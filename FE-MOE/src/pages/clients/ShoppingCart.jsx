// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1

import { Box, Breadcrumbs, Grid, Link, Typography } from "@mui/joy";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

function ShoppingCart() {
  const navigate = useNavigate();
  return (
    <Box>
      <Grid
        container
        spacing={2}
        alignItems="center"
        height={"50px"}
      >
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
          <Link
            underline="hover"
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Trang chủ
          </Link>
          <Typography level="title-md" noWrap>
            Giỏ hàng
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Box>
        
      </Box>
    </Box>
  );
}

export default ShoppingCart;
