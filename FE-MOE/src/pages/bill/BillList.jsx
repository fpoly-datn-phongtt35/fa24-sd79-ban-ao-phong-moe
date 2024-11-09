import { Container, Tab, Tabs, Typography, CircularProgress, TableContainer, Table, TableCell, TableBody, TableRow, TableHead, Paper, Badge, Chip } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BillList() {
    const [tabIndex, setTabIndex] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const bills = [
        { id: 1, code: 'HD15030032', customer: 'Nguyễn Anh Dũng', phone: '0387880000', total: '238,501 đ', type: 'Giao hàng', date: '17:52:50 21/12/2023' },
        { id: 2, code: 'HD15030034', customer: 'Khách hàng lẻ', phone: '-', total: '423,000 đ', type: 'Tại quầy', date: '18:11:21 21/12/2023' },
        { id: 3, code: 'HD15030033', customer: 'Khách hàng lẻ', phone: '-', total: '400,000 đ', type: 'Tại quầy', date: '17:52:51 21/12/2023' },
        { id: 4, code: 'HD15030029', customer: 'Nguyễn Anh Dũng', phone: '0387880000', total: '691,301 đ', type: 'Giao hàng', date: '18:41:40 18/12/2023' },
    ];

    const tabs = [
        { label: 'Tất cả', count: 3 },
        { label: 'Chờ xác nhận', count: 3 },
        { label: 'Chờ giao', count: 4 },
        { label: 'Hoàn thành', count: 5 },
        { label: 'Đã hủy', count: 6 },
    ];

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        setLoading(true);
        setTimeout(() => {
            if (newValue === 2) {
                navigate('/bill/list');
            } else {
                navigate('/bill');
            }
            setLoading(false);
        }, 500);
    };

    return (
        <Container maxWidth="max-Width" className="bg-white" style={{ height: "100%", marginTop: "15px" }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: '#0071bd', textAlign: 'left' }}
                >
                    QUẢN LÝ DANH SÁCH HÓA ĐƠN
                </Typography>
            </div>



            {loading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1
                    }}
                >
                    <CircularProgress size={80} />
                </div>
            )}

            {!loading && (
                <>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="Tạo mới" sx={{ fontWeight: 'bold' }} />
                        <Tab label="Danh sách hóa đơn" sx={{ fontWeight: 'bold' }} />
                    </Tabs>
                </>
            )}

            <Tabs
                value={tabIndex}
                onChange={(event, newValue) => setTabIndex(newValue)}
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                variant="scrollable"
                scrollButtons="auto"
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        label={`${tab.label} (${tab.count})`}
                        sx={{ fontWeight: 'bold' }}
                        disableRipple
                    />
                ))}
            </Tabs>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Mã</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>SĐT</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Loại đơn hàng</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bills.map((bill, index) => (
                            <TableRow key={bill.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{bill.code}</TableCell>
                                <TableCell>{bill.customer}</TableCell>
                                <TableCell>{bill.phone}</TableCell>
                                <TableCell style={{ color: 'red' }}>{bill.total}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={bill.type}
                                        color={bill.type === 'Giao hàng' ? 'primary' : 'success'}
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            padding: '0 10px',
                                            color: bill.type === 'Giao hàng' ? '#007bff' : '#28a745',
                                            borderColor: bill.type === 'Giao hàng' ? '#007bff' : '#28a745',
                                            backgroundColor: bill.type === 'Giao hàng' ? '#e3f2fd' : '#e8f5e9',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{bill.date}</TableCell>
                                <TableCell>...</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Container>
    );
}
