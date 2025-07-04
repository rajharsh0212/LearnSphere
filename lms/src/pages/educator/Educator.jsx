import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/educator/Sidebar";
import Footer from "../../components/educator/Footer";

const Educator = () => {
  return (
    <div className="text-default min-h-screen bg-white">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 pt-24">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Educator;