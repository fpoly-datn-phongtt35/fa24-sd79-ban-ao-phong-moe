// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
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
import SquareFootOutlinedIcon from "@mui/icons-material/SquareFootOutlined";

export const DialogStoreSizeV2 = (props) => {
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
      length: item.length,
      width: item.width,
      sleeve: item.sleeve,
      userId: localStorage.getItem("userId"),
    };
    props.handleSubmit(data);
    handleClose();
    setValue("name", "");
    setValue("length", "");
    setValue("width", "");
    setValue("sleeve", "");
  };
  return (
    <React.Fragment>
      <SquareFootOutlinedIcon onClick={handleClickOpen} />
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>{props.title}</DialogTitle>
          <Stack spacing={2} direction="row">
            <FormControl error={!!errors?.name}>
              <FormLabel required>Kích thước</FormLabel>
              <Input
                placeholder={props.label}
                {...register("name", {
                  required: true,
                })}
              />
              {errors.name && (
                <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
              )}
            </FormControl>
            <FormControl error={!!errors?.length}>
              <FormLabel required>Chiều dài</FormLabel>
              <Input
                type="number"
                placeholder={props.label}
                {...register("length", {
                  required: {
                    value: true,
                    message: "Vui lòng nhập chiều dài!",
                  },
                  min: {
                    value: 1,
                    message: "Chiều dài phải lớn hơn 0",
                  },
                  max: {
                    value: 100,
                    message: "Dữ liệu không hợp lệ!",
                  },
                })}
              />
              {errors.length && (
                <FormHelperText>{errors.length.message}</FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Stack spacing={2} direction="row" marginTop={2}>
            <FormControl error={!!errors?.width}>
              <FormLabel required>Chiều rộng</FormLabel>
              <Input
                type="number"
                placeholder={props.label}
                {...register("width", {
                  required: {
                    value: true,
                    message: "Vui lòng nhập chiều rộng!",
                  },
                  min: {
                    value: 1,
                    message: "Chiều rộng phải lớn hơn 0",
                  },
                  max: {
                    value: 100,
                    message: "Dữ liệu không hợp lệ!",
                  },
                })}
              />
              {errors.width && (
                <FormHelperText>{errors.width.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={!!errors?.sleeve}>
              <FormLabel required>Chiều dài tay áo</FormLabel>
              <Input
                type="number"
                placeholder={props.label}
                {...register("sleeve", {
                  required: {
                    value: true,
                    message: "Vui lòng nhập chiều dài tay áo!",
                  },
                  min: {
                    value: 1,
                    message: "Chiều dài tay áo phải lớn hơn 0",
                  },
                  max: {
                    value: 100,
                    message: "Dữ liệu không hợp lệ!",
                  },
                })}
              />
              {errors.sleeve && (
                <FormHelperText>{errors.sleeve.message}</FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Stack marginTop={2}>
            <Button type="button" onClick={handleSubmit(onSubmit)}>
              Lưu
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};
