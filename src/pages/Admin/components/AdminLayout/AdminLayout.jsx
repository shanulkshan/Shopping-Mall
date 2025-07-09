import React from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <AdminSidebar>{children}</AdminSidebar>
    </div>
  );
};

export default AdminLayout;
