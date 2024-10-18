import * as React from "react";
import { IconButton } from "@mui/material";
import {
  Button,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";

export const DialogIconUpdate = (props) => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(props.name);
  const [hex_code, setHexCode] = React.useState(props.hex_code);

  React.useEffect(() => {
    setName(props.name);
    setHexCode(props.hex_code);
  }, [props.name, props.hex_code]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async () => {
    const data = {
      name: name,
      hex_code: hex_code,
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
          <Stack spacing={2}>
            <FormControl required>
              <FormLabel>Tên màu</FormLabel>
              <Input
                defaultValue={name}
                placeholder={props.label}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl required>
              <FormLabel>Hex code</FormLabel>
              <Input
                defaultValue={hex_code}
                variant="plain"
                type="color"
                size="sm"
                onChange={(e) => setHexCode(e.target.value)}
                placeholder={props.label}
              />
            </FormControl>
            <Button type="button" onClick={onSubmit}>
              Lưu
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};
