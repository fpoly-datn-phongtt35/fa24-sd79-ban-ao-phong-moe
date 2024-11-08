// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalClose,
  Radio,
  RadioGroup,
  Sheet,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import { formatCurrencyVND, formatDateTimeWithPending } from "~/utils/format";
import CardOrderItem from "../cards/CardOrderItem";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";

function TableRow(props) {
  const { item, isOpen, onToggle, handleCancelOrder } = props;

  const [open, setOpen] = React.useState(false);

  const [message, setMessage] = React.useState("");
  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
    setMessage(event.target.value);
  };
  return (
    <React.Fragment>
      <tr>
        <td style={{ textAlign: "center", width: "5%" }}>
          <Tooltip variant="plain" title="Xem chi tiết">
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              onClick={() => onToggle(item.code)}
            >
              {isOpen ? (
                <ArrowDropUpOutlinedIcon />
              ) : (
                <ArrowDropDownOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
        </td>
        <td style={{ textAlign: "center", width: "20%" }} scope="row">
          <Chip color="primary">{props.item.code}</Chip>
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          <Typography level="title-sm">{props.item.quantity}</Typography>
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          <Typography level="title-sm">
            {formatCurrencyVND(props.item.subtotal)}
          </Typography>
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          {props.item.sellDiscount > 0 ? (
            <Typography level="title-sm" color="danger">
              -{formatCurrencyVND(props.item.sellDiscount)}
            </Typography>
          ) : (
            <Typography level="title-sm" color="primary">
              Không áp dụng
            </Typography>
          )}
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          <Typography
            level="title-sm"
            color={props.item.shippingFee > 0 ? "danger" : "primary"}
          >
            {props.item.shippingFee > 0
              ? formatCurrencyVND(props.item.shippingFee)
              : "Miễn phí"}
          </Typography>
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          <Typography level="title-sm">
            {formatCurrencyVND(props.item.totalAmount)}
          </Typography>
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          {props.item.paymentTime !== null ? (
            <Chip color="success">Đã thanh toán</Chip>
          ) : props.item.status === "Đã hủy đơn hàng" ? (
            <Chip color="danger">Đã hủy đơn hàng</Chip>
          ) : (
            <Chip color="warning">Chờ thanh toán</Chip>
          )}
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          <Typography level="title-sm">
            {formatDateTimeWithPending(props.item.orderDate, "Chưa xác định")}
          </Typography>
        </td>
      </tr>
      <tr>
        <td style={{ height: 0, padding: 0 }} colSpan={10}>
          {isOpen && (
            <Sheet
              variant="soft"
              sx={{
                display: "flex",
                alignItems: "center",
                p: 3,
                backgroundColor: "#fff",
                boxShadow: "inset 0 3px 6px 0 rgba(0 0 0 / 0.1)",
              }}
            >
              <Box
                sx={{
                  padding: 2,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box sx={{ marginBottom: 2 }}>
                  <Typography
                    level="title-md"
                    fontWeight="bold"
                    fontSize="1.1rem"
                    sx={{ marginBottom: 2 }}
                  >
                    Hóa Đơn: {props.item.code}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography
                          level="body-md"
                          color="text.secondary"
                          fontWeight="bold"
                        >
                          Hình thức thanh toán:
                        </Typography>
                        <Typography level="body-md">
                          {props.item.paymentMethod === "BANK"
                            ? "Chuyển khoản"
                            : props.item.paymentMethod === "CASH"
                            ? "Thanh toán tại cửa hàng"
                            : "Thanh toán khi nhận hàng"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography
                          level="body-md"
                          color="text.secondary"
                          fontWeight="bold"
                        >
                          Trạng thái thanh toán:
                        </Typography>
                        <Typography
                          level="title-md"
                          color={
                            props.item.paymentTime !== null
                              ? "success"
                              : "danger"
                          }
                        >
                          {props.item.paymentTime !== null
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography
                          level="body-md"
                          color="text.secondary"
                          fontWeight="bold"
                        >
                          Thời gian đặt hàng:
                        </Typography>
                        <Typography level="body-md">
                          {formatDateTimeWithPending(
                            props.item.orderDate,
                            "Chưa xác định"
                          )}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography
                          level="body-md"
                          color="text.secondary"
                          fontWeight="bold"
                        >
                          Trạng thái đơn hàng:
                        </Typography>
                        <Typography level="title-md" color="primary">
                          {props.item.status}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography
                          level="body-md"
                          color="text.secondary"
                          fontWeight="bold"
                        >
                          Tổng tiền hàng:
                        </Typography>
                        <Typography level="body-md">
                          {formatCurrencyVND(props.item.subtotal)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography
                          level="body-md"
                          color="text.secondary"
                          fontWeight="bold"
                        >
                          Giảm giá:
                        </Typography>
                        <Typography level="body-md">
                          {formatCurrencyVND(props.item.sellDiscount)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography
                          level="body-md"
                          color="text.secondary"
                          fontWeight="bold"
                        >
                          Phí vận chuyển:
                        </Typography>
                        <Typography level="body-md">
                          {props.item.shippingFee > 0
                            ? formatCurrencyVND(props.item.shippingFee)
                            : "Miễn phí"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography
                          level="body-md"
                          color="primary.main"
                          fontWeight="bold"
                        >
                          Tổng tiền phải trả:
                        </Typography>
                        <Typography
                          level="body-md"
                          color="danger"
                          fontWeight="bold"
                        >
                          {formatCurrencyVND(props.item.totalAmount)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box marginTop={2}>
                    {props.item.status === "Chưa xác nhận" &&
                      props.item.paymentMethod !== "BANK" && (
                        <Button color="danger" onClick={() => setOpen(true)}>
                          Hủy đơn
                        </Button>
                      )}
                    <Modal
                      open={open}
                      onClose={() => setOpen(false)}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Sheet
                        variant="outlined"
                        sx={{
                          minWidth: 500,
                          borderRadius: "md",
                          p: 3,
                          boxShadow: "lg",
                        }}
                      >
                        <ModalClose variant="plain" sx={{ m: 1 }} />
                        <Typography
                          component="h2"
                          id="modal-title"
                          level="h4"
                          textColor="inherit"
                          sx={{ fontWeight: "lg", mb: 1 }}
                        >
                          Tại sao bạn muốn hủy đơn hàng này?
                        </Typography>
                        <FormControl>
                          <FormLabel>Lý do</FormLabel>
                          <RadioGroup
                            defaultValue="female"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleChange}
                            sx={{ my: 1 }}
                          >
                            <Radio
                              value="Tôi muốn cập nhật địa chỉ/sđt nhận hàng."
                              label="Tôi muốn cập nhật địa chỉ/sđt nhận hàng."
                            />
                            <Radio
                              value="Tôi muốn thêm/thay đổi Mã giảm giá"
                              label="Tôi muốn thêm/thay đổi Mã giảm giá"
                            />
                            <Radio
                              value="Tôi muốn thay đổi sản phẩm (kích thước, màu sắc, số lượng…)"
                              label="Tôi muốn thay đổi sản phẩm (kích thước, màu sắc, số lượng…)"
                            />
                            <Radio
                              value="Thủ tục thanh toán rắc rối"
                              label="Thủ tục thanh toán rắc rối"
                            />
                            <Radio
                              value="Tôi tìm thấy chỗ mua khác tốt hơn (Rẻ hơn, uy tín hơn, giao nhanh hơn…)"
                              label="Tôi tìm thấy chỗ mua khác tốt hơn (Rẻ hơn, uy tín hơn, giao nhanh hơn…)"
                            />
                            <Radio
                              value="Tôi không có nhu cầu mua nữa"
                              label="Tôi không có nhu cầu mua nữa"
                            />
                            <Radio
                              value="Tôi không tìm thấy lý do hủy phù hợp"
                              label="Tôi không tìm thấy lý do hủy phù hợp"
                            />
                            <Radio value="Lý do khác" label="Khác" />
                            {value === "Lý do khác" && (
                              <Box marginTop={2}>
                                <Input
                                  placeholder="Nhập lý do..."
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                />
                              </Box>
                            )}
                          </RadioGroup>
                          <Box marginTop={2}>
                            <Button
                              onClick={() =>
                                handleCancelOrder(props.item.id, message)
                              }
                            >
                              Xác nhận
                            </Button>
                          </Box>
                        </FormControl>
                      </Sheet>
                    </Modal>
                  </Box>
                </Box>
                <Typography
                  marginBottom={1}
                  color="neutral"
                  level="title-lg"
                  noWrap
                  variant="plain"
                >
                  Danh sách sản phẩm
                </Typography>
                <Table sx={{ borderRadius: "8px", overflow: "hidden" }}>
                  <thead>
                    <tr
                      style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}
                    >
                      <th
                        style={{
                          padding: "8px",
                          fontWeight: "bold",
                          width: "30%",
                          textAlign: "center",
                        }}
                      >
                        Sản phẩm
                      </th>
                      <th
                        style={{
                          padding: "8px",
                          fontWeight: "bold",
                          width: "20%",
                          textAlign: "center",
                        }}
                      >
                        Giá tiền
                      </th>
                      <th
                        style={{
                          padding: "8px",
                          fontWeight: "bold",
                          width: "20%",
                          textAlign: "center",
                        }}
                      >
                        Số lượng
                      </th>
                      <th
                        style={{
                          padding: "8px",
                          fontWeight: "bold",
                          width: "20%",
                          textAlign: "center",
                        }}
                      >
                        Tổng tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.item.products.map((product, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px solid #ddd" }}
                      >
                        <td style={{ padding: "8px" }}>
                          <CardOrderItem data={product} />
                        </td>
                        <td style={{ padding: "8px", textAlign: "center" }}>
                          <Typography level="title-sm">
                            {formatCurrencyVND(product.discountPrice)}
                          </Typography>
                          {product.discountPrice !== product.retailPrice && (
                            <Typography
                              level="title-sm"
                              color="danger"
                              sx={{
                                textDecoration: "line-through",
                              }}
                            >
                              {formatCurrencyVND(product.retailPrice)}
                            </Typography>
                          )}
                        </td>
                        <td style={{ padding: "8px", textAlign: "center" }}>
                          <Typography level="title-sm">
                            {product.quantity}
                          </Typography>
                        </td>
                        <td style={{ padding: "8px", textAlign: "center" }}>
                          <Typography level="title-sm">
                            {formatCurrencyVND(product.totalAmount)}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        <Typography level="title-md">
                          Tổng tiền: {formatCurrencyVND(props.item.subtotal)}
                        </Typography>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Box>
            </Sheet>
          )}
        </td>
      </tr>
    </React.Fragment>
  );
}

export default TableRow;
