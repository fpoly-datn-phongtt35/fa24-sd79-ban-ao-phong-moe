import { Divider, Input } from '@mui/joy';
import { Box, Button, Container, Dialog, Grid, IconButton, List, ListItem, ListItemText, Paper, Typography, Chip, Breadcrumbs, Link } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBillEdit } from '~/apis/billListApi';
import ProductListModal from '~/components/bill/ProductListModal';
import { ImageRotator } from '~/components/common/ImageRotator ';
import { formatCurrencyVND } from '~/utils/format';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DiscountIcon from '@mui/icons-material/Discount';

import { addPay, deleteCoupon, deleteProduct, fetchCoupon, fetchProduct, postCoupon, postProduct } from '~/apis/billsApi';
import CouponModal from '~/components/bill/CouponModal';
import { toast } from 'react-toastify';

export default function BillEdit() {
    //bill edit
    const navigate = useNavigate();
    const { id } = useParams();
    const [billData, setBillData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const billIdRef = useRef(null);
    const billId = billIdRef.current;

    //product
    const [isProductListModalOpen, setProductListModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [quantityTimeoutId, setQuantityTimeoutId] = useState(null);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [errorMessages, setErrorMessages] = useState({});

    //coupon
    const [isCouponModalOpen, setCouponModalOpen] = useState(false)
    const [coupons, setCoupons] = useState([]);
    const customerId = billData?.[0]?.customer?.id;
    const [orderData, setOrderData] = useState({});
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    // ---------------------- khai báo hóa đơn edit -------------------------------//
    useEffect(() => {
        fetchBillEdit();
        handleSetProduct();
    }, []);

    const fetchBillEdit = async () => {
        try {
            const bill = await getBillEdit(id);
            const fetchedBill = bill.data[0];

            setBillData(bill.data);
            billIdRef.current = fetchedBill.id;

            // Nếu không có sản phẩm trong bill, đặt lại các giá trị tính toán
            if (!fetchedBill.billDetails || fetchedBill.billDetails.length === 0) {
                setOrderData((prev) => ({
                    ...prev,
                    subtotal: 0,
                    discountAmount: 0,
                    totalAfterDiscount: 0,
                    shippingCost: 0,
                }));
            }
        } catch (error) {
            console.error("Error fetching bill:", error);
        }
    };

    // ---------------------- khai báo sản phẩm -------------------------------//
    let initialQuantity = {};
    const onProduct = async (pr) => {
        const product = {
            productDetail: pr.id,
            bill: id,
            quantity: 1,
            price: parseFloat(pr.price),
            discountAmount: pr.sellPrice || 0,
        };
        try {
            await postProduct(product);
            initialQuantity[pr.id] = 1;

            // Sau khi thêm sản phẩm thành công, cập nhật lại sản phẩm và hóa đơn
            await handleSetProduct();
            await fetchBillEdit();
        } catch (error) {
            console.error('Failed to add product:', error);
        }
    };

    const handleSetProduct = async () => {
        try {
            const response = await fetchProduct(id);
            if (response?.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        let newErrorMessages = { ...errorMessages };

        if (newQuantity < 0) {
            newErrorMessages[productId] = "Số lượng không được âm";
        } else if (newQuantity === 0 || newQuantity === '') {
            newErrorMessages[productId] = "Số lượng chưa nhập";
        } else {
            delete newErrorMessages[productId];
        }

        setErrorMessages(newErrorMessages);

        const sanitizedQuantity = newQuantity <= 0 ? 1 : newQuantity;

        const productToUpdate = products.find(
            (product) => product.productDetail.id === productId
        );

        if (!productToUpdate) return;

        const maxQuantity = productToUpdate.productDetail.quantity + 1;
        const updatedQuantity = sanitizedQuantity > maxQuantity ? maxQuantity : sanitizedQuantity;

        if (quantityTimeoutId) {
            clearTimeout(quantityTimeoutId);
        }

        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.productDetail.id === productId
                    ? { ...product, quantity: updatedQuantity }
                    : product
            )
        );

        const timeoutId = setTimeout(async () => {
            await updateProductQuantity(productId, updatedQuantity);
        }, 500);
        setQuantityTimeoutId(timeoutId);
    };

    const updateProductQuantity = async (productId, newQuantity) => {
        try {
            const productToUpdate = products.find(
                (product) => product.productDetail.id === productId
            );
            if (!productToUpdate) return;

            const product = {
                productDetail: productToUpdate.productDetail.id,
                bill: id,
                quantity: newQuantity,
                price: productToUpdate.productDetail.price,
                discountAmount: productToUpdate.discountAmount || 0,
            };

            await postProduct(product);
            initialQuantity[productId] = newQuantity;

            // Cập nhật lại sản phẩm và hóa đơn
            await handleSetProduct();
            await fetchBillEdit();
        } catch (error) {
            console.error('Failed to update product quantity:', error);
        }
    };

    const openProductListModal = (id) => {
        if (id) {
            setSelectedOrder(id);
            setProductListModalOpen(true);
        } else {
            console.log('No order selected.');
        }
    };

    const handleDeleteProduct = async (productDetailId) => {
        if (!billData || !billData[0]?.billDetails) {
            console.error("No bill data or product details available.");
            return;
        }

        const productToDelete = billData[0].billDetails.find(
            (detail) => detail.productDetail.id === productDetailId
        );

        if (!productToDelete) {
            console.error("Product not found in bill details.");
            return;
        }

        try {
            await deleteProduct(productToDelete.id);
            console.log("Product deleted successfully:", productToDelete.id);
            fetchBillEdit();
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    const closeProductListModal = () => setProductListModalOpen(false);

    // ---------------------- khai báo phiếu giảm giá -------------------------------//
    const onCoupon = async (coupon) => {
        const couponData = {
            bill: id,
            coupon: coupon.id,
        };
        await postCoupon(couponData);
        await handleSetCoupon(id);
        await fetchBillEdit();
    };

    const handleSetCoupon = async () => {
        const response = await fetchCoupon(billId);
        if (response?.data) {
            setCoupons(response.data);
        }
        console.log(response.data)
    };

    const handleRemoveCoupon = async () => {
        try {
            await deleteCoupon(id);
            setOrderData(prevOrderData => ({
                ...prevOrderData,
                coupon: null
            }));
            setSelectedCoupon(null);
            await fetchBillEdit();
            await handleSetCoupon(id);
        } catch (error) {
            console.error("Failed to remove coupon:", error);
        }
    };

    const openCouponModal = () => {
        handleSetCoupon(id);
        setCouponModalOpen(true);
    };

    const closeCouponModal = () => setCouponModalOpen(false);

    // ---------------------- khai báo tính toán -------------------------------//

    const calculateTotals = () => {
        if (!billData || !billData[0]) return { subtotal: 0, discountAmount: 0, totalAfterDiscount: 0, shippingCost: 0 };

        if (!billData || !billData[0]?.billDetails?.length) {
            return { subtotal: 0, discountAmount: 0, totalAfterDiscount: 0, shippingCost: 0 };
        }

        const currentBill = billData[0];
        const currentDetails = currentBill.billDetails || [];

        const subtotal = currentDetails.reduce((total, detail) => {
            return total + detail.discountAmount * detail.quantity;
        }, 0);

        const discountAmount = (() => {
            if (!currentBill.coupon) return 0;

            const { discountType, discountValue, conditions, maxValue } = currentBill.coupon;
            if (subtotal < (conditions || 0)) return 0;

            if (discountType === 'FIXED_AMOUNT') {
                return Math.min(discountValue, subtotal);
            } else if (discountType === 'PERCENTAGE') {
                const calculatedDiscount = (subtotal * discountValue) / 100;
                return Math.min(calculatedDiscount, maxValue || calculatedDiscount);
            }

            return 0;
        })();

        const totalAfterDiscount = subtotal - discountAmount;
        const shippingCost = subtotal < 100000 ? 24000 : 0;

        return { subtotal, discountAmount, totalAfterDiscount, shippingCost };
    };

    const { subtotal, discountAmount, totalAfterDiscount, shippingCost } = calculateTotals();

    // ---------------------- sửa hóa đơn -------------------------------//
    const onPay = async () => {
        if (!billData || !billData[0]?.billDetails?.length) {
            toast.error("Sản phẩm không được bỏ trống");
            return false; 
        }
    
        const currentBill = billData[0];
    
        const billStoreRequest = {
            billRequest: {
                code: currentBill.code || "",
                bankCode: currentBill.bankCode || "",
                customer: currentBill.customer?.id || "",
                coupon: currentBill.coupon?.id || "",
                billStatus: currentBill.status || "",
                shipping: shippingCost,
                subtotal,
                sellerDiscount: discountAmount,
                total: totalAfterDiscount + shippingCost,
                paymentMethod: currentBill.paymentMethod || "",
                message: currentBill.message || "",
                note: "",
                paymentTime: currentBill.paymentTime || "",
                userId: localStorage.getItem("userId"),
            },
            billDetails: currentBill.billDetails.map((billDetail) => ({
                productDetail: billDetail.productDetail.id,
                quantity: billDetail.quantity,
                price: billDetail.productDetail.price,
                discountAmount: billDetail.discountAmount,
            })),
        };
    
        try {       
            await addPay(billStoreRequest);
            await fetchBillEdit();
            console.log("billStoreRequest:", billStoreRequest);
            return true; 
        } catch (error) {
            console.error("Error processing payment:", error);
            return false; 
        }
    };

    return (
        <Container maxWidth="max-Width" style={{ backgroundColor: '#f7f8fa', minHeight: '100vh', marginTop: '15px' }}>

            <div>
                <Grid container spacing={2} alignItems="center" marginBottom={2} height={"50px"}>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
                        <Link
                            underline="hover"
                            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                            color="inherit"
                            onClick={() => navigate("/bill/list")}
                        >
                            Danh sách hóa đơn
                        </Link>
                        <Link
                            underline="hover"
                            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                            color="inherit"
                            onClick={() => navigate(`/bill/detail/${id}`)}
                        >
                            Chi tiết hóa đơn
                        </Link>
                        {billData?.map((bd) => (
                            <Typography key={bd.code} sx={{ color: "text.white", cursor: "pointer" }}>
                                Chi tiết sản phẩm: {bd.code}
                            </Typography>
                        ))}
                    </Breadcrumbs>
                </Grid>
            </div>

            {/* sản phẩm */}
            <div>
                <hr />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'end', mt: 3, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'end', mt: 3, justifyContent: 'space-between' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            THÔNG TIN SẢN PHẨM
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={openProductListModal}
                    >
                        Thêm sản phẩm
                    </Button>
                    <Dialog open={isProductListModalOpen} onClose={closeProductListModal} maxWidth="lg" fullWidth>
                        <ProductListModal
                            onAddProduct={onProduct}
                            onClose={closeProductListModal}
                            order={id}
                        />
                    </Dialog>

                </Box>

                <List sx={{ mb: 3 }}>
                    {billData?.map((bd) =>
                        [...bd.billDetails]
                            .sort((a, b) => a.productDetail.id - b.productDetail.id)
                            .map((detail) => (
                                <ListItem
                                    key={detail.productDetail.id}
                                    sx={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '8px',
                                        boxShadow: 1,
                                        mb: 2,
                                        transition: '0.3s',
                                        '&:hover': {
                                            boxShadow: 3,
                                            backgroundColor: '#f9f9f9',
                                        },
                                    }}
                                >
                                    <Grid container alignItems="center" spacing={2}>
                                        {/* Image Section */}
                                        <Grid item xs={4} sm={3} md={2}>
                                            {detail.productDetail?.imageUrl?.length > 0 ? (
                                                <ImageRotator
                                                    imageUrl={detail.productDetail.imageUrl}
                                                    w={100}
                                                    h={110}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        width: 90,
                                                        height: 100,
                                                        bgcolor: 'grey.300',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Typography variant="body2">No Image</Typography>
                                                </Box>
                                            )}
                                        </Grid>

                                        {/* Product Details */}
                                        <Grid item xs={4} sm={5} md={6}>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {detail.productDetail?.productName}
                                                    </Typography>
                                                }
                                            />
                                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                Kích thước: {detail.productDetail?.size} - Màu sắc: {detail.productDetail?.color}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                Xuất xứ: {detail.productDetail?.origin} - Vật liệu: {detail.productDetail?.material}
                                            </Typography>
                                        </Grid>

                                        {/* Quantity Input */}
                                        <Grid
                                            item
                                            xs={4}
                                            sm={2}
                                            md={2}
                                            display="flex"
                                            justifyContent="center"
                                            flexDirection="column"
                                            alignItems="center"
                                        >
                                            <Input
                                                type="number"
                                                value={
                                                    products.find((p) => p.productDetail.id === detail.productDetail.id)?.quantity || 1
                                                }
                                                onChange={(e) =>
                                                    handleQuantityChange(detail.productDetail?.id, parseInt(e.target.value, 10) || 1)
                                                }
                                                sx={{ width: '80%', '& input': { textAlign: 'center' } }}
                                            />
                                            {/* {errorMessages[detail.productDetail.id] && (
                                                <Typography color="error" sx={{ marginTop: 1, fontSize: '0.875rem' }}>
                                                    {errorMessages[detail.productDetail.id]}
                                                </Typography>
                                            )} */}
                                        </Grid>

                                        {/* Price and Delete Button */}
                                        <Grid item xs={4} sm={2} md={2} display="flex" justifyContent="flex-end" alignItems="center">
                                            <Typography variant="body2" sx={{ mr: 1 }}>
                                                {detail.discountAmount === detail.productDetail?.price ? (
                                                    formatCurrencyVND(detail.productDetail?.price * detail.quantity)
                                                ) : (
                                                    <>
                                                        <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: 8 }}>
                                                            {formatCurrencyVND(detail.productDetail?.price * detail.quantity)}
                                                        </span>
                                                        <span style={{ color: 'red' }}>
                                                            {formatCurrencyVND(detail.discountAmount * detail.quantity)}
                                                        </span>
                                                    </>
                                                )}
                                            </Typography>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteProduct(detail.productDetail.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            ))
                    )}
                </List>

            </div>

            {/* tính toán */}
            <div>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 1 }}>
                            <Button
                                startIcon={<DiscountIcon />}
                                variant="outlined"
                                onClick={openCouponModal}
                                disabled={!id}
                                sx={{ borderColor: '#4caf50', color: '#4caf50' }}
                            >
                                Phiếu giảm giá
                            </Button>
                            <Typography variant="body2" color="textSecondary">
                                Chọn mã giảm giá &gt;
                            </Typography>
                        </Box>

                        <CouponModal
                            open={isCouponModalOpen}
                            onClose={closeCouponModal}
                            onSelectCoupon={onCoupon}
                            customerId={customerId}
                            subtotal={subtotal}
                        >

                        </CouponModal>

                        <Grid container spacing={2}>
                            <Grid item xs={6}><Typography variant="body2">Tạm tính:</Typography></Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography variant="body2">{formatCurrencyVND(subtotal)}</Typography></Grid>

                            <Grid item xs={6}><Typography variant="body2">Giảm giá:</Typography></Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography variant="body2">{formatCurrencyVND(discountAmount)}</Typography></Grid>
                        </Grid>

                        {coupons.map((coupon) => (
                            <Box
                                key={coupon.id}
                                sx={{
                                    backgroundColor: "#e6f4ea",
                                    p: 1,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    my: 2,
                                }}
                            >
                                <Typography variant="body2" color="green">
                                    Áp dụng thành công phiếu giảm giá <strong>{coupon.name}</strong>
                                </Typography>
                                <Chip
                                    label={
                                        coupon.discountType === "FIXED_AMOUNT"
                                            ? `Giảm ${formatCurrencyVND(coupon.discountValue)} đơn tối thiểu ${formatCurrencyVND(
                                                coupon.conditions
                                            )}`
                                            : `Giảm ${coupon.discountValue}% đơn tối thiểu ${formatCurrencyVND(coupon.conditions)}`
                                    }
                                    color="success"
                                    size="small"
                                />
                                <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => handleRemoveCoupon(coupon.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}


                        <Grid container spacing={0} sx={{ mb: 2, mt: 2 }}>

                            <Grid container spacing={1} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <Typography variant="body2">Phí vận chuyển:</Typography>
                                </Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2">
                                        {formatCurrencyVND(shippingCost)}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="h6">Tổng tiền:</Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography variant="h6" color="error">
                                    {formatCurrencyVND(totalAfterDiscount + shippingCost)}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2, backgroundColor: '#b0bec5' }} />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {                             
                                const isSuccess = await onPay();
                                if (isSuccess) {
                                    navigate(`/bill/detail/${id}`, { state: { refresh: true } });
                                }
                            }}
                            sx={{ mt: 3, width: '100%', fontWeight: 'bold' }}
                        >
                            Sửa sản phẩm
                        </Button>

                    </Grid>
                </Paper>
            </div>
        </Container>
    )
}
