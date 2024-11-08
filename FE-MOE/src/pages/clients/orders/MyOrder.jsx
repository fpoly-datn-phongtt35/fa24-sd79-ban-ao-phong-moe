// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import {
  Box,
  Breadcrumbs,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Link,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TableRow from "~/components/clients/other/TableRow";
import { getOrders } from "~/apis/client/apiClient";
import SvgIconDisplay from "~/components/other/SvgIconDisplay";
import EmptyOrderSvgIcon from "~/assert/icon/note-notepad-svgrepo-com.svg";

function MyOrder() {
  const navigate = useNavigate();

  const [openRow, setOpenRow] = useState(null);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [keyword, setKeyword] = useState("");

  const [orders, setOrders] = useState(null);

  useEffect(() => {
    handleGetInvoices();
  }, []);

  const handleGetInvoices = async () => {
    await getOrders(pageNo, pageSize, keyword).then((res) => {
      console.log(res.data);
      setOrders(res.data);
    });
  };

  const handleRowToggle = (code) => {
    setOpenRow(openRow === code ? null : code);
  };

  return (
    <Box sx={{ marginLeft: 5 }}>
      <Grid container spacing={2} alignItems="center" height={"50px"}>
        <Breadcrumbs separator="›" aria-label="breadcrumbs">
          <Link
            underline="hover"
            sx={{ cursor: "pointer" }}
            color="neutral"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </Link>
          <Typography noWrap>Đơn hàng</Typography>
        </Breadcrumbs>
      </Grid>
      {/* table */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 3,
          marginBottom: 3,
        }}
      >
        <FormControl>
          <FormLabel>Tra cứu hóa đơn</FormLabel>
          <Input sx={{ width: 500 }} placeholder="Tra cứu hóa đơn" />
        </FormControl>
      </Box>
      <Box>
        <Typography
          marginBottom={1}
          color="neutral"
          level="title-lg"
          noWrap
          variant="plain"
        >
          Danh sách đơn hàng
        </Typography>
        {orders?.content?.length < 1 && (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <SvgIconDisplay
                icon={EmptyOrderSvgIcon}
                width="100px"
                height="100px"
              />
            </Box>
            <Typography level="h5" fontWeight="bold" color="neutral">
              Chưa có đơn hàng
            </Typography>
          </Box>
        )}
        <Sheet sx={{ borderRadius: "5px" }}>
          {orders?.content?.length > 0 && (
            <Table variant="outlined" borderAxis="none">
              <thead>
                <tr>
                  <th
                    style={{ textAlign: "center", width: "5%" }}
                    aria-label="empty"
                  />
                  <th style={{ textAlign: "center", width: "20%" }}>
                    Mã đơn hàng
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    Số lượng
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    Tổng đơn hàng
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    Giảm giá
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    Phí vận chuyển
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    Tổng tiền
                  </th>
                  <th style={{ textAlign: "center", width: "30%" }}>
                    Trạng thái
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    Thanh toán
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    Ngày đặt hàng
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  orders?.content?.map((item) => (
                    <TableRow
                      key={item.code}
                      item={item}
                      isOpen={openRow === item.code}
                      onToggle={handleRowToggle}
                    />
                  ))}
              </tbody>
            </Table>
          )}
        </Sheet>
      </Box>
    </Box>
  );
}

export default MyOrder;
