import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/student/Home';
import CoursesList from './pages/student/CoursesList';
import CourseDetails from './pages/student/CourseDetails';
import MyEnrollments from './pages/student/MyEnrollments';
import Player from './pages/student/Player';
import Loading from './components/student/Loading';
import Educator from './pages/educator/Educator';
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import MyCourses from './pages/educator/MyCourses';
import StudentsEnrolled from './pages/educator/StudentsEnrolled';
import RoleBasedNavbar from './components/RoleBasedNavbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import About from './pages/About';
import Contact from './pages/Contact';
import AiDoubtSolver from './pages/student/AiDoubtSolver';
import AiQuizTaker from './pages/student/AiQuizTaker';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';

const PublicOnlyRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (auth.token && auth.user) {
    const role = auth.user.currentRole;
    if (role === 'educator') return <Navigate to="/educator/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div>
      <ToastContainer />
      <RoleBasedNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route path="/courses" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={['student']}>
                <Dashboard role="student" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/educator/dashboard"
            element={
              <ProtectedRoute roles={['educator']}>
                <Dashboard role="educator" />
              </ProtectedRoute>
            }
          />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course-list/:id" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails/>} />
        <Route
          path="/my-enrollments"
          element={
            <ProtectedRoute roles={['student']}>
              <MyEnrollments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/:courseId"
          element={
            <ProtectedRoute roles={['student']}>
              <Player />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loading/:path"
          element={
            <ProtectedRoute>
              <Loading />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-doubt-solver"
          element={
            <ProtectedRoute roles={['student']}>
              <AiDoubtSolver />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-quiz-taker"
          element={
            <ProtectedRoute roles={['student']}>
              <AiQuizTaker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/educator"
          element={
            <ProtectedRoute roles={['educator']}>
              <Educator />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute roles={['educator']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-course"
            element={
              <ProtectedRoute roles={['educator']}>
                <AddCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-courses"
            element={
              <ProtectedRoute roles={['educator']}>
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="students-enrolled"
            element={
              <ProtectedRoute roles={['educator']}>
                <StudentsEnrolled />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App
