import { Container, Tab, Tabs, Typography, CircularProgress, TableContainer, Table, TableCell, TableBody, TableRow, TableHead, Paper, Pagination } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBillList } from '~/apis/billListApi';
import { formatCurrencyVND } from '~/utils/format';
import { Edit } from '@mui/icons-material';
import { IconButton } from '@mui/joy';

export default function BillList() {
    const navigate = useNavigate();
    const [activeTabIndex, setActiveTabIndex] = useState(1);
    const [tabIndexList, setTabIndexList] = useState(0);
    const [loading, setLoading] = useState(false);

    const [billList, setBillList] = useState(null);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize] = useState(5);
    const [keyword] = useState('');
    const [status, setStatus] = useState('');
    const [totalPages, setTotalPages] = useState(0);


    // Status mapping
    const statusMap = {
        '1': 'Đang chờ xử lý',
        '2': 'Chờ xác nhận',
        '3': 'Đã xác nhận',
        '4': 'Chờ giao',
        '5': 'Đã giao thành công',
        '6': 'Giao hàng thất bại',
        '7': 'Đã hủy',
        '8': 'Đơn hàng hoàn tất',
        '9': 'Khác',
      };

    // Tab definitions with labels and associated status filters
    const tabs = [
        { label: 'Tất cả', status: '' },
        { label: 'Chờ xác nhận', status: '2' },
        { label: 'Chờ giao', status: '4' },
        { label: 'Hoàn thành', status: '8' },
        { label: 'Đã hủy', status: '7' },
    ];

    // Handle main tab change
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

    // Fetch bill list based on the status and pagination
    const fetchBillList = async () => {
        setLoading(true);
        try {
            const res = await getBillList(pageNo, pageSize, keyword, status);
            setBillList(res.data);
            setTotalPages(res.totalPages);
        } catch (error) {
            console.error("Failed to fetch bills", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle sub-tab change for filtering bills by status
    const handleTabChangeList = (event, newValue) => {
        setTabIndexList(newValue);
        const newStatus = tabs[newValue].status;
        setStatus(newStatus);
        setPageNo(1);
    };

    // Handle page change for pagination
    const handlePageChange = (event, newPage) => {
        setPageNo(newPage);
    };

    // Fetch data on mount and when status or pageNo changes
    useEffect(() => {
        fetchBillList();
        localStorage.removeItem('billId');
    }, [status, pageNo]);

    return (
        <Container maxWidth="lg" className="bg-white" style={{ height: "100%", marginTop: "15px" }}>
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

            <Tabs value={tabIndexList} onChange={handleTabChangeList} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }} variant="scrollable" scrollButtons="auto">
                {tabs.map((tab, index) => (
                    <Tab key={index} label={tab.label} sx={{ fontWeight: 'bold' }} />
                ))}
            </Tabs>

            <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
                <Table sx={{ minWidth: 800, borderCollapse: 'collapse' }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#0071bd' }}>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', padding: '12px 16px' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Mã</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Khách hàng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>SĐT</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Tổng tiền</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Loại đơn hàng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Ngày tạo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {billList?.content?.map((bill, index) => (
                            <TableRow key={bill.id} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                <TableCell sx={{ textAlign: 'center', padding: '12px 16px' }}>
                                    {index + 1 + (pageNo - 1) * pageSize}
                                </TableCell>
                                <TableCell sx={{ padding: '12px 16px' }}>{bill.code}</TableCell>
                                <TableCell sx={{ padding: '12px 16px' }}>
                                    {bill.customer ? `${bill.customer.lastName} ${bill.customer.firstName}` : 'Khách hàng lẻ'}
                                </TableCell>
                                <TableCell sx={{ padding: '12px 16px' }}>{bill.customer ? `${bill.customer.phoneNumber}` : 'XXXXXXXXX'}</TableCell>
                                <TableCell sx={{ color: 'red', padding: '12px 16px' }}>
                                    {formatCurrencyVND(bill.total)}
                                </TableCell>
                                <TableCell sx={{ padding: '12px 16px' }}>
                                    {statusMap[bill.billStatus] || 'N/A'}
                                </TableCell>
                                <TableCell sx={{ padding: '12px 16px' }}>{bill.createAt}</TableCell>
                                <TableCell sx={{ padding: '12px 16px' }}>
                                    <IconButton
                                        onClick={() => {
                                            localStorage.setItem('billId', bill.id); 
                                            navigate(`/bill/detail/${bill.id}`);    
                                        }}
                                        color="primary"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => navigate(`/bill/detail`)} color='primary'>
                                        ...
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination
                count={totalPages}
                page={pageNo}
                onChange={handlePageChange}
                color="primary"
                sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
            />
        </Container>
    );
}
