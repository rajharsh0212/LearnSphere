import { createContext, useEffect, useState} from "react";
import { dummyCourses } from "../assets/assets";
export const AppContext = createContext()
export const AppContextProvider= ({ children }) => {
     
  const currency= import.meta.env.VITE_CURRENCY; // Default currency symbol, can be changed based on user preference or locale
  const [allcourses, setAllCourses] = useState([]); // State to hold all courses
  const fetchCourses = async () => {
    setAllCourses(dummyCourses);
  }
  useEffect(() => {
    fetchCourses();
  }, []);
  const calculaterating= (course) => {
    if(course.courseRatings.length === 0) return 0;
    let totalrating=0;
    course.courseRatings.forEach((rating) => {
      totalrating += rating.rating;
    });
    return (totalrating / course.courseRatings.length).toFixed(1);
  }
  const value={
        currency,allcourses,calculaterating
    }
    return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}