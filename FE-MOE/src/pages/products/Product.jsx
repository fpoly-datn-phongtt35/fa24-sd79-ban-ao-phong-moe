import { Container, Grid, Typography, Box } from "@mui/material";

export const Product = () => {
  return (
    <Container
      maxWidth="max-width"
      className="bg-white"
      style={{ height: "100%", marginTop: "15px" }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        bgcolor={"#1976d2"}
        height={"50px"}
      >
        <Typography
          xs={4}
          margin={"4px"}
          variant="h6"
          gutterBottom
          color="#fff"
        >
          Quản lý sản phẩm
        </Typography>
      </Grid>
      <Grid>
        <Box className="mb-5 mt-5">
          <Typography variant="h4" color="text.primary">
            Danh sách sản phẩm
          </Typography>
        </Box>
      </Grid>
    </Container>
  );
};
