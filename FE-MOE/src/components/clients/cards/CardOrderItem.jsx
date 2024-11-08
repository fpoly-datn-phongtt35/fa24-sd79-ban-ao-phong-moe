// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { AspectRatio, Card, Typography } from "@mui/joy";
import { useState } from "react";

function CardOrderItem({ data }) {
  const [flexBasis, setFlexBasis] = useState(200);
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
        <img src={data.imageUrl} alt={data.name} />
      </AspectRatio>
      <div style={{ width: "100%" }}>
        <Typography level="title-sm" noWrap={false} color="neutral">
          {data.name}
        </Typography>
        <Typography level="body-sm" color="neutral">
          Khác
        </Typography>
      </div>
    </Card>
  );
}

export default CardOrderItem;
