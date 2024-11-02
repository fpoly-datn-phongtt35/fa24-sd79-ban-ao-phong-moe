// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1

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
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CardShoppingCard from "~/components/clients/cards/CardShoppingCard";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { ScrollToTop } from "~/utils/defaultScroll";
import { useContext } from "react";
import { deleteItemCart } from "~/apis/client/productApiClient";
import { formatCurrencyVND } from "~/utils/format";
import { MoeAlert } from "~/components/other/MoeAlert";
import { toast } from "react-toastify";
import { CommonContext } from "~/context/CommonContext";

function ShoppingCart() {
  ScrollToTop();
  const navigate = useNavigate();
  const context = useContext(CommonContext);

  const handleDeleteCart = async (id) => {
    await deleteItemCart(id).then((res) => {
      context.handleFetchCarts();
      toast.success(res.message);
    });
  };
  return (
    <Box>
      <Grid container spacing={2} alignItems="center" height={"50px"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
          <Link
            underline="hover"
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Trang chủ
          </Link>
          <Typography level="title-md" noWrap>
            Giỏ hàng
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Box margin={5}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid size={{ xs: 12 }}>
            <Sheet>
              <Table>
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: "50px" }}>
                      <Checkbox />
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
                  {context.carts?.length === 0 && (
                    <tr>
                      <td colSpan={5} align="center">
                        Chưa có sản phẩm nào được thêm!
                      </td>
                    </tr>
                  )}
                  {context.carts &&
                    context.carts.map((cart) => (
                      <tr key={cart.id}>
                        <td className="text-center">
                          <Checkbox />
                        </td>
                        <td>
                          <CardShoppingCard data={cart} />
                        </td>
                        <td className="text-center">
                          {formatCurrencyVND(cart.retailPrice)}
                        </td>
                        <td className="text-center">
                          <Input defaultValue={cart.quantity} type="number" />
                        </td>
                        <td className="text-center">
                          {formatCurrencyVND(cart.retailPrice * cart.quantity)}
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
                                <BackspaceOutlinedIcon color="error" />
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
          <Divider sx={{ my: 1, width: "100%" }} />
          <Grid
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              startDecorator={<ShoppingCartOutlinedIcon />}
              onClick={() => navigate("/")}
            >
              Quay lại cửa hàng
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startDecorator={<PaymentsOutlinedIcon />}
            >
              Mua hàng
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ShoppingCart;
