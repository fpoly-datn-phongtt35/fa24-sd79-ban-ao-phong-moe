import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import "regenerator-runtime/runtime";
import { Header_Admin } from "./components/layout/Header_Admin";
import { Sidebar_Admin } from "./components/layout/Sidebar_Admin";
import { Product } from "./pages/products/Product";
import { Archive } from "./pages/products/Archive";
import { Dashboard } from "./pages/other/Dashboard";
import { Customer } from "./pages/customer/Customer";
import { AddCustomer } from "./pages/customer/AddCustomer";
import CustomerDetailPage from "./pages/customer/CustomerDetailPage";
import { Categories } from "./pages/products/categories/Categories";
import { Promotion } from "~/pages/promotions/Promotion";
import { Brand } from "./pages/products/brands/Brand";
import { Material } from "./pages/products/materials/Material";
import { Size } from "./pages/products/sizes/Size";
import { Color } from "./pages/products/colors/Color";
import Coupon from "./pages/coupon/Coupon";
import CreateCoupon from "./pages/coupon/CreateCoupon";
import UpdateCoupon from "./pages/coupon/UpdateCoupon";
import { Employee } from "~/pages/employee/Employee";
import EmployeesCreate from "./pages/employee/EmployeeCreate";
import EmployeesUpdate from "./pages/employee/EmployeeUpdate";
import { AddPromotion } from "./pages/promotions/AddPromotion";
import { UpdatePromotion } from "./pages/promotions/UpdatePromotion";

import { ProductDetail } from "./pages/products/main/ProductDetail";
import { ProductStore } from "./pages/products/main/ProductStore";
import { useState } from "react";
import { Home } from "./pages/clients/Home";
import Header_Client from "./components/layout/Header_Client";
import Authentication from "./pages/auth/Authentication";

const ProtectedRoutes = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const onCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const getAuthority = () => {
    const roleCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="));

    return roleCookie ? roleCookie.split("=")[1] : "";
  };

  if (!accessToken) {
    return <Navigate to="/login" replace={true} />;
  } else if (getAuthority() === "ADMIN") {
    return (
      <div className="layout">
        <div className="sidebar">
          <Sidebar_Admin collapsed={collapsed} />
        </div>

        <div className="main-area">
          <div className="header">
            <div className="header-left"></div>
            <Header_Admin onCollapsed={onCollapsed} collapsed={collapsed} />
          </div>

          <div className="content-area">
            <Outlet />
          </div>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/" replace={true} />;
  }
};

const PublicRoutes = () => {
  return (
    <div className="layout_client">
      <div className="main-area_client">
        <div>
          <Header_Client />
        </div>

        <div className="content-area_client">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const UnauthorizedRoutes = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return <Navigate to="/dashboard" replace={true} />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Navigate to="/" replace={true} />} />

      <Route element={<UnauthorizedRoutes />}>
        <Route path="/login" element={<Authentication />} />
      </Route>
      <Route element={<PublicRoutes />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/categories" element={<Categories />} />
        <Route path="/product/brand" element={<Brand />} />
        <Route path="/product/material" element={<Material />} />
        <Route path="/product/size" element={<Size />} />
        <Route path="/product/color" element={<Color />} />
        <Route path="/product/new" element={<ProductStore />} />
        <Route path="/product/view/:id" element={<ProductDetail />} />
        <Route path="/product/archive" element={<Archive />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/customer/add" element={<AddCustomer />} />
        <Route path="/customer/:id" element={<CustomerDetailPage />} />
        <Route path="/coupon" element={<Coupon />} />
        <Route path="/coupon/create" element={<CreateCoupon />} />
        <Route path="/coupon/detail/:id" element={<UpdateCoupon />} />
        <Route path="/promotions" element={<Promotion />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/employee/add" element={<EmployeesCreate />} />
        <Route path="/employee/:id" element={<EmployeesUpdate />} />
        <Route path="/promotions/add" element={<AddPromotion />} />
        <Route path="/promotions/update/:id" element={<UpdatePromotion />} />
      </Route>
    </Routes>
  );
}

export default App;
