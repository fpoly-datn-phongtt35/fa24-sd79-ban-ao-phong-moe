// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React, { useContext, useState } from "react";
import { Box } from "@mui/joy";
import SideImage from "~/assert/images/SideImage.svg";

import SignUpBase from "~/components/auth/SignUpBase";
import { AuthContext } from "~/context/AuthContext";
import SignUpInfo from "~/components/auth/SignUpInfo";
import SignUpAddress from "~/components/auth/SignUpAddress";
import SignUpAvatar from "~/components/auth/SignUpAvatar";

function SignUp() {
  const context = useContext(AuthContext);

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
          {context.step === 0 && <SignUpBase />}
          {context.step === 1 && <SignUpInfo />}
          {context.step === 2 && <SignUpAddress />}
          {context.step === 3 && <SignUpAvatar />}
          {context.step === 4 && (
            <p onClick={() => context.setStep(1)}>
              HI{console.log(context.dataRegister)}
            </p>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default SignUp;
