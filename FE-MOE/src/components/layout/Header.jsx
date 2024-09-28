import React, { useState, useEffect } from "react";
import "./Header.css";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [username, setUsername] = useState("Unknown");
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img
          src="https://www.logolynx.com/images/logolynx/42/4240b79d919cfa02c483d8936894d63d.png"
          alt="MOE Logo"
          className="img-fluid"
          style={{ width: "100px", cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        />
      </div>
      <div className="header-left">
        <span className="me-3 fw-bold">Hello {username} !</span>
        <Image
          src="https://pluspng.com/img-png/user-png-icon-young-user-icon-2400.png"
          roundedCircle
          style={{ width: "30px" }}
        />
      </div>
    </header>
  );
};
