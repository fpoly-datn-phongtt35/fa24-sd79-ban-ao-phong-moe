import React, { useState } from "react";
import { Box, Typography } from "@mui/joy";
import Rating from "@mui/material/Rating";
import { formatCurrencyVND } from "~/utils/format";
import { useNavigate } from "react-router-dom"; // Đảm bảo rằng bạn đã cài đặt react-router-dom

const TopProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/view/${product.productId}`);
  };

  return (
    <Box
      sx={{
        width: "250px",
        maxWidth: "100%",
        padding: "15px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        textAlign: "start",
        position: "relative",
        overflow: "hidden"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        component="img"
        src={product.imageUrl}
        alt="Product"
        sx={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "12px",
          marginBottom: "16px",
          transition: "filter 0.3s ease",
          filter: hovered ? "blur(4px)" : "none",
        }}
      />

      <Typography
        onClick={handleViewDetail}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -150%)", 
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

      <Typography
        fontWeight="bold"
        fontSize="16px"
        sx={{ marginBottom: "8px", zIndex: 2 }}
        noWrap
      >
        {product.name}
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "start", alignItems: "center", zIndex: 2 }}
      >
        <Typography
          color="danger"
          fontWeight="bold"
          sx={{ marginRight: "8px" }}
        >
          {formatCurrencyVND(product.discountPrice)}
        </Typography>
        <Typography
          sx={{
            textDecoration: "line-through",
            color: "grey",
          }}
        >
          {formatCurrencyVND(product.retailPrice)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginTop: "8px", zIndex: 2 }}>
        <Rating
          name="read-only"
          value={product.rate}
          readOnly
          precision={0.5}
        />
        <Typography sx={{ marginLeft: "8px", color: "grey" }}>
          ({product.rateCount})
        </Typography>
      </Box>
    </Box>
  );
};

export default TopProductCard;
