import * as React from "react";
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
import { IconButton } from "@mui/material";

export const DialogIconUpdate = (props) => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(props.name);
  const [length, setLength] = React.useState(props.length);
  const [width, setWidth] = React.useState(props.width);
  const [sleeve, setSleeve] = React.useState(props.sleeve);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setName(props.name);
    setLength(props.length);
    setWidth(props.width);
    setSleeve(props.sleeve);
  }, [props.name, props.length, props.width, props.sleeve]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Vui lòng không bỏ trống!";
    if (!length || length <= 0 || length > 100)
      newErrors.length = "Chiều dài phải lớn hơn 0 và nhỏ hơn 100!";
    if (!width || width <= 0 || width > 100)
      newErrors.width = "Chiều rộng phải lớn hơn 0 và nhỏ hơn 100!";
    if (!sleeve || sleeve <= 0 || sleeve > 100)
      newErrors.sleeve = "Chiều dài tay áo phải lớn hơn 0 và nhỏ hơn 100!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    const data = {
      name: name,
      length: length,
      width: width,
      sleeve: sleeve,
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
      <Modal open={open} onClose={handleClose}>
        <ModalDialog>
          <DialogTitle>{props.title}</DialogTitle>
          <Stack spacing={2} direction="row">
            <FormControl error={!!errors.name}>
              <FormLabel required>Kích thước</FormLabel>
              <Input
                value={name}
                placeholder={props.label}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <FormHelperText>{errors.name}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={!!errors.length}>
              <FormLabel required>Chiều dài</FormLabel>
              <Input
                value={length}
                type="number"
                placeholder={props.label}
                onChange={(e) => setLength(e.target.value)}
              />
              {errors.length && (
                <FormHelperText>{errors.length}</FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Stack spacing={2} direction="row" marginTop={2}>
            <FormControl error={!!errors.width}>
              <FormLabel required>Chiều rộng</FormLabel>
              <Input
                value={width}
                type="number"
                placeholder={props.label}
                onChange={(e) => setWidth(e.target.value)}
              />
              {errors.width && (
                <FormHelperText>{errors.width}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={!!errors.sleeve}>
              <FormLabel required>Chiều dài tay áo</FormLabel>
              <Input
                value={sleeve}
                type="number"
                placeholder={props.label}
                onChange={(e) => setSleeve(e.target.value)}
              />
              {errors.sleeve && (
                <FormHelperText>{errors.sleeve}</FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Stack marginTop={2}>
            <Button onClick={onSubmit}>Lưu</Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};
