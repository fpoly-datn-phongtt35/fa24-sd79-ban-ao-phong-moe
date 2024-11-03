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

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "#0071bd", borderRadius: "8px" }}>
      <Table size="medium">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#0071bd" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>STT</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'name'}
                direction={sortBy === 'name' ? sort : 'asc'}
                onClick={() => handleRequestSort('name')}
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Tên phiếu giảm giá
              </TableSortLabel>
            </TableCell>
            <TableCell align="left" sx={{ color: "white", fontWeight: "bold" }}>Mã</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'quantity'}
                direction={sortBy === 'quantity' ? sort : 'asc'}
                onClick={() => handleRequestSort('quantity')}
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Số lượng
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'usageCount'}
                direction={sortBy === 'usageCount' ? sort : 'asc'}
                onClick={() => handleRequestSort('usageCount')}
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Sử dụng
              </TableSortLabel>
            </TableCell>
            <TableCell align="left" sx={{ color: "white", fontWeight: "bold" }}>Loại</TableCell>
            <TableCell align="left" sx={{ color: "white", fontWeight: "bold" }}>Kiểu</TableCell>
            <TableCell align="left" sx={{ color: "white", fontWeight: "bold" }}>Trạng thái</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'startDate'}
                direction={sortBy === 'startDate' ? sort : 'asc'}
                onClick={() => handleRequestSort('startDate')}
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Bắt đầu
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'endDate'}
                direction={sortBy === 'endDate' ? sort : 'asc'}
                onClick={() => handleRequestSort('endDate')}
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Kết thúc
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ color: "#999", padding: "20px" }}>
                Không tìm thấy phiếu giảm giá nào!
              </TableCell>
            </TableRow>
          )}
          {coupons.map((coupon, index) => (
            <TableRow
              key={coupon.id}
              sx={{
                backgroundColor: index % 2 === 0 ? "#f9fafb" : "white", // Alternating row colors
                "&:hover": { backgroundColor: "#eaeef3" }, // Row hover effect
              }}
            >
              <TableCell>{(pageNo - 1) * pageSize + index + 1}</TableCell>
              <TableCell>{coupon.name}</TableCell>
              <TableCell align="left">{coupon.code}</TableCell>
              <TableCell align="left" >{coupon.quantity}</TableCell>
              <TableCell align="left">{coupon.usageCount}</TableCell>
              <TableCell align="left">
                {coupon.discountType === "PERCENTAGE" ? <PercentIcon /> : <AttachMoneyIcon />}
              </TableCell>
              <TableCell align="left">
                {coupon.type === "PUBLIC" ? <PublicIcon /> : <PersonIcon />}
              </TableCell>
              <TableCell align="left">{coupon.status}</TableCell>
              <TableCell align="left">
                {new Date(coupon.startDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {new Date(coupon.startDate).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </TableCell>
              <TableCell align="left">
                {new Date(coupon.endDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {new Date(coupon.endDate).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CouponTable;
