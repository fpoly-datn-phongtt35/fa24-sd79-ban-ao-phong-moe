import { Box, Grid, TextField  } from "@mui/material";

export const Filter = () => {
  return (
    <Box marginTop={5}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField label="name..." variant="standard"/>
        </Grid>

        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField label="status..." />
            </Grid>
            <Grid item xs={3}>
              <TextField label="category..." />
            </Grid>
            <Grid item xs={3}>
              <TextField label="branch..." />
            </Grid>
            <Grid item xs={3}>
              <TextField label="material..." />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
