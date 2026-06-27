import Stripe from "../configs/stripe.js";
import Purchase from "../models/purchase.js";
import User from "../models/User.js";
import Course from "../models/course.js";

export const stripeWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Webhook secret needed!");
  }

  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).send("Missing Stripe signature");
  }

  let evt;
  try {
    evt = Stripe.webhooks.constructEvent(req.body, signature, WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  switch (evt.type) {
    case "checkout.session.completed": {
      const session = evt.data.object;
      if (session.payment_status !== "paid") {
        break;
      }

      const { purchaseId, userId, courseId } = session.metadata || {};
      if (!purchaseId) {
        console.warn("Stripe session completed without purchaseId metadata");
        break;
      }

      const purchaseData = await Purchase.findById(purchaseId);
      if (!purchaseData) {
        console.warn(`Purchase not found for webhook purchaseId=${purchaseId}`);
        break;
      }

      const resolvedUserId = userId || purchaseData.userId;
      const resolvedCourseId = courseId || purchaseData.courseId;

      const [userData, courseData] = await Promise.all([
        User.findById(resolvedUserId),
        Course.findById(resolvedCourseId),
      ]);

      if (!userData || !courseData) {
        console.warn("Webhook could not resolve user or course", {
          resolvedUserId: String(resolvedUserId),
          resolvedCourseId: String(resolvedCourseId),
        });
        break;
      }

      await Promise.all([
        User.updateOne(
          { _id: userData._id },
          { $addToSet: { enrolledCourses: courseData._id } }
        ),
        Course.updateOne(
          { _id: courseData._id },
          { $addToSet: { enrolledStudents: userData._id } }
        ),
      ]);

      purchaseData.status = "completed";
      purchaseData.paymentId = session.payment_intent || session.id;
      await purchaseData.save();
      break;
    }

    case "payment_intent.payment_failed": {
      const failedPaymentIntent = evt.data.object;
      const failedSession = await Stripe.checkout.sessions.list({
        payment_intent: failedPaymentIntent.id,
        limit: 1,
      });

      const failedPurchaseId = failedSession.data[0]?.metadata?.purchaseId;
      if (!failedPurchaseId) {
        break;
      }

      const failedPurchaseData = await Purchase.findById(failedPurchaseId);
      if (failedPurchaseData) {
        failedPurchaseData.status = "failed";
        await failedPurchaseData.save();
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${evt.type}`);
      break;
  }

  res.json({ received: true });
};