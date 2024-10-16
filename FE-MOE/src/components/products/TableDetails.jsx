import {
  Box,
  Button,
  Checkbox,
  Grid,
  Input,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import {
  changeStatusProductDetail,
  updateProductDetailAttribute,
} from "~/apis/productApi";
import { useEffect, useState } from "react";
import { Switch } from "@mui/material";
import { StoreAttributeDetail } from "./StoreAttributeDetail";
import { toast } from "react-toastify";

export const TableDetails = (props) => {
  const [details, setDetails] = useState();
  const [selected, setSelected] = useState([]);
  const [hasChanged, setHasChanged] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [inputErrors, setInputErrors] = useState({});

  useEffect(() => {
    setDetails(props.data?.details);
  }, [props.data]);

  const onChangeStatusDetail = async (id, status) => {
    await changeStatusProductDetail(id, status);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = props.data?.details.map((detail) => detail.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
      setInputValues({});
      setInputErrors({});
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);

    if (selectedIndex !== -1) {
      setInputValues((prevValues) => {
        const updatedValues = { ...prevValues };
        delete updatedValues[id];
        return updatedValues;
      });
      setInputErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[id];
        return updatedErrors;
      });
    }
  };

  const handleSave = async () => {
    const hasErrors = Object.values(inputErrors).some(
      (error) => error?.price || error?.quantity
    );

    if (hasErrors) {
      toast.error("Dữ liệu không hợp lệ!");
      return;
    }

    const updatedDetails = selected.map((id) => {
      const item = details.find((detail) => detail.id === id);
      return {
        id: item.id,
        price: inputValues[item.id]?.price || item.price,
        quantity: inputValues[item.id]?.quantity || item.quantity,
      };
    });
    await updateProductDetailAttribute(updatedDetails).then(() => {
      props.getProduct();
      setSelected([]);
      setInputValues({});
      setInputErrors({});
      setHasChanged(false);
    });
  };

  const handleInputChange = (id, field, value) => {
    const parsedValue = Number(value);

    if (field === "price") {
      if (parsedValue <= 100) {
        setInputErrors((prev) => ({
          ...prev,
          [id]: { ...prev[id], price: "Price must be greater than 100" },
        }));
      } else if (parsedValue > 90000000){
        setInputErrors((prev) => ({
          ...prev,
          [id]: { ...prev[id], price: "Invalid data" },
        }));
      }
      else {
        setInputErrors((prev) => ({
          ...prev,
          [id]: { ...prev[id], price: null },
        }));
      }
    } else if (field === "quantity") {
      if (parsedValue < 0) {
        setInputErrors((prev) => ({
          ...prev,
          [id]: { ...prev[id], quantity: "Quantity cannot be less than 0" },
        }));
      }else if (parsedValue > 10000){
        setInputErrors((prev) => ({
          ...prev,
          [id]: { ...prev[id], quantity: "Invalid data" },
        }));
      }
       else {
        setInputErrors((prev) => ({
          ...prev,
          [id]: { ...prev[id], quantity: null },
        }));
      }
    }

    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: {
        ...prevValues[id],
        [field]: value,
      },
    }));
    setHasChanged(true);
  };

  return (
    <Box marginTop={3}>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid size={6}>
          <Typography color="neutral" level="title-lg" noWrap variant="plain">
            Chi tiết sản phẩm
          </Typography>
        </Grid>
        <Grid size={6} container spacing={2}>
          <Grid size={6}>
            <StoreAttributeDetail getProduct={props.getProduct} />
          </Grid>
          {hasChanged && (
            <Grid size={6}>
              <Button
                startDecorator={<SaveIcon />}
                variant="plain"
                size="sm"
                onClick={handleSave}
              >
                Lưu
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Sheet
        sx={{
          marginTop: 2,
          padding: "2px",
          borderRadius: "5px",
        }}
      >
        <Table borderAxis="x" variant="outlined">
          <thead>
            <tr>
              <th className="text-center" style={{ width: "50px" }}>
                <Checkbox
                  checked={
                    details?.length > 0 && selected.length === details?.length
                  }
                  indeterminate={
                    selected.length > 0 && selected.length < details?.length
                  }
                  onChange={handleSelectAllClick}
                />
              </th>
              <th className="text-center" style={{ width: "350px" }}>
                Tên sản phẩm
              </th>
              <th className="text-center">Màu sắc</th>
              <th className="text-center">Kích thước</th>
              <th className="text-center">Giá tiền</th>
              <th className="text-center">Số lượng</th>
              <th className="text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {details &&
              details.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: selected.includes(item.id)
                      ? "#dde7ee"
                      : "white",
                  }}
                >
                  <td className="text-center">
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onClick={(event) => handleClick(event, item.id)}
                    />
                  </td>
                  <td>{`${props.data?.name} [${item.color} - ${item.size}]`}</td>
                  <td className="text-center">{item.color}</td>
                  <td className="text-center">{item.size}</td>
                  <td className="text-center">
                    {selected.includes(item.id) ? (
                      <Input
                        value={inputValues[item.id]?.price || item.price}
                        variant="plain"
                        size="sm"
                        type="number"
                        error={!!inputErrors[item.id]?.price}
                        onChange={(e) =>
                          handleInputChange(item.id, "price", e.target.value)
                        }
                      />
                    ) : (
                      item.price
                    )}
                  </td>
                  <td className="text-center">
                    {selected.includes(item.id) ? (
                      <Input
                        required
                        error={!!inputErrors[item.id]?.quantity}
                        value={inputValues[item.id]?.quantity || item.quantity}
                        variant="plain"
                        size="sm"
                        type="number"
                        onChange={(e) =>
                          handleInputChange(item.id, "quantity", e.target.value)
                        }
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="text-center">
                    <Switch
                      defaultChecked={item.status === "ACTIVE"}
                      onClick={(e) =>
                        onChangeStatusDetail(item.id, e.target.checked)
                      }
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
};
