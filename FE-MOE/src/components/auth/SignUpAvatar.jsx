// Author: Nong Hoang Vu || JavaTech
// Facebook: https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { Box, Button, Typography, Avatar, IconButton } from "@mui/joy";
import { useContext, useState } from "react";
import { AuthContext } from "~/context/AuthContext";
import { PhotoCamera } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { register } from "~/apis";
import axios from "axios";
import { API_ROOT } from "~/utils/constants";
import { CommonContext } from "~/context/CommonContext";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function SignUpAvatar() {
  const contextCommon = useContext(CommonContext);
  const context = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [avatar, setAvatar] = useState(null);
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      setFile(file);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if(file === null){
      toast.warning("Vui lòng chọn ảnh đại diện!");
      return;
    }
    let formData = new FormData();
    formData.append("username", context.dataRegister.username);
    formData.append("email", context.dataRegister.email);
    formData.append("password", context.dataRegister.password);
    formData.append("firstName", context.dataRegister.firstName);
    formData.append("lastName", context.dataRegister.lastName);
    formData.append("gender", context.dataRegister.gender);
    formData.append("dateOfBirth", context.dataRegister.dateOfBirth);
    formData.append("phoneNumber", context.dataRegister.phoneNumber);
    formData.append("streetName", context.dataRegister.streetName);
    formData.append("ward", context.dataRegister.ward);
    formData.append("district", context.dataRegister.district);
    formData.append("districtId", context.dataRegister.districtId);
    formData.append("city", context.dataRegister.city);
    formData.append("cityId", context.dataRegister.cityId);
    formData.append("avatar", file);

    setLoading(true);
    await register(formData)
      .then(async (res) => {
        if (res.status === 200) {
          const result = {
            username: context.dataRegister.username,
            password: context.dataRegister.password,
            platform: "web",
          };
          await axios.post(`${API_ROOT}/auth/access`, result).then((res) => {
            if (res.status === 200) {
              document.cookie =
                `role=${res.data.authority};path=/;max-age=` + 7 * 24 * 60 * 60;
              localStorage.setItem("userId", res.data.userId);
              localStorage.setItem("username", result.username);
              localStorage.setItem("accessToken", res.data.accessToken);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              contextCommon.handleFetchCarts();

              Cookies.set("usernameCookie", result.username, { expires: 30 });
              Cookies.set("passwordCookie", result.password, { expires: 30 });
              Cookies.set("isRememberMe", "true", { expires: 30 });
              toast.success("Đăng ký thành công!");
              navigate("/");
            }
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        level="h4"
        textAlign="center"
        marginBottom={2}
        fontWeight="bold"
        sx={{
          color: "#1976d2",
        }}
      >
        HOÀN TẤT ĐĂNG KÝ
      </Typography>

      <Typography
        level="body2"
        textAlign="center"
        marginBottom={2}
        sx={{
          color: "#000",
        }}
      >
        Hãy chọn một ảnh đại diện cho hồ sơ của bạn. Ảnh này sẽ hiển thị trên
        trang cá nhân của bạn.
      </Typography>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Avatar
          src={avatar || "/default-avatar.png"}
          alt={context?.dataRegister?.firstName}
          sx={{
            width: 120,
            height: 120,
            border: "5px solid #1976d2",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        />

        <IconButton
          color="primary"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "white",
            borderRadius: "50%",
            border: "2px solid #1976d2",
            "&:hover": {
              backgroundColor: "#e3f2fd",
            },
          }}
          component="label"
        >
          <PhotoCamera />
          {!loading && (
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          )}
        </IconButton>
      </Box>

      <Typography
        level="body2"
        textAlign="center"
        sx={{
          color: "#000",
        }}
      >
        Nhấp vào biểu tượng máy ảnh để thay đổi ảnh đại diện của bạn.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mt: 3,
        }}
      >
        <Button
          disabled={loading}
          type="button"
          variant="soft"
          color="neutral"
          sx={{
            width: "45%",
            backgroundColor: "#f0f0f0",
            "&:hover": {
              backgroundColor: "#d6d6d6",
            },
          }}
          onClick={() => navigate("/")}
        >
          Hủy
        </Button>
        <Button
          loading={loading}
          type="button"
          variant="soft"
          color="primary"
          sx={{
            width: "45%",
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
          onClick={() => handleSubmit()}
        >
          Hoàn thành
        </Button>
      </Box>
    </Box>
  );
}

export default SignUpAvatar;
