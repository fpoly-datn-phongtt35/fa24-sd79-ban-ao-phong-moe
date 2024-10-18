import HomeIcon from "@mui/icons-material/Home";
import { Breadcrumbs, Link, Typography } from "@mui/joy";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const BreadcrumbsAttributeProduct = ({ tag }) => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      marginBottom={2}
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
        <Typography sx={{ color: "text.white", cursor: "pointer" }}>
          Quản lý {tag}
        </Typography>
      </Breadcrumbs>
    </Grid>
  );
};
