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
import { useNavigate, useSearchParams } from "react-router-dom";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import SvgIconDisplay from "~/components/other/SvgIconDisplay";
import VisaSvgIcon from "~/assert/icon/visa.svg";
import MBankIcon from "~/assert/icon/MBBank-MBB.svg";
import VNPaySvgIcon from "~/assert/icon/Logo VNPAY-QR.svg";
import SuccessfullyOrderIcon from "~/assert/icon/correct-success-tick-svgrepo-com.svg";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import CardShoppingCard from "~/components/clients/cards/CardShoppingCard";
import { formatCurrencyVND } from "~/utils/format";
import { ScrollToTop } from "~/utils/defaultScroll";
import { reqPay } from "~/apis";
import { handleVerifyBanking } from "~/exceptions/PaymentException";
import {
  createOrder,
  fetchAllVouchers,
  getUserAddressCart,
} from "~/apis/client/apiClient";
import VoucherModal from "~/components/clients/modals/VoucherModal";
import { toast } from "react-toastify";
import { MoeAlert } from "~/components/other/MoeAlert";

function CheckOut() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [items, setItems] = useState(null);

  const [message, setMessage] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [discount, setDiscount] = useState(0);
  const [couponId, setCouponId] = useState(null);

  const [userInfo, setUserInfo] = useState(null);
  const [vouchers, setVouchers] = useState(null);

  const [voucher, setVoucher] = useState(null);

  const [ketword, setKeword] = useState(null);

  const [orderSuccessfully, setOrderSuccessfully] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleClodeVoucher = () => {
    setVoucher(null);
    setDiscount(0);
    setCouponId(null);
  };
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const res = async () => {
      await fetchAllVouchers(userInfo?.id, ketword).then(async (res) => {
        setVouchers(res);
      });
    };
    if (ketword !== null) {
      res();
    }
  }, [ketword]);

  useEffect(() => {
    let total = calculateTotalPrice();
    setShipping(total < 100000 ? 24000 : 0);
    setSubtotal(total);
  }, [items]);

  const init = () => {
    setOrderSuccessfully(false);
    ScrollToTop();
    fetchUsers();
    setItems(JSON.parse(localStorage.getItem("orderItems")));

    handleVerifyBanking(
      searchParams.get("vnp_TransactionStatus"),
      searchParams.get("vnp_BankTranNo")
    ) && setOrderSuccessfully(true);
    navigate("/checkout");
  };

  const fetchUsers = async () => {
    await getUserAddressCart().then(async (res) => {
      setUserInfo(res.data);
      await fetchAllVouchers(res.data.id, ketword).then(async (res) => {
        setVouchers(res);
      });
    });
  };

  const handleDiscount = (data) => {
    if (data.discountType === "PERCENTAGE") {
      let result = subtotal * (data.discountValue / 100);
      result = result > data.maxValue ? data.maxValue : result;
      setDiscount(result);
    } else {
      setDiscount(data.discountValue);
    }
    setCouponId(data.id);
    setVoucher(data);
    setSubtotal(calculateTotalPrice());
  };

  const calculateTotalPrice = () => {
    return items?.reduce(
      (total, items) => total + items.productCart.sellPrice * items.quantity,
      0
    );
  };

  const onPay = async () => {
    const data = {
      customerId: userInfo?.id,
      couponId,
      shipping,
      subtotal,
      sellerDiscount: discount,
      total: subtotal + shipping - discount,
      paymentMethod,
      message,
      items,
    };

    const transformedData = {
      ...data,
      items: data.items.map((item) => ({
        id: Number(item.id),
        retailPrice: item.retailPrice,
        sellPrice: item.productCart.sellPrice,
        quantity: item.quantity,
      })),
    };

    if (data.total > 50000000) {
      toast.warning("Quá hạn mức thanh toán, vui lòng tách đơn!");
      return;
    }

    if (paymentMethod === "BANK") {
      localStorage.setItem("temp_data", JSON.stringify(transformedData));
      await reqPay(transformedData, "&uri=checkout");
    } else {
      setLoading(true);
      await createOrder(transformedData).then(() => {
        localStorage.removeItem("orderItems");
        setOrderSuccessfully(true);
        setLoading(false);
      });
    }
  };

  if (orderSuccessfully) {
    ScrollToTop();
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        width="95vw"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          bgcolor="white"
          padding="24px"
          borderRadius="8px"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
        >
          <SvgIconDisplay
            icon={SuccessfullyOrderIcon}
            width="80px"
            height="80px"
            mb={2}
          />
          <Typography variant="h5" mb={1}>
            Cảm ơn bạn đã đặt hàng!
          </Typography>
          <Typography level="title-md" mb={3} color="textSecondary">
            Đơn hàng của bạn sẽ sớm được giao cho đơn vị vận chuyển!
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

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
        <Typography marginLeft={2} level="body-md">
          Không tìm thấy đơn hàng!
        </Typography>
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
          <Typography level="body-lg" margin={2}>
            Người nhận: {userInfo?.fullName}
          </Typography>
          <Typography level="body-lg" margin={2}>
            Số điện thoại: {userInfo?.phone}
          </Typography>
          <Typography level="body-lg" margin={2}>
            Địa chỉ: {userInfo?.address}
            <Typography
              color="primary"
              level="body-xs"
              noWrap
              variant="outlined"
              marginLeft={2}
            >
              Mặc định
            </Typography>
            <Typography
              onClick={() => navigate("/my-account")}
              color="primary"
              sx={{
                cursor: "pointer",
                ":hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
              level="body-xs"
              noWrap
              marginLeft={2}
            >
              Thay đổi thông tin
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
            <Table borderAxis="y">
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
                          {formatCurrencyVND(i.productCart.sellPrice)}
                        </Typography>
                        {i.productCart.percent !== null && (
                          <Typography
                            sx={{
                              textDecoration: "line-through",
                              color: "grey",
                            }}
                          >
                            {formatCurrencyVND(i.retailPrice)}
                          </Typography>
                        )}
                      </td>
                      <td className="text-center">
                        <Typography level="title-md">{i.quantity}</Typography>
                      </td>
                      <td className="text-center">
                        <Typography level="title-md">
                          {formatCurrencyVND(
                            i.productCart.sellPrice * i.quantity
                          )}
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
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Lời nhắn gửi cho người bán..."
                  sx={{ minWidth: 300, marginLeft: 2 }}
                  size="md"
                />
              </Box>
              <Typography level="title-md">
                Tổng số tiền ({items.length} sản phẩm):{" "}
                {formatCurrencyVND(subtotal)}
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {voucher && (
              <Typography
                level="title-sm"
                variant="solid"
                color="danger"
                borderRadius={50}
                endDecorator={
                  <CloseIcon onClick={() => handleClodeVoucher()} />
                }
              >
                Giảm &nbsp;
                {voucher.discountType === "PERCENTAGE"
                  ? `${voucher.discountValue}%`
                  : formatCurrencyVND(voucher.discountValue)}
                &nbsp; đơn tối đa {formatCurrencyVND(voucher.conditions)}
              </Typography>
            )}
            {!voucher && (
              <VoucherModal
                handleDiscount={handleDiscount}
                vouchers={vouchers}
                totalAmout={subtotal}
                setKeword={setKeword}
              />
            )}
          </Box>
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
            <RadioGroup value={paymentMethod} name="radio-buttons-group">
              <Radio
                value="CASH_ON_DELIVERY"
                label="Thanh toán khi nhận hàng"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Radio
                  value="BANK"
                  label="Chuyển khoản"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Box>
                  <SvgIconDisplay
                    width={"60px"}
                    height={"60px"}
                    icon={VNPaySvgIcon}
                  />
                  <SvgIconDisplay
                    width={"60px"}
                    height={"60px"}
                    icon={VisaSvgIcon}
                  />
                  <SvgIconDisplay
                    width={"25px"}
                    height={"25px"}
                    icon={MBankIcon}
                  />
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
                    {formatCurrencyVND(subtotal)}
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
                    {formatCurrencyVND(discount)}
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
                    {shipping === 0 ? "FREE" : formatCurrencyVND(shipping)}
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
                    {formatCurrencyVND(subtotal + shipping - discount)}
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
              <MoeAlert
                title="Xác nhận đơn hàng"
                message="Bạn có muốn tiếp tục không?"
                event={() => onPay()}
                button={
                  <Button
                    variant="solid"
                    size="lg"
                    color="primary"
                    loading={loading}
                  >
                    Đặt Hàng
                  </Button>
                }
              />
            </Box>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}

export default CheckOut;
