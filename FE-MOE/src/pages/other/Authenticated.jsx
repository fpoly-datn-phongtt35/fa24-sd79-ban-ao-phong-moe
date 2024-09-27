import { useEffect, useState } from "react";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";
import { useNavigate } from "react-router-dom";
function Authenticated() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const res = authorizedAxiosInstance.get(`${API_ROOT}/product`);
    console.log(res);
    setUser(localStorage.getItem("username"));
  }, []);

  const handleLogout = async () => {
    await authorizedAxiosInstance.post(`${API_ROOT}/auth/remove`, null);
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
    setUser(null);
  };

  if (!user) {
    return (
      <div className="text-center m-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-center m-5">
        <span>
          Authenticated with username <b>{localStorage.getItem("username")}</b>
        </span>
      </p>
      <div>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
export default Authenticated;
