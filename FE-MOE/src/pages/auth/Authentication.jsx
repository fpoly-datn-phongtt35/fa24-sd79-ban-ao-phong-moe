// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { Button, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "~/assert/Auth.css";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";

function Authentication() {
  const [active, setActive] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "%cAccount",
      "color: green; font-weight: bold; font-size: 20px"
    );

    console.table({
      User: {
        username: "user",
        password: "123456",
      },
      Admin_System: {
        username: "sysadmin",
        password: "Admin@",
      },
    });
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      username,
      password,
      platform: "web",
    };
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/auth/access`,
      data
    );
    document.cookie =
      `role=${res.data.authority};path=/;max-age=` + 7 * 24 * 60 * 60;
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("username", username);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    navigate("/");
  };

  const handleRegisterClick = () => {
    setActive(true);
  };

  const handleLoginClick = () => {
    setActive(false);
  };

  return (
    <div className="body_auth">
      <div
        className={`container_auth ${active ? "active" : ""}`}
        id="container_auth"
      >
        <div className="form-container_auth sign-up">
          <form>
            <Typography level="h3">Tạo Tài Khoản</Typography>
            <div className="social-icons">
              <a href="#" className="icon">
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <Typography level="body-sm">Đăng ký tài khoản với email</Typography>
            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Mật khẩu" />
            <Button>Đăng ký</Button>
          </form>
        </div>
        <div className="form-container_auth sign-in">
          <form onSubmit={handleSubmit}>
            <Typography level="h3">Đăng Nhập</Typography>
            <div className="social-icons">
              <a href="#" className="icon">
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <Typography level="body-sm">
              Đăng nhập với tài khoản mật khẩu
            </Typography>
            <input
              value={username}
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              value={password}
              type="password"
              placeholder="Mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Typography level="body-sm" href="#">
              Quên mật khẩu
            </Typography>
            <Button type="submit">Đăng nhập</Button>
          </form>
        </div>
        <div className="toggle-container_auth">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <Typography color="white" level="h1">
                MOE STORE
              </Typography>
              <Typography color="white" level="body-sm">
                Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng
                của trang web
              </Typography>
              <Button className="hidden" onClick={handleLoginClick}>
                Đăng nhập
              </Button>
            </div>
            <div className="toggle-panel toggle-right">
              <Typography color="white" level="h1">
                MOE STORE
              </Typography>
              <Typography color="white" level="body-sm">
                Đăng ký thông tin cá nhân của bạn để sử dụng tất cả các tính
                năng của trang web
              </Typography>
              <Button className="hidden" onClick={handleRegisterClick}>
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Authentication;
