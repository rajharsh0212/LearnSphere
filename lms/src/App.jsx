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
import { AuthContext } from './context/AuthContext';
import About from './pages/About';
import Contact from './pages/Contact';
import { useContext } from 'react';
import AiDoubtSolver from './pages/student/AiDoubtSolver';
import AiQuizTaker from './pages/student/AiQuizTaker';

const App = () => {
  const { role } = useContext(AuthContext);

  return (
    <div>
      <ToastContainer />
      <RoleBasedNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading  />} />
        <Route path="/ai-doubt-solver" element={<AiDoubtSolver />} />
        <Route path="/ai-quiz-taker" element={<AiQuizTaker />} />
        <Route path="/educator" element={<Educator />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="students-enrolled" element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
