import {
  Box,
  Breadcrumbs,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Link,
  Table,
  Typography,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TableRow from "~/components/clients/other/TableRow";

function MyOrder() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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
        <Table
          sx={{
            "& th, & td": {
              padding: "12px 16px",
              fontSize: "0.875rem",
              color: "text.primary",
            },
            "& thead th": {
              fontWeight: "bold",
              textAlign: "center",
            },
            "& tbody td": {
              textAlign: "center",
            },
            "& tbody tr": {
              borderBottom: "1px solid #e0e0e0",
            },
            "& tbody tr:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <thead>
            <tr>
              <th style={{ width: "5%" }} aria-label="empty" />
              <th className="text-start" style={{ width: "25%" }}>Mã hóa đơn</th>
              <th style={{ width: "15%" }}>Số lượng</th>
              <th style={{ width: "20%" }}>Tổng tiền</th>
              <th style={{ width: "20%" }}>Trạng thái</th>
              <th style={{ width: "15%" }}>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            <TableRow initialOpen={false} />
            <TableRow initialOpen={false} />
            <TableRow initialOpen={false} />
            <TableRow initialOpen={false} />
            <TableRow initialOpen={false} />
            <TableRow initialOpen={false} />
            <TableRow initialOpen={false} />
            <TableRow initialOpen={false} />
            <TableRow initialOpen={false} />
            <TableRow initialOpen={false} />
          </tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default MyOrder;
