// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Input,
  Link,
  Radio,
  RadioGroup,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import SvgIconDisplay from "~/components/other/SvgIconDisplay";
import VisaSvgIcon from "~/assert/icon/visa.svg";
import MasterCardSvgIcon from "~/assert/icon/mastercard.svg";
import VNPaySvgIcon from "~/assert/icon/Logo VNPAY-QR.svg";
import { CommonContext } from "~/context/CommonContext";
import { useContext, useEffect, useState } from "react";
import CardShoppingCard from "~/components/clients/cards/CardShoppingCard";
import { formatCurrencyVND } from "~/utils/format";
import { ScrollToTop } from "~/utils/defaultScroll";

function CheckOut() {
  const navigate = useNavigate();
  const context = useContext(CommonContext);
  const [items, setItems] = useState(null);

  useEffect(() => {
    ScrollToTop();
    setItems(context.tempCarts);
  });

  const calculateTotalPrice = () => {
    return items?.reduce(
      (total, items) => total + items.retailPrice * items.quantity,
      0
    );
  };

  const totalPrice = calculateTotalPrice();

  if (!items) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        width="95vw"
        onClick={() => navigate("/cart")}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box>
      <Grid container spacing={2} alignItems="center" height={"50px"}>
        <Breadcrumbs
          separator="›"
          aria-label="breadcrumbs"
          sx={{ marginLeft: 5 }}
        >
          <Link
            underline="hover"
            sx={{ cursor: "pointer" }}
            color="neutral"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </Link>
          <Link
            underline="hover"
            sx={{ cursor: "pointer" }}
            color="neutral"
            onClick={() => navigate("/cart")}
          >
            Giỏ hàng
          </Link>
          <Typography noWrap>Thanh toán</Typography>
        </Breadcrumbs>
      </Grid>
      <Box margin={5}>
        <Box
          sx={{
            position: "relative",
            padding: "16px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background:
                "repeating-linear-gradient(to right, grey, grey 10px, transparent 10px, transparent 20px)",
            },
          }}
        >
          <Typography
            level="title-lg"
            startDecorator={<RoomOutlinedIcon color="primary" />}
          >
            Địa chỉ nhận hàng
          </Typography>
          <Typography level="body-lg">
            180/23, Đường Phú Mỹ, Phường Mỹ Đình 2, Quận Nam Từ Liêm, Hà Nội{" "}
            <Typography
              color="primary"
              level="body-xs"
              noWrap
              variant="outlined"
              marginLeft={2}
            >
              Mặc định
            </Typography>
          </Typography>
        </Box>
        <Box
          sx={{
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            marginTop: 5,
            position: "relative",
            padding: "16px",
          }}
        >
          <Sheet>
            <Table borderAxis="x" variant="outlined">
              <thead>
                <tr>
                  <th className="text-center" width="30%">
                    Sản phẩm
                  </th>
                  <th className="text-center">Đơn giá</th>
                  <th className="text-center">Số lượng</th>
                  <th className="text-center">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items &&
                  items.map((i) => (
                    <tr key={i.id}>
                      <td>
                        <CardShoppingCard data={i} />
                      </td>
                      <td className="text-center">
                        <Typography level="title-md">
                          {formatCurrencyVND(i.retailPrice)}
                        </Typography>
                      </td>
                      <td className="text-center">
                        <Typography level="title-md">{i.quantity}</Typography>
                      </td>
                      <td className="text-center">
                        <Typography level="title-md">
                          {formatCurrencyVND(i.retailPrice * i.quantity)}
                        </Typography>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box display="flex" alignItems="center">
                <Typography level="title-md">Lời nhắn: </Typography>
                <Input
                  placeholder="Lời nhắn gửi cho người bán..."
                  sx={{ minWidth: 300, marginLeft: 2 }}
                  size="md"
                />
              </Box>
              <Typography level="title-md">
                Tổng số tiền ({items.length} sản phẩm):{" "}
                {formatCurrencyVND(totalPrice)}
              </Typography>
            </Box>
          </Sheet>
        </Box>
        <Box
          sx={{
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            marginTop: 5,
            position: "relative",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            level="title-lg"
            startDecorator={<ReceiptOutlinedIcon color="primary" />}
          >
            Giảm giá
          </Typography>
          <Button variant="plain" size="sm">
            Chọn phiếu giảm giá
          </Button>
        </Box>
        {/* Payment method */}
        <Box
          sx={{
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            marginTop: 5,
            position: "relative",
            padding: "16px",
          }}
        >
          <Typography marginBottom={2} level="title-lg">
            Phương thức thanh toán
          </Typography>
          <FormControl>
            <RadioGroup
              defaultValue="CASH_ON_DELIVERY"
              name="radio-buttons-group"
            >
              <Radio
                value="CASH_ON_DELIVERY"
                label="Thanh toán khi nhận hàng"
              />
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Radio value="BANK" label="Chuyển khoản" />
                <Box>
                  <SvgIconDisplay icon={VNPaySvgIcon} />
                  <SvgIconDisplay icon={VisaSvgIcon} />
                  <SvgIconDisplay icon={MasterCardSvgIcon} />
                </Box>
              </Box>
            </RadioGroup>
            {/* Pay detail */}
            <Box
              sx={{
                borderTop: "0.5px solid gray",
                borderBottom: "0.5px solid gray",
                marginTop: 2,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: 300, padding: "16px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <Typography marginBottom={2} level="title-md" color="neutral">
                    Tổng tiền hàng
                  </Typography>
                  <Typography marginBottom={2} level="title-md" color="neutral">
                    {formatCurrencyVND(totalPrice)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <Typography marginBottom={2} level="title-md" color="neutral">
                    Giảm giá
                  </Typography>
                  <Typography marginBottom={2} level="title-md" color="neutral">
                    0 đ
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <Typography marginBottom={2} level="title-md" color="neutral">
                    Tổng tiền phí vận chuyển
                  </Typography>
                  <Typography marginBottom={2} level="title-md" color="neutral">
                    FREE
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8px",
                  }}
                >
                  <Typography marginBottom={2} level="title-md">
                    Tổng thanh toán
                  </Typography>
                  <Typography marginBottom={2} level="title-md" color="danger">
                    {formatCurrencyVND(totalPrice)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* Order  */}
            <Box
              sx={{
                marginTop: 5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography color="neutral" level="title-md">
                Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo &nbsp;
                <Link>Điều khoản của chúng tôi</Link>
              </Typography>
              <Button variant="outlined" size="lg" color="primary">
                Mua Hàng
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}

export default CheckOut;
