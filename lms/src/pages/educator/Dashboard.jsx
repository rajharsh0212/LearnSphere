import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { currency, backendUrl } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const { auth } = useContext(AuthContext);

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch dashboard data.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <Loading />;
  }

  const { enrolledStudentsData, totalCourses, totalEarning } = dashboardData;

  const stats = [
    {
      icon: assets.person_tick_icon,
      value: enrolledStudentsData.length,
      label: "Total Enrollments",
    },
    {
      icon: assets.my_course_icon,
      value: totalCourses,
      label: "Total Courses",
    },
    {
      icon: assets.earning_icon,
      value: `${currency} ${(totalEarning || 0).toFixed(2)}`,
      label: "Total Earnings",
    },
  ];

  return (
    <div className="bg-gray-50/50">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Dashboard
        </h1>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <img src={stat.icon} alt="" className="w-8 h-8" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          
          ))}
        </div>

        {/* Recent Enrollments */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Enrollments
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Course
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudentsData.slice(0, 5).map((item, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-3">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={assets.user_icon}
                        alt="user"
                      />
                      <span>{item.student.name}</span>
                    </td>
                    <td className="px-6 py-4">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {enrolledStudentsData.length === 0 && (
              <p className="text-center py-10 text-gray-500">
                No enrollments yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;