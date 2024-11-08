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
  Option,
  Select,
  Sheet,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TableRow from "~/components/clients/other/TableRow";
import { billStatus, cancelInvoice, getOrders } from "~/apis/client/apiClient";
import SvgIconDisplay from "~/components/other/SvgIconDisplay";
import EmptyOrderSvgIcon from "~/assert/icon/note-notepad-svgrepo-com.svg";
import { Pagination } from "@mui/material";
import debounce from "lodash.debounce";

function MyOrder() {
  const navigate = useNavigate();

  const [openRow, setOpenRow] = useState(null);
  const [statusOptions, setStatusOptions] = useState(null);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState(0);

  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      await billStatus().then((res) => setStatusOptions(res.data));
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    handleGetInvoices();
  }, [pageNo, pageSize, keyword, status]);

  const debouncedSearch = debounce((value) => {
    setKeyword(value);
    setPageNo(1);
  }, 300);

  const onChangeSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSetPageSize = (value) => {
    setPageNo(1);
    setPageSize(value);
  };

  const handleGetInvoices = async () => {
    await getOrders(pageNo, pageSize, keyword, status).then((res) => {
      setOrders(res.data);
    });
  };

  const handleCancelOrder = async (id, message) => {
    await cancelInvoice(id, message).then(() => {
      handleGetInvoices();
    });
  };

  const handlePageChange = (event, value) => {
    setPageNo(value);
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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          marginTop: 3,
          marginBottom: 3,
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel>Tra cứu đơn hàng</FormLabel>
          <Input
            sx={{ width: 300 }}
            placeholder="Nhập mã đơn hàng"
            onChange={onChangeSearch}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Trạng thái</FormLabel>
          <Select
            value={status}
            sx={{ minWidth: 300 }}
            onChange={(event, value) => setStatus(value)}
          >
            <Option value={0}>Tất cả</Option>
            {statusOptions &&
              statusOptions?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </FormControl>
      </Box>

      <Box>
        <Grid
          container
          spacing={2}
          marginBottom={1}
          sx={{ flexGrow: 1 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid size={8}>
            <Typography color="neutral" level="title-lg" noWrap variant="plain">
              Danh sách đơn hàng
            </Typography>
          </Grid>
          <Grid size={2}>
            <Stack
              spacing={1}
              direction="row"
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                color="neutral"
                level="title-md"
                noWrap
                variant="plain"
              >
                Hiển thị:
              </Typography>
              <Select
                defaultValue={pageSize}
                sx={{ width: "80px" }}
                onChange={(event, value) => handleSetPageSize(value)}
              >
                <Option value={3}>3</Option>
                <Option value={5}>5</Option>
                <Option value={10}>10</Option>
                <Option value={25}>25</Option>
                <Option value={50}>50</Option>
                <Option value={100}>100</Option>
              </Select>
            </Stack>
          </Grid>
        </Grid>
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
            <Table borderAxis="both">
              <thead>
                <tr>
                  <th
                    style={{ textAlign: "center", width: "5%" }}
                    aria-label="empty"
                  />
                  <th style={{ textAlign: "center", width: "20%" }}>
                    <Typography level="title-md">Mã đơn hàng</Typography>
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    <Typography level="title-md">Số lượng</Typography>
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    <Typography level="title-md">Tổng đơn hàng</Typography>
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    <Typography level="title-md">Giảm giá</Typography>
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    <Typography level="title-md">Phí vận chuyển</Typography>
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    <Typography level="title-md">Tổng tiền</Typography>
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    <Typography level="title-md">Trạng thái</Typography>
                  </th>
                  <th style={{ textAlign: "center", width: "20%" }}>
                    <Typography level="title-md">Ngày đặt hàng</Typography>
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
                      handleCancelOrder={handleCancelOrder}
                    />
                  ))}
              </tbody>
            </Table>
          )}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding={3}
          >
            {orders?.totalPages > 1 && (
              <Stack>
                <Pagination
                  count={orders?.totalPages}
                  page={pageNo}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                />
              </Stack>
            )}
          </Box>
        </Sheet>
      </Box>
    </Box>
  );
}

export default MyOrder;
