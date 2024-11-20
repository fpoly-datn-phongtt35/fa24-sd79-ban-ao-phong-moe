import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Input } from '@mui/joy';
import { addBillStatusDetail, addBillStatusDetailV2, getBillEdit, getBillStatusDetailsByBillId, getPreviousBillStatusId } from '~/apis/billListApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, Grid, List, ListItem, ListItemText, Paper, Breadcrumbs, Link, Modal, TextField, StepLabel, IconButton, Step, Stepper, StepConnector, Tooltip } from '@mui/material';
import { formatCurrencyVND } from '~/utils/format';
import { addPayBillEdit, deleteProduct, fetchBill, fetchCoupon, fetchProduct, postCoupon, postProduct, putCustomer } from '~/apis/billsApi';
import CustomerEditModal from '~/components/bill/CustomerEditModal';
import { fetchCustomerById } from '~/apis/customerApi';
import { useNavigate } from 'react-router-dom';
import UpdateIcon from '@mui/icons-material/Update';
import StatusModal from '~/components/bill/StatusModal';
import { toast } from "react-toastify";
import { ImageRotator } from '~/components/common/ImageRotator ';
import ProductListModal from '~/components/bill/ProductListModal';
import CouponModalBillEdit from '~/components/bill/CouponModalBillEdit';

import DiscountIcon from '@mui/icons-material/Discount';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import BookIcon from '@mui/icons-material/Book';
import UndoIcon from '@mui/icons-material/Undo';

