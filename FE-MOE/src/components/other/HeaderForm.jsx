import { Grid, Typography } from "@mui/material";

export const HeardForm = (props) => {
  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      bgcolor={"#1976d2"}
      height={"50px"}
    >
      <Typography xs={4} margin={"4px"} variant="h6" gutterBottom color="#fff">
        {props.title}
      </Typography>
    </Grid>
  );
};
