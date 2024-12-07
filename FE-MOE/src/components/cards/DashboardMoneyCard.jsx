import React from "react";
import { Box, Typography, IconButton } from "@mui/joy";
import SvgIconDisplay from "../other/SvgIconDisplay";

const DashboardMoneyCard = ({ title, icon, value, value_2 }) => {
  return (
    <Box
      variant="outlined"
      sx={{
        minHeight: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderRadius: "lg",
        boxShadow: "sm",
        background: "linear-gradient(to right, #ffffff, #f9f9f9)",
      }}
    >
      {/* Left Content */}
      <Box>
        <Typography color="neutral" level="title-lg">
          {title}
        </Typography>
        <Typography level="tile-lg" color="primary" fontWeight="bold" mt={1}>
          {value} &nbsp;
          <Typography
            level="title-md"
            component="span"
            color="success"
            sx={{ fontWeight: "bold" }}
          >
            {value_2}
          </Typography>
        </Typography>
      </Box>

      {/* Right Content */}
      <IconButton
        sx={{
          width: 50,
          height: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to right, #007bff, #00c6ff)",
          borderRadius: "30%",
          boxShadow: "md",
          color: "#fff",
        }}
      >
        <SvgIconDisplay icon={icon} width="40px" height="40px"/>
      </IconButton>
    </Box>
  );
};

export default DashboardMoneyCard;
