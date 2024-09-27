import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Signin from "~/pages/auth/Signin";
import Authenticated from "~/pages/other/Authenticated";

const ProtectedRoutes = () => {
  
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return <Navigate to="/login" replace={true} />;
  }
  return (
    <>
      <h1>Header</h1>
      <h1>Sidebar</h1>
      <Outlet />
      <h1>Footer</h1>
    </>
  );
};

const UnauthorizedRoutes = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return <Navigate to="/home" replace={true} />;
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
        <Route path="/home" element={<Authenticated />} />
      </Route>
    </Routes>
  );
}

export default App;
