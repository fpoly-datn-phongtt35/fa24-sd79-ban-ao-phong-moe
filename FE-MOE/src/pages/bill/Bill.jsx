import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    Tab,
    Tabs,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField,
    Divider,
    Chip,
    Alert,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import DiscountIcon from '@mui/icons-material/Discount';
import SearchIcon from '@mui/icons-material/Search';
import ProductListModal from '~/components/bill/ProductListModal';
import { Input } from '@mui/joy';

function Bill() {
    const [tabIndex, setTabIndex] = useState(0);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showMaxOrderAlert, setShowMaxOrderAlert] = useState(false);
    const [isProductListModalOpen, setProductListModalOpen] = useState(false);

    const handleTabChange = (event, newValue) => setTabIndex(newValue);

    const createNewOrder = () => {
        if (orders.length >= 5) {
            setShowMaxOrderAlert(true);
            return;
        }
        const newOrder = `HD1503${Math.floor(1000 + Math.random() * 9000)}`;
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        setShowMaxOrderAlert(false);
    };

    const deleteOrder = (orderToDelete) => {
        setOrders(prevOrders => prevOrders.filter(order => order !== orderToDelete));
        if (selectedOrder === orderToDelete) setSelectedOrder(null);
    };

    const selectOrder = (order) => setSelectedOrder(order);

    const openProductListModal = () => setProductListModalOpen(true);
    const closeProductListModal = () => setProductListModalOpen(false);

    return (
        <Container maxWidth="max-width" className="bg-white" style={{ height: "100%", marginTop: "15px" }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Quản lý đơn hàng
            </Typography>

            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="Tạo mới" sx={{ fontWeight: 'bold' }} />
                <Tab label="Danh sách hóa đơn" sx={{ fontWeight: 'bold' }} />
            </Tabs>

            {showMaxOrderAlert && (
                <Alert severity="warning" sx={{ mb: 2 }}>Bạn đã đạt tối đa 5 đơn hàng.</Alert>
            )}

            <Button variant="contained" color="primary" onClick={createNewOrder} sx={{ mb: 2, fontWeight: 'bold' }}>
                Tạo mới đơn hàng
            </Button>

            {orders.map((order, index) => (
                <Box key={index} sx={{ position: 'relative', mb: 2 }}>
                    <Button
                        color={selectedOrder === order ? "primary" : "secondary"}
                        variant="outlined"
                        onClick={() => selectOrder(order)}
                        sx={{
                            borderRadius: '20px',
                            padding: '12px 32px',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            '&:hover': { backgroundColor: 'primary.light' },
                        }}
                    >
                        {order}
                        <span
                            onClick={(e) => { e.stopPropagation(); deleteOrder(order); }}
                            style={{ color: 'red', marginLeft: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <DeleteIcon fontSize="small" />
                        </span>
                    </Button>
                </Box>
            ))}

            {selectedOrder && (
                <>
                    {/* Thông tin giỏ hàng */}
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold">Đơn hàng {selectedOrder}</Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'end' }}>
                            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openProductListModal}>Thêm sản phẩm</Button>
                            <Button variant="contained" color="secondary" startIcon={<QrCodeIcon />}>QR Code sản phẩm</Button>
                        </Box>

                        {/* Product List Modal */}
                        <Dialog open={isProductListModalOpen} onClose={closeProductListModal} maxWidth="md" fullWidth>
                            <DialogTitle>Danh sách sản phẩm</DialogTitle>
                            <DialogContent>
                                <ProductListModal />
                            </DialogContent>
                        </Dialog>

                        <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 'bold', color: 'textSecondary' }}>Giỏ hàng</Typography>
                        <List>
                            <ListItem sx={{ backgroundColor: '#fafafa', borderRadius: '8px', mb: 2 }}>
                                <img src="https://via.placeholder.com/100x80?text=Product+Image" alt="Product" style={{ width: 100, height: 80, marginRight: 16, borderRadius: '8px' }} />
                                <ListItemText
                                    primary="Giày Asics Gel Kayano"
                                    secondary="Giá: 470,000 đ"
                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                />
                                <Input type="number" defaultValue={1}/>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>470,000 đ</Typography>
                                <IconButton color="error"><DeleteIcon /></IconButton>
                            </ListItem>
                        </List>
                    </Paper>

                    {/* Thông tin khách hàng */}
                    <Paper elevation={2} sx={{ padding: 2, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Thông tin khách hàng</Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="body1" fontWeight="bold">Tên khách hàng:</Typography>
                                <Typography variant="body2" color="textSecondary">Khách hàng lẻ</Typography>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center">
                                <TextField
                                    placeholder="Tìm kiếm khách hàng..."
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end"><SearchIcon /></InputAdornment>
                                        ),
                                    }}
                                />
                                <Button variant="contained" color="warning" startIcon={<AddIcon />}>Thêm mới KH</Button>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Thông tin thanh toán */}
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold" color="textPrimary">
                            Thông tin thanh toán
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={3}>
                            {/* Left Side: Product Image */}
                            <Grid item xs={12} md={4}>
                                <img
                                    src="https://via.placeholder.com/300x300?text=Product+Image"
                                    alt="Shoe"
                                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                                />
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Button variant="outlined" startIcon={<DiscountIcon />}>
                                        Phiếu giảm giá
                                    </Button>
                                    <Typography color="textSecondary">Chọn hoặc nhập mã</Typography>
                                </Box>

                                <Box sx={{ backgroundColor: '#e6f4ea', padding: 1.5, borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <Typography variant="body2" color="green" fontWeight="bold">
                                        Áp dụng thành công phiếu giảm giá Kim Chi
                                    </Typography>
                                    <Chip label="Giảm 10% đơn tối thiểu 100,000 đ" color="success" />
                                    <IconButton color="error" size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>

                                <Grid container spacing={1} sx={{ mb: 2 }}>
                                    <Grid item xs={6}><Typography>Tạm tính:</Typography></Grid>
                                    <Grid item xs={6}><Typography align="right">470,000 đ</Typography></Grid>

                                    <Grid item xs={6}><Typography>Giảm giá:</Typography></Grid>
                                    <Grid item xs={6}><Typography align="right">47,000 đ</Typography></Grid>

                                    <Grid item xs={6}><Typography variant="h6">Tổng tiền:</Typography></Grid>
                                    <Grid item xs={6}><Typography variant="h6" align="right" color="error">423,000 đ</Typography></Grid>
                                </Grid>

                                <TextField
                                    label="Tiền khách đưa"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ my: 3 }}
                                />
                                <Typography color="error">Vui lòng nhập đủ tiền khách đưa!</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                                    <Typography variant="body1">Tiền thừa: <span style={{ fontWeight: 'bold' }}>0 đ</span></Typography>
                                    <Button variant="outlined" color="primary">VNĐ</Button>
                                </Box>

                                <Divider sx={{ my: 3 }} />
                                <Typography variant="body2" sx={{ mb: 1 }}>Chọn phương thức thanh toán</Typography>
                                <Box display="flex" justifyContent="space-between">
                                    <Button variant="contained" color="warning" startIcon={<LocalAtmIcon />}>
                                        Tiền mặt
                                    </Button>
                                    <Button variant="contained" color="info" startIcon={<CreditCardIcon />}>
                                        Chuyển khoản
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </>
            )}
        </Container>
    );
}

export default Bill;
