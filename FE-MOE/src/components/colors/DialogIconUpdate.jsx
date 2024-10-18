import * as React from "react";
import { IconButton } from "@mui/material";
import {
  Button,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { useForm } from "react-hook-form";

export const DialogIconUpdate = (props) => {
  const [defaultValue, setDefaultValue] = React.useState(props.value);
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (item) => {
    const data = {
      name: item.name,
      hex_code: item.hex_code,
      userId: localStorage.getItem("userId"),
    };
    props.handleSubmit(data, props.id);
    handleClose();
  };

  return (
    <React.Fragment>
      <IconButton color={props.color} onClick={handleClickOpen}>
        {props.icon}
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>{props.title}</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <FormControl required error={!!errors?.name}>
                <FormLabel>Tên màu</FormLabel>
                <Input
                  defaultValue={defaultValue.name}
                  placeholder={props.label}
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
                )}
              </FormControl>
              <FormControl required error={!!errors?.hex_code}>
                <FormLabel>Hex code</FormLabel>
                <Input
                  defaultValue={defaultValue.hex_code}
                  variant="plain"
                  type="color"
                  size="sm"
                  placeholder={props.label}
                  {...register("hex_code", { required: true })}
                />
                {errors.hex_code && (
                  <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
                )}
              </FormControl>
              <Button type="submit">Lưu</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
      {/* <Dialog
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
      </Dialog> */}
    </React.Fragment>
  );
};
