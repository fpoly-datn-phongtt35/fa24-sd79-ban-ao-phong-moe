import { Grid, Typography } from "@mui/material";

export const HeardForm = (props) => {
  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      bgcolor={"#2378cb"}
      height={"40px"}
      paddingLeft={2}
      borderRadius={1}
    >
      <Typography xs={4} variant="h6" color="#fff">
        {props.title}
      </Typography>
    </Grid>
  );
};
