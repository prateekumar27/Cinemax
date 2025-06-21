import React, { useEffect } from "react";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import AdminNavbar from "../../Components/Admin/AdminNavbar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import Loading from "../../Components/Loading";

const Layout = () => {
  const { isAdmin, fetchIsAdmin } = useAppContext();

  useEffect(() => {
    fetchIsAdmin();
  }, []);

  return isAdmin ? (
    <div>
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
