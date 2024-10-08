import * as React from 'react';
import {DialogTitle, DialogContent, Dialog, DialogActions, TextField, Button } from "@mui/material";

export const DialogModify = (props) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <React.Fragment>
        <Button variant="contained" onClick={handleClickOpen} endIcon={props.icon}>
          {props.buttonTitle}
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const value = formJson.value;
              console.log(value);
              const data = {
                name: value,
                userId: localStorage.getItem("userId"),
              }
              props.handleSubmit(data);
              handleClose();
            },
          }}
        >
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="value"
              name="value"
              label={props.label}
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit">Lưu</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
};
