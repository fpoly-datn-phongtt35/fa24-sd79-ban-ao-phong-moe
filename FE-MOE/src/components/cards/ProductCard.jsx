import React, { useState } from "react";
import { Card, CardContent, Button, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      sx={{
        width: 300,
        maxWidth: "100%",
        minHeight: "550px",
        maxHeight: "550px",
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
      {/* Image section */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={product.imageUrl[0]}
          alt={product.name}
          style={{ width: "300px", height: "300px" }}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <FavoriteBorderIcon style={{ color: "#555" }} />
          <VisibilityIcon style={{ color: "#555" }} />
        </div>

        {/* Add to Cart button - only visible on hover */}
        <Button
          variant="contained"
          color="primary"
          style={{
            position: "absolute",
            bottom: "0",
            width: "100%",
            backgroundColor: hovered ? "#000" : "transparent",
            color: hovered ? "#fff" : "transparent",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          Thêm vào giỏ hàng
        </Button>
      </div>

      {/* Discount Badge */}
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
        }}
      >
        -10%
      </div>

      {/* Product details */}
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          style={{ fontWeight: "bold", marginBottom: "10px" }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          style={{ textDecoration: "line-through", color: "#aaa" }}
        >
          200.000 VNĐ
        </Typography>
        <Typography variant="h6" component="div" style={{ color: "#ff0000" }}>
          100.000 VNĐ
        </Typography>

        {/* Rating and reviews */}
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          <span style={{ color: "#ffcc00", marginRight: "5px" }}>★★★★★</span>(13k lượt đánh giá)
        </Typography>
      </CardContent>
    </Card>
  );
};
