import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { Grid2 } from "@mui/material";

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
              length: formJson.length,
              width: formJson.width,
              sleeve: formJson.sleeve,
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
                label="Size"
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
                id="sleeve"
                name="sleeve"
                label="Chiều dài tay áo"
                type="number"
                fullWidth
                variant="standard"
                value={value.sleeve}
                onChange={(event) => setValue({...value, sleeve: event.target.value })}
              />
            </Grid2>
            <Grid2 size={6}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="length"
                name="length"
                label="Chiều dài"
                type="text"
                fullWidth
                variant="standard"
                value={value.length}
                onChange={(event) => setValue({...value, length: event.target.value })}
              />
            </Grid2>

            <Grid2 size={6}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="width"
                name="width"
                label="Chiều rộng"
                type="text"
                fullWidth
                variant="standard"
                value={value.width}
                onChange={(event) => setValue({...value, width: event.target.value })}
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
