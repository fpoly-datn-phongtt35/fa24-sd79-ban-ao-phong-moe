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

export const DialogModifyIconButton = (props) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(props.value);

  React.useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async () => {
    const data = {
      name: value,
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
          <DialogTitle>
            {props.title} {props.value}
          </DialogTitle>
          <Stack spacing={2}>
            <FormControl required>
              <FormLabel>{props.label}</FormLabel>
              <Input
                defaultValue={value}
                placeholder={props.label}
                onChange={(e) => setValue(e.target.value)}
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
