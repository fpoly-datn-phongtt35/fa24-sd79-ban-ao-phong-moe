import { AspectRatio, Card, Typography } from "@mui/joy";
import { useState } from "react";

function CardShoppingCard({ data }) {
  const [flexBasis, setFlexBasis] = useState(200);
  return (
    <Card
      variant="plain"
      size="sm"
      orientation="horizontal"
      sx={{ gap: 2, minWidth: 350 }}
    >
      <AspectRatio
        sx={[
          { overflow: "auto" },
          flexBasis ? { flexBasis: `${flexBasis}px` } : { flexBasis: null },
        ]}
      >
        <img src={data.imageUrl} alt={data.name} />
      </AspectRatio>
      <div style={{ width: "100%" }}>
        <Typography
          level="title-sm"
          noWrap={false}
          color={
            !data.productCart.status || data.productCart.quantity < 1
              ? "danger"
              : "neutral"
          }
        >
          {data.name}
        </Typography>
        <Typography
          level="body-sm"
          color={
            !data.productCart.status || data.productCart.quantity < 1
              ? "danger"
              : "neutral"
          }
        >
          {!data.productCart.status
            ? "Sản phẩm không tồn tại"
            : data.productCart.quantity < 1
            ? "Hết hàng"
            : data.origin}
        </Typography>
      </div>
    </Card>
  );
}

export default CardShoppingCard;
