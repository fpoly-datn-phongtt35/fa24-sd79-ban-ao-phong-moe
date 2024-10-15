import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalDialog,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const StoreAttributeDetail = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    
    setIsLoading(true);
    // await updateProduct(data, props.id).then(() => {
    //   setOpen(false);
    //   setIsLoading(false);
    // });
  };
  return (
    <>
      <Button
        startDecorator={<AppRegistrationIcon />}
        variant="plain"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Thêm thuộc tính
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Thêm thuộc tính</DialogTitle>
          <DialogContent>Vui lòng chọn thuộc tính chưa tồn tại!</DialogContent>
          <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={1}>
              <FormControl>
                <FormLabel>Màu sắc</FormLabel>
                <Select
                  placeholder="Chọn màu sắc"
                  sx={{ minWidth: 300, maxWidth: 320 }}
                >
                  <Option>Màu sắc</Option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Kích thước</FormLabel>
                <Select
                  placeholder="Chọn kích thước"
                  sx={{ minWidth: 300, maxWidth: 320 }}
                >
                  <Option>kích thước</Option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Giá tiền</FormLabel>
                <Input
                  type="number"
                  sx={{ minWidth: 300, maxWidth: 320 }}
                  placeholder="Nhập giá tiền"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Số lượng</FormLabel>
                <Input
                  type="number"
                  sx={{ minWidth: 300, maxWidth: 320 }}
                  placeholder="Nhập số lượng"
                />
              </FormControl>
              <Button
                loading={isLoading}
                type="submit"
                startDecorator={<SaveIcon />}
              >
                Lưu
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
};
