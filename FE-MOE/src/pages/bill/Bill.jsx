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
    Dialog,
    Chip,
    Divider,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { deleteBill, deleteCoupon, deleteProduct, fetchBill, fetchProduct, postBill, postCoupon, postCustomer, postProduct } from '~/apis/billsApi';
import ProductListModal from '~/components/bill/ProductListModal';
import { formatCurrencyVND } from '~/utils/format';
import { ImageRotator } from '~/components/common/ImageRotator ';
import { Input } from '@mui/joy';
import CustomerList from '~/components/bill/CustomerList';
import DiscountIcon from '@mui/icons-material/Discount';
import CouponModal from '~/components/bill/CouponModal';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';

function Bill() {
    const [tabIndex, setTabIndex] = useState(0);
    const [bills, setBills] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isProductListModalOpen, setProductListModalOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isCouponModalOpen, setCouponModalOpen] = useState(false)
    const [orderData, setOrderData] = useState({});
    const [products, setProducts] = useState([]);
    const handleTabChange = (event, newValue) => setTabIndex(newValue);

    useEffect(() => {
        handleSetBill();
    }, []);

    useEffect(() => {
        if (selectedOrder) {
            handleSetProduct(selectedOrder);
        }
    }, [selectedOrder]);

    const handleQuantityChange = (productId, newQuantity) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId ? { ...product, quantity: newQuantity } : product
            )
        );
    };

    const handleSelectCoupon = async (coupon) => {
        try {
            const couponData = {
                bill: selectedOrder,
                coupon: coupon.id
            };
            await postCoupon(couponData);

            setOrderData(prevOrderData => ({
                ...prevOrderData,
                coupon: coupon
            }));
            setSelectedCoupon(coupon);
        } catch (error) {
            console.error("Failed to apply coupon:", error);
        }
        await handleSetBill();
    };

    const getCurrentOrderData = () => {
        return bills.find(order => order.id === selectedOrder) || {};
    };

    const onSubmit = async (data) => {
        const billData = {
            code: data.code,
            userId: localStorage.getItem("userId"),
        };

        const response = await postBill(billData);
        if (response?.data) {
            setSelectedOrder(response.data.id);
        }
        await handleSetBill();
    };

    const onProduct = async (pr) => {
        if (!selectedOrder) {
            console.error('No order selected. Order object:', selectedOrder);
            return;
        }

        const product = {
            productDetail: pr.id,
            bill: selectedOrder,
            quantity: 1,
            price: parseFloat(pr.price),
            discountAmount: 0,
        };

        try {
            await postProduct(product);
            handleSetProduct(selectedOrder);
        } catch (error) {
            console.error('Failed to add product:', error);
        }
    };

    const onCustomer = async (customer) => {
        const customerData = {
            bill: selectedOrder,
            customer: customer.id
        };

        try {
            await postCustomer(customerData);

        } catch (error) {
            console.error("Failed to add customer:", error);
        }
    };

    const handleSetBill = async () => {
        const response = await fetchBill();
        if (response?.data) {
            setBills(response.data);
        }
        console.log(response.data)
    };

    const handleSetProduct = async (orderId) => {
        const response = await fetchProduct(orderId);
        if (response?.data) {
            setProducts(response.data);
        }
        console.log(response.data)
    };

    const deleteOrder = async (orderToDelete) => {
        await deleteBill(orderToDelete);
        setBills(prevBills => prevBills.filter(order => order.id !== orderToDelete));
        if (selectedOrder === orderToDelete) setSelectedOrder(null);
    };

    const selectOrder = (order) => {
        setSelectedOrder(order.id);
    };

    const openProductListModal = (order) => {
        if (order) {
            setSelectedOrder(order.id);
            setProductListModalOpen(true);
        } else {
            console.log('No order selected.');
        }
    };

    const handleDeleteProduct = async (product) => {

        if (!product.id) {
            console.error('Invalid product or product ID');
            return;
        }

        await deleteProduct(product.id);
        handleSetProduct(selectedOrder);

    };

    const handleRemoveCoupon = async () => {
        try {
            await deleteCoupon(selectedOrder);
            setOrderData(prevOrderData => ({
                ...prevOrderData,
                coupon: null
            }));
            setSelectedCoupon(null);
            handleSetBill();
        } catch (error) {
            console.error("Failed to remove coupon:", error);
        }
    };

    const openCouponModal = () => setCouponModalOpen(true);
    const closeCouponModal = () => setCouponModalOpen(false);

    const closeProductListModal = () => setProductListModalOpen(false);

    return (
        <Container maxWidth="max-Width" className="bg-white" style={{ height: "100%", marginTop: "15px" }}>
            <div>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Quản lý đơn hàng
                </Typography>

                <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Tạo mới" sx={{ fontWeight: 'bold' }} />
                    <Tab label="Danh sách hóa đơn" sx={{ fontWeight: 'bold' }} />
                </Tabs>

                <Button variant="contained" color="primary" onClick={onSubmit} sx={{ mb: 2, fontWeight: 'bold' }}>
                    Tạo mới đơn hàng
                </Button>

                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
                    {bills.map((order, index) => (
                        <Button
                            key={index}
                            color={selectedOrder === order.id ? "primary" : "secondary"}
                            variant="outlined"
                            onClick={() => selectOrder(order)}
                            sx={{
                                borderRadius: '20px',
                                padding: '12px 32px',
                                marginBottom: '8px'
                            }}
                        >
                            {order.code}
                            <span
                                onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                                style={{ color: 'red', marginLeft: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                                <DeleteIcon fontSize="small" />
                            </span>
                        </Button>
                    ))}
                </Box>
            </div>
            <div>
                <Typography variant="h6" fontWeight="bold">
                    Đơn hàng {selectedOrder || 'Chưa chọn đơn hàng'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'end', mt: 3, justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => openProductListModal(bills.find(order => order.id === selectedOrder))}
                    >
                        Thêm sản phẩm
                    </Button>
                    <Button variant="contained" color="secondary" startIcon={<QrCodeIcon />}>
                        QR Code sản phẩm
                    </Button>
                </Box>


                <Dialog open={isProductListModalOpen} onClose={closeProductListModal} maxWidth="lg" fullWidth>
                    <ProductListModal
                        onAddProduct={onProduct}
                        onClose={closeProductListModal}
                        order={selectedOrder}
                    />
                </Dialog>

                <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 'bold', color: 'textSecondary' }}>Giỏ hàng</Typography>
                <List sx={{ mb: 3 }}>
                    {products.map((product, index) => (
                        <ListItem key={index} sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: 1,
                            mb: 2,
                            transition: '0.3s',
                            '&:hover': {
                                boxShadow: 3,
                                backgroundColor: '#f9f9f9'
                            }
                        }}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={4} sm={3} md={2}>
                                    {product.productDetail.imageUrl && Array.isArray(product.productDetail.imageUrl) && product.productDetail.imageUrl.length > 0 ? (
                                        <ImageRotator imageUrl={product.productDetail.imageUrl} w={100} h={110} />
                                    ) : (
                                        <Box sx={{ width: 90, height: 100, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography variant="body2">No Image</Typography>
                                        </Box>
                                    )}
                                </Grid>
                                <Grid item xs={4} sm={5} md={6}>
                                    <ListItemText
                                        primary={<Typography variant="h6" fontWeight="bold">{product.productDetail.productName}</Typography>}
                                    />
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Kích thước: {product.productDetail.size} - Màu sắc: {product.productDetail.color}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Xuất xứ: {product.productDetail.origin} - Vật liệu: {product.productDetail.material}
                                    </Typography>
                                    {product.discountAmount > 0 && (
                                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                            Giảm giá: {formatCurrencyVND(product.discountAmount)}
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={4} sm={2} md={2} display="flex" justifyContent="center">
                                    <Input
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10) || 0)}
                                        sx={{
                                            width: '80%',
                                            '& input': {
                                                textAlign: 'center',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4} sm={2} md={2} display="flex" justifyContent="flex-end" alignItems="center">
                                    <Typography variant="body2" sx={{ mr: 1 }}>
                                        {formatCurrencyVND(product.productDetail.price * product.quantity)}
                                    </Typography>
                                    <IconButton color="error" onClick={() => handleDeleteProduct(product)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>

                            </Grid>
                        </ListItem>
                    ))}
                </List>
            </div>
            <div>
                <CustomerList selectedOrder={selectedOrder} onAddCustomer={onCustomer} />
            </div>
            <div>
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
                        {/* coupon */}
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

                            <Grid container spacing={1}>
                                <Grid item xs={6}><Typography>Tạm tính:</Typography></Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography>470,000 đ</Typography></Grid>

                                <Grid item xs={6}><Typography>Giảm giá:</Typography></Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography>47,000 đ</Typography></Grid>
                            </Grid>

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

                            <Grid container spacing={1} sx={{ mb: 2 }}>
                                <Grid item xs={6}><Typography variant="h6">Tổng tiền:</Typography></Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography variant="h6" color="error">423,000 đ</Typography></Grid>
                            </Grid>


                            <TextField
                                label="Tiền khách đưa"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                                Vui lòng nhập đủ tiền khách đưa!
                            </Typography>


                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography>Tiền thừa:</Typography>
                                <Typography fontWeight="bold">0 đ</Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />


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

                            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Tạo hóa đơn
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </div>


        </Container >
    );
}

export default Bill;
