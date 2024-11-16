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
    CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { addPay, deleteBill, deleteCoupon, deleteProduct, fetchBill, fetchCoupon, fetchCustomer, fetchProduct, handleVerifyBanking, postBill, postCoupon, postCustomer, postProduct, putCustomer, reqPay } from '~/apis/billsApi';
import ProductListModal from '~/components/bill/ProductListModal';
import { formatCurrencyVND } from '~/utils/format';
import { ImageRotator } from '~/components/common/ImageRotator ';
import { FormControl, FormHelperText, FormLabel, Input, MenuItem, Option, Select, Switch } from '@mui/joy';
import CustomerList from '~/components/bill/CustomerList';
import DiscountIcon from '@mui/icons-material/Discount';
import CouponModal from '~/components/bill/CouponModal';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams, useParams} from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { fetchCustomerById } from '~/apis/customerApi';
import SvgIconDisplay from '~/components/other/SvgIconDisplay';
import VanChuyenNhanh from "~/assert/icon/van-chuyen-nhanh.svg";

function BillEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [bills, setBills] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isProductListModalOpen, setProductListModalOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isCouponModalOpen, setCouponModalOpen] = useState(false)
    const [orderData, setOrderData] = useState({});
    const [products, setProducts] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [customerAmount, setCustomerAmount] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [isDeliveryEnabled, setDeliveryEnabled] = useState(false);
    const [quantityTimeoutId, setQuantityTimeoutId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchParams] = useSearchParams();
    const [bankCode, setBankCode] = useState(null);
    const [loading, setLoading] = useState(false);

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const host = "https://provinces.open-api.vn/api/";

    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        city: '',
        district: '',
        ward: '',
        streetName: ''
    });

    const handleTabChange = (event, newValue) => {
        setActiveTabIndex(newValue);
        setLoading(true);

        setTimeout(() => {
            if (newValue === 0) {
                navigate('/bill');
            } else {
                navigate('/bill/list');
                localStorage.removeItem('selectedOrder');
                localStorage.removeItem('bankCode');
            }
            setLoading(false);
        }, 500);
    };

    //----------------------------------------------------------UseEffect--------------------------------------//
    useEffect(() => {
        handleSetBill();
    }, []);

    useEffect(() => {
        const storedSelectedOrder = localStorage.getItem('2');
        if (storedSelectedOrder) {
            const parsedOrderId = typeof storedSelectedOrder === 'string' ? parseInt(storedSelectedOrder, 10) : storedSelectedOrder;
            setSelectedOrder(parsedOrderId);
            handleSetBill(parsedOrderId);
        }
    }, []);

    useEffect(() => {
        if (selectedOrder) {
            handleSetProduct(selectedOrder);
            handleSetCoupon(selectedOrder);
            handleSetCustomer(selectedOrder);
        }
    }, [selectedOrder]);

    useEffect(() => {
        init();
    }, []);
    

    const init = () => {
        setBankCode(searchParams.get("vnp_BankTranNo"))
        localStorage.setItem("bankCode", searchParams.get("vnp_BankTranNo"))
        handleVerifyBanking(
            searchParams.get("vnp_TransactionStatus"),
            searchParams.get("vnp_BankTranNo"),
        )
        navigate("/bill");
    };

    //----------------------------------------------------------Bill--------------------------------------//
    const onSubmit = async () => {
        const billData = {
            billStatus: 1,
            userId: localStorage.getItem("userId"),
        };

        try {
            const response = await postBill(billData);
            if (response?.data) {
                const newOrderId = response.data.id;
                setSelectedOrder(newOrderId);
                localStorage.setItem('selectedOrder', newOrderId);
            }
            await handleSetBill();
        } catch (error) {
            console.error("Error in onSubmit:", error);
            toast.error("Có lỗi xảy ra khi tạo hóa đơn.");
        }
    };

    const handleSetBill = async (orderId = selectedOrder) => {
        try {
            const response = await fetchBill();
            if (response?.data) {
                const updatedBills = response.data.map(bill => ({
                    ...bill,
                    customerId: bill.customer ? bill.customer.id : null,
                }));

                setBills(updatedBills);

                if (orderId) {
                    const orderToSet = updatedBills.find(bill => bill.id === orderId);
                    setCurrentOrder(orderToSet || null);
                } else {
                    setCurrentOrder(updatedBills[0] || null);
                }
            }
        } catch (error) {
            console.error("Error fetching bills:", error);
        }
    };

    const deleteOrder = async (orderToDelete) => {
        await deleteBill(orderToDelete);
        setBills(prevBills => prevBills.filter(order => order.id !== orderToDelete));
        if (selectedOrder === orderToDelete) setSelectedOrder(null);
    };

    const selectOrder = (order) => {
        setSelectedOrder(order.id);
        setCurrentOrder(order);
        localStorage.setItem('selectedOrder', order.id.toString());
    };

    //----------------------------------------------------------Product--------------------------------------//
    let initialQuantity = {};

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
            discountAmount: pr.sellPrice || 0,
        };
        try {
            await postProduct(product);
            handleSetProduct(selectedOrder);
            initialQuantity[pr.id] = 1;
        } catch (error) {
            console.error('Failed to add product:', error);
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity === null || newQuantity === '') {
            setErrorMessage("Số lượng chưa nhập");
        } else {
            setErrorMessage("");
        }

        const productToUpdate = products.find(p => p.id === productId);
        if (!productToUpdate) return;

        const maxQuantity = productToUpdate.productDetail.quantity + 1;
        const updatedQuantity = newQuantity > maxQuantity ? maxQuantity : newQuantity;

        if (quantityTimeoutId) {
            clearTimeout(quantityTimeoutId);
        }

        if (initialQuantity[productId] === undefined) {
            initialQuantity[productId] = maxQuantity;
        }

        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId ? { ...product, quantity: updatedQuantity } : product
            )
        );

        const timeoutId = setTimeout(() => updateProductQuantity(productId, updatedQuantity), 1000);
        setQuantityTimeoutId(timeoutId);
    };

    const updateProductQuantity = async (productId, newQuantity) => {
        try {
            const productToUpdate = products.find(p => p.id === productId);
            if (!productToUpdate) return;

            const product = {
                productDetail: productToUpdate.productDetail.id,
                bill: selectedOrder,
                quantity: newQuantity,
                price: productToUpdate.productDetail.price,
                discountAmount: productToUpdate.discountAmount || 0,
            };

            await postProduct(product);
            initialQuantity[productId] = newQuantity;
        } catch (error) {
            console.error('Failed to update product quantity:', error);
        }
    };

    const handleSetProduct = async (orderId) => {
        const response = await fetchProduct(orderId);
        if (response?.data) {
            setProducts(response.data);
        }
    };

    const openProductListModal = (order) => {
        if (!selectedOrder) {
            console.log('No order selected, cannot open product modal.');
            return;
        }
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

    const closeProductListModal = () => setProductListModalOpen(false);

    //----------------------------------------------------------Customer--------------------------------------//   
    const onCustomer = async (customer) => {
        if (!selectedOrder) {
            console.error("No order selected, cannot add customer.");
            return;
        }

        const customerData = {
            bill: selectedOrder,
            customer: customer.id,
            customerId: orderData.customerId,
        };

        try {
            await postCustomer(customerData);
        } catch (error) {
            console.error("Failed to add customer:", error);
        }
    };

    const handleSetCustomer = async (orderId) => {
        const response = await fetchCustomer(orderId);
        if (response?.data) {
            setCustomers(response.data);
        }
        await handleSetBill();
    };

    const handleAddCustomer = (customer) => {
        setCustomerId(customer.id);
        onCustomer(customer);
    };

    //----------------------------------------------------------Coupon--------------------------------------//  
    const onCoupon = async (coupon) => {
        const couponData = {
            bill: localStorage.getItem('selectedOrder'),
            coupon: coupon.id
        };
        await postCoupon(couponData);
        await handleSetBill();
        await handleSetCoupon(selectedOrder);
    };

    const handleSetCoupon = async (orderId) => {
        if (!orderId) {
            return;
        }
        const response = await fetchCoupon(orderId);
        if (response?.data) {
            setCoupons(response.data);
        }
        await handleSetBill();
    };

    const handleRemoveCoupon = async () => {
        try {
            await deleteCoupon(selectedOrder);
            setOrderData(prevOrderData => ({
                ...prevOrderData,
                coupon: null
            }));
            setSelectedCoupon(null);
            await handleSetBill();
            await handleSetCoupon(selectedOrder);
        } catch (error) {
            console.error("Failed to remove coupon:", error);
        }
    };

    const openCouponModal = () => setCouponModalOpen(true);
    const closeCouponModal = () => setCouponModalOpen(false);

    //----------------------------------------------------------Tính toán--------------------------------------//  
    const handleCustomerAmountChange = (event) => {
        const value = parseFloat(event.target.value) || 0;
        setCustomerAmount(value);
    };

    const subtotal = products.reduce((total, product) => {
        return total + product.discountAmount * product.quantity;
    }, 0);

    const discountAmount = (() => {
        if (!currentOrder || !currentOrder.coupon) return 0;

        const { discountType, discountValue, conditions, maxValue } = currentOrder.coupon;
        if (subtotal < conditions) return 0;

        if (discountType === 'FIXED_AMOUNT') {
            return Math.min(discountValue, subtotal);
        } else if (discountType === 'PERCENTAGE') {
            const calculatedDiscount = (subtotal * discountValue) / 100;
            return Math.min(calculatedDiscount, maxValue);
        }

        return 0;
    })();

    const totalAfterDiscount = subtotal - discountAmount;
    const changeAmount = customerAmount > totalAfterDiscount ? customerAmount - totalAfterDiscount : 0;

    const shippingCost = isDeliveryEnabled && subtotal < 100000 ? 24000 : 0;

    //----------------------------------------------------------Them lan cuoi----------------------------------//
    const PaymentMethod = {
        CASH: 0,
        BANK: 1,
    };

    //----------------------------------------------------------Giao diện--------------------------------------//  

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} | ${hours}:${minutes}:${seconds}`;
    };

    const clearData = () => {
        setSelectedOrder(null);
        setCurrentOrder(null);
        setProducts([]);
        setCoupons([]);
        setCustomers([]);
        setCustomerAmount('');
        setSelectedCoupon(null);
        setSelectedPaymentMethod(null);
        setCustomerId(null);
        localStorage.removeItem('selectedOrder');
        window.scrollTo(0, 0);
    };

    const onPay = async () => {
        if (!currentOrder || products.length === 0) {
            toast.error("Không thể tạo hóa đơn, vui lòng chọn đơn hàng và thêm sản phẩm.");
            return;
        }

        const paymentMethodName = {
            [PaymentMethod.CASH]: "CASH",
            [PaymentMethod.BANK]: "BANK",
        }[selectedPaymentMethod] || "UNKNOWN";

        const billStoreRequest = {
            billRequest: {
                code: currentOrder.code,
                bankCode: bankCode,
                customer: currentOrder.customerId || null,
                coupon: currentOrder.coupon ? currentOrder.coupon.id : null,
                billStatus: 3,
                shipping: shippingCost,
                subtotal: subtotal,
                sellerDiscount: discountAmount,
                total: totalAfterDiscount,
                paymentMethod: paymentMethodName,
                message: null,
                note: null,
                paymentTime: formatDate(new Date()),
                userId: localStorage.getItem("userId"),
            },
            billDetails: products.map((product) => ({
                productDetail: product.productDetail.id,
                quantity: product.quantity,
                price: product.productDetail.price,
                discountAmount: product.discountAmount,
            })),
        };

        try {
            if (paymentMethodName === "BANK") {
                localStorage.setItem("temp_data", JSON.stringify(billStoreRequest));
                await reqPay(billStoreRequest, "&uri=bill");
                clearData();
                return;
            } else {
                await addPay(billStoreRequest);
                toast.success("Hóa đơn đã được tạo thành công!");
                clearData();
                await handleSetBill();
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            toast.error("Có lỗi xảy ra khi tạo hóa đơn.");
        }
    };

    //dia chi

    const handleToggleDelivery = () => {
        setDeliveryEnabled((prev) => !prev);
    };

    useEffect(() => {
        const fetchCities = async () => {
            const response = await axios.get(`${host}?depth=1`);
            setCities(response.data);
        };
        fetchCities();
    }, []);

    const handleCityChange = async (e) => {
        const provinceId = e;
        setSelectedCity(provinceId);
        setSelectedDistrict("");
        setSelectedWard("");
        if (provinceId) {
            const response = await axios.get(`${host}p/${provinceId}?depth=2`);
            setDistricts(response.data.districts);
        } else {
            setDistricts([]);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtId = e;
        setSelectedDistrict(districtId);
        setSelectedWard("");
        if (districtId) {
            const response = await axios.get(`${host}d/${districtId}?depth=2`);
            setWards(response.data.wards);
        } else {
            setWards([]);
        }
    };

    const handleWardChange = (e) => {
        setSelectedWard(e);
    };

    useEffect(() => {
        if (customerId) {
            fetchCustomerDetail();
        } else {
            setCustomerData(null);
        }
        handleSetBill();
    }, [customerId]);

    const fetchCustomerDetail = async () => {
        if (!customerId) {
            console.error("Customer ID is missing");
            return;
        }

        try {
            const response = await fetchCustomerById(customerId);
            const customerData = response.data;

            handleCityChange(customerData.city_id);
            handleDistrictChange(customerData.district_id)
            handleWardChange(customerData.ward)

            setCustomerData({
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                phoneNumber: customerData.phoneNumber,
                city: customerData.city,
                district: customerData.district,
                ward: customerData.ward,
                streetName: customerData.streetName
            });
        } catch (error) {
            console.error("Failed to fetch customer detail:", error);
        }
    };

    const updateCustomer = async (e) => {
        e.preventDefault();

        try {
            const cityName = cities.find((city) => city.code == selectedCity)?.name;
            const districtName = districts.find((district) => district.code == selectedDistrict)?.name;
            const wardName = wards.find((ward) => ward.name == selectedWard)?.name;

            const updatedCustomer = {
                ...customerData,
                city: cityName,
                city_id: selectedCity,
                district: districtName,
                district_id: selectedDistrict,
                ward: wardName,
                dateOfBirth: formatDate(customerData.dateOfBirth),
                updatedAt: new Date().toISOString(),
            };

            const response = await putCustomer(updatedCustomer, customerId);

            if (response && response.status === 200) {
                toast.success('Cập nhật thành công');
                navigate('/bill');
            } else {
                toast.error('Cập nhật không thành công, vui lòng thử lại.');
            }
        } catch (error) {
            console.error("Failed to update customer:", error);
            toast.error('Có lỗi xảy ra khi cập nhật thông tin khách hàng.');
        }
    };

    return (

        <Container maxWidth="max-Width" className="bg-white" style={{ height: "100%", marginTop: "15px" }}>
            {/* Bill */}
            <div>
                <div className="d-flex" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: 'bold', color: '#0071bd', textAlign: 'center' }}
                    >
                        QUẢN LÝ ĐƠN HÀNG
                    </Typography>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: 'medium', color: '#0071bd', textAlign: 'center' }}
                    >
                        {currentOrder ? currentOrder.code : 'Chưa chọn đơn hàng'}
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
                            value={activeTabIndex}
                            onChange={handleTabChange}
                            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Tạo mới" sx={{ fontWeight: 'bold' }} />
                            <Tab label="Danh sách hóa đơn" sx={{ fontWeight: 'bold' }} />
                        </Tabs>
                    </>
                )}

                {bills.length >= 5 && (
                    <Typography color="error" sx={{ mb: 1 }}>
                        Tối đa tạo 5 hóa đơn.
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    disabled={bills.length >= 5}
                    sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        background: bills.length < 5 ? 'linear-gradient(90deg, #4a90e2, #007AFF)' : 'gray',
                        '&:hover': {
                            background: bills.length < 5 ? 'linear-gradient(90deg, #3a70d2, #0068D8)' : 'gray'
                        }
                    }}
                >
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
                                marginBottom: '8px',
                                backgroundColor: selectedOrder === order.id ? '#e3f2fd' : 'white',
                                borderColor: selectedOrder === order.id ? 'primary.main' : 'secondary.main',
                                '&:hover': {
                                    backgroundColor: '#f0f4ff'
                                },
                                transition: 'background-color 0.3s ease'
                            }}
                        >
                            {order.code}
                            <span
                                onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                                style={{
                                    color: 'red',
                                    marginLeft: 8,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '4px',
                                    borderRadius: '50%',
                                    backgroundColor: '#fdd',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </span>
                        </Button>
                    ))}
                </Box>
            </div>

            {/* Product */}
            <div>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'end', mt: 3, justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => openProductListModal(bills.find(order => order.id === selectedOrder))}
                        disabled={!selectedOrder}
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
                                </Grid>
                                <Grid item xs={4} sm={2} md={2} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                                    <Input
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10) || '')}
                                        sx={{
                                            width: '80%',
                                            '& input': {
                                                textAlign: 'center',
                                            }
                                        }}
                                    />
                                    {errorMessage && (
                                        <Typography color="error" sx={{ marginTop: 1, fontSize: '0.875rem' }}>
                                            {errorMessage}
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid item xs={4} sm={2} md={2} display="flex" justifyContent="flex-end" alignItems="center">
                                    <Typography variant="body2" sx={{ mr: 1 }}>
                                        {product.discountAmount === product.productDetail.price ? (
                                            formatCurrencyVND(product.productDetail.price * product.quantity)
                                        ) : (
                                            <>
                                                <span style={{ textDecoration: "line-through", color: "gray", marginRight: 8 }}>
                                                    {formatCurrencyVND(product.productDetail.price * product.quantity)}
                                                </span>
                                                <span style={{ color: "red" }}>
                                                    {formatCurrencyVND(product.discountAmount * product.quantity)}
                                                </span>
                                            </>
                                        )}
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

            {/* Customer */}
            <div>
                <CustomerList
                    selectedOrder={selectedOrder}
                    onAddCustomer={handleAddCustomer}
                    customerId={customerId}
                    setCustomerId={setCustomerId}
                />
            </div>

            {/* Coupon and Tính toán */}
            <div>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5" fontWeight="bold" color="textPrimary">
                            Thông tin thanh toán
                        </Typography>

                        <Box display="flex" alignItems="center">
                            <Switch checked={isDeliveryEnabled} onChange={handleToggleDelivery} />
                            <Typography variant="body1">Giao hàng</Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <LocationOnIcon color="success" />
                            <Typography variant="body1" color="textSecondary">
                                Địa chỉ
                            </Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 2, backgroundColor: '#b0bec5' }} />

                    <Grid container spacing={4}>
                        {isDeliveryEnabled ? (
                            customerData ? (
                                <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                                    <Grid container spacing={2} ml={0}>
                                        <Grid container spacing={2} ml={0}>
                                            <Grid container spacing={2} mb={3} mt={0}>
                                                <Grid item xs={12} md={6} >
                                                    <FormControl required error={!customerData.lastName || !customerData.firstName}>
                                                        <FormLabel>Họ và tên</FormLabel>
                                                        <Input
                                                            value={`${customerData.lastName || ""} ${customerData.firstName || ""}`}
                                                            onChange={(e) => {
                                                                const [lastName, ...firstNameParts] = e.target.value.split(" ");
                                                                setCustomerData({
                                                                    ...customerData,
                                                                    lastName,
                                                                    firstName: firstNameParts.join(" "),
                                                                });
                                                            }}
                                                            variant="outlined"
                                                            size="md"
                                                        />
                                                        {!customerData.lastName || !customerData.firstName ? (
                                                            <FormHelperText>Họ và tên không được bỏ trống</FormHelperText>
                                                        ) : null}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <FormControl required error={!customerData.phoneNumber}>
                                                        <FormLabel>Số điện thoại</FormLabel>
                                                        <Input
                                                            value={customerData.phoneNumber || ""}
                                                            onChange={(e) =>
                                                                setCustomerData({
                                                                    ...customerData,
                                                                    phoneNumber: e.target.value,
                                                                })
                                                            }
                                                            variant="outlined"
                                                            size="md"
                                                        />
                                                        {!customerData.phoneNumber ? (
                                                            <FormHelperText>Số điện thoại không được bỏ trống</FormHelperText>
                                                        ) : null}
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>


                                        <Grid container spacing={2} mb={3}>
                                            <Grid item xs={12} md={4}>
                                                <FormControl required>
                                                    <FormLabel>Tỉnh/thành phố</FormLabel>
                                                    <Select
                                                        value={selectedCity}
                                                        onChange={(e, v) => handleCityChange(v)}
                                                        placeholder="Chọn thành phố"
                                                    >
                                                        <Option value="" disabled>
                                                            Chọn tỉnh thành
                                                        </Option>
                                                        {cities.map((city) => (
                                                            <Option key={city.code} value={city.code}>
                                                                {city.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <FormControl required>
                                                    <FormLabel>Quận/huyện</FormLabel>
                                                    <Select
                                                        value={selectedDistrict}
                                                        onChange={(e, v) => handleDistrictChange(v)}
                                                        placeholder="Chọn quận huyện"
                                                    >
                                                        <Option value="" disabled>
                                                            Chọn quận huyện
                                                        </Option>
                                                        {districts.map((district) => (
                                                            <Option key={district.code} value={district.code}>
                                                                {district.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <FormControl required>
                                                    <FormLabel>Xã/phường/thị trấn</FormLabel>
                                                    <Select
                                                        value={selectedWard}
                                                        onChange={(e, v) => handleWardChange(v)}
                                                        placeholder="Chọn phường xã"
                                                    >
                                                        <Option value="" disabled>
                                                            Chọn phường xã
                                                        </Option>
                                                        {wards.map((ward) => (
                                                            <Option key={ward.name} value={ward.name}>
                                                                {ward.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={2} mb={2}>
                                            <Grid item xs={12} md={6}>
                                                <FormControl required error={!customerData.streetName}>
                                                    <FormLabel>Địa chỉ cụ thể</FormLabel>
                                                    <Input
                                                        size="md"
                                                        value={customerData.streetName || ""}
                                                        onChange={(e) =>
                                                            setCustomerData({
                                                                ...customerData,
                                                                streetName: e.target.value,
                                                            })
                                                        }
                                                        variant="outlined"
                                                    />
                                                    {!customerData.streetName ? (
                                                        <FormHelperText>Địa chỉ cụ thể không được bỏ trống</FormHelperText>
                                                    ) : null}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <SvgIconDisplay
                                                    width={"100%"}
                                                    height={"90%"}
                                                    icon={VanChuyenNhanh}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent="center" mt={3}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={updateCustomer}
                                            sx={{ px: 4, py: 1.5 }}
                                        >
                                            Cập nhật thông tin
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid item xs={12} md={6}>
                                    <Box
                                        component="img"
                                        src="https://res.cloudinary.com/dp0odec5s/image/upload/v1729760620/c6gyppm7eef7cyo0vxzy.jpg"
                                        alt="No Delivery"
                                        sx={{
                                            width: '100%',
                                            borderRadius: '12px',
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
                                        }}
                                    />
                                </Grid>
                            )
                        ) : (
                            <Grid item xs={12} md={6}>
                                <Box
                                    component="img"
                                    src="https://res.cloudinary.com/dp0odec5s/image/upload/v1729760620/c6gyppm7eef7cyo0vxzy.jpg"
                                    alt="No Delivery"
                                    sx={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
                                    }}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 1 }}>
                                <Button
                                    startIcon={<DiscountIcon />}
                                    variant="outlined"
                                    onClick={openCouponModal}
                                    disabled={!selectedOrder}
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
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={6}><Typography variant="body2">Tạm tính:</Typography></Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography variant="body2">{formatCurrencyVND(subtotal)}</Typography></Grid>

                                <Grid item xs={6}><Typography variant="body2">Giảm giá:</Typography></Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography variant="body2">{formatCurrencyVND(discountAmount)}</Typography></Grid>
                            </Grid>

                            {coupons.map((coupon, index) => (
                                <Box key={index} sx={{ backgroundColor: '#e6f4ea', p: 1, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
                                    <Typography variant="body2" color="green">
                                        Áp dụng thành công phiếu giảm giá <strong>{coupon.name}</strong>
                                    </Typography>
                                    <Chip
                                        label={
                                            coupon.discountType === 'FIXED_AMOUNT'
                                                ? `Giảm ${formatCurrencyVND(coupon.discountValue)} đơn tối thiểu ${formatCurrencyVND(coupon.conditions)}`
                                                : `Giảm ${coupon.discountValue}% đơn tối thiểu ${formatCurrencyVND(coupon.conditions)}`
                                        }
                                        color="success"
                                        size="small"
                                    />
                                    <IconButton color="error" size="small" onClick={handleRemoveCoupon}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}

                            <Grid container spacing={0} sx={{ mb: 2, mt: 2 }}>
                                {isDeliveryEnabled && (
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
                                )}

                                <Grid item xs={6}>
                                    <Typography variant="h6">Tổng tiền:</Typography>
                                </Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                    <Typography variant="h6" color="error">
                                        {formatCurrencyVND(totalAfterDiscount + shippingCost)}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {selectedPaymentMethod === PaymentMethod.CASH && (
                                <TextField
                                    label="Tiền khách đưa"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    value={customerAmount}
                                    onChange={handleCustomerAmountChange}
                                />
                            )}

                            {selectedPaymentMethod === PaymentMethod.CASH && customerAmount < totalAfterDiscount && (
                                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                                    Vui lòng nhập đủ tiền khách đưa!
                                </Typography>
                            )}
                            {selectedPaymentMethod === PaymentMethod.CASH && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="body2">Tiền thừa:</Typography>
                                    <Typography fontWeight="bold" color="success.main">
                                        {changeAmount >= 0 ? formatCurrencyVND(changeAmount) : formatCurrencyVND(0)}
                                    </Typography>
                                </Box>
                            )}

                            <Divider sx={{ my: 2, backgroundColor: '#b0bec5' }} />

                            <Typography variant="body2" sx={{ mb: 1 }}>Chọn phương thức thanh toán:</Typography>
                            <Box display="flex" justifyContent="space-between" gap={2}>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: selectedPaymentMethod === PaymentMethod.CASH ? '#FFD700' : 'gray', color: 'black', flex: 1 }}
                                    startIcon={<LocalAtmIcon />}
                                    onClick={() => setSelectedPaymentMethod(PaymentMethod.CASH)}
                                >
                                    Tiền mặt
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: selectedPaymentMethod === PaymentMethod.BANK ? '#2196f3' : 'gray', color: 'white', flex: 1 }}
                                    startIcon={<CreditCardIcon />}
                                    onClick={() => setSelectedPaymentMethod(PaymentMethod.BANK)}
                                >
                                    Chuyển khoản
                                </Button>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onPay}
                                sx={{ mt: 3, width: '100%', fontWeight: 'bold' }}
                                disabled={selectedPaymentMethod === PaymentMethod.CASH && customerAmount < totalAfterDiscount}
                            >
                                Tạo hóa đơn
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </div>

        </Container >
    );
}

export default BillEdit;