import {
  LocalShippingRounded as LocalShippingRoundedIcon,
  ShoppingCartRounded as ShoppingCartRoundedIcon,
  ContactsRounded as ContactsRoundedIcon,
  CreditCardRounded as CreditCardRoundedIcon,
  CheckCircleRounded as CheckCircleRoundedIcon,
  Error as ErrorIcon,
  Cancel as CancelIcon,
  DoneAll as DoneAllIcon,
  HelpOutline as HelpOutlineIcon,
  ArrowForwardRounded as ArrowForwardRoundedIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';

import { jsPDF } from 'jspdf';
import html2canvas from "html2canvas";
import '../../styles/style.css';
import '../../styles/ship.css';
// import Roboto from "../../fonts/Roboto-Regular-normal.js";

export default function BillDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [billData, setBillData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [bill, setBill] = useState(null);

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

  //product
  const [isProductListModalOpen, setProductListModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quantityTimeoutId, setQuantityTimeoutId] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);

  //coupon
  const [isCouponModalOpen, setCouponModalOpen] = useState(false)
  const [coupons, setCoupons] = useState([]);
  const customerId = billData?.[0]?.customer?.id;

  //status
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState("");
  const [statusDetails, setStatusDetails] = useState([]);
  const [isShippingDisabled, setIsShippingDisabled] = useState(false);
  const [prevStatus, setPrevStatus] = useState(null);

  //bill
  const [isModalOpenNote, setIsModalOpenNote] = useState(false);
  const [billNote, setBillNote] = useState("");
  const [tempBillNote, setTempBillNote] = useState("");
  const [tempPaymentAmount, setTempPaymentAmount] = useState("");
  const [tempPaymentMethod, setTempPaymentMethod] = useState("");
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const checkNote = billData && billData.some(bill => bill.note);
  const checkNoteRef = useRef(null);
  const noteRef = checkNoteRef.current;

  const statusDone = billData && billData.some(bill => bill.status);
  const statusRef = useRef(null);
  const statuses = statusRef.current;

  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);

  useEffect(() => {
    fetchBillEdit();
    fetchBillStatusDetails();
    handleSetProduct();
    handleSetCoupon();
    // fetchPreviousStatus();
  }, []);

  const fetchBillEdit = async () => {
    try {
      const bill = await getBillEdit(id);
      setBillData(bill.data);

      if (bill.data?.[0]) {
        setTempPaymentMethod(bill.data[0].paymentMethod || "");
        statusRef.current = bill.data[0].status;
        checkNoteRef.current = bill.data[0].note;
      }
    } catch (error) {
      console.error("Error fetching bill:", error);
    }
  };

  //Hien thi du lieu trang thai
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

  const statusColors = {
    '0': '#B0BEC5',  // Màu xám nhẹ (Đã tạo hóa đơn)
    '1': '#007bff',  // Xanh dương (Đang chờ xử lý)
    '2': '#FF9800',  // Cam (Chờ xác nhận)
    '3': '#4CAF50',  // Xanh lá (Đã xác nhận)
    '4': '#1E88E5',  // Xanh dương đậm (Chờ giao)
    '5': '#43A047',  // Xanh lá đậm (Đã giao thành công)
    '6': '#E53935',  // Đỏ (Giao hàng thất bại)
    '7': '#F44336',  // Đỏ tươi (Đã hủy)
    '8': '#9C27B0',  // Tím (Đơn hàng hoàn tất)
    '9': '#FF5722',  // Cam đậm (Khác)
  };

  const statusIcons = {
    '0': <ShoppingCartRoundedIcon />,
    '1': <ShoppingCartRoundedIcon />,//LocalShippingRoundedIcon
    '2': <CheckCircleRoundedIcon />,
    '3': <AttachMoneyIcon />,
    '4': <LocalShippingRoundedIcon />,
    '5': <LocalShippingRoundedIcon />, //DoneAllIcon
    '6': <ErrorIcon />,
    '7': <CancelIcon />,
    '8': <DoneAllIcon />,
    '9': <HelpOutlineIcon />,
  };

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

  //----------------------------------------------Product-------------------------------------//
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
    } catch (error) {
      console.error('Failed to add product:', error);
    }
    fetchBillEdit();
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
    // Kiểm tra số lượng hợp lệ, nếu không đặt mặc định là 1
    const sanitizedQuantity = newQuantity === 0 || newQuantity === '' ? 1 : newQuantity;

    if (sanitizedQuantity === 1) {
      setErrorMessage(""); // Xóa thông báo lỗi nếu số lượng hợp lệ
    } else if (newQuantity === 0 || newQuantity === '') {
      setErrorMessage("Số lượng chưa nhập");
    }

    const productToUpdate = products.find(
      (product) => product.productDetail.id === productId
    );

    if (!productToUpdate) return;

    const maxQuantity = productToUpdate.productDetail.quantity + 1;
    const updatedQuantity = sanitizedQuantity > maxQuantity ? maxQuantity : sanitizedQuantity;

    // Hủy timeout cũ nếu có
    if (quantityTimeoutId) {
      clearTimeout(quantityTimeoutId);
    }

    // Cập nhật danh sách sản phẩm
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productDetail.id === productId
          ? { ...product, quantity: updatedQuantity }
          : product
      )
    );

    // Tạo timeout mới để cập nhật số lượng
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
    } catch (error) {
      console.error('Failed to update product quantity:', error);
    }
    fetchBillEdit();
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

  //----------------------------------------------------------Coupon--------------------------------------//  

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
    try {
      const response = await fetchCoupon(id || localStorage.getItem("billId"));
      if (response?.data) {
        setCoupons(response.data);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const subtotal = billData?.[0]?.billDetails?.reduce((total, billDetail) => {
    return total + (billDetail.discountAmount * billDetail.quantity);
  }, 0) || 0;

  const openCouponModal = () => {
    handleSetCoupon(id);
    setCouponModalOpen(true);
  };

  const closeCouponModal = () => setCouponModalOpen(false);

  //----------------------------------------------Status-------------------------------------//
  useEffect(() => {
    if (prevStatus !== 1) {
      fetchPreviousStatus();
    }
  }, [prevStatus]);

  const fetchBillStatusDetails = async () => {
    try {
      const statusData = await getBillStatusDetailsByBillId(id);
      setStatusDetails(statusData.data);

    } catch (error) {
      console.error("Error fetching bill status details:", error);
      setErrorMessage("Failed to fetch bill status details");
    }
  };

  const fetchPreviousStatus = async () => {
    try {
      const response = await getPreviousBillStatusId(id);

      if (response?.data) {
        const previousStatus = response.data;
        setPrevStatus(previousStatus);
        if (previousStatus === 1) {
          toast.info("Không còn trạng thái nào.");
        }
      } else {
      }
    } catch (error) {
      console.error("Error fetching previous status ID:", error);
    }
  };

  const handleStatusConfirm = (status, customNote) => {
    // Kiểm tra nếu trạng thái là 8 (hoàn tất) hoặc 5 (đang xử lý) mà chưa có ghi chú
    if ((status === 8 || status === 5) && (!noteRef || noteRef.trim() === "")) {
      toast.error("Chưa xác nhận thanh toán đơn hàng.");
      return;
    }

    // Kiểm tra nếu trạng thái là 7 (đã hủy)
    if (status === 7) {
      toast.error("Đơn hàng đã bị hủy.");
      return;
    }

    // Kiểm tra logic giao hàng và thanh toán trước khi hoàn tất (nếu cần)
    if (billData[0]?.status === 2 && status === '8') {
      toast.error("Phải giao hàng và xác nhận thanh toán trước khi hoàn tất đơn hàng.");
      return;
    }

    const userId = localStorage.getItem("userId") || null;
    onPay(tempBillNote, status, customNote, userId);
    updateBillStatusDetail(status, customNote, userId);
    fetchBillStatusDetails();
  };

  const updateBillStatusDetail = async (status, customNote, userId) => {
    if (billData[0]?.status === 2 && status === '8') {
      toast.error("Phải giao hàng và xác nhận thanh toán trước khi hoàn tất đơn hàng.");
      return false; // Indicate failure here
    }

    const statusDetail = {
      bill: billData[0].id,
      billStatus: status,
      note: customNote || '',
      userId: userId,
    };

    try {
      await addBillStatusDetail(statusDetail);
      fetchBillEdit();
      fetchBillStatusDetails();
      console.log("Status and note saved:", statusDetail);
      return true; // Indicate success here
    } catch (error) {
      console.error("Error updating status:", error);
      return false; // Indicate failure here
    }

  };

  const handleRestorePreviousStatus = async () => {
    const customNote = prompt("Vui lòng nhập ghi chú cho việc khôi phục trạng thái:");

    if (!customNote || customNote.trim() === "") {
      toast.error("Ghi chú không được để trống.");
      return;
    }

    const userId = localStorage.getItem("userId");

    const updateSuccess = await updateBillStatusDetail(prevStatus, customNote, userId);

    if (updateSuccess) {
      onPay("", prevStatus, customNote, userId);
      setPrevStatus(null);
      fetchBillEdit();
      fetchBillStatusDetails();
    } else {
      return;
    }
  };


  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
  };

  //----------------------------------------------Bill-------------------------------------//

  const openNoteModal = () => {
    fetchBillEdit(id);
    setIsModalOpenNote(true);
    setTempBillNote(billData[0]?.note || "");
    setTempPaymentAmount(billData[0]?.total);
    setTempPaymentMethod(billData[0]?.paymentMethod || "");
  };

  const handleNoteCloseModal = () => {
    if (statuses === 7) {
      toast.error("Hóa đơn đã bị hủy. Không thể xác nhận thanh toán.");
      return;
    }

    setIsModalOpenNote(false);
    setBillNote(tempBillNote);
    setIsPaymentConfirmed(true);

    const userId = localStorage.getItem("userId");

    updateBillStatusDetail("3", tempBillNote, userId);
    onPay(tempBillNote, "3", tempBillNote, userId);
    fetchBillEdit();
    fetchBillStatusDetails();
  };

  const handleNoteChange = (event) => {
    setTempBillNote(event.target.value);
  };

  const onPay = async (billNote, status, statusNote, userId) => {
    if (!billData || billData[0]?.billDetails?.length === 0) {
      console.log("Cannot create invoice. Please select an order and add products.");
      return;
    }

    const updatedBillData = billData[0];

    // -------------------------------------- Calculations --------------------------------------
    const subtotal = updatedBillData.billDetails.reduce((total, billDetail) => {
      return total + billDetail.discountAmount * billDetail.quantity;
    }, 0);

    const couponDetails = updatedBillData.coupon || null;

    const discountAmount = (() => {
      if (!couponDetails) return 0;

      const { discountType, discountValue, conditions, maxValue } = couponDetails;

      if (subtotal < conditions) return 0;

      if (discountType === "FIXED_AMOUNT") {
        return Math.min(discountValue, subtotal);
      } else if (discountType === "PERCENTAGE") {
        const calculatedDiscount = (subtotal * discountValue) / 100;
        return Math.min(calculatedDiscount, maxValue);
      }

      return 0;
    })();

    const totalAfterDiscount = subtotal - discountAmount;

    const shippingCost = updatedBillData.shippingCost || 0;

    // -------------------------------------- Bill Request --------------------------------------
    const billStoreRequest = {
      billRequest: {
        code: updatedBillData.code || "",
        bankCode: updatedBillData.bankCode || "",
        customer: updatedBillData.customer?.id || "",
        coupon: updatedBillData.coupon?.id || "",
        billStatus: status || updatedBillData.status || "",
        shipping: shippingCost,
        subtotal,
        sellerDiscount: discountAmount || 0,
        total: totalAfterDiscount + shippingCost,
        paymentMethod: updatedBillData.paymentMethod || "",
        message: updatedBillData.message || "",
        note: (billNote === "" || billNote === null) ? "" : billNote || updatedBillData.note || "",
        paymentTime: updatedBillData.paymentTime || "",
        userId: userId || updatedBillData.userId,
      },
      billDetails: updatedBillData.billDetails.map((billDetail) => ({
        productDetail: billDetail.productDetail.id,
        quantity: billDetail.quantity,
        price: billDetail.productDetail.price,
        discountAmount: billDetail.discountAmount,
      })),
    };

    // -------------------------------------- Submit Request -------------------------------------
    try {
      await addPayBillEdit(billStoreRequest);
      console.log("billStoreRequest:", billStoreRequest);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
    fetchBillEdit();
  };

  const handUpdateBill = async () => {
    const updatedBill = {
      billNote: "",
      status: null,
      statusNote: "",
      userId: localStorage.getItem("userId"),
    };
    await onPay(updatedBill.billNote, updatedBill.status, updatedBill.statusNote, updatedBill.userId);
  };

  //----------------------------------------------Xuất hóa đơn-------------------------------------//

  const handlePrintInvoice = () => {
    const invoiceContent = document.getElementById("invoice-content");
  
    if (invoiceContent) {
      // Make the invoice content visible for printing
      invoiceContent.style.display = 'block';
  
      // Print directly using the browser's print dialog
      const originalContent = document.body.innerHTML; // Save the current page content
      document.body.innerHTML = invoiceContent.outerHTML; // Replace with the invoice content
  
      window.print(); // Open the print dialog
  
      document.body.innerHTML = originalContent; // Restore the original page content
      window.location.reload(); // Optional: Refresh the page to reapply JavaScript functionality
    }
  };
  
  const handlePrintInvoiceShip = () => {
    const shippingInvoice = document.getElementById("shipping-invoice");
  
    if (shippingInvoice) {
      // Make the invoice content visible for printing
      shippingInvoice.style.display = 'block';
  
      const originalContent = document.body.innerHTML; // Save the current page content
      document.body.innerHTML = shippingInvoice.outerHTML; // Replace with the shipping invoice content
  
      window.print(); // Open the print dialog
  
      document.body.innerHTML = originalContent; // Restore the original page content
      window.location.reload(); // Optional: Refresh the page to reapply JavaScript functionality
    }
  };
  

  return (
    <Container maxWidth="max-Width" style={{ backgroundColor: '#f7f8fa', minHeight: '100vh', marginTop: '15px' }}>

      {/* ------------------Chuyển trang------------------ */}

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

      {/* ------------------Status------------------ */}

      <div>
        <Box sx={{ width: '100%', mt: 2 }}>
          <Box
            sx={{
              width: '100%',
              px: 3,
              py: 2,
              background: '#f7f8fa',
              borderRadius: 2,
              overflowX: 'auto', // Thanh cuộn ngang
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                minWidth: '100%',
              }}
            >
              {statusDetails.map((status, index) => {
                const statusCode = status.billStatus;
                const isLast = index === statusDetails.length - 1;
                const statusColor = statusColors[statusCode] || '#a6a6a6';
                const statusIcon = statusIcons[statusCode] || <HelpOutlineIcon />;

                return (
                  <React.Fragment key={index}>
                    {/* Icon và Label */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        flexShrink: 0,
                        mx: 1.5, // Thu hẹp khoảng cách
                      }}
                    >
                      <Tooltip title={statusMap[statusCode]} arrow>
                        <Box
                          sx={{
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40, // Giảm kích thước icon
                            height: 40,
                            borderRadius: '50%',
                            border: `3px solid ${statusColor}`,
                            background: `linear-gradient(135deg, ${statusColor}, #f9f9f9)`,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              boxShadow: `0 4px 12px ${statusColor}`,
                            },
                          }}
                        >
                          {statusIcon}
                        </Box>
                      </Tooltip>
                      <Box
                        sx={{
                          width: 2,
                          height: 16,
                          background: statusColor,
                          mt: 0.5,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: statusColor,
                          mt: 0.5,
                          fontWeight: 600,
                          textAlign: 'center',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        {statusMap[statusCode]}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '10px',
                          textAlign: 'center', // Căn giữa nếu cần
                        }}
                      >
                        {status.createAt}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '10px',
                          marginTop: '5px',
                          minHeight: '14px', // Đặt chiều cao tối thiểu để đồng nhất
                          textAlign: 'center',
                          display: 'block',
                        }}
                      >
                        {status.note || '\u00A0'} {/* Hiển thị khoảng trắng nếu không có note */}
                      </Typography>

                    </Box>

                    {/* Thanh trạng thái với gradient */}
                    {!isLast && (
                      <Box
                        sx={{
                          mx: 1,
                          flexShrink: 0,
                          width: '20px',
                          minWidth: '20px',
                          flexGrow: 1,
                          height: 6,
                          background: `linear-gradient(90deg, ${statusColor} 0%, #f1f1f1 100%)`,
                          borderRadius: 3,
                          boxShadow: `inset 0 1px 3px rgba(0, 0, 0, 0.1)`,
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </Box>
          </Box>
        </Box>


        <Box display="flex" justifyContent="space-between" gap={2} marginTop="20px">
          <div>
            {(statuses !== 5 && statuses !== 8 && statuses !== 7) && (
              <Button variant="contained" color="error" style={{ marginRight: '8px' }}>
                Hủy
              </Button>
            )}

            {(statuses !== 8 && statuses !== 7) && (
              <Button
                variant="contained"
                style={{ backgroundColor: '#0D47A1', color: 'white' }}
                disabled={isShippingDisabled}
                onClick={() => setIsStatusModalOpen(true)}
              >
                {statuses === 5 ? "Hoàn thành" : "Giao hàng"}
              </Button>
            )}
          </div>

          <div>
            <Button
              variant="outlined"
              color="warning"
              style={{ marginRight: '8px' }}
              onClick={handleRestorePreviousStatus}
              hidden={statuses === 2 || statuses === 8 || statuses === 7}
            >
              <UndoIcon />
            </Button>

            {statuses === 5 ? (
              <Button
                variant="outlined"
                color="error"
                style={{ marginRight: '8px' }}
                onClick={handlePrintInvoiceShip}
              >
                <PrintIcon />
              </Button>
            ) : (
              (statuses !== 1 && statuses !== 2) && (
                <Button
                  variant="outlined"
                  color="error"
                  style={{ marginRight: '8px' }}
                  onClick={handlePrintInvoice}
                >
                  <PrintIcon />
                </Button>
              )
            )}

            <Button variant="outlined" color="info" style={{ marginRight: '8px' }}            >
              <BookIcon />
            </Button>
          </div>
        </Box>

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </div>

      <div>
        <StatusModal
          open={isStatusModalOpen}
          onClose={closeStatusModal}
          onStatusConfirm={handleStatusConfirm}
          currentStatuses={billData?.[0]?.billStatusDetails?.map((status) => status.id) || []}
        />
      </div>

      {/* ------------------Thông tin đơn hàng------------------ */}

      <div>
        <hr />
        <Box mb={4}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'stretch', mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography level="h5" sx={{ fontWeight: 'bold' }}>
                THÔNG TIN ĐƠN HÀNG
              </Typography>

              <Button
                startIcon={<DiscountIcon />}
                variant="outlined"
                onClick={openCouponModal}
                disabled={statuses === 8 || statuses === 7 || statuses === 3 || statuses === 5}
                sx={{ borderColor: '#4caf50', color: '#4caf50' }}
              >
                Phiếu giảm giá
              </Button>
            </Box>

            <CouponModalBillEdit
              open={isCouponModalOpen}
              onClose={closeCouponModal}
              onSelectCoupon={onCoupon}
              customerId={customerId}
              subtotal={subtotal}
            />
          </Box>

          {billData?.map((bd) => (
            <Box key={bd.id || bd.code} mt={2} sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
              <Box display="flex" justifyContent="space-between" gap={4}>
                {/* Cột bên trái */}
                <Box width="50%">
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="40%" sx={{ fontWeight: 'bold' }}>Trạng thái:</Typography>
                    <Typography width="60%" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                      {statusMap[bd?.status] || '#'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="40%" sx={{ fontWeight: 'bold' }}>Mã đơn hàng:</Typography>
                    <Typography width="60%" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                      {bd?.code || '#'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="40%" sx={{ fontWeight: 'bold' }}>Loại đơn hàng:</Typography>
                    <Typography width="60%" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                      {bd?.paymentMethod || '#'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography width="40%" sx={{ fontWeight: 'bold' }}>Đợt giảm giá:</Typography>
                    <Typography width="60%" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                      {100 - (bd.billDetails[0]?.productDetail?.percent ?? 0)}%
                    </Typography>
                  </Box>
                </Box>

                {/* Cột bên phải */}
                <Box width="50%">
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="50%" sx={{ fontWeight: 'bold' }}>Phí vận chuyển:</Typography>
                    <Typography width="50%" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                      {bd?.shipping || 'FREE'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="50%" sx={{ fontWeight: 'bold' }}>Tổng tiền:</Typography>
                    <Typography width="50%" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                      {formatCurrencyVND(bd?.subtotal || '')}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="50%" sx={{ fontWeight: 'bold' }}>Giảm giá:</Typography>
                    <Typography width="50%" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                      - {formatCurrencyVND(bd?.sellerDiscount || '')}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography width="50%" sx={{ fontWeight: 'bold' }}>Phải thanh toán:</Typography>
                    <Typography width="50%" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                      {formatCurrencyVND(bd?.total || '')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

          ))}
        </Box>
      </div>


      {/* ------------------Thông tin khách hàng------------------ */}

      <div>
        <hr />
        <Box mb={4}>
          {billData?.map((bd) => (
            <Box key={bd.id || bd.code}>
              {/* Tiêu đề và nút thay đổi thông tin */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography level="h5" sx={{ fontWeight: 'bold' }}>
                  THÔNG TIN KHÁCH HÀNG
                </Typography>
                <Button
                  onClick={handleOpenModal}
                  variant="outlined"
                  color="warning"
                  disabled={!isCustomerAvailable || statuses === 8 || statuses === 7 || statuses === 3 || statuses === 5}
                >
                  Thay đổi thông tin
                </Button>
              </Box>

              {/* Chia 2 bên thông tin */}
              <Box display="flex" justifyContent="space-between" mt={2} gap={4}>
                {/* Cột bên trái */}
                <Box width="50%">
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="40%" sx={{ fontWeight: 'bold' }}>Tên khách hàng:</Typography>
                    <Typography width="60%" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                      {bd?.customer?.lastName || '#'} {bd?.customer?.firstName || ''}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography width="40%" sx={{ fontWeight: 'bold' }}>Số điện thoại:</Typography>
                    <Typography width="60%" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                      {bd?.customer?.phoneNumber || '#'}
                    </Typography>
                  </Box>
                </Box>

                {/* Cột bên phải */}
                <Box width="50%">
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography width="40%" sx={{ fontWeight: 'bold' }}>Email:</Typography>
                    <Typography width="60%" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                      {bd?.customer?.user?.email || '#'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography width="40%" sx={{ fontWeight: 'bold' }}>Địa chỉ:</Typography>
                    <Typography width="60%" sx={{ color: 'text.secondary', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {`${bd?.customer?.customerAddress?.streetName || '#'}, 
                        ${bd?.customer?.customerAddress?.ward || '#'}, 
                        ${bd?.customer?.customerAddress?.district || '#'}, 
                        ${bd?.customer?.customerAddress?.city || '#'}`}
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

      {/* ------------------Lịch sử thanh toán------------------ */}

      <div>
        <hr />
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography level="h5" sx={{ fontWeight: 'bold' }}>
            LỊCH SỬ THANH TOÁN
          </Typography>
          {statuses !== undefined && (
            <Button
              variant="outlined"
              color="warning"
              onClick={openNoteModal}
              disabled={statuses === 8 || statuses === 7 || statuses === 3}
            >
              XÁC NHẬN THANH TOÁN
            </Button>
          )}
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
              {checkNote || statusDone ? (
                billData
                  .filter(bill => bill.note || bill.status === 8)
                  .map((bill, index) => (
                    <TableRow key={bill.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{formatCurrencyVND(bill.total)}</TableCell>
                      <TableCell>{bill.createAt}</TableCell>
                      <TableCell>{bill.code}</TableCell>
                      <TableCell>{bill.paymentMethod}</TableCell>
                      <TableCell>{`${bill?.employee?.last_name || ''} ${bill?.employee?.first_name || ''}`}</TableCell>
                      <TableCell>{bill.message}</TableCell>
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
      </div>

      <div>
        <Modal open={isModalOpenNote} onClose={() => setIsModalOpenNote(false)}>
          <Box
            sx={{
              padding: 2,
              backgroundColor: "white",
              borderRadius: 2,
              width: '400px',
              margin: 'auto',
            }}
          >
            <Typography variant="h6" sx={{ color: 'red' }}>
              Vui lòng nhập ghi chú trước khi xác nhận
            </Typography>

            <TextField
              fullWidth
              multiline
              value={tempBillNote}
              onChange={handleNoteChange}
              label="Note"
              rows={4}
              inputProps={{
                maxLength: 225,
              }}
              helperText={`${tempBillNote.length}/225`}
              sx={{ marginTop: 1 }}
            />

            {/* Display payment information */}
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1">Số tiền: {tempPaymentAmount.toLocaleString()} đ</Typography>
              <Typography variant="body1">Loại thanh toán: {tempPaymentMethod}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Button onClick={() => setIsModalOpenNote(false)} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleNoteCloseModal}
                variant="contained"
                sx={{ backgroundColor: '#FFD700', color: 'black' }}
                disabled={tempBillNote.length === 0 || tempBillNote.length > 225}
              >
                Xác nhận đơn hàng
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>

      {/* ------------------Danh sách sản phẩm------------------ */}

      <div>
        <hr />
        <div>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'end', mt: 3, justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              THÔNG TIN SẢN PHẨM
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'end', mt: 3, justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="success"
                startIcon={<UpdateIcon />}
                onClick={() => handUpdateBill()}
                disabled={statuses === 8 || statuses === 7 || statuses === 3 || statuses === 5}
              >
                Cập nhật sản phẩm
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={openProductListModal}
                disabled={statuses === 8 || statuses === 7 || statuses === 3 || statuses === 5}
              >
                Thêm sản phẩm
              </Button>
            </Box>
          </Box>

          <Dialog open={isProductListModalOpen} onClose={closeProductListModal} maxWidth="lg" fullWidth>
            <ProductListModal
              onAddProduct={onProduct}
              onClose={closeProductListModal}
              order={id}
            />
          </Dialog>

        </div>

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
                          products.find((p) => p.productDetail.id === detail.productDetail.id)?.quantity
                        }
                        onChange={(e) =>
                          handleQuantityChange(detail.productDetail?.id, parseInt(e.target.value, 10) || '')
                        }
                        sx={{ width: '80%', '& input': { textAlign: 'center' } }}
                        disabled={statuses === 8 || statuses === 7 || statuses === 3 || statuses === 5}
                      />
                      {errorMessage && (
                        <Typography color="error" sx={{ marginTop: 1, fontSize: '0.875rem' }}>
                          {errorMessage}
                        </Typography>
                      )}
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
                        disabled={statuses === 8 || statuses === 7 || statuses === 3 || statuses === 5}
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

      {/* In ra hóa đơn */}

      <div
        id="invoice-content"
        className={`invoice-container ${isInvoiceVisible ? 'visible' : ''}`}
      >
        <div className="invoice-header">
          <div className="invoice-header-left">
            <div className="invoice-logo-background">
              <img
                src="https://res.cloudinary.com/dp0odec5s/image/upload/v1729760620/c6gyppm7eef7cyo0vxzy.jpg"
                alt="Logo"
                className="invoice-logo"
              />
            </div>
          </div>
          <div className="invoice-header-right">
            <h1 className="invoice-title">Hóa đơn bán hàng</h1>
          </div>
        </div>

        {billData?.[0] ? (
          <>
            <div className="invoice-info">
              <p><strong>Mã hóa đơn:</strong> {billData[0]?.code || 'N/A'}</p>
              <p><strong>Ngày thanh toán:</strong> {billData[0]?.createAt || 'N/A'}</p>
              <p><strong>Trạng thái:</strong> {statusMap[billData[0]?.status] || 'N/A'}</p>
              <p><strong>Khách hàng:</strong> {`${billData[0]?.customer?.lastName || ''} ${billData[0]?.customer?.firstName || ''}`}</p>
              <p><strong>Số điện thoại:</strong> {billData[0]?.customer?.phoneNumber || 'N/A'}</p>
              <p><strong>Địa chỉ:</strong> {`${billData[0]?.customer?.customerAddress?.streetName || ''}, ${billData[0]?.customer?.customerAddress?.ward || ''}, ${billData[0]?.customer?.customerAddress?.district || ''}, ${billData[0]?.customer?.customerAddress?.city || ''}`}</p>
            </div>

            <h2 className="invoice-details-title">Danh sách sản phẩm</h2>
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Đợt giảm giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {billData[0]?.billDetails?.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.productDetail?.productName || 'N/A'}</td>
                    <td>{product.quantity || 0}</td>
                    <td>{formatCurrencyVND(product.productDetail?.price || 0)}</td>
                    <td>{product.productDetail?.percent ? `${100 - product.productDetail.percent}%` : 'N/A'}</td>
                    <td>{formatCurrencyVND((product.quantity || 0) * (product.discountAmount || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-summary">
              <p><strong>Tổng tiền hàng:</strong> {formatCurrencyVND(billData[0]?.subtotal || 0)}</p>
              <p><strong>Phiếu giảm giá:</strong> {billData[0]?.sellerDiscount ? `- ${formatCurrencyVND(billData[0]?.sellerDiscount)}` : '0 đ'}</p>
              <p><strong>Phí giao hàng:</strong> {formatCurrencyVND(billData[0]?.shipping || 0)}</p>
              <p><strong>Tổng tiền cần thanh toán:</strong> {formatCurrencyVND(billData[0]?.total || 0)}</p>
            </div>
          </>
        ) : (
          <p>Không có dữ liệu hóa đơn.</p>
        )}
      </div>

      <div
        id="shipping-invoice"
        className={`shipping-invoice-container ${isInvoiceVisible ? 'visible' : ''}`}
      >
        <div className="shipping-invoice-header">
          <div className="shipping-invoice-header-left">
            <div className="shipping-invoice-logo-background">
              <img
                src="https://res.cloudinary.com/dp0odec5s/image/upload/v1729760620/c6gyppm7eef7cyo0vxzy.jpg"
                alt="Logo"
                className="shipping-invoice-logo"
              />
            </div>
          </div>
          <div className="shipping-invoice-header-right">
            <h1 className="shipping-invoice-title">Hóa đơn giao hàng</h1>
          </div>
        </div>

        {billData?.[0] ? (
          <>
            <div className="shipping-invoice-info">
              <p><strong>Mã hóa đơn:</strong> {billData[0]?.code || 'N/A'}</p>
              <p><strong>Trạng thái:</strong> {statusMap[billData[0]?.status] || 'N/A'}</p>
              <p><strong>Khách hàng:</strong> {`${billData[0]?.customer?.lastName || ''} ${billData[0]?.customer?.firstName || ''}`}</p>
              <p><strong>Số điện thoại:</strong> {billData[0]?.customer?.phoneNumber || 'N/A'}</p>
              <p><strong>Địa chỉ giao hàng:</strong> {`${billData[0]?.customer?.customerAddress?.streetName || ''}, ${billData[0]?.customer?.customerAddress?.ward || ''}, ${billData[0]?.customer?.customerAddress?.district || ''}, ${billData[0]?.customer?.customerAddress?.city || ''}`}</p>
            </div>

            <h2 className="shipping-invoice-details-title">Danh sách sản phẩm</h2>
            <table className="shipping-invoice-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Đợt giảm giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {billData[0]?.billDetails?.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.productDetail?.productName || 'N/A'}</td>
                    <td>{product.quantity || 0}</td>
                    <td>{formatCurrencyVND(product.productDetail?.price || 0)}</td>
                    <td>{product.productDetail?.percent ? `${100 - product.productDetail.percent}%` : 'N/A'}</td>
                    <td>{formatCurrencyVND((product.quantity || 0) * (product.discountAmount || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="shipping-invoice-summary">
              <p><strong>Tổng tiền hàng:</strong> {formatCurrencyVND(billData[0]?.subtotal || 0)}</p>
              <p><strong>Phiếu giảm giá:</strong> {billData[0]?.sellerDiscount ? `- ${formatCurrencyVND(billData[0]?.sellerDiscount)}` : '0 đ'}</p>
              <p><strong>Phí giao hàng:</strong> {formatCurrencyVND(billData[0]?.shipping || 0)}</p>
              <p><strong>Tổng tiền cần thanh toán:</strong> {formatCurrencyVND(billData[0]?.total || 0)}</p>
            </div>
          </>
        ) : (
          <p>Không có dữ liệu hóa đơn.</p>
        )}
      </div>

    </Container >
  );
}
