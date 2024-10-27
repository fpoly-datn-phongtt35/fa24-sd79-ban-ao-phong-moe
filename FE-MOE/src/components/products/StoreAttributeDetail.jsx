import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { fetchAllColors, postColor } from "~/apis/colorApi";
import { fetchAllSizes, postSize } from "~/apis/sizesApi";
import { useParams } from "react-router-dom";
import { storeProductDetailAttribute } from "~/apis/productApi";
import { DialogStoreV2 } from "../colors/DialogStoreV2";
import { DialogStoreSizeV2 } from "../sizes/DialogStoreSizeV2";

export const StoreAttributeDetail = (props) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetchColors();
    fetchSizes();
    setValue("userId", localStorage.getItem("userId"));
    setValue("productId", id);
  }, []);

  const fetchColors = async () => {
    await fetchAllColors("").then((res) => setColors(res.data));
  };
  const fetchSizes = async () => {
    await fetchAllSizes("").then((res) => setSizes(res.data));
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    await storeProductDetailAttribute(data).finally(() => {
      props.getProduct();
      setIsLoading(false);
    });
    setOpen(false);
    clearValue();
  };

  const clearValue = () => {
    setValue("colorId", "");
    setValue("sizeId", "");
    setValue("quantity", "");
    setValue("retailPrice", "");
  };

  const handlePostColor = async (data) => {
    await postColor(data).then(() => fetchColors());
  };

  const handlePostSize = async (data) => {
    await postSize(data).then(() => fetchSizes());
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
              <FormControl required error={!!errors?.colorId}>
                <FormLabel>Màu sắc</FormLabel>
                <Select
                  placeholder="Chọn màu sắc"
                  sx={{ minWidth: 300, maxWidth: 320 }}
                  {...register("colorId", { required: true })}
                >
                  <Button
                    startDecorator={
                      <DialogStoreV2
                        buttonTitle="Thêm mới màu sắc"
                        title="Thêm mới màu sắc"
                        label="Nhập tên màu sắc"
                        handleSubmit={handlePostColor}
                      />
                    }
                    color="neutral"
                    size="sm"
                    variant="plain"
                  >
                    Thêm màu sắc
                  </Button>
                  {colors.map((color, index) => (
                    <Option key={index} value={color.id}>
                      {color.name}
                    </Option>
                  ))}
                </Select>
                {errors.colorId && (
                  <FormHelperText>Vui lòng chọn màu sắc</FormHelperText>
                )}
              </FormControl>

              <FormControl required error={!!errors?.sizeId}>
                <FormLabel>Kích thước</FormLabel>
                <Select
                  placeholder="Chọn kích thước"
                  sx={{ minWidth: 300, maxWidth: 320 }}
                  {...register("sizeId", { required: true })}
                >
                  <Button
                    startDecorator={
                      <DialogStoreSizeV2
                        buttonTitle="Thêm mới kích thước"
                        title="Thêm mới kích thước"
                        label="Nhập tên kích thước"
                        handleSubmit={handlePostSize}
                      />
                    }
                    color="neutral"
                    size="sm"
                    variant="plain"
                  >
                    Thêm kích thước
                  </Button>
                  {sizes.map((size, index) => (
                    <Option key={index} value={size.id}>
                      {size.name}
                    </Option>
                  ))}
                </Select>
                {errors.sizeId && (
                  <FormHelperText>Vui lòng chọn kích thước</FormHelperText>
                )}
              </FormControl>

              <FormControl required error={!!errors?.retailPrice}>
                <FormLabel>Giá tiền</FormLabel>
                <Input
                  type="number"
                  sx={{ minWidth: 300, maxWidth: 320 }}
                  {...register("retailPrice", {
                    required: true,
                    min: {
                      value: 100,
                      message: "Giá tiền phải lớn hơn hoặc bằng 100",
                    },
                    max: {
                      value: 90000000,
                      message: "Giá tiền không hợp lệ",
                    },
                  })}
                  placeholder="Nhập giá tiền"
                />
                {errors.retailPrice && (
                  <FormHelperText>{errors.retailPrice.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl required error={!!errors?.quantity}>
                <FormLabel>Số lượng</FormLabel>
                <Input
                  type="number"
                  sx={{ minWidth: 300, maxWidth: 320 }}
                  {...register("quantity", {
                    required: true,
                    min: {
                      value: 0,
                      message: "Số lượng phải lớn hơn hoặc bằng 0",
                    },
                    max: {
                      value: 10000,
                      message: "Số lượng không hợp lệ",
                    },
                  })}
                  placeholder="Nhập số lượng"
                />
                {errors.quantity && (
                  <FormHelperText>{errors.quantity.message}</FormHelperText>
                )}
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
