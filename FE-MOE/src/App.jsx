import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Signin from "~/pages/auth/Signin";
import { Header } from "./components/layout/Header";
import { Sidebar_ } from "./components/layout/Sidebar_";
import { Product } from "./pages/products/Product";
import { Dashboard } from "./pages/other/Dashboard";
import { Customer } from "./pages/customer/Customer";
import { AddCustomer } from "./pages/customer/AddCustomer";
import CustomerDetailPage from './pages/customer/CustomerDetailPage';
import { Categories } from "./pages/products/categories/Categories";

const ProtectedRoutes = () => {
  
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return <Navigate to="/login" replace={true} />;
  }
  return (
    <div className="layout">
      <Header />
      <div className="content-area">
        <Sidebar_ />
        <div className="main-content">
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
      <Route path="/" element={<Navigate to="/login" replace={true} />} />

      <Route element={<UnauthorizedRoutes />}>
        <Route path="/login" element={<Signin />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<Product />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/customer/add" element={<AddCustomer />} />
         <Route path="/customer/:id" element={<CustomerDetailPage />} />
        <Route path="/categories" element={<Categories />} />
      </Route>
    </Routes>
  );
}

export default App;
