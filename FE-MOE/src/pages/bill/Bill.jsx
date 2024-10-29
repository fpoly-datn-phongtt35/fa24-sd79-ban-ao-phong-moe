import React, { useState, useEffect } from 'react';
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
import { formatCurrencyVND } from '~/utils/format';
import { ImageRotator } from '~/components/common/ImageRotator ';
import CustomerList from '~/components/bill/CustomerList';
import CouponModal from '~/components/bill/CouponModal';

function Bill() {
    const [tabIndex, setTabIndex] = useState(0);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showMaxOrderAlert, setShowMaxOrderAlert] = useState(false);
    const [isProductListModalOpen, setProductListModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [orderData, setOrderData] = useState({});

    const handleTabChange = (event, newValue) => setTabIndex(newValue);

    const createNewOrder = () => {
        if (orders.length >= 5) {
            setShowMaxOrderAlert(true);
            return;
        }
        const newOrder = `HD1503${Math.floor(1000 + Math.random() * 9000)}`;
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        setShowMaxOrderAlert(false);
        setSelectedOrder(newOrder);
        setOrderData((prev) => ({ ...prev, [newOrder]: { products: [], coupon: null } }));
    };

    const deleteOrder = (orderToDelete) => {
        setOrders(prevOrders => prevOrders.filter(order => order !== orderToDelete));
        if (selectedOrder === orderToDelete) setSelectedOrder(null);
    };

    const selectOrder = (order) => {
        setSelectedOrder(order);
    };

    const openProductListModal = () => setProductListModalOpen(true);
    const closeProductListModal = () => setProductListModalOpen(false);

    const openCouponModal = () => setIsCouponModalOpen(true);
    const closeCouponModal = () => setIsCouponModalOpen(false);

    const handleAddProduct = (product) => {
        setOrderData(prevData => ({
            ...prevData,
            [selectedOrder]: {
                ...prevData[selectedOrder],
                products: [...(prevData[selectedOrder]?.products || []), product],
            },
        }));
    };

    const handleDeleteProduct = (productToDelete) => {
        setOrderData(prevData => ({
            ...prevData,
            [selectedOrder]: {
                ...prevData[selectedOrder],
                products: prevData[selectedOrder]?.products.filter(product => product !== productToDelete),
            },
        }));
    };

    const handleSelectCoupon = (coupon) => {
        setOrderData(prevData => ({
            ...prevData,
            [selectedOrder]: {
                ...prevData[selectedOrder],
                coupon,
            },
        }));
    };

    const handleRemoveCoupon = () => {
        setOrderData(prevData => ({
            ...prevData,
            [selectedOrder]: {
                ...prevData[selectedOrder],
                coupon: null,
            },
        }));
    };

    const getCurrentOrderData = () => orderData[selectedOrder] || { products: [], coupon: null};

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
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
                {orders.map((order, index) => (
                    <Button
                        key={index}
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
                            marginBottom: '8px'
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
                ))}
            </Box>

            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
                        <Box>
                            Đơn hàng {selectedOrder || 'Chưa chọn đơn hàng'}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => setProductListModalOpen(true)}
                            >
                                Thêm sản phẩm
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<QrCodeIcon />}
                            >
                                QR Code sản phẩm
                            </Button>
                        </Box>
                    </Box>
                </Typography>

                {/* ------------------------------- Product ----------------------------------- */}
                <Dialog open={isProductListModalOpen} onClose={closeProductListModal} maxWidth="maxWidth" fullWidth>
                    <ProductListModal
                        onAddProduct={handleAddProduct}
                    />
                </Dialog>

                <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 'bold', color: 'textSecondary' }}>Giỏ hàng</Typography>
                <List>
                    {getCurrentOrderData().products.map((product, index) => (
                        <ListItem key={index} sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={2}>
                                    <ImageRotator imageUrl={product.imageUrl} w={90} h={100} />
                                </Grid>
                                <Grid item xs={6}>
                                    <ListItemText
                                        primary={<Typography variant="h6" fontWeight="bold">{product.productName}</Typography>}
                                        secondary={<Typography variant="body2" color="textSecondary">Giá: {formatCurrencyVND(product.price)}</Typography>}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Input type="number" defaultValue={1} sx={{ width: '100', mr: 10 }} />
                                </Grid>
                                <Grid item xs={2} display="flex" alignItems="center" justifyContent="flex-end">
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main', marginRight: 1 }}>
                                        {formatCurrencyVND(product.price)}
                                    </Typography>
                                    <IconButton color="error" onClick={() => handleDeleteProduct(product)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>

                            </Grid>
                        </ListItem>
                    ))}
                </List>

            </Paper>

            {/* ------------------------------- Customer ----------------------------------- */}
            <CustomerList />
            {/* ------------------------------- Bill ----------------------------------- */}

            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="textPrimary">
                    Thông tin thanh toán
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <img
                            src="https://via.placeholder.com/300x300?text=Product+Image"
                            alt="Shoe"
                            style={{ maxWidth: '100%', borderRadius: '8px' }}
                        />
                    </Grid>
                    {/* ------------------------------- Coupon ----------------------------------- */}
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Button
                                startIcon={<DiscountIcon />}
                                variant="text"
                                onClick={openCouponModal}
                            >
                                Phiếu giảm giá
                            </Button>
                            <Typography variant="body2" color="textSecondary">
                                Chọn hoặc nhập mã &gt;
                            </Typography>
                        </Box>

                        <CouponModal
                            open={isCouponModalOpen}
                            onClose={closeCouponModal}
                            onSelectCoupon={handleSelectCoupon}
                        />



                        {/* ------------------------------- Thong tin hoa don ----------------------------------- */}
                        <Grid container spacing={1}>
                            <Grid item xs={6}><Typography>Tạm tính:</Typography></Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography>470,000 đ</Typography></Grid>

                            <Grid item xs={6}><Typography>Giảm giá:</Typography></Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography>47,000 đ</Typography></Grid>
                        </Grid>

                        {/* ------------------------------- Hien thi coupon ----------------------------------- */}
                        {getCurrentOrderData().coupon && (
                            <Box sx={{ backgroundColor: '#e6f4ea', p: 1, borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
                                <Typography variant="body2" color="green">
                                    Áp dụng thành công phiếu giảm giá <strong>{getCurrentOrderData().coupon.name}</strong>
                                </Typography>
                                <Chip
                                    label={
                                        getCurrentOrderData().coupon.discountType === 'FIXED_AMOUNT'
                                            ? `Giảm ${formatCurrencyVND(getCurrentOrderData().coupon.discountValue)} đơn tối thiểu ${formatCurrencyVND(getCurrentOrderData().coupon.conditions)}`
                                            : `Giảm ${getCurrentOrderData().coupon.discountValue}% đơn tối thiểu ${formatCurrencyVND(getCurrentOrderData().coupon.conditions)}`
                                    }
                                    color="success"
                                />
                                <IconButton color="error" size="small" onClick={handleRemoveCoupon}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )}

                        {/* Total Amount */}
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            <Grid item xs={6}><Typography variant="h6">Tổng tiền:</Typography></Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography variant="h6" color="error">423,000 đ</Typography></Grid>
                        </Grid>

                        {/* Customer Payment Input */}
                        <TextField
                            label="Tiền khách đưa"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                            Vui lòng nhập đủ tiền khách đưa!
                        </Typography>

                        {/* Change Due */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography>Tiền thừa:</Typography>
                            <Typography fontWeight="bold">0 đ</Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Payment Methods */}
                        <Typography variant="body2" sx={{ mb: 1 }}>Chọn phương thức thanh toán:</Typography>
                        <Box display="flex" justifyContent="space-between">
                            <Button variant="contained" sx={{ backgroundColor: '#FFD700', color: 'black' }} startIcon={<LocalAtmIcon />}>
                                Tiền mặt
                            </Button>
                            <Button variant="contained" sx={{ backgroundColor: '#2196f3', color: 'white' }} startIcon={<CreditCardIcon />}>
                                Chuyển khoản
                            </Button>
                            <Button variant="contained" sx={{ backgroundColor: '#424242', color: 'white' }} startIcon={<LocalAtmIcon />}>
                                Tiền mặt & Chuyển khoản
                            </Button>
                        </Box>

                        {/* Generate Invoice Button */}
                        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Tạo hóa đơn
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default Bill;
