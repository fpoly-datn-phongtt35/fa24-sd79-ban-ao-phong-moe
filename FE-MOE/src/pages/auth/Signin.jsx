import { useState } from "react";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("123456");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const data = {
      username,
      password,
      platform: "web",
    };
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/auth/access`,
      data
    );
    document.cookie = `role=${res.data.authority};path=/;max-age=` + (7 * 24 * 60 * 60);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("username", username);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    navigate("/dashboard");
  };
  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <div className="text-center mb-4">
          {/* Logo MOE */}
          <img
            src="https://static.vecteezy.com/system/resources/previews/010/166/568/original/moe-letter-technology-logo-design-on-white-background-moe-creative-initials-letter-it-logo-concept-moe-letter-design-vector.jpg"
            alt="MOE Logo"
            className="img-fluid mb-3"
            style={{ width: "100px" }}
          />
          <h2 className="fw-bold">MOE Login</h2>
        </div>

        <p className="text-center text-muted">
          Username: sysadmin | Password: sysadmin
        </p>

        <form className="mt-4">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingUsername"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="floatingUsername">Username</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="d-grid">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-outline-primary btn-lg"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-3 text-center">
          <button
            className="btn btn-link text-decoration-none text-muted fw-m"
            style={{ textTransform: "uppercase" }}
          >
            Forgot Password?
          </button>
          <button
            className="btn btn-link text-decoration-none text-primary fw-bold"
            style={{ textTransform: "uppercase" }}
          >
            Sign Up
          </button>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="btn btn-light border w-100 btn-lg d-flex align-items-center justify-content-center"
            onClick={() => toast.error("Coming soon!")}
          >
            <img
              src="https://th.bing.com/th/id/R.0fa3fe04edf6c0202970f2088edea9e7?rik=joOK76LOMJlBPw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fgoogle-logo-png-open-2000.png&ehk=0PJJlqaIxYmJ9eOIp9mYVPA4KwkGo5Zob552JPltDMw%3d&risl=&pid=ImgRaw&r=0"
              alt="Google Logo"
              style={{ width: "20px", marginRight: "10px" }}
            />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
