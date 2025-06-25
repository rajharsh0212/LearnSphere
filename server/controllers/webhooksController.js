import { Webhook } from "svix";
import Stripe from "../configs/stripe.js";
import Purchase from "../models/purchase.js";
import User from "../models/User.js";
import Course from "../models/course.js";
import { response } from "express";

export const stripeWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Webhook secret needed!");
  }

  let evt;
  try {
    evt=Stripe.webhooks.constructEvent(req.body,sig,process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    response.status(400).send(`Webhook Error: ${error.message}`);
  }
  // console.log(evt);
  switch (evt.type) {
    case "payment_intent.succeeded":
      const paymentIntent = evt.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await Stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId);

      courseData.enrolledStudents.push(userData._id);
      await courseData.save();
      userData.enrolledCourses.push(courseData._id);
      await userData.save();
      purchaseData.status = "completed";
      await purchaseData.save();

      break;

    case "payment_intent.payment_failed":
      const failedPaymentIntent = evt.data.object;
      const failedPaymentIntentId = failedPaymentIntent.id;

      const failedSession = Stripe.checkout.sessions.list({
        payment_intent: failedPaymentIntentId,
      });

      const { FailedPurchaseId } = failedSession.data[0].metadata;
      const failedPurchaseData = await PurchaseModel.findById(FailedPurchaseId);
      failedPurchaseData.status = "failed";
      failedPurchaseData.save();

      break;

    default:
      console.log(`Unhandled event type ${evt.type}`);
      break;
  }

  res.json({ received: true });
};