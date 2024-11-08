// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Button, IconButton, Sheet, Table, Typography } from "@mui/joy";
import { formatCurrencyVND, formatDateTimeWithPending } from "~/utils/format";
import CardOrderItem from "../cards/CardOrderItem";

function TableRow(props) {
  const { item, isOpen, onToggle } = props;

  return (
    <React.Fragment>
      <tr>
        <td style={{ textAlign: "center", width: "20%" }}>
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => onToggle(item.code)}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </td>
        <td scope="row">{props.item.code}</td>
        <td style={{ textAlign: "center", width: "20%" }}>
          {props.item.quantity}
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          {formatCurrencyVND(props.item.subtotal)}
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          {formatCurrencyVND(props.item.sellDiscount)}
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          {props.item.shippingFee > 0
            ? formatCurrencyVND(props.item.shippingFee)
            : "FREE"}
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          {formatCurrencyVND(props.item.totalAmount)}
        </td>
        <td style={{ width: "30%" }}>{props.item.status}</td>
        <td style={{ textAlign: "center", width: "20%" }}>
          {formatDateTimeWithPending(props.item.paymentTime, "Đang chờ")}
        </td>
        <td style={{ textAlign: "center", width: "20%" }}>
          {formatDateTimeWithPending(props.item.orderDate, "Chưa xác định")}
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
                        <Typography level="body-md">
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
                          Ngày đặt:
                        </Typography>
                        <Typography level="body-md">
                          {formatDateTimeWithPending(
                            props.item.orderDate,
                            "Chưa xác định"
                          )}
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
                          Trạng thái:
                        </Typography>
                        <Typography level="body-md">
                          {props.item.status}
                        </Typography>
                      </Box>
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
                          Phí vận chuyển:
                        </Typography>
                        <Typography level="body-md">
                          {props.item.shippingFee > 0
                            ? formatCurrencyVND(props.item.shippingFee)
                            : "FREE"}
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
                          color="primary.main"
                          fontWeight="bold"
                        >
                          {formatCurrencyVND(props.item.totalAmount)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    {props.item.status === "Chưa xác nhận" &&
                      props.item.paymentMethod !== "BANK" && (
                        <Button color="danger">Hủy đơn</Button>
                      )}
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
