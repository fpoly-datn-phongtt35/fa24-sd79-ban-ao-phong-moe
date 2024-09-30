import * as React from "react";
import { Grid2, IconButton, DialogTitle, DialogContent, Dialog, DialogActions, TextField, Button } from "@mui/material";

export const DialogIconUpdate = (props) => {
  const [value, setValue] = React.useState(props.value);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton color={props.color} onClick={handleClickOpen}>
        {props.icon}
      </IconButton>
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
                value={value.name}
                onChange={(event) => setValue({...value, name: event.target.value })}
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
                value={value.hex_code}
                onChange={(event) => setValue({...value, hex_code: event.target.value })}
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
