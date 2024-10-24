import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TableSortLabel } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Public as PublicIcon, Person as PersonIcon, Percent as PercentIcon, AttachMoney as AttachMoneyIcon } from '@mui/icons-material';
import { MoeAlert } from '~/components/other/MoeAlert';
import { useNavigate } from "react-router-dom";

const CouponTable = ({ coupons, sortBy, sort, handleRequestSort, onDelete, pageNo, pageSize }) => {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'name'}
                direction={sortBy === 'name' ? sort : 'asc'}
                onClick={() => handleRequestSort('name')}
              >
                Tên phiếu giảm giá
              </TableSortLabel>
            </TableCell>
            <TableCell align="left">Mã</TableCell>
            <TableCell align="left">Số lượng</TableCell>
            <TableCell align="left">Loại</TableCell>
            <TableCell align="left">Kiểu</TableCell>
            <TableCell align="left">Trạng thái</TableCell>
            <TableCell align="left">Bắt đầu</TableCell>
            <TableCell align="left">Kết thúc</TableCell>
            <TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} align="center">
                Không tìm thấy phiếu giảm giá nào!
              </TableCell>
            </TableRow>
          )}
          {coupons.map((coupon, index) => (
            <TableRow key={coupon.id}>
              <TableCell>{(pageNo - 1) * pageSize + index + 1}</TableCell>
              <TableCell>{coupon.name}</TableCell>
              <TableCell align="left">{coupon.code}</TableCell>
              <TableCell align="left">{coupon.quantity}</TableCell>
              <TableCell align="left">
                {coupon.discountType === 'PERCENTAGE' ? <PercentIcon /> : <AttachMoneyIcon />}
              </TableCell>
              <TableCell align="left">
                {coupon.type === 'PUBLIC' ? <PublicIcon /> : <PersonIcon />}
              </TableCell>
              <TableCell align="left">{coupon.status}</TableCell>
              <TableCell align="left">
                {new Date(coupon.startDate).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}{' '}
                {new Date(coupon.startDate).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false, // Ensures 24-hour format
                })}
              </TableCell>

              <TableCell align="left">
                {new Date(coupon.endDate).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}{' '}
                {new Date(coupon.endDate).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false, // Ensures 24-hour format
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
                  button={<IconButton color="secondary" size="small"><DeleteIcon /></IconButton>}
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
