import * as React from "react";
import { Grid2, DialogTitle, DialogContent, Dialog, DialogActions, TextField, Button } from "@mui/material";

export const DialogStore = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        endIcon={props.icon}
      >
        {props.buttonTitle}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const data = {
              name: formJson.name,
              hex_code: formJson.hex_code,
              userId: localStorage.getItem("userId"),
            };
            props.handleSubmit(data, props.id);
            handleClose();
          },
        }}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
        <Grid2 container spacing={2}>
            <Grid2 size={6}>
            <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="name"
                label="Tên màu"
                type="text"
                fullWidth
                variant="standard"
              />
            </Grid2>
            <Grid2 size={6}>
            <TextField
                autoFocus
                required
                margin="dense"
                id="hex_code"
                name="hex_code"
                label="Mã màu"
                type="color"
                fullWidth
                variant="standard"
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button type="submit">Lưu</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
