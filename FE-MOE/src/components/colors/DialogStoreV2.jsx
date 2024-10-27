import * as React from "react";
import { useForm } from "react-hook-form";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import {
  Button,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";

export const DialogStoreV2 = (props) => {
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
    setValue("name", "");
    setValue("hex_code", "");
  };
  return (
    <React.Fragment>
      <ColorLensOutlinedIcon onClick={handleClickOpen} />
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>{props.title}</DialogTitle>
          <Stack spacing={2}>
            <FormControl required error={!!errors?.name}>
              <FormLabel>Tên màu</FormLabel>
              <Input
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
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Lưu
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};
