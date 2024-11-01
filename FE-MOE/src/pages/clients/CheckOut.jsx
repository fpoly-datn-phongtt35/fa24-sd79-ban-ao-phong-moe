// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { Box, Breadcrumbs, Grid, Link, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";

function CheckOut() {
    const navigate = useNavigate();
  return (
    <Box>
      <Grid container spacing={2} alignItems="center" height={"50px"}>
        <Breadcrumbs
          separator="›"
          aria-label="breadcrumbs"
          sx={{ marginLeft: 5 }}
        >
          <Link
            underline="hover"
            sx={{ cursor: "pointer" }}
            color="neutral"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </Link>
          <Link
            underline="hover"
            sx={{ cursor: "pointer" }}
            color="neutral"
            onClick={() => navigate("/cart")}
          >
            Giỏ hàng
          </Link>
          <Typography noWrap>Thanh toán</Typography>
        </Breadcrumbs>
      </Grid>
    </Box>
  );
}

export default CheckOut;
