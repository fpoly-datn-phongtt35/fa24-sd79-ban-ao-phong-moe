import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Public as PublicIcon,
  Person as PersonIcon,
  Percent as PercentIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { MoeAlert } from "~/components/other/MoeAlert";
import { useNavigate } from "react-router-dom";

const CouponTable = ({ coupons, sortBy, sort, handleRequestSort, onDelete, pageNo, pageSize }) => {
  const navigate = useNavigate();

  const cellStyle = {
    maxWidth: "150px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "white", borderRadius: "8px" }}>
      <Table size="medium">
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgb(70 168 234)", borderBottom: "1px solid #ddd" }}>
            <TableCell sx={{ color: "#000", fontWeight: "bold", paddingLeft: "16px", height: "56px"}}>STT</TableCell>

            <TableCell sx={{ height: "56px"}}>
              <TableSortLabel
                active={sortBy === "name"}
                direction={sortBy === "name" ? sort : "asc"}
                onClick={() => handleRequestSort("name")}
                sx={{ color: "#333", fontWeight: "bold", textTransform: "capitalize" }}
              >
                Tên PGG
              </TableSortLabel>
            </TableCell>

            <TableCell align="left" sx={{ color: "#333", fontWeight: "bold", height: "56px"}}>Mã</TableCell>

            <TableCell sx={{ height: "56px"}}>
              <TableSortLabel
                active={sortBy === "quantity"}
                direction={sortBy === "quantity" ? sort : "asc"}
                onClick={() => handleRequestSort("quantity")}
                sx={{ color: "#333", fontWeight: "bold" }}
              >
                Số lượng
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ height: "56px"}}>
              <TableSortLabel
                active={sortBy === "usageCount"}
                direction={sortBy === "usageCount" ? sort : "asc"}
                onClick={() => handleRequestSort("usageCount")}
                sx={{ color: "#333", fontWeight: "bold" }}
              >
                Sử dụng
              </TableSortLabel>
            </TableCell>

            <TableCell align="left" sx={{ color: "#333", fontWeight: "bold", height: "56px"}}>Loại</TableCell>

            <TableCell align="left" sx={{ color: "#333", fontWeight: "bold", height: "56px"}}>Kiểu</TableCell>

            <TableCell align="left" sx={{ color: "#333", fontWeight: "bold", height: "56px"}}>Trạng thái</TableCell>

            <TableCell sx={{ height: "56px"}}>
              <TableSortLabel
                active={sortBy === "startDate"}
                direction={sortBy === "startDate" ? sort : "asc"}
                onClick={() => handleRequestSort("startDate")}
                sx={{ color: "#333", fontWeight: "bold" }}
              >
                Bắt đầu
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ height: "56px"}}>
              <TableSortLabel
                active={sortBy === "endDate"}
                direction={sortBy === "endDate" ? sort : "asc"}
                onClick={() => handleRequestSort("endDate")}
                sx={{ color: "#333", fontWeight: "bold" }}
              >
                Kết thúc
              </TableSortLabel>
            </TableCell>

            <TableCell align="right" sx={{ color: "#333", fontWeight: "bold", paddingRight: "16px", height: "56px"}}>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ color: "red", padding: "20px" }}>
                Không tìm thấy phiếu giảm giá nào!
              </TableCell>
            </TableRow>
          )}
          {coupons.map((coupon, index) => {
            const now = new Date();
            const startDate = new Date(coupon.startDate);
            const endDate = new Date(coupon.endDate);

            let rowColor;
            if (now < startDate) {
              rowColor = "#fff8e1";
            } else if (now > endDate) {
              rowColor = "#ffebee";
            } else {
              rowColor = "#e8f5e9";
            }

            return (
              <TableRow
                key={coupon.id}
                sx={{
                  backgroundColor: rowColor,
                  "&:hover": { backgroundColor: "#eaeef3" },
                }}
              >
                <TableCell>{(pageNo - 1) * pageSize + index + 1}</TableCell>
                <TableCell sx={cellStyle}>{coupon.name}</TableCell>
                <TableCell align="left" sx={cellStyle}>{coupon.code}</TableCell>
                <TableCell align="left">{coupon.quantity}</TableCell>
                <TableCell align="left">{coupon.usageCount}</TableCell>
                <TableCell align="left">
                  {coupon.discountType === "PERCENTAGE" ? <PercentIcon /> : <AttachMoneyIcon />}
                </TableCell>
                <TableCell align="left">
                  {coupon.type === "PUBLIC" ? <PublicIcon /> : <PersonIcon />}
                </TableCell>
                <TableCell align="left">{coupon.status}</TableCell>
                <TableCell align="left">
                  {startDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })} |{" "}
                  {startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false })}
                </TableCell>
                <TableCell align="left">
                  {endDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })} |{" "}
                  {endDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false })}
                </TableCell>

                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/coupon/detail/${coupon.id}`)} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <MoeAlert
                    title="Cảnh báo"
                    message="Bạn có muốn xóa phiếu giảm giá này?"
                    event={() => onDelete(coupon.id)}
                    button={<IconButton color="error" size="small"><DeleteIcon /></IconButton>}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CouponTable;
