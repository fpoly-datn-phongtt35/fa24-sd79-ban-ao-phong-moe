import * as React from "react";
import { IconButton} from "@mui/material";
import { useForm } from "react-hook-form";
import { Button, DialogTitle, FormControl, FormHelperText, FormLabel, Input, Modal, ModalDialog, Stack } from "@mui/joy";

export const DialogModifyIconButton = (props) => {
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
      name: item.value,
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
              <FormControl required error={!!errors?.value}>
                <FormLabel>{props.label}</FormLabel>
                <Input
                  defaultValue={defaultValue}
                  placeholder={props.label}
                  {...register("value", { required: true })}
                />
                {errors.name && (
                  <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
                )}
              </FormControl>
              <Button type="submit">Lưu</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};
