// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { AspectRatio, Card, Typography } from "@mui/joy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CardOrderItem({ data }) {
  const [flexBasis, setFlexBasis] = useState(200);
  const navigate = useNavigate();
  return (
    <Card
      variant="plain"
      size="sm"
      orientation="horizontal"
      sx={{ gap: 2, minWidth: 350, backgroundColor: "white" }}
    >
      <AspectRatio
        sx={[
          { overflow: "auto" },
          flexBasis ? { flexBasis: `${flexBasis}px` } : { flexBasis: null },
        ]}
      >
        <img
          onClick={() => {
            if (data.status && data.quantity > 0) {
              navigate(
                `/view/${data.productId}#${data.name.substring(
                  0,
                  data.name.indexOf("[")
                )}`
              );
            } else {
              toast.error("Sản phẩm không có sẵn");
            }
          }}
          src={data.imageUrl}
          alt={data.name}
        />
      </AspectRatio>
      <div style={{ width: "100%" }}>
        <Typography level="title-sm" noWrap={false} color="neutral">
          {data.name}
        </Typography>
        <Typography level="body-sm" color="neutral">
          {data.category}
        </Typography>
      </div>
    </Card>
  );
}

export default CardOrderItem;
