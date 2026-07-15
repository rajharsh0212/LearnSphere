# LearnSphere — Full-Stack Learning Management System (LMS)

A production-ready, full-stack Learning Management System built with the **MERN stack** (MongoDB, Express.js, React, Node.js). The platform supports **dual roles** (Student & Educator), **Stripe payment integration**, **AI-powered features** via Google Gemini, and is deployed on **Vercel**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture & Project Structure](#architecture--project-structure)
4. [Database Schema Design](#database-schema-design)
5. [Authentication & Authorization Workflow](#authentication--authorization-workflow)
6. [Feature Implementation Details](#feature-implementation-details)
   - [Role-Based Registration & Login](#1-role-based-registration--login)
   - [Role Switching](#2-role-switching)
   - [Dynamic Role-Based Navbar](#3-dynamic-role-based-navbar)
   - [Protected Routes (Frontend)](#4-protected-routes-frontend)
   - [Course Browsing & Search](#5-course-browsing--search)
   - [Course Details Page](#6-course-details-page)
   - [Course Purchase via Stripe](#7-course-purchase-via-stripe)
   - [Stripe Webhook Handling](#8-stripe-webhook-handling)
   - [Course Player & Video Streaming](#9-course-player--video-streaming)
   - [Course Progress Tracking](#10-course-progress-tracking)
   - [Course Ratings & Comments](#11-course-ratings--comments)
   - [My Enrollments Dashboard](#12-my-enrollments-dashboard)
   - [AI Doubt Solver (Chatbot)](#13-ai-doubt-solver-chatbot)
   - [AI Quiz Generator](#14-ai-quiz-generator)
   - [Educator — Course Creation](#15-educator--course-creation)
   - [Educator — My Courses](#16-educator--my-courses)
   - [Educator — Dashboard Analytics](#17-educator--dashboard-analytics)
   - [Educator — Enrolled Students List](#18-educator--enrolled-students-list)
   - [Image Upload via Cloudinary](#19-image-upload-via-cloudinary)
   - [Global Context & State Management](#20-global-context--state-management)
   - [Auto Logout on Token Expiry](#21-auto-logout-on-token-expiry)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Environment Variables](#environment-variables)
9. [Setup & Installation](#setup--installation)
10. [Deployment](#deployment)

---

## Project Overview

**LearnSphere** is a comprehensive e-learning platform that enables:

- **Students** to browse courses, purchase them with Stripe, watch video lectures, track progress, rate/comment on courses, resolve doubts with an AI chatbot, and take AI-generated quizzes.
- **Educators** to create and manage courses with a rich-text editor, upload thumbnails, set pricing and discounts, view enrolled students, and monitor earnings on a dashboard.

The platform uses **JWT-based authentication** with role-encoded tokens, allowing a single user to hold both Student and Educator roles and switch between them seamlessly.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v7, Tailwind CSS v4, Vite |
| **Backend** | Node.js, Express 5, Mongoose (MongoDB ODM) |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **Payments** | Stripe Checkout Sessions, Stripe Webhooks (svix) |
| **AI Features** | Google Generative AI (Gemini 1.5 Flash) |
| **File Upload** | Cloudinary (via Multer disk storage) |
| **Rich Text Editor** | Quill.js |
| **Deployment** | Vercel (both client & server) |
| **Key Libraries** | axios, react-toastify, react-youtube, rc-progress, humanize-duration, react-simple-star-rating, react-icons, uniqid, jwt-decode |

---

## Architecture & Project Structure

The project follows a **monorepo** structure with two independent deployable units:

```
LMS/
├── lms/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/               # Static assets and constants
│   │   ├── components/           # Reusable UI components
│   │   │   ├── educator/         # Educator-specific components (Navbar, Sidebar, Footer)
│   │   │   └── student/          # Student-specific components (Hero, CourseCard, SearchBar, etc.)
│   │   ├── context/              # React Context providers
│   │   │   ├── AuthContext.jsx   # Authentication state (token, user, login/logout)
│   │   │   └── AppContext.jsx    # Application state (courses, user data, utilities)
│   │   ├── pages/                # Page-level components
│   │   │   ├── educator/         # Educator pages (Dashboard, AddCourse, MyCourses, etc.)
│   │   │   └── student/          # Student pages (Home, CoursesList, Player, AI features, etc.)
│   │   ├── App.jsx               # Route definitions
│   │   ├── ProtectedRoute.jsx    # Role-based route guard
│   │   └── main.jsx              # Entry point with context providers
│   └── package.json
│
├── server/                       # Backend (Express + MongoDB)
│   ├── configs/                  # Third-party service configurations
│   │   ├── mongodb.js            # MongoDB Atlas connection
│   │   ├── cloudinary.js         # Cloudinary SDK setup
│   │   ├── stripe.js             # Stripe SDK initialization
│   │   └── multer.js             # Multer file storage config
│   ├── controllers/              # Request handlers (business logic)
│   │   ├── aiController.js       # Gemini AI — doubt solver & quiz generator
│   │   ├── courseController.js   # Public course endpoints
│   │   ├── educatorController.js # Educator-only course management
│   │   ├── userController.js     # Student actions (purchase, progress, ratings, quiz history)
│   │   └── webhooksController.js # Stripe webhook event processing
│   ├── middlewares/
│   │   ├── auth_middleware.js     # JWT verification + role requirement middleware
│   │   └── multer.js             # File upload middleware
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js               # User with roles, enrollments, chat/quiz history
│   │   ├── course.js             # Course with chapters, lectures, ratings
│   │   ├── courseProgress.js     # Per-user lecture completion tracking
│   │   └── purchase.js           # Payment records with status tracking
│   ├── routes/                   # API route definitions
│   └── server.js                 # Express app entry point
│
└── README.md
```

### Request Flow Architecture

```
Client (React) → HTTP Request with JWT in Authorization Header
       ↓
Express Server → CORS Validation
       ↓
Route Matching → /api/auth, /api/course, /api/user, /api/educator, /api/ai
       ↓
Middleware Chain → authMiddleware (JWT verify) → requireRole (role check)
       ↓
Controller → Business Logic → MongoDB/Cloudinary/Stripe/Gemini
       ↓
JSON Response → Client updates React state via Context API
```

---

## Database Schema Design

### User Model
```
User {
  name: String (required)
  email: String (unique, lowercase)
  password: String (bcrypt hashed)
  roles: {
    student: Boolean (default: false)
    educator: Boolean (default: false)
  }
  enrolledCourses: [ObjectId → Course]       // Courses purchased by student
  createdCourses: [ObjectId → Course]         // Courses created by educator
  chatHistory: [{                             // AI Doubt Solver conversation log
    sender: 'user' | 'ai',
    text: String,
    timestamp: Date
  }]
  quizHistory: [{                             // AI Quiz attempt records
    quizTitle: String,
    topics: String,
    score: Number,
    totalQuestions: Number,
    date: Date,
    questions: [{
      question: String,
      options: [String],
      correctAnswer: String,
      userAnswer: String,
      explanation: String
    }]
  }]
  timestamps: true
}
```

### Course Model
```
Course {
  courseTitle: String
  courseDescription: String (rich text HTML from Quill)
  courseThumbnail: String (Cloudinary URL)
  coursePrice: Number
  isPublished: Boolean (default: true)
  discount: Number (0-100 percentage)
  discountEndDate: Date
  whatsInTheCourse: String
  courseContent: [Chapter]                    // Nested chapters → lectures
  courseRatings: [Rating]                     // Embedded ratings with comments
  educator: ObjectId → User
  studentsEnrolled: [ObjectId → User]        // Denormalized for quick access
  timestamps: true
}

Chapter {
  chapterId: String (uniqid)
  chapterOrder: Number
  chapterTitle: String
  chapterContent: [Lecture]
}

Lecture {
  lectureId: String (uniqid)
  lectureTitle: String
  lectureDuration: Number (in minutes)
  lectureUrl: String (YouTube URL)
  isPreviewFree: Boolean
  lectureOrder: Number
}

Rating {
  userId: ObjectId → User
  rating: Number (1-5)
  comment: String
}
```

### CourseProgress Model
```
CourseProgress {
  userId: String
  courseId: String
  completed: Boolean
  lectureCompleted: [String]                  // Array of lectureId strings
}
```

### Purchase Model
```
Purchase {
  userId: ObjectId → User
  courseId: ObjectId → Course
  amount: Number (after discount)
  status: 'pending' | 'completed' | 'failed'
  paymentId: String (Stripe session ID)
  timestamps: true
}
```

---

## Authentication & Authorization Workflow

### How It Works (Step-by-Step)

1. **Registration** (`POST /api/auth/register`):
   - User submits name, email, password, and selected roles (student/educator or both).
   - Password is hashed using `bcryptjs` (salt rounds: 10).
   - If user already exists, existing role flags are updated (additive — roles are never removed).
   - A new `User` document is created/updated in MongoDB.

2. **Login** (`POST /api/auth/login`):
   - User provides email, password, and the role they want to log in as (`loginRole`).
   - Server validates credentials with `bcrypt.compare()`.
   - Server checks if user has the requested role (`user.roles[loginRole]`).
   - A **JWT token** is generated encoding `{ id, currentRole }` with 2-hour expiry.
   - Token and user object are returned to the client.

3. **Token Storage (Client)**:
   - `AuthContext` stores the token in `localStorage` and in React state.
   - On app load, the token is read from `localStorage` and decoded with `jwt-decode` to restore the session.

4. **Authenticated Requests**:
   - Every API call includes the header: `Authorization: Bearer <token>`.
   - The `authMiddleware` on the server verifies the token with `jwt.verify()` and attaches `req.user = { id, currentRole }`.

5. **Role-Based Access Control**:
   - The `requireRole(role)` middleware checks `req.user.currentRole` against the required role.
   - Example: `POST /api/educator/add-course` → requires `requireRole('educator')`.
   - Example: `POST /api/user/purchase` → requires `requireRole('student')`.

6. **Role Switching** (`POST /api/auth/switch-role`):
   - Authenticated users with dual roles can switch without re-logging in.
   - Server verifies the user owns the target role, then issues a **new JWT** with the updated `currentRole`.

7. **Auto-Logout on Token Expiry**:
   - `AppContext` sets up an Axios response interceptor.
   - If any API call returns HTTP 401, the interceptor triggers `handleLogout()`.
   - Logout clears `localStorage`, resets React state, and deletes server-side chat history.

---

## Feature Implementation Details

### 1. Role-Based Registration & Login

**Frontend Implementation:**
- **Register.jsx**: Split-screen layout with a form. Roles are selected via checkboxes, allowing both "Student" and "Educator" simultaneously. The `toggleRole()` function manages a role array with add/remove logic. Validates at least one role is selected before submission.
- **Login.jsx**: Role switcher toggle (Student/Educator) determines the `loginRole` sent to the API. On success, `AuthContext.login()` stores token + user data and `useNavigate()` redirects to `/` (student) or `/educator` (educator).

**Backend Implementation:**
- `POST /api/auth/register`: Accepts `{ name, email, password, selectedRoles }`. Hashes password, checks if user exists (updates roles if so), creates new user otherwise.
- `POST /api/auth/login`: Accepts `{ email, password, loginRole }`. Validates credentials, checks role access, returns JWT with `{ id, currentRole }` (2h expiry).

**Data Flow:**
```
Register Form → POST /api/auth/register → bcrypt hash → MongoDB User.create()
Login Form → POST /api/auth/login → bcrypt compare → JWT sign → localStorage + AuthContext
```

---

### 2. Role Switching

**Implementation:**
- `POST /api/auth/switch-role` (requires authentication).
- User sends `{ newRole }`. Server verifies `user.roles[newRole] === true`.
- A **new JWT** is issued with `currentRole: newRole`.
- Frontend `AuthContext.updateAuthUser()` updates the in-memory user state without page reload.

**Why a new token?** The role is embedded in the JWT payload. Since JWTs are immutable once signed, a new token must be issued to reflect the role change. All subsequent API requests use the new token.

---

### 3. Dynamic Role-Based Navbar

**Implementation (RoleBasedNavbar.jsx):**
```
if (auth.user.currentRole === 'student')  → <StudentNavbar />
if (auth.user.currentRole === 'educator') → <EducatorNavbar />
else (unauthenticated)                    → <HomeNavbar />
```

- **HomeNavbar**: Transparent background that becomes opaque on scroll (scroll event listener toggles `isScrolled` state). Includes mobile hamburger menu with animated dropdown. Links to About, Contact, Courses, Login, and Register.
- **StudentNavbar**: Links to course catalog, enrollments, AI features.
- **EducatorNavbar**: Links to dashboard, add course, my courses, enrolled students.

---

### 4. Protected Routes (Frontend)

**Implementation (ProtectedRoute.jsx):**
```jsx
const ProtectedRoute = ({ roles, children }) => {
  if (!auth.token || !auth.user) return <Navigate to="/login" />;
  if (roles && !roles.includes(auth.user.currentRole)) return <Navigate to="/" />;
  return children;
};
```

**Usage in App.jsx:**
```jsx
<Route path="/student/dashboard" element={
  <ProtectedRoute roles={['student']}><Dashboard role="student" /></ProtectedRoute>
} />
<Route path="/educator/dashboard" element={
  <ProtectedRoute roles={['educator']}><Dashboard role="educator" /></ProtectedRoute>
} />
```

This provides client-side route guarding. Server-side protection is handled independently via `authMiddleware` + `requireRole`.

---

### 5. Course Browsing & Search

**Frontend (CoursesList.jsx):**
- Reads `allcourses` from `AppContext` (fetched once on app mount from `GET /api/course/all`).
- URL-driven search using `useParams()` — navigating to `/course-list/react` filters courses by "react".
- Filters `allcourses` by `courseTitle` using case-insensitive `includes()`.
- Responsive grid layout displaying `CourseCard` components (1–4 column grid).
- Search tag shown with a clear button that navigates back to `/course-list`.

**Backend (courseController.js):**
- `GET /api/course/all`: Returns all published courses (`isPublished: true`), excludes `courseContent` and `enrolledStudents` for payload optimization, populates educator info.

---

### 6. Course Details Page

**Frontend (CourseDetails.jsx):**
- Fetches full course data via `GET /api/course/:id` (includes lecture URLs for free previews, stripped for paid lectures).
- **Left Column**: Course title, truncated description, average rating with star count, educator name, collapsible chapter accordion (expand/collapse with `openSections` state), tabbed section for Description (rendered as HTML from Quill) and Comments.
- **Right Column (Sticky Sidebar)**: YouTube video preview or thumbnail, actual vs. discounted price, countdown ("X days left at this price"), course stats (duration, lectures count), enroll/go-to-course button, "What's in the course" checklist.
- **Free Preview**: Clicking a free lecture loads YouTube player inline without enrollment.
- **Price Calculation**: `discountedPrice = coursePrice - (coursePrice * discount / 100)`.
- **Enrollment Check**: Compares `courseId` against `userData.enrolledCourses` from context.

**Backend:**
- `GET /api/course/:id`: Returns full course data but **strips `lectureUrl`** for non-free lectures (content protection). Calculates `daysLeft` for discount countdown.

---

### 7. Course Purchase via Stripe

**Frontend Flow:**
1. Student clicks "Enroll Now" on `CourseDetails`.
2. `POST /api/user/purchase` is called with `{ courseId }`.
3. Server returns a Stripe Checkout Session URL.
4. Frontend redirects to Stripe's hosted payment page via `window.location.href = session_url`.
5. On success, Stripe redirects to `/loading/my-enrollments` (a loading page that waits briefly, then navigates to `/my-enrollments`).

**Backend Flow (userController.js → purchaseCourse):**
1. Validate user and course exist. Check for existing completed purchase (prevent double-buy).
2. Calculate discounted amount: `coursePrice - (coursePrice * discount / 100)`.
3. Create a `Purchase` document with status `"pending"`.
4. Create a Stripe Checkout Session with:
   - `line_items`: Product name, image, unit_amount (in cents).
   - `metadata`: `{ userId, purchaseId, courseId }` — for webhook processing.
   - `success_url` and `cancel_url` for redirect.
5. Save Stripe session ID as `paymentId` on the Purchase document.
6. Return `session_url` to frontend.

---

### 8. Stripe Webhook Handling

**Implementation (webhooksController.js):**

- The webhook endpoint `POST /stripe` is registered **before** `express.json()` middleware (needs raw body for signature verification).
- Uses `Stripe.webhooks.constructEvent()` to verify the webhook signature.

**Event: `payment_intent.succeeded`:**
1. Extract `paymentIntentId` from the event.
2. Look up the Checkout Session using `Stripe.checkout.sessions.list({ payment_intent: paymentIntentId })`.
3. Extract `purchaseId` from session metadata.
4. Update the `Purchase` status to `"completed"`.
5. Push `userId` into `Course.enrolledStudents` (denormalized).
6. Push `courseId` into `User.enrolledCourses`.

**Event: `payment_intent.payment_failed`:**
1. Update the `Purchase` status to `"failed"`.

**Why webhooks instead of client-side confirmation?** Webhooks are server-to-server, cryptographically signed, and reliable — they handle edge cases like browser crashes, network failures, and delayed payments.

---

### 9. Course Player & Video Streaming

**Frontend (Player.jsx):**
- Loads enrolled course data from `AppContext.enrolledCourses` by matching `courseId` from URL params.
- **Left Panel**: Collapsible chapter list with lecture items. Each lecture shows:
  - Blue checkmark icon if completed (checked against `progressData.lectureCompleted`).
  - Play icon if not yet completed.
  - Clicking a lecture sets it as `playerData` and loads the YouTube player.
- **Right Panel**: `react-youtube` component renders the YouTube video. Lecture title displayed above. "Mark Completed" button triggers progress update.
- **YouTube ID Extraction**: A `getYouTubeId(url)` utility parses YouTube URLs (handles both `youtube.com/watch?v=` and `youtu.be/` formats).

---

### 10. Course Progress Tracking

**Backend:**
- `POST /api/user/update-course-progress`: Accepts `{ courseId, lectureId }`. If a `CourseProgress` document exists, pushes `lectureId` to `lectureCompleted` (with duplicate check). Otherwise, creates a new document.
- `GET /api/user/get-course-progress/:courseId`: Returns the progress data for a specific user-course combination.

**Frontend (Player.jsx):**
- On "Mark Completed" click, sends `POST` and updates local `progressData` state.
- Progress reflected instantly in the sidebar (blue tick icon appears).

**Frontend (MyEnrollments.jsx):**
- Fetches progress for **all** enrolled courses in parallel using `Promise.all`.
- Displays a progress bar (`rc-progress Line` component) per course.
- Calculates percentage: `(lectureCompleted / totalLectures) * 100`.
- Status shows "Completed" or "On going" based on progress percentage.

---

### 11. Course Ratings & Comments

**Backend:**
- `POST /api/user/add-rating`: Accepts `{ courseId, rating }`. Validates the user is enrolled. If user has an existing rating, updates it (upsert pattern). Otherwise, pushes a new entry to `course.courseRatings`.
- `POST /api/user/add-comment`: Accepts `{ courseId, comment }`. Same enrollment check. Prevents duplicate comments. Adds comment to the user's existing rating entry.

**Frontend (Player.jsx):**
- Star rating component (`react-simple-star-rating`) pre-fills with user's existing rating.
- Comment textarea with submit button. Only available to enrolled students.
- Ratings are embedded in the course document (no separate collection), enabling fast reads.

**Frontend (CourseDetails.jsx):**
- Comments tab displays all user reviews with name, avatar, star rating, and comment text.
- Average rating calculated via `AppContext.calculateAverageRating()` — sums all ratings and divides by count.

---

### 12. My Enrollments Dashboard

**Frontend (MyEnrollments.jsx):**
- Calls `fetchUserEnrolledCourse()` from `AppContext` on mount.
- For each enrolled course, fetches progress via `GET /api/user/get-course-progress/:courseId`.
- Renders a table with: thumbnail + title, duration (humanized), completion count (e.g., "3/10 Lectures"), visual progress bar, and status button.
- Clicking "On going" or "Completed" navigates to `/player/:courseId`.

---

### 13. AI Doubt Solver (Chatbot)

**Frontend (AiDoubtSolver.jsx):**
- Chat-style UI with message bubbles (blue = user, gray = AI), auto-scrolling.
- On mount, fetches chat history via `GET /api/user/chat-history` and populates `messages` state.
- User types a question → sends `POST /api/ai/ask` with `{ prompt }`.
- AI typing indicator (animated dots) shown while waiting for response.
- Response appended to messages array.

**Backend (aiController.js → generateDoubtSolution):**
1. Receives `{ prompt }` from the authenticated user.
2. Calls `GoogleGenerativeAI.getGenerativeModel({ model: "gemini-1.5-flash" })`.
3. Sends prompt via `model.generateContent(prompt)`.
4. Extracts text response from the Gemini API result.
5. Saves both user prompt and AI response to `User.chatHistory` using `$push`.
6. Returns `{ answer: text }`.

**Chat History Lifecycle:**
- Loaded on page mount for conversation continuity.
- Cleared on logout (`DELETE /api/user/chat-history`) — privacy by design.

---

### 14. AI Quiz Generator

**Frontend (AiQuizTaker.jsx):**
- **Sidebar navigation**: "Attempt Quiz" and "Quiz History" views.
- **Setup Form**: Topic input, difficulty dropdown (Easy/Medium/Hard), number of questions.
- **Quiz View**: Dynamically generated MCQ form with radio buttons.
- **Results View**: Score display with percentage, color-coded answer review (green = correct, red = incorrect), explanations for wrong answers.
- **History View**: Expandable accordion of past quiz attempts.

**Backend (aiController.js → generateQuiz):**
1. Receives `{ topics, difficulty, numQuestions }`.
2. Constructs a detailed prompt instructing Gemini to return a **JSON-only** response with a specific schema (`questions[]` with `id`, `question`, `options[]`, `correctAnswer`, `explanation`).
3. Cleans the response (strips markdown code fences) and parses JSON.
4. Returns the structured quiz object.

**Quiz Attempt Saving (userController.js → saveQuizAttempt):**
- After the student completes a quiz, frontend sends `POST /api/user/save-quiz` with:
  `{ quizTitle, topics, score, totalQuestions, questions }` (questions include `userAnswer` for review).
- Stored in `User.quizHistory` array.

**Quiz History (userController.js → getQuizHistory):**
- `GET /api/user/quiz-history` returns the user's quiz history in reverse chronological order.

**Client-Side Scoring:**
```javascript
questions.forEach(q => {
  if (userAnswers[q.id] === q.correctAnswer) score++;
});
```

---

### 15. Educator — Course Creation

**Frontend (AddCourse.jsx):**
- **Rich Text Editor**: Quill.js initialized in `useEffect` for course description (supports bold, italic, lists, headers, links, images, code blocks).
- **Dynamic Chapter/Lecture Management**:
  - `handleChapter('add')` — creates a new chapter with `uniqid()` for chapterId.
  - `handleChapter('remove', chapterId)` — removes chapter.
  - `handleLecture('add', chapterId)` — opens a popup modal for lecture details.
  - Lecture modal collects: title, YouTube URL, duration (minutes), and free preview toggle.
- **Thumbnail Upload**: File input with drag-and-drop area, preview shown after selection.
- **Additional Fields**: Price, discount percentage, discount end date, "What's in the course" text, publish toggle.
- **Submission**: Constructs a `FormData` object with JSON-stringified `courseData` + image file, sends to `POST /api/educator/add-course`.

**Backend (educatorController.js → addCourse):**
1. `authMiddleware` → `upload.single('image')` (Multer) → `requireRole('educator')`.
2. Parses `courseData` from JSON, sets `educator = userId`.
3. Uploads image to Cloudinary via `cloudinary.uploader.upload(imageFile.path, { folder: 'mern-lms' })`.
4. Saves `result.secure_url` as `courseThumbnail`.
5. Creates and saves the `Course` document.
6. Pushes course ID to `User.createdCourses`.

---

### 16. Educator — My Courses

**Frontend (MyCourses.jsx):**
- Fetches educator's courses via `GET /api/educator/courses`.
- Role guard checks `auth.user.currentRole !== "educator"` — shows access denied if violated.
- Responsive grid displaying course cards with thumbnail, title, price, and enrolled student count.
- "Add New Course" button links to `/educator/add-course`.

**Backend (educatorController.js → getEducatorCourses):**
- Queries `Course.find({ educator: userId })` — returns only courses created by the authenticated educator.

---

### 17. Educator — Dashboard Analytics

**Frontend (Dashboard.jsx):**
- Fetches dashboard data via `GET /api/educator/dashboard`.
- Displays three stat cards:
  - **Total Enrollments**: Count of enrolled students across all courses.
  - **Total Courses**: Count of educator's courses.
  - **Total Earnings**: Sum of all completed purchase amounts (formatted to 2 decimals).
- **Recent Enrollments Table**: Shows top 5 recent student enrollments with name, avatar, and course title.

**Backend (educatorController.js → educatorDashboardData):**
1. Fetches all courses by the educator.
2. Extracts course IDs and queries `Purchase.find({ courseId: { $in: courseIds }, status: "completed" })`.
3. Computes `totalEarnings` via `reduce()` over purchase amounts.
4. Iterates courses, fetches enrolled user names, builds `enrolledStudentsData` array.

---

### 18. Educator — Enrolled Students List

**Frontend (StudentsEnrolled.jsx):**
- Fetches data via `GET /api/educator/enrolled-students`.
- Full-width table: #, Student Name (with avatar), Course Title, Purchase Date.
- Responsive — hides `#` and Date columns on mobile.
- Data reversed to show most recent enrollments first.

**Backend (educatorController.js → getEnrolledStudentsData):**
1. Finds all courses by educator.
2. Queries completed purchases for those courses with `.populate("userId", "name").populate("courseId", "courseTitle")`.
3. Maps to a clean `{ student, courseTitle, purchasedAt }` structure.

---

### 19. Image Upload via Cloudinary

**Workflow:**
1. **Frontend**: `AddCourse.jsx` constructs a `FormData` with the image file under the key `'image'`.
2. **Multer Middleware**: `upload.single('image')` catches the file, stores it temporarily using disk storage.
3. **Cloudinary Upload**: In the controller, `cloudinary.uploader.upload(imageFile.path, { folder: 'mern-lms' })` uploads to Cloudinary.
4. **URL Storage**: `result.secure_url` (HTTPS CDN URL) is saved as `courseThumbnail` in the database.

**Configuration (configs/cloudinary.js):**
```javascript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});
```

---

### 20. Global Context & State Management

The app uses **two React Context providers** wrapping the entire app:

#### AuthContext (`context/AuthContext.jsx`)
| State/Method | Purpose |
|---|---|
| `auth` | `{ token, user }` — current session state |
| `login(token, user)` | Stores to localStorage + state |
| `logout(callback)` | Clears chat history on server, removes localStorage, resets state |
| `updateAuthUser(updatedUser)` | Merges new user data into state (for role switching) |

#### AppContext (`context/AppContext.jsx`)
| State/Method | Purpose |
|---|---|
| `allcourses` | All published courses (fetched once on mount) |
| `userData` | Current authenticated user's data |
| `enrolledCourses` | Student's enrolled courses (fetched when auth changes) |
| `fetchCourses()` | Calls `GET /api/course/all` |
| `fetchUserData()` | Calls `GET /api/user/data` |
| `fetchUserEnrolledCourse()` | Calls `GET /api/user/enrolled-courses` |
| `calculateAverageRating(course)` | Computes mean of `courseRatings[].rating` |
| `calculateCourseDuration(course)` | Sums all lecture durations, humanizes |
| `calculateNoOfLectures(course)` | Counts all lectures across chapters |
| `calculateCourseChapterTime(chapter)` | Sums lecture durations for one chapter |
| `handleLogout()` | Calls `AuthContext.logout()` + resets app state |

---

### 21. Auto Logout on Token Expiry

**Implementation (AppContext.jsx):**
```javascript
useEffect(() => {
  const interceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        handleLogout(); // clears state, localStorage, server chat history
      }
      return Promise.reject(error);
    }
  );
  return () => axios.interceptors.response.eject(interceptor);
}, [logout]);
```

When any API request returns a 401 (typically because the JWT expired after 2 hours), the global Axios interceptor automatically triggers logout. This provides seamless session management without manual token refresh.

---

## API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user with role(s) |
| POST | `/api/auth/login` | No | Login with email, password, and role |
| POST | `/api/auth/switch-role` | JWT | Switch active role (issues new token) |
| GET | `/api/auth/me` | JWT | Get current user profile |

### Courses (`/api/course`) — Public
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/course/all` | No | Get all published courses (no content) |
| GET | `/api/course/:id` | No | Get course details (free preview URLs only) |

### User/Student (`/api/user`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/user/data` | JWT | Any | Get user profile data |
| GET | `/api/user/enrolled-courses` | JWT | Any | Get enrolled courses with content |
| POST | `/api/user/purchase` | JWT | Student | Initiate Stripe checkout for a course |
| POST | `/api/user/update-course-progress` | JWT | Any | Mark a lecture as completed |
| GET | `/api/user/get-course-progress/:courseId` | JWT | Any | Get progress for a course |
| POST | `/api/user/add-rating` | JWT | Any | Rate a course (1-5 stars) |
| POST | `/api/user/add-comment` | JWT | Any | Add comment to a course |
| GET | `/api/user/chat-history` | JWT | Any | Get AI chat conversation history |
| DELETE | `/api/user/chat-history` | JWT | Any | Clear chat history (called on logout) |
| POST | `/api/user/save-quiz` | JWT | Any | Save a quiz attempt |
| GET | `/api/user/quiz-history` | JWT | Any | Get all past quiz attempts |

### Educator (`/api/educator`)
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/educator/add-course` | JWT | Educator | Create a new course (multipart form) |
| GET | `/api/educator/courses` | JWT | Educator | Get educator's own courses |
| GET | `/api/educator/dashboard` | JWT | Educator | Get dashboard analytics |
| GET | `/api/educator/enrolled-students` | JWT | Educator | Get enrolled students list |

### AI (`/api/ai`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/ask` | JWT | Send doubt to Gemini AI, get answer |
| POST | `/api/ai/generate-quiz` | JWT | Generate MCQ quiz on given topics |

### Webhooks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/stripe` | Stripe Signature | Handle Stripe payment events |

---

## Environment Variables

### Server (`server/.env`)
```env
CURRENCY=USD
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GEMINI_API_KEY=your_gemini_api_key
```

### Client (`lms/.env`)
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=$
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Stripe account (test mode)
- Google AI Studio account (for Gemini API key)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd LMS
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create `server/.env` with the variables listed above.

```bash
npm run dev    # Starts with nodemon on port 5000
```

### 3. Frontend Setup
```bash
cd lms
npm install
```
Create `lms/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=$
```

```bash
npm run dev    # Starts Vite dev server on port 5173
```

### 4. Stripe Webhook (Local Development)
```bash
stripe listen --forward-to localhost:5000/stripe
```
Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env`.

---

## Deployment

Both frontend and backend are configured for **Vercel** deployment with `vercel.json` configuration files.

- **Frontend**: Built with `vite build`, deployed as a static site with SPA fallback routing.
- **Backend**: Deployed as a serverless function with Express adapter.
- **CORS**: Configured to allow both `localhost` origins and production Vercel domains.

**Production URLs:**
- Frontend: `https://learnsphere-beta.vercel.app`
- Backend: Configured via `VITE_BACKEND_URL` env variable on Vercel.

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **JWT with embedded role** | Enables stateless auth; role in token avoids extra DB lookups per request |
| **Denormalized `studentsEnrolled` on Course** | Fast reads for enrollment checks without joining Purchase collection |
| **Chat history on User model** | Simplifies retrieval; cleared on logout for privacy |
| **Quiz history on User model** | Keeps user data co-located; avoids separate collection overhead |
| **Stripe Webhooks over client confirmation** | Server-to-server reliability; handles edge cases (browser crash, network failure) |
| **Cloudinary for images** | CDN-backed, auto-optimized image delivery; offloads storage from server |
| **YouTube for video hosting** | No video storage/encoding costs; leverages YouTube's CDN and player |
| **Embedded ratings in Course** | Single query returns course + all ratings; no multi-collection joins |
| **Axios interceptor for auto-logout** | Centralized 401 handling; no per-component token expiry logic |

---

*Built with the MERN Stack + AI — A LearnSphere Project*
