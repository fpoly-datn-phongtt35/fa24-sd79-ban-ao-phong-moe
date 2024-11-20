import {
    Container, Tab, Tabs, Typography, CircularProgress,
    TableContainer, Table, TableCell, TableBody, TableRow,
    TableHead, Paper, Pagination
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteBillList, getBillList } from '~/apis/billListApi';
import { formatCurrencyVND } from '~/utils/format';
import { Edit } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/joy';
import DeleteIcon from '@mui/icons-material/Delete';
import { MoeAlert } from '~/components/other/MoeAlert';

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

    const tabs = [
        { label: 'Chờ xác nhận', status: '2' },
        { label: 'Đang chờ', status: '1' },
        { label: 'Chờ giao', status: '4' },
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
            const res = await getBillList(pageNo, pageSize, '', status);
            setBillList(res?.data?.content || []);
            setTotalPages(res?.data?.totalPages || 0);
        } catch (error) {
            console.error("Failed to fetch bills", error);
        } finally {
            setLoading(false);
        }
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
    }, [status, pageNo]);

    const handleDelete = async (id) => {
        await deleteBillList(id);
        fetchBillList();
    };

    return (
        <Container maxWidth="lg" className="bg-white" style={{ marginTop: "15px" }}>
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

            <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#0071bd' }}>
                            {/* Table Columns */}
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
                        {billList.map((bill, index) => (
                            <TableRow key={bill.id}>
                                {/* Row Content */}
                                <TableCell>{index + 1 + (pageNo - 1) * pageSize}</TableCell>
                                <TableCell>{bill.code}</TableCell>
                                <TableCell>{bill.customer ? `${bill.customer.lastName} ${bill.customer.firstName}` : 'Khách hàng lẻ'}</TableCell>
                                <TableCell>{bill.customer?.phoneNumber || 'XXXXXXXXX'}</TableCell>
                                <TableCell>{formatCurrencyVND(bill.total)}</TableCell>
                                <TableCell>{statusMap[bill.billStatus] || 'N/A'}</TableCell>
                                <TableCell>{bill.createAt}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => navigate(`/bill/detail/${bill.id}`)} color='success'>
                                        <Edit />
                                    </IconButton>
                                    <MoeAlert
                                        title="Cảnh báo"
                                        message="Xóa hóa đơn này không?"
                                        event={() => handleDelete(bill.id)}
                                        button={
                                            <Tooltip title="Xóa vĩnh viễn" variant="plain">
                                                <IconButton
                                                    color="danger"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    />

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
