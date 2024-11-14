import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Stepper, Container } from '@mui/joy';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import Step, { stepClasses } from '@mui/joy/Step';
import { getBillEdit } from '~/apis/billListApi';
import PrintIcon from '@mui/icons-material/Print';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, Grid, IconButton, Input, List, ListItem, ListItemText, Paper, Breadcrumbs, Link, Modal, TextField } from '@mui/material';
import { ImageRotator } from '~/components/common/ImageRotator ';
import { formatCurrencyVND } from '~/utils/format';
import ProductListModal from '~/components/bill/ProductListModal';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { addPay, addPayBillEdit, deleteProduct, fetchProduct, postProduct, putCustomer } from '~/apis/billsApi';
import CustomerEditModal from '~/components/bill/CustomerEditModal';
import { fetchCustomerById } from '~/apis/customerApi';
import { useNavigate } from 'react-router-dom';
import UpdateIcon from '@mui/icons-material/Update';

export default function BillEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [billData, setBillData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  //product
  const [isProductListModalOpen, setProductListModalOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantityTimeoutId, setQuantityTimeoutId] = useState(null);
  const [productList, setProductList] = useState(products);

  //customer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    city: "",
    district: "",
    ward: "",
    streetName: "",
  });

  //coupon
  const [coupon, setCoupon] = useState();

  //bill
  const [isModalOpenNote, setIsModalOpenNote] = useState(false);
  const [note, setNote] = useState("");

  //Hien thi du lieu edit
  useEffect(() => {
    fetchBillEdit();
  }, [id]);

  useEffect(() => {
    handleSetProduct();
  }, []);

  const fetchBillEdit = async () => {
    const bill = await getBillEdit(id);
    console.log(bill.data)
    setBillData(bill.data);
  };

  //Hien thi du lieu trang thai
  const statusMap = {
    '2': 'Chờ xác nhận',
    '4': 'Chờ giao',
    '3': 'Hoàn thành',
    '7': 'Đã hủy',
  };

  //----------------------------------------------Product-------------------------------------//
  useEffect(() => {
    setProductList(products);
  }, [products]);

  useEffect(() => {
    if (products !== productList) {
      onUpdateAndPay();
    }
  }, [productList, products]);

  let initialQuantity = {};

  const onProduct = async (pr) => {
    if (!id) {
      console.error('No order selected. Order object:', id);
      return;
    }
    const product = {
      productDetail: pr.id,
      bill: id,
      quantity: 1,
      price: parseFloat(pr.price),
      discountAmount: pr.sellPrice || 0,
    };
    try {
      await postProduct(product);
      handleSetProduct(id);
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
    fetchBillEdit();
    setQuantityTimeoutId(timeoutId);
  };

  const updateProductQuantity = async (productId, newQuantity) => {
    try {
      const productToUpdate = products.find(p => p.id === productId);
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
    } catch (error) {
      console.error('Failed to update product quantity:', error);
    }
  };

  const handleSetProduct = async () => {
    const billId = localStorage.getItem('billId');
    const response = await fetchProduct(billId);
    if (response?.data) {
      setProducts(response?.data);
    }
  };

  const openProductListModal = () => {
    const billId = localStorage.getItem('billId');
    if (!billId) {
      console.log('No order selected, cannot open product modal.');
      return;
    }
    if (billId) {
      setSelectedOrder(billId);
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

  //----------------------------------------------Customer-------------------------------------//
  const handleOpenModal = () => {
    if (billData && billData.length > 0) {
      const bd = billData[0];
      const customerId = bd?.customer?.id;

      if (customerId) {
        setCustomerData({
          firstName: bd?.customer?.firstName || "",
          lastName: bd?.customer?.lastName || "",
          phone: bd?.customer?.phoneNumber || "",
          email: bd?.customer?.user?.email || "",
          city: bd?.customer?.customerAddress?.city || "",
          district: bd?.customer?.customerAddress?.district || "",
          ward: bd?.customer?.customerAddress?.ward || "",
          streetName: bd?.customer?.customerAddress?.streetName || "",
        });
        setIsModalOpen(true);
        console.log(customerData);
      } else {
        console.error("Không tìm thấy thông tin khách hàng");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isCustomerAvailable = billData && billData.length > 0 && billData[0]?.customer?.id;
  //----------------------------------------------Coupon-------------------------------------//
  useEffect(() => {
    if (billData && billData.length > 0) {
      const coupon = getCouponFromBill(billData);
      if (coupon) {
        setCoupon(coupon);
      }
    }
  }, [billData]);

  const getCouponFromBill = (billData) => {
    if (billData && billData.length > 0) {
      const bill = billData[0];
      const coupon = bill.coupon;

      if (coupon) {
        const { id, code, name, discountValue, discountType, conditions, maxValue } = coupon;
        return { id, code, name, discountValue, discountType, conditions, maxValue };
      } else {
        return null;
      }
    }
    return null;
  };

  //----------------------------------------------Bill-------------------------------------//
  const openNoteModal = () => {
    setIsModalOpenNote(true);
  };

  const handleNoteCloseModal = () => {
    setIsModalOpenNote(false);
    onPay();
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const calculateAmounts = () => {
    const subtotal = products.reduce((total, product) => {
      return total + product.discountAmount * product.quantity;
    }, 0);

    const discountAmount = (() => {
      if (!coupon) return 0;
      const { discountType, discountValue, conditions, maxValue } = coupon;
      const billSubtotal = subtotal;
      if (billSubtotal < conditions) {

        return 0;
      }
      if (discountType === 'FIXED_AMOUNT') {
        const discount = Math.min(discountValue, billSubtotal);

        return discount;
      } else if (discountType === 'PERCENTAGE') {
        const calculatedDiscount = (billSubtotal * discountValue) / 100;
        const cappedDiscount = Math.min(calculatedDiscount, maxValue);

        return cappedDiscount;
      }

      return 0;
    })();


    const totalAfterDiscount = subtotal - discountAmount;
    const shippingCost = subtotal < 100000 ? 24000 : 0;
    const total = totalAfterDiscount + shippingCost;

    return {
      subtotal,
      discountAmount,
      totalAfterDiscount,
      shippingCost,
      total
    };
  };

  const onPay = async () => {
    const {
      subtotal,
      discountAmount,
      totalAfterDiscount,
      shippingCost,
      total
    } = calculateAmounts();

    if (!billData || products.length === 0) {
      console.log("Cannot create invoice. Please select an order and add products.");
      return;
    }

    const updatedBillData = billData[0];
    const updatedStatus = '3';

    const billStoreRequest = {
      billRequest: {
        code: updatedBillData.code || "",
        bankCode: updatedBillData.bankCode || "",
        customer: updatedBillData.customer?.id || "",
        coupon: updatedBillData.coupon?.id || "",
        billStatus: updatedStatus,
        shipping: shippingCost,
        subtotal: subtotal,
        sellerDiscount: updatedBillData.sellerDiscount || 0,
        total: total,
        paymentMethod: updatedBillData.paymentMethod || "",
        message: updatedBillData.message || "",
        note: note,
        paymentTime: updatedBillData.paymentTime || "",
        userId: localStorage.getItem("userId"),
      },
      billDetails: products.map((product) => ({
        productDetail: product.productDetail.id,
        quantity: product.quantity,
        price: product.productDetail.price,
        discountAmount: product.discountAmount || product.productDetail.price,
      })),
    };

    try {
      const response = await addPayBillEdit(billStoreRequest);
      console.log("Payment request:", billStoreRequest);
      fetchBillEdit();

    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const onUpdateAndPay = async () => {
    calculateAmounts();
    await onPay();
  };

  return (
    <Container maxWidth="max-Width" style={{ backgroundColor: '#c9dcdf', minHeight: '100vh', marginTop: '15px' }}>
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
            {billData?.map((bd) => (
              <Typography key={bd.code} sx={{ color: "text.white", cursor: "pointer" }}>
                Hóa đơn: {bd.code}
              </Typography>
            ))}
          </Breadcrumbs>
        </Grid>
      </div>

      {/* Order Status */}

      <div>
        <Box display="flex" flexDirection="column" alignItems="start">
          <Stepper
            size="lg"
            sx={{
              width: '100%',
              '--StepIndicator-size': '3rem',
              '--Step-connectorInset': '0px',
              [`& .${stepIndicatorClasses.root}`]: {
                borderWidth: 4,
              },
              [`& .${stepClasses.root}::after`]: {
                height: 4,
              },
              [`& .${stepClasses.completed}`]: {
                [`& .${stepIndicatorClasses.root}`]: {
                  borderColor: 'primary.300',
                  color: 'primary.300',
                },
                '&::after': {
                  bgcolor: 'primary.300',
                },
              },
              [`& .${stepClasses.active}`]: {
                [`& .${stepIndicatorClasses.root}`]: {
                  borderColor: 'currentColor',
                },
              },
              [`& .${stepClasses.disabled} *`]: {
                color: 'neutral.outlinedDisabledColor',
              },
            }}
          >
            <Step
              completed
              orientation="vertical"
              indicator={
                <StepIndicator variant="outlined" color="primary">
                  <ShoppingCartRoundedIcon />
                </StepIndicator>
              }
            />
            <Step
              orientation="vertical"
              completed
              indicator={
                <StepIndicator variant="outlined" color="primary">
                  <ContactsRoundedIcon />
                </StepIndicator>
              }
            />
            <Step
              orientation="vertical"
              completed
              indicator={
                <StepIndicator variant="outlined" color="primary">
                  <LocalShippingRoundedIcon />
                </StepIndicator>
              }
            />
            <Step
              orientation="vertical"
              active
              indicator={
                <StepIndicator variant="solid" color="primary">
                  <CreditCardRoundedIcon />
                </StepIndicator>
              }
            >
              <Typography
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 'lg',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px',
                }}
              >
                Payment and Billing
              </Typography>
            </Step>
            <Step
              orientation="vertical"
              disabled
              indicator={
                <StepIndicator variant="outlined" color="neutral">
                  <CheckCircleRoundedIcon />
                </StepIndicator>
              }
            />
          </Stepper>
        </Box>

        <Box display="flex" justifyContent="space-between" gap={2} marginTop="20px">
          <div>
            <Button variant="contained" color="error" style={{ marginRight: '8px' }}>
              Hủy
            </Button>
            <Button variant="contained" style={{ backgroundColor: '#0D47A1', color: 'white' }}>
              Giao hàng
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="error"
              startIcon={<PrintIcon />}
              style={{ marginRight: '8px' }}
            >
              In Hóa Đơn
            </Button>
            <Button variant="contained" style={{ backgroundColor: '#0D47A1', color: 'white' }}>
              Chi tiết
            </Button>
          </div>
        </Box>

      </div>

      {/* Thông tin đơn hàng */}

      <div>
        <hr />
        <Box mb={4}>
          <Typography level="h5" sx={{ color: 'red', fontWeight: 'bold' }}>THÔNG TIN ĐƠN HÀNG</Typography>
          {billData?.map((bd) => (
            <Box key={bd.id || bd.code} mt={2} sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
              <Box display="flex" justifyContent="space-between" gap={4}>
                {/* Cột bên trái */}
                <Box width="50%">
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="40%">Trạng thái:</Typography>
                    <Typography width="60%" sx={{ color: 'red', textAlign: 'right' }}>
                      {statusMap[bd?.status] || '#'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="40%">Mã đơn hàng:</Typography>
                    <Typography width="60%" sx={{ color: 'red', textAlign: 'right' }}>
                      {bd?.code || '#'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="40%">Loại đơn hàng:</Typography>
                    <Typography width="60%" sx={{ color: 'red', textAlign: 'right' }}>
                      {bd?.paymentMethod || '#'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography width="40%">Đợt giảm giá:</Typography>
                    <Typography width="60%" sx={{ color: 'red', textAlign: 'right' }}>
                      {100 - (bd.billDetails[0]?.productDetail?.percent ?? 0)}%
                    </Typography>
                  </Box>
                </Box>

                {/* Cột bên phải */}
                <Box width="50%">
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="50%">Phí vận chuyển:</Typography>
                    <Typography width="50%" sx={{ color: 'red', textAlign: 'right' }}>
                      {bd?.shipping || 'FREE'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="50%">Tổng tiền:</Typography>
                    <Typography width="50%" sx={{ color: 'red', textAlign: 'right' }}>
                      {formatCurrencyVND(bd?.subtotal || '')}
                    </Typography>
                  </Box>
                  {/* <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="50%">Phiếu giảm giá:</Typography>
                    <Typography width="50%" sx={{ color: 'red', textAlign: 'right' }}>
                      {bd?.coupon.code || ''}
                    </Typography>
                  </Box> */}
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="50%">Giảm giá:</Typography>
                    <Typography width="50%" sx={{ color: 'red', textAlign: 'right' }}>
                      - {formatCurrencyVND(bd?.sellerDiscount || '')}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography width="50%">Phải thanh toán:</Typography>
                    <Typography width="50%" sx={{ color: 'red', textAlign: 'right' }}>
                      {formatCurrencyVND(bd?.total || '')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </div>

      {/* Thông tin khách hàng */}

      <div>
        <hr />
        <Box mb={4}>
          {billData?.map((bd) => (
            <Box key={bd.id || bd.code}>
              {/* Tiêu đề và nút thay đổi thông tin*/}
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography level="h5" sx={{ color: 'red', fontWeight: 'bold' }}>
                  THÔNG TIN KHÁCH HÀNG
                </Typography>
                <Button
                  onClick={handleOpenModal}
                  variant="solid"
                  sx={{ backgroundColor: '#FFD700', color: 'black' }}
                  disabled={!isCustomerAvailable}
                >
                  Thay đổi thông tin
                </Button>
              </Box>

              {/* Chia 2 bên thông tin */}
              <Box display="flex" justifyContent="space-between" mt={2} gap={4}>
                {/* Cột bên trái */}
                <Box width="50%">
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="40%" >Tên khách hàng:</Typography>
                    <Typography width="60%" sx={{ color: 'red', textAlign: 'right' }}>
                      {bd?.customer?.lastName || '#'} {bd?.customer?.firstName || ''}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography width="40%">Số điện thoại:</Typography>
                    <Typography width="60%" sx={{ color: 'red', textAlign: 'right' }}>
                      {bd?.customer?.phoneNumber || '#'}
                    </Typography>
                  </Box>
                </Box>

                {/* Cột bên phải */}
                <Box width="50%">
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="40%">Email:</Typography>
                    <Typography width="60%" sx={{ color: 'red', textAlign: 'right' }}>
                      {bd?.customer?.user?.email || '#'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography width="40%">Địa chỉ:</Typography>
                    <Typography width="60%" sx={{ color: 'red', textAlign: 'right' }}>
                      {bd?.customer?.customerAddress?.streetName || '#'}-
                      {bd?.customer?.customerAddress?.ward || '#'}-
                      {bd?.customer?.customerAddress?.district || '#'}-
                      {bd?.customer?.customerAddress?.city || '#'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </div>

      <div>
        <CustomerEditModal
          open={isModalOpen}
          onClose={handleCloseModal}
          customerData={customerData}
          setCustomerData={setCustomerData}
          cities={cities}
          districts={districts}
          wards={wards}
          selectedCity={selectedCity}
          selectedDistrict={selectedDistrict}
          selectedWard={selectedWard}
          setCities={setCities}
          setDistricts={setDistricts}
          setWards={setWards}
          setSelectedCity={setSelectedCity}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedWard={setSelectedWard}
          customerId={billData?.[0]?.customer?.id}
          fetchCustomerById={fetchCustomerById}
          putCustomer={putCustomer}
          fetchBillEdit={fetchBillEdit}
        />
      </div>

      {/* Lịch sử thanh toán */}

      <div>
        <hr />
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography level="h5" sx={{ color: 'red', fontWeight: 'bold' }}>
            LỊCH SỬ THANH TOÁN
          </Typography>

          <Button
            variant="solid"
            sx={{ backgroundColor: '#FFD700' }}
            onClick={openNoteModal}
          >
            XÁC NHẬN THANH TOÁN
          </Button>
        </Box>
        <TableContainer component={Paper} style={{ marginTop: 16 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Số tiền</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Mã giao dịch</TableCell>
                <TableCell>Loại giao dịch</TableCell>
                <TableCell>Nhân viên xác nhận</TableCell>
                <TableCell>Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billData && billData.length > 0 ? (
                billData.map((bill, index) => (
                  <TableRow key={bill.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{formatCurrencyVND(bill.total)}</TableCell>
                    <TableCell>{bill.paymentTime}</TableCell>
                    <TableCell>{bill.code}</TableCell>
                    <TableCell>{bill.paymentMethod}</TableCell>
                    <TableCell>{`${bill?.employee?.last_name} ${bill?.employee?.first_name}`}</TableCell>
                    <TableCell>{bill.message || ""}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </div>

      <div>
        {isModalOpenNote && (
          <Modal open={isModalOpenNote} onClose={handleNoteCloseModal}>
            <Box
              sx={{
                padding: 2,
                backgroundColor: "white",
                borderRadius: 2,
                width: '400px',
                margin: 'auto',
              }}
            >
              <Typography variant="h6" sx={{ color: 'red' }}>Vui lòng nhập ghi chú trước khi xác nhận</Typography>

              <TextField
                fullWidth
                multiline
                value={note}
                onChange={handleNoteChange}
                label="Note"
                rows={4}
                inputProps={{
                  maxLength: 225,
                }}
                helperText={`${note.length}/225`}
                sx={{ marginTop: 1 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button onClick={() => setIsModalOpenNote(false)} variant="outlined">Cancel</Button>
                <Button
                  onClick={handleNoteCloseModal}
                  variant="contained"
                  sx={{ backgroundColor: '#FFD700', color: 'black' }}
                  disabled={note.length === 0 || note.length > 225}
                >
                  Xác nhận đơn hàng
                </Button>
              </Box>
            </Box>
          </Modal>
        )}
      </div>

      {/* Danh sách sản phẩm */}
      <div>
        <hr />
        <Typography variant="h5" style={{ color: 'red', fontWeight: 'bold' }}>THÔNG TIN SẢN PHẨM</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'end', mt: 3, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<UpdateIcon />}
            onClick={onUpdateAndPay}
          >
            Cập nhật sản phẩm
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openProductListModal}
            disabled={!id}
          >
            Thêm sản phẩm
          </Button>
        </Box>

        <Dialog open={isProductListModalOpen} onClose={closeProductListModal} maxWidth="lg" fullWidth>
          <ProductListModal
            onAddProduct={onProduct}
            onClose={closeProductListModal}
            order={id}
          />
        </Dialog>

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
                    primary={<Typography variant="h6" fontWeight="bold" color='danger'>{product.productDetail.productName}</Typography>}
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
                    onChange={(e) =>
                      handleQuantityChange(product.id, parseInt(e.target.value, 10) || '')}
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

    </Container >
  );
}
