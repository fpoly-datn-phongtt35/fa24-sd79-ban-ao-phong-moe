// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Divider,
  Grid,
  Input,
  Link,
  Sheet,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import CardShoppingCard from "~/components/clients/cards/CardShoppingCard";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { ScrollToTop } from "~/utils/defaultScroll";
import { deleteItemCart, updateCart } from "~/apis/client/productApiClient";
import { formatCurrencyVND } from "~/utils/format";
import { MoeAlert } from "~/components/other/MoeAlert";
import { toast } from "react-toastify";
import { CommonContext } from "~/context/CommonContext";
import BagSvgIcon from "~/assert/icon/bag-svgrepo-com.svg";
import SvgIconDisplay from "~/components/other/SvgIconDisplay";
import debounce from "lodash.debounce";

function ShoppingCart() {
  const navigate = useNavigate();
  const context = useContext(CommonContext);

  const [selectedCarts, setSelectedCarts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    ScrollToTop();
  }, []);

  useEffect(() => {
    if (context.carts && context.carts.length > 0) {
      setSelectAll(selectedCarts.length === context.carts.length);
    }
  }, [selectedCarts, context.carts]);

  const handleDeleteCart = async (id) => {
    await deleteItemCart(id).then((res) => {
      context.handleFetchCarts();
      toast.success(res.message);
      setSelectedCarts((prevSelectedCarts) =>
        prevSelectedCarts.filter((cart) => cart.id !== id)
      );
    });
  };

  const debouncedQuantity = debounce((id, quantity) => {
    handleUpdateCart(id, quantity);
  }, 900);

  const handleUpdateCart = async (id, quantity) => {
    let data = {
      productDetailId: id,
      quantity: quantity,
      username: localStorage.getItem("username"),
    };
    await updateCart(data).then(() => context.handleFetchCarts());
  };

  const onUpdateQuantity = (id, quantity) => {
    debouncedQuantity(id, quantity);
  };

  const handleCheckboxChange = (cart) => {
    if (selectedCarts.includes(cart)) {
      setSelectedCarts(
        selectedCarts.filter((selectedCart) => selectedCart.id !== cart.id)
      );
    } else {
      setSelectedCarts([...selectedCarts, cart]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCarts([]);
    } else {
      setSelectedCarts(context.carts);
    }
    setSelectAll(!selectAll);
  };

  const calculateTotalPrice = () => {
    return selectedCarts.reduce(
      (total, cart) => total + cart.retailPrice * cart.quantity,
      0
    );
  };

  const totalPrice = calculateTotalPrice();

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
          <Typography noWrap>Giỏ hàng</Typography>
        </Breadcrumbs>
      </Grid>
      <Box margin={5}>
        {context.carts?.length === 0 && (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <SvgIconDisplay icon={BagSvgIcon} width="100px" height="100px" />
            </Box>
            <Typography level="h5" fontWeight="bold" color="neutral">
              Giỏ hàng của bạn đang trống!
            </Typography>
            <Box marginTop={2}>
              <Button size="lg" variant="soft" onClick={() => navigate("/")}>
                MUA NGAY
              </Button>
            </Box>
          </Box>
        )}
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {context.carts?.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Sheet>
                <Table>
                  <thead>
                    <tr>
                      <th className="text-center" style={{ width: "50px" }}>
                        <Checkbox
                          size="sm"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-center">Sản phẩm</th>
                      <th className="text-center">Giá tiền</th>
                      <th className="text-center" style={{ width: "100px" }}>
                        Số lượng
                      </th>
                      <th className="text-center">Tổng tiền</th>
                      <th className="text-center" style={{ width: "100px" }}>
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {context.carts.map((cart) => (
                      <tr key={cart.id}>
                        <td className="text-center">
                          <Checkbox
                            size="sm"
                            checked={selectedCarts.includes(cart)}
                            onChange={() => handleCheckboxChange(cart)}
                          />
                        </td>
                        <td>
                          <CardShoppingCard data={cart} />
                        </td>
                        <td className="text-center">
                          <Typography level="title-md">
                            {formatCurrencyVND(cart.retailPrice)}
                          </Typography>
                        </td>
                        <td className="text-center">
                          <Input
                            defaultValue={cart.quantity}
                            type="number"
                            onChange={(e) =>
                              onUpdateQuantity(cart.id, e.target.value)
                            }
                          />
                        </td>
                        <td className="text-center">
                          <Typography level="title-md">
                            {formatCurrencyVND(
                              cart.retailPrice * cart.quantity
                            )}
                          </Typography>
                        </td>
                        <td className="text-center">
                          <MoeAlert
                            title="Xóa sản phẩm"
                            message="Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
                            event={() => handleDeleteCart(cart.id)}
                            button={
                              <Tooltip
                                title="Xóa khỏi giỏ hàng"
                                variant="plain"
                              >
                                <Typography level="title-md" color="danger">
                                  Xóa
                                </Typography>
                              </Tooltip>
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Sheet>
            </Grid>
          )}
          <Divider sx={{ my: 1, width: "100%" }} />
          {context.carts?.length > 0 && selectedCarts.length > 0 && (
            <Grid
              xs={12}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography level="title-md">
                Tổng tiền: {formatCurrencyVND(totalPrice)}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="sm"
                startDecorator={<PaymentsOutlinedIcon />}
                onClick={() => {
                  console.log("Selected Carts: ", selectedCarts);
                  context.setTempCarts(selectedCarts);
                  navigate("/checkout");
                }}
              >
                Thanh toán
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default ShoppingCart;
