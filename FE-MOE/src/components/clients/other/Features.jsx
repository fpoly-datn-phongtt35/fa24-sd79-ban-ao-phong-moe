import React from "react";
import { Box, Typography, Stack } from "@mui/joy";
import DeliveryIcon from "~/assert/icon/icon-delivery.svg";
import CustomerIcon from "~/assert/icon/Icon-Customer service.svg";
import SecureIcon from "~/assert/icon/Icon-secure.svg";

const Feature = ({ icon, title, description }) => (
  <Box
    sx={{
      textAlign: "center",
      p: 2,
      border: "1px solid #ccc",
      borderRadius: "8px",
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
      <img src={icon} alt={title} style={{ width: "40px", height: "40px" }} />
    </Box>
    <Typography level="h6" fontWeight="bold">
      {title}
    </Typography>
    <Typography level="body2">{description}</Typography>
  </Box>
);

const Features = () => (
  <Stack
    direction="row"
    spacing={2}
    sx={{
      display: "flex",
      justifyContent: "space-evenly",
      p: 2,
    }}
  >
    <Feature
      icon={DeliveryIcon}
      title="GIAO HÀNG MIỄN PHÍ VÀ NHANH CHÓNG"
      description="Giao hàng miễn phí cho tất cả các đơn hàng trên 100.000 VND"
    />
    <Feature
      icon={CustomerIcon}
      title="DỊCH VỤ KHÁCH HÀNG 24/7"
      description="Hỗ trợ khách hàng thân thiện 24/7"
    />
    <Feature
      icon={SecureIcon}
      title="ĐẢM BẢO HOÀN TIỀN"
      description="Chúng tôi trả lại tiền trong vòng 30 ngày"
    />
  </Stack>
);

export default Features;
