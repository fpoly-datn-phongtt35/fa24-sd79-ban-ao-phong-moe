import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Input } from '@mui/joy';
import { addBillStatusDetail, getBillEdit, getBillStatusDetailsByBillId, getPreviousBillStatusId } from '~/apis/billListApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, Grid, List, ListItem, ListItemText, Paper, Breadcrumbs, Link, Modal, TextField, StepLabel, IconButton, Step, Stepper, StepConnector, Tooltip, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { formatCurrencyVND } from '~/utils/format';
import { addPayBillEdit, putCustomer } from '~/apis/billsApi';
import CustomerEditModal from '~/components/bill/CustomerEditModal';
import { fetchCustomerById } from '~/apis/customerApi';
import { useNavigate } from 'react-router-dom';
import UpdateIcon from '@mui/icons-material/Update';
import StatusModal from '~/components/bill/StatusModal';
import { toast } from "react-toastify";
import { ImageRotator } from '~/components/common/ImageRotator ';

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
import RestoreStatusModal from '~/components/bill/RestoreStatusModal ';
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

  //status
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState("");
  const [statusDetails, setStatusDetails] = useState([]);
  const [isShippingDisabled, setIsShippingDisabled] = useState(false);
  const [prevStatus, setPrevStatus] = useState(null);
  const [isRestoreModalOpen, setRestoreModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  //bill
  const [isModalOpenNote, setIsModalOpenNote] = useState(false);
  const [billNote, setBillNote] = useState("");
  const [tempBillNote, setTempBillNote] = useState("");
  const [paymentTime, setPaymentTime] = useState("");
  const [tempPaymentAmount, setTempPaymentAmount] = useState("");
  const [tempPaymentMethod, setTempPaymentMethod] = useState("");
  const [tempPaymentTime, setTempPaymentTime] = useState("");
  const [tempMessage, setTempMessage] = useState("");
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const checkNote = billData && billData.some(bill => bill.note);
  const checkNoteRef = useRef(null);
  const noteRef = checkNoteRef.current;

  const statusDone = billData && billData.some(bill => bill.status);
  const statusRef = useRef(null);
  const statuses = statusRef.current;

  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

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

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchBillEdit();
      await fetchBillStatusDetails();
    };

    fetchInitialData();
  }, []);

  const fetchBillEdit = async () => {
    try {
      const bill = await getBillEdit(id);
      setBillData(bill.data);

      if (bill.data?.[0]) {
        setTempPaymentMethod(bill.data[0].paymentMethod || "");
        setTempPaymentTime(bill.data[0].paymentTime || "");
        setTempMessage(bill.data[0].message || "")
        statusRef.current = bill.data[0].status;
        checkNoteRef.current = bill.data[0].note;
      }
    } catch (error) {
      console.error("Error fetching bill:", error);
    }
  };

  const statusMap = {
    '1': 'Đã tạo hóa đơn',
    '2': 'Chờ xác nhận',
    '3': 'Đã xác nhận',
    '4': 'Đã vận chuyển',
    '5': 'Đã giao thành công',
    '6': 'Giao hàng thất bại',
    '7': 'Đã hủy',
    '8': 'Đơn hàng hoàn tất',
    '9': 'Khác',
  };

  const statusColors = {
    '0': '#B0BEC5',
    '1': '#007bff',
    '2': '#FF9800',
    '3': '#4CAF50',
    '4': '#1E88E9',
    '5': '#43A047',
    '6': '#E53935',
    '7': '#F44336',
    '8': '#9C27B0',
    '9': '#FF5722',
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
      console.log(statusData)

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
    // Lấy trạng thái hiện tại
    const currentStatus = billData[0]?.status;

    // 1. Nếu đang ở trạng thái 2, chỉ cho phép chuyển sang trạng thái 4
    if (currentStatus === 2 && Number(status) !== 4 && Number(status) !== 7) {
      toast.error("Vui lòng giao hàng trước khi chọn trạng thái khác.");
      return;
    }

    // 2. Nếu đang ở trạng thái 4, chỉ cho phép chuyển sang trạng thái 8
    if (currentStatus === 4 && (Number(status) !== 8 || !noteRef || noteRef.trim() === "") && Number(status) !== 7) {
      toast.error("Vui lòng xác nhận thanh toán trước khi hoàn tất.");
      return;
    }

    // 3. Nếu đang ở trạng thái 3, chỉ cho phép chuyển sang trạng thái 8 hoặc 7
    if (currentStatus === 3 && Number(status) !== 8) {
      toast.error("Vui lòng hoàn tất thanh toán hoặc hủy đơn hàng.");
      return;
    }

    // 4. Nếu đơn hàng đã bị hủy (trạng thái 7), không được thay đổi
    if (currentStatus === 7) {
      toast.error("Đơn hàng đã bị hủy.");
      return;
    }

    // if (Number(status) === 8) {
    //   handlePrintInvoice();
    // }

    // Cập nhật trạng thái nếu không vi phạm điều kiện nào
    const userId = localStorage.getItem("userId") || null;
    onPay(tempBillNote, status, customNote, userId, paymentTime);
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

  const handleConfirmRestore = async (customNote) => {
    const userId = localStorage.getItem("userId");

    const updateSuccess = await updateBillStatusDetail(prevStatus, customNote, userId);

    setTempBillNote("");
    setPaymentTime("");

    if (updateSuccess) {
      onPay("", prevStatus, customNote, userId, "");
      setPrevStatus(null);
      fetchBillEdit();
      fetchBillStatusDetails();
      toast.success("Khôi phục trạng thái thành công.");
    } else {
      toast.error("Khôi phục trạng thái thất bại.");
    }

    setRestoreModalOpen(false); // Đóng modal sau khi xử lý
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
  };

  const handleRestorePreviousStatus = () => {
    setRestoreModalOpen(true);
  };

  const handleButtonClick = async () => {
    await fetchBillStatusDetails();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    const currentStatus = billData[0]?.status;

    if (statuses === 7) {
      toast.error("Hóa đơn đã bị hủy. Không thể xác nhận thanh toán.");
      return;
    }

    if (currentStatus === 2 && Number(status) !== 4 && Number(status) !== 7) {
      toast.error("Vui lòng giao hàng trước khi xác nhận.");
      setTempBillNote("");
      return;
    }

    // Proceed only if the above conditions are not met
    setIsModalOpenNote(false);
    setBillNote(tempBillNote);

    const newPaymentTime = billData[0]?.paymentTime || formatDate(new Date());
    setPaymentTime(newPaymentTime);

    setIsPaymentConfirmed(true);

    const userId = localStorage.getItem("userId");

    updateBillStatusDetail("3", tempBillNote, userId);
    onPay(tempBillNote, "3", tempBillNote, userId, newPaymentTime);
    fetchBillEdit();
    fetchBillStatusDetails();
  };

  const handleNoteChange = (event) => {
    setTempBillNote(event.target.value);
  };

  const onPay = async (billNote, status, statusNote, userId, paymentTime) => {
    if (!billData || billData[0]?.billDetails?.length === 0) {
      console.log("Cannot create invoice. Please select an order and add products.");
      return;
    }

    const updatedBillData = billData[0];

    // Use existing paymentTime if already set, otherwise use the passed paymentTime
    const finalPaymentTime = updatedBillData.paymentTime || paymentTime;

    const billStoreRequest = {
      billRequest: {
        code: updatedBillData.code || "",
        bankCode: updatedBillData.bankCode || "",
        customer: updatedBillData.customer?.id || "",
        coupon: updatedBillData.coupon?.id || "",
        billStatus: status || updatedBillData.status || "",
        shipping: updatedBillData.shippingCost || 0,
        subtotal: updatedBillData.subtotal || 0,
        sellerDiscount: updatedBillData.sellerDiscount || 0,
        total: updatedBillData.total || 0,
        paymentMethod: updatedBillData.paymentMethod || "",
        message: updatedBillData.message || "",
        note: (billNote === "" || billNote === null) ? "" : billNote || updatedBillData.note || "",
        paymentTime: finalPaymentTime || "",
        userId: userId || updatedBillData.userId,
      },
      billDetails: updatedBillData.billDetails.map((billDetail) => ({
        productDetail: billDetail.productDetail.id,
        quantity: billDetail.quantity,
        price: billDetail.productDetail.price,
        discountAmount: billDetail.discountAmount,
      })),
    };

    try {
      await addPayBillEdit(billStoreRequest);
      console.log("billStoreRequest:", billStoreRequest);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
    fetchBillEdit();
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleConfirmEdit = () => {
    setOpenConfirm(false);
    navigate(`/bill/edit/${id}`);
  };

  //----------------------------------------------Xuất hóa đơn-------------------------------------//
  const handlePrintInvoice = () => {
    const invoiceContent = document.getElementById("invoice-content");

    if (invoiceContent) {
      invoiceContent.style.display = 'block';
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = invoiceContent.outerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
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
            {(statuses !== 4 && statuses !== 8 && statuses !== 7) && (
              <Button variant="contained" color="error" style={{ marginRight: '8px' }} onClick={() => navigate("/bill/list")}>
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
                {statuses === 4 ? "Hoàn thành" : "Giao hàng"}
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

            {statuses === 4 ? (
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

            <Button
              variant="outlined"
              color="info"
              style={{ marginRight: '8px' }}
              onClick={handleButtonClick}
            >
              <BookIcon />
            </Button>
          </div>
        </Box>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Trạng thái hóa đơn</DialogTitle>
        <DialogContent>
          {errorMessage ? (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          ) : statusDetails.length > 0 ? (
            <List>
              {statusDetails.map((status, index) => {
                const statusCode = status.billStatus;
                const statusColor = statusColors[statusCode] || '#a6a6a6'; // Default color

                return (
                  <ListItem key={index}>
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="span" sx={{ color: statusColor }}>
                          {statusMap[statusCode]}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary" component="span">
                            {`Thời gian: ${status.createAt}`}
                          </Typography>
                        </>
                      }
                      sx={{
                        padding: '10px',
                        borderLeft: `5px solid ${statusColor}`, // Border color changes with status
                      }}
                    />
                    {/* Optionally, you can also apply status color to the status icon */}
                    <Box sx={{ color: statusColor }}>
                      {statusIcons[statusCode]}
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Loading details...
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


      <div>
        <StatusModal
          open={isStatusModalOpen}
          onClose={closeStatusModal}
          onStatusConfirm={handleStatusConfirm}
          currentStatuses={billData?.[0]?.billStatusDetails?.map((status) => status.id) || []}
        />
      </div>

      <div>
        <RestoreStatusModal
          open={isRestoreModalOpen}
          onClose={() => setRestoreModalOpen(false)}
          onConfirm={handleConfirmRestore}
        />
      </div>
      {/* ------------------Thông tin đơn hàng------------------ */}

      <div>
        <hr />
        <Box mb={4}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'stretch', mt: 3 }}>
            <Typography level="h5" sx={{ fontWeight: 'bold' }}>
              THÔNG TIN ĐƠN HÀNG
            </Typography>
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
                  disabled={!isCustomerAvailable || statuses === 8 || statuses === 7 || statuses === 3 || statuses === 4}
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
              {(checkNote || statusDone) ? (
                billData
                  .filter(bill => bill.note || bill.status === 8)
                  .length > 0 ? (
                  billData
                    .filter(bill => bill.note || bill.status === 8)
                    .map((bill, index) => (
                      <TableRow key={bill.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{formatCurrencyVND(bill.total)}</TableCell>
                        <TableCell>{bill.paymentTime || ''}</TableCell>
                        <TableCell>{bill.code}</TableCell>
                        <TableCell>{bill.paymentMethod}</TableCell>
                        <TableCell>{`${bill?.employee?.last_name || ''} ${bill?.employee?.first_name || ''}`}</TableCell>
                        <TableCell>{bill.message}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Chưa có giao dịch thỏa mãn
                    </TableCell>
                  </TableRow>
                )
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
        <Modal
          open={isModalOpenNote}
          onClose={() => setIsModalOpenNote(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              padding: 3,
              backgroundColor: 'white', // Sử dụng màu cụ thể nếu theme không nhận diện
              borderRadius: 3,
              width: '450px',
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'red', // Đổi sang giá trị tĩnh
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 2,
              }}
            >
              Vui lòng nhập ghi chú trước khi xác nhận <br></br>
              (chú ý bom hàng)
            </Typography>

            <TextField
              fullWidth
              multiline
              value={tempBillNote}
              onChange={handleNoteChange}
              label="Ghi chú"
              rows={4}
              variant="outlined"
              inputProps={{
                maxLength: 225,
              }}
              helperText={`${tempBillNote.length}/225`}
              sx={{ marginBottom: 2 }}
            />

            <Box
              sx={{
                padding: 2,
                backgroundColor: '#f9f9f9', // Sử dụng màu cố định
                borderRadius: 2,
                marginBottom: 2,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Thông tin thanh toán</Typography>
              <Typography variant="body2">Số tiền: <b>{tempPaymentAmount.toLocaleString()} đ</b></Typography>
              <Typography variant="body2">Loại thanh toán: <b>{tempPaymentMethod}</b></Typography>
              <Typography variant="body2">Ngày thanh toán: <b>{tempPaymentTime}</b></Typography>
              <Typography variant="body2">Ghi chú: <b>{tempMessage}</b></Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Button
                onClick={() => setIsModalOpenNote(false)}
                variant="outlined"
                color="primary"
                sx={{ flexGrow: 1 }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleNoteCloseModal}
                variant="contained"
                color="warning"
                sx={{
                  flexGrow: 1,
                }}
                disabled={tempBillNote.length === 0 || tempBillNote.length > 225}
              >
                Xác nhận
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

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "end",
                mt: 3,
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="outlined"
                color="success"
                startIcon={<UpdateIcon />}
                onClick={handleOpenConfirm}
                disabled={statuses === 8 || statuses === 7 || statuses === 3 || statuses === 4}
              >
                Sửa sản phẩm
              </Button>

              {/* Dialog Confirm */}
              <Dialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                aria-labelledby="confirm-edit-title"
                aria-describedby="confirm-edit-description"
              >
                <DialogTitle id="confirm-edit-title">Xác nhận chỉnh sửa</DialogTitle>
                <DialogContent>
                  <DialogContentText id="confirm-edit-description">
                    Bạn có chắc chắn muốn sửa sản phẩm này không?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseConfirm} color="primary">
                    Hủy
                  </Button>
                  <Button onClick={handleConfirmEdit} color="success" autoFocus>
                    Xác nhận
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box>

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
                    <Grid item xs={4} sm={2} md={2} display="flex" justifyContent="center" flexDirection="column" alignItems="center"                   >
                      <Typography variant="body1" sx={{
                        width: '80%', textAlign: 'center', padding: '8px 0', backgroundColor: '#f5f5f5', borderRadius: '4px', border: '1px solid #ddd',
                      }}                      >
                        {detail.productDetail.quantity}
                      </Typography>
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
