// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React, { useState } from "react";
import { Box } from "@mui/joy";
import SideImage from "~/assert/images/signUp.svg";

import RequestForgotPassword from "~/components/auth/RequestForgotPassword";
import ForgotPasswordVerify from "~/components/auth/ForgotPasswordVerify";
import ChangePasswordForm from "~/components/auth/ChangePasswordForm";

function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);

  const commonMethods = {
    step,
    setStep,
    email,
    setEmail,
    token,
    setToken,
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 750,
        maxHeight: 750,
        maxWidth: 1305,
        margin: "auto",
        p: 3,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1400,
          overflow: "hidden",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${SideImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: 636,
            height: 636,
            borderRadius: "8px 0 0 8px",
          }}
        />

        <Box
          sx={{
            flex: 1,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "0 8px 8px 0",
          }}
        >
          {step === 0 && <RequestForgotPassword method={commonMethods} />}
          {step === 1 && <ForgotPasswordVerify method={commonMethods} />}
          {step === 2 && <ChangePasswordForm method={commonMethods}/>}
        </Box>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
