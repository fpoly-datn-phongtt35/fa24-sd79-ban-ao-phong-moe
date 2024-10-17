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
import { useForm } from "react-hook-form";

export const DialogModify = (props) => {
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
    props.handleSubmit(data);
    handleClose();
    setValue("value", "");
  };
  return (
    <React.Fragment>
      <Button
        variant="soft"
        onClick={handleClickOpen}
        startDecorator={props.icon}
      >
        {props.buttonTitle}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>{props.title}</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <FormControl required error={!!errors?.value}>
                <FormLabel>{props.label}</FormLabel>
                <Input
                  name="value"
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
