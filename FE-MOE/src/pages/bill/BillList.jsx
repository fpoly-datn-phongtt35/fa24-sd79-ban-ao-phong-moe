import {
    Container, Tab, Tabs, Typography, CircularProgress,
    TableContainer, Table, TableCell, TableBody, TableRow,
    TableHead, Paper, Pagination, TextField,
    Box,
    Grid,
    Button,
    Slider
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteBillList, getBillList } from '~/apis/billListApi';
import { formatCurrencyVND } from '~/utils/format';
import { Edit } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/joy';
import DeleteIcon from '@mui/icons-material/Delete';
import { MoeAlert } from '~/components/other/MoeAlert';
import debounce from 'lodash.debounce';
import ClearIcon from '@mui/icons-material/Clear';

export default function BillList() {
    const navigate = useNavigate();
    const [activeTabIndex, setActiveTabIndex] = useState(1);
    const [tabIndexList, setTabIndexList] = useState(0);
    const [loading, setLoading] = useState(false);

    const [billList, setBillList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize] = useState(5);
    const [status, setStatus] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minTotal, setMinTotal] = useState('');
    const [maxTotal, setMaxTotal] = useState('');
    const employeeId = localStorage.getItem("userId");

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        minTotal: '',
        maxTotal: '',
    });

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    const statusMap = {
        '1': 'Đã tạo hóa đơn',
        '2': 'Chờ xác nhận',
        '3': 'Đã xác nhận',
        '4': 'Chờ giao',
        '5': 'Đã giao thành công',
        '6': 'Giao hàng thất bại',
        '7': 'Đã hủy',
        '8': 'Đơn hàng hoàn tất',
        '9': 'Khác',
    };

    const tabs = [
        { label: 'Chờ xác nhận', status: '2' },
        { label: 'Đã vận chuyển', status: '4' },
        { label: 'Đã xác nhận', status: '3' },
        { label: 'Hoàn thành', status: '8' },
        { label: 'Đã hủy', status: '7' },
    ];

    const handleTabChange = (event, newValue) => {
        setActiveTabIndex(newValue);
        setLoading(true);
        setTimeout(() => {
            if (newValue === 0) {
                navigate('/bill');
            } else {
                navigate('/bill/list');
            }
            setLoading(false);
        }, 500);
    };

    const fetchBillList = async () => {
        setLoading(true);
        try {
            const res = await getBillList(
                pageNo, pageSize, searchKeyword, status,
                startDate ? formatDate(startDate) : "",
                endDate ? formatDate(endDate) : "",
                minTotal || null, maxTotal || null, employeeId || ""
            );
            setBillList(res?.data?.content || []);
            setTotalPages(res?.data?.totalPages || 0);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách hóa đơn!");
            console.error("Failed to fetch bills", error);
        }
        setLoading(false);
    };

    const handleTabChangeList = (event, newValue) => {
        setTabIndexList(newValue);
        setStatus(tabs[newValue].status);
        setPageNo(1);
        setBillList([]);
    };

    const handlePageChange = (event, newPage) => {
        setPageNo(newPage);
    };

    useEffect(() => {
        fetchBillList();
    }, [status, pageNo, searchKeyword, employeeId, filters]);

    const handleDelete = async (id) => {
        await deleteBillList(id);
        fetchBillList();
    };

    const handleSearchChange = debounce((event) => {
        setSearchKeyword(event.target.value);
        setPageNo(1);
    }, 1000);

    const handleClearFilters = () => {
        setStartDate('');
        setEndDate('');
        setMinTotal('');
        setMaxTotal('');
        setFilters({ startDate: '', endDate: '', minTotal: '', maxTotal: '' });
        setPageNo(1);
    };

    const handleFilterClick = () => {
        setFilters({
            startDate: startDate || '',
            endDate: endDate || '',
            minTotal: minTotal || '',
            maxTotal: maxTotal || '',
        });
        setPageNo(1);
    };

    return (
        <Container maxWidth="max-Width" className="bg-white" style={{ marginTop: "15px" }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#0071bd', textAlign: 'left', mb: 3 }}>
                QUẢN LÝ DANH SÁCH HÓA ĐƠN
            </Typography>

            {loading && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 1
                }}>
                    <CircularProgress size={80} />
                </div>
            )}

            <Tabs
                value={activeTabIndex}
                onChange={handleTabChange}
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label="Tạo mới" sx={{ fontWeight: 'bold' }} />
                <Tab label="Danh sách hóa đơn" sx={{ fontWeight: 'bold' }} />
            </Tabs>

            <Tabs
                value={tabIndexList}
                onChange={handleTabChangeList}
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                variant="scrollable" scrollButtons="auto"
            >
                {tabs.map((tab, index) => (
                    <Tab key={index} label={tab.label} sx={{ fontWeight: 'bold' }} />
                ))}
            </Tabs>

            <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Hàng 1: Tìm kiếm và Nút */}
                    <Grid item xs={12} sm={8} md={8}>
                        <TextField
                            placeholder="Tìm kiếm hóa đơn..."
                            fullWidth
                            onChange={handleSearchChange}
                            size="small"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} display="flex" justifyContent="flex-end" gap={1}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClearFilters}
                            size="medium"
                            startIcon={<ClearIcon />}
                        >
                            Xóa bộ lọc
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFilterClick}
                            size="medium"
                        >
                            Lọc dữ liệu
                        </Button>
                    </Grid>

                    {/* Hàng 2: Bộ lọc ngày và giá */}
                    <Grid item xs={6} sm={3} md={3}>
                        <TextField
                            label="Từ ngày"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3} md={3}>
                        <TextField
                            label="Đến ngày"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3} md={3}>
                        <TextField
                            label="Từ giá"
                            placeholder="Nhập giá tối thiểu"
                            fullWidth
                            value={minTotal}
                            onChange={(e) => setMinTotal(e.target.value.replace(/[^0-9]/g, ''))}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3} md={3}>
                        <TextField
                            label="Đến giá"
                            placeholder="Nhập giá tối đa"
                            fullWidth
                            value={maxTotal}
                            onChange={(e) => setMaxTotal(e.target.value.replace(/[^0-9]/g, ''))}
                            size="small"
                        />
                    </Grid>
                </Grid>
            </Box>


            <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#0071bd' }}>
                            <TableCell sx={{ color: 'white', textAlign: 'center' }}>#</TableCell>
                            <TableCell sx={{ color: 'white' }}>Mã</TableCell>
                            <TableCell sx={{ color: 'white' }}>Khách hàng</TableCell>
                            <TableCell sx={{ color: 'white' }}>SĐT</TableCell>
                            <TableCell sx={{ color: 'white' }}>Tổng tiền</TableCell>
                            <TableCell sx={{ color: 'white' }}>Loại đơn hàng</TableCell>
                            <TableCell sx={{ color: 'white' }}>Ngày tạo</TableCell>
                            <TableCell sx={{ color: 'white' }}>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {billList.length > 0 ? (
                            billList.map((bill, index) => (
                                <TableRow key={bill.id}>
                                    {/* Row Content */}
                                    <TableCell>{index + 1 + (pageNo - 1) * pageSize}</TableCell>
                                    <TableCell>{bill.code}</TableCell>
                                    <TableCell>{bill.customer ? `${bill.customer.lastName} ${bill.customer.firstName}` : 'Khách hàng lẻ'}</TableCell>
                                    <TableCell>{bill.customer?.phoneNumber || 'XXXXXXXXX'}</TableCell>
                                    <TableCell
                                        sx={{
                                            color: bill.total === null ? "red" : "inherit",
                                            fontWeight: bill.total === null ? "bold" : "normal",
                                        }}
                                    >
                                        {bill.total === null ? "Chưa thanh toán" : formatCurrencyVND(bill.total)}
                                    </TableCell>
                                    <TableCell>{statusMap[bill.billStatus] || 'N/A'}</TableCell>
                                    <TableCell>{bill.createAt}</TableCell>
                                    <TableCell className='text-center'>
                                        <IconButton onClick={() => navigate(`/bill/detail/${bill.id}`)} color='success'>
                                            <Edit />
                                        </IconButton>
                                        {/* <MoeAlert
                                            title="Cảnh báo"
                                            message={'Bạn có muốn xóa hóa đơn này không?'}
                                            event={() => handleDelete(bill.id)}
                                            button={
                                                <Tooltip title="Xóa vĩnh viễn" variant="plain">
                                                    <IconButton color="danger">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        /> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} sx={{ textAlign: 'center', fontStyle: 'italic', color: 'gray' }}>
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>


            <Pagination
                count={totalPages}
                page={pageNo}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                color="primary"
                sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
            />
        </Container>
    );
}
