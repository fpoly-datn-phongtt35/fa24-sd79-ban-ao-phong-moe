import React, { useState, useEffect } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { Avatar, Tooltip } from "@mui/material";

export const Header = () => {
  const [username, setUsername] = useState("Unknown");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setAvatar(localStorage.getItem("avatar"));
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img
          src="https://www.moe.co.nz/wp-content/uploads/2021/12/Moe_Logo_Alpha.png"
          alt="MOE Logo"
          className="img-fluid"
          style={{ width: "100px", cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        />
      </div>
      <div className="header-left">
        <Tooltip title={username}>
          <Avatar alt={username} src={avatar} />
        </Tooltip>
      </div>
    </header>
  );
};
