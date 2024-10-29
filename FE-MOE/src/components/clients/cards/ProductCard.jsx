// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React, { useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { formatCurrencyVND } from "~/utils/format";
import { useNavigate } from "react-router-dom";

export const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/view/${product.productId}`);
  };

  return (
    <Card
      sx={{
        width: 350,
        maxWidth: "100%",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
        },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: "250px",
            height: "250px",
            objectFit: "cover",
            transition: "filter 0.3s ease",
            filter: hovered ? "blur(4px)" : "none",
          }}
        />

        <Typography
          onClick={handleViewDetail}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            padding: "10px 20px",
            borderRadius: "5px",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            cursor: "pointer",
            zIndex: 1,
          }}
        >
          Xem chi tiết
        </Typography>
      </div>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "#ff0000",
          color: "#fff",
          padding: "5px 10px",
          fontSize: "12px",
          fontWeight: "bold",
          borderRadius: "5px",
          zIndex: 2,
        }}
      >
        -50%
      </div>

      <CardContent>
        <Typography
          variant="h6"
          component="div"
          style={{ fontWeight: "bold", marginBottom: "10px" }}
          noWrap
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          style={{ textDecoration: "line-through", color: "#aaa" }}
        >
          {formatCurrencyVND(product.retailPrice)}
        </Typography>
        <Typography variant="h6" component="div" style={{ color: "#ff0000" }}>
          {formatCurrencyVND(product.discountPrice)}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          <span style={{ color: "#ffcc00", marginRight: "5px" }}>★★★★★</span>((
          {product.rateCount}) lượt đánh giá)
        </Typography>
      </CardContent>
    </Card>
  );
};
