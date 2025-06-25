import { useContext } from 'react';
import StudentNavbar from './student/StudentNavbar';
import EducatorNavbar from './educator/EducatorNavbar';
import HomeNavbar from './HomeNavbar';
import { AuthContext } from '../context/AuthContext';

const RoleBasedNavbar = () => {
  const { auth } = useContext(AuthContext);
  const role = auth?.user?.currentRole;

  if (role === 'student') return <StudentNavbar />;
  if (role === 'educator') return <EducatorNavbar />;
  return <HomeNavbar />; // ✅ Fallback when no user is logged in
};

export default RoleBasedNavbar;
