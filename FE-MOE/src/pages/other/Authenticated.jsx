import { useEffect, useState } from "react";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";
import { useNavigate } from "react-router-dom";
import { handleLogoutAPI } from "~/apis";

function Authenticated() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const res = authorizedAxiosInstance.get(`${API_ROOT}/product`);
    setUser(localStorage.getItem("username"));
  }, [user]);

  const handleLogout = async () => {
    await handleLogoutAPI();
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
