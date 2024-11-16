// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import "regenerator-runtime/runtime";
import { Header_Admin } from "~/components/layout/Header_Admin";
import { Sidebar_Admin } from "~/components/layout/Sidebar_Admin";
import { Product } from "~/pages/products/Product";
import { Archive } from "~/pages/products/Archive";
import { Dashboard } from "~/pages/other/Dashboard";
import { Customer } from "~/pages/customer/Customer";
import { AddCustomer } from "~/pages/customer/AddCustomer";
import CustomerDetailPage from "~/pages/customer/CustomerDetailPage";
import { Categories } from "~/pages/products/categories/Categories";
import { Promotion } from "~/pages/promotions/Promotion";
import { Brand } from "~/pages/products/brands/Brand";
import { Material } from "~/pages/products/materials/Material";
import { Size } from "~/pages/products/sizes/Size";
import { Color } from "~/pages/products/colors/Color";
import Coupon from "~/pages/coupon/Coupon";
import CreateCoupon from "~/pages/coupon/CreateCoupon";
import UpdateCoupon from "~/pages/coupon/UpdateCoupon";
import { Employee } from "~/pages/employee/Employee";
import EmployeesUpdate from "~/pages/employee/EmployeeUpdate";
import { AddPromotion } from "~/pages/promotions/AddPromotion";
import { UpdatePromotion } from "~/pages/promotions/UpdatePromotion";
import { ProductDetail } from "~/pages/products/main/ProductDetail";
import { ProductStore } from "~/pages/products/main/ProductStore";
import { useState } from "react";
import Header_Client from "~/components/layout/Header_Client";
import Home from "~/pages/clients/Home";
import FooterClient from "~/components/layout/FooterClient";
import AboutUs from "~/pages/clients/AboutUs";
import { Contact } from "~/pages/clients/Contact";
import { ViewDetail } from "~/pages/clients/ViewDetail";
import LoginPage from "~/pages/auth/LoginPage";
import LocationSelector from "~/pages/other/LocationSelector";
import { EmployeeStore } from "~/pages/employee/EmployeeStore";
import ShoppingCart from "~/pages/clients/ShoppingCart";
import CheckOut from "~/pages/clients/CheckOut";
import Bill from "~/pages/bill/Bill";
import AccountInfo from "~/pages/clients/customer/AccountManager";
import MyOrder from "~/pages/clients/orders/MyOrder";
import BillList from "~/pages/bill/BillList";
import BillEdit from "~/pages/bill/BillEdit";
import Products from "~/pages/clients/Products";
import { AddressInfo } from "~/pages/clients/customer/AddressManager";
function RouterProvider() {
  const ProtectedRoutes_ADMIN = () => {
    const [collapsed, setCollapsed] = useState(false);

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
      return <Navigate to="/signin" replace={true} />;
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
  const ProtectedRoutes_USER = () => {
    const accessToken = localStorage.getItem("accessToken");

    const getAuthority = () => {
      const roleCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("role="));

      return roleCookie ? roleCookie.split("=")[1] : "";
    };

    if (!accessToken) {
      return <Navigate to="/signin" replace={true} />;
    } else if (getAuthority() === "USER") {
      return (
        <div className="layout_client">
          <div className="main-area_client">
            <div>
              <Header_Client />
            </div>
            <div className="content-area_client">
              <Outlet />
              <FooterClient />
            </div>
          </div>
        </div>
      );
    } else {
      return <Navigate to="/" replace={true} />;
    }
  };

  const PublicRoutes = () => {
    const accessToken = localStorage.getItem("accessToken");

    const getAuthority = () => {
      const roleCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("role="));

      return roleCookie ? roleCookie.split("=")[1] : "";
    };

    if (accessToken && getAuthority() == "ADMIN") {
      return <Navigate to="/dashboard" replace={true} />;
    }

    return (
      <div className="layout_client">
        <div className="main-area_client">
          <div>
            <Header_Client />
          </div>
          <div className="content-area_client">
            <Outlet />
            <FooterClient />
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
      <div className="layout_client">
        <div className="main-area_client">
          <div>
            <Header_Client />
          </div>
          <div className="content-area_client" style={{backgroundColor: '#4545ff1a'}}>
            <Outlet />
          </div>
        </div>
      </div>
    );
  };
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" replace={true} />} />

      <Route element={<UnauthorizedRoutes />}>
        <Route path="/signin" element={<LoginPage />} />
      </Route>

      <Route element={<PublicRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/view/:id" element={<ViewDetail />} />
        <Route path="/search" element={<Products />} />
        <Route path="/api-tinh-thanh" element={<LocationSelector />} />
      </Route>

      <Route element={<ProtectedRoutes_USER />}>
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/my-account" element={<AccountInfo />} />
        <Route path="/my-order" element={<MyOrder />} />
        <Route path="/my-address" element={<AddressInfo />} />
      </Route>

      <Route element={<ProtectedRoutes_ADMIN />}>
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
        <Route path="/employee/add" element={<EmployeeStore />} />
        <Route path="/employee/:id" element={<EmployeesUpdate />} />
        <Route path="/promotions/add" element={<AddPromotion />} />
        <Route path="/promotions/update/:id" element={<UpdatePromotion />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/bill/list" element={<BillList />} />
        <Route path="/bill/edit/:id" element={<BillEdit />} />
      </Route>
    </Routes>
  );
}

export default RouterProvider;
