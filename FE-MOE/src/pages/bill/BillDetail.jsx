import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Stepper, Container } from '@mui/joy';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Step, { stepClasses } from '@mui/joy/Step';
import { addBillStatusDetail, getBillEdit, getBillStatusDetailsByBillId } from '~/apis/billListApi';
import PrintIcon from '@mui/icons-material/Print';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, Grid, List, ListItem, ListItemText, Paper, Breadcrumbs, Link, Modal, TextField, StepLabel } from '@mui/material';
import { ImageRotator } from '~/components/common/ImageRotator ';
import { formatCurrencyVND } from '~/utils/format';
import { addPayBillEdit, putCustomer } from '~/apis/billsApi';
import CustomerEditModal from '~/components/bill/CustomerEditModal';
import { fetchCustomerById } from '~/apis/customerApi';
import { useNavigate } from 'react-router-dom';
import UpdateIcon from '@mui/icons-material/Update';
import StatusModal from '~/components/bill/StatusModal';
import { toast } from "react-toastify";

export default function BillDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [billData, setBillData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    fetchBillEdit();
    fetchBillStatusDetails();
  }, []);

  const fetchBillEdit = async () => {
    const bill = await getBillEdit(id);
    setBillData(bill.data);
    setTempPaymentMethod(bill.data[0]?.paymentMethod || "");
    if (bill.data && bill.data[0]) {
      statusRef.current = bill.data[0].status;
    }
    if (bill.data && bill.data[0]) {
      checkNoteRef.current = bill.data[0].note;
    }
  };

  //Hien thi du lieu trang thai
  const statusMap = {
    '0': 'Đã tạo hóa đơn',
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
  const fetchBillStatusDetails = async () => {
    try {
      const statusData = await getBillStatusDetailsByBillId(id);
      setStatusDetails(statusData.data);
    } catch (error) {
      console.error("Error fetching bill status details:", error);
      setErrorMessage("Failed to fetch bill status details");
    }
  };

  const handleStatusConfirm = (status, customNote) => {
    if (statuses === 8 || statuses === 5 && (!noteRef || noteRef.trim() === "")) {
      toast.error("Chưa xác nhận thanh toán đơn hàng");
      return;
    } else if (statuses === 7) {
      toast.error("Đơn hàng đã bị hủy");
      return;
    }

    const userId = localStorage.getItem("userId");
    onPay(tempBillNote, status, customNote, userId);
    updateBillStatusDetail(status, customNote, userId);
    fetchBillStatusDetails();
  };


  const stepIcons = [
    <ShoppingCartRoundedIcon />,     // Đang chờ xử lý
    <LocalShippingRoundedIcon />,     // Chờ xác nhận
    <CheckCircleRoundedIcon />,       // Hoàn thành
    <LocalShippingRoundedIcon />,     // Chờ giao
    <CheckCircleRoundedIcon />,       // Đã giao thành công
    <ErrorIcon />,                    // Giao hàng thất bại
    <CancelIcon />,                   // Đã hủy
    <DoneAllIcon />,                  // Đơn hàng hoàn tất
    <HelpOutlineIcon />,              // Khác
  ];

  const updateBillStatusDetail = async (status, customNote, userId) => {
    const statusDetail = {
      bill: billData[0].id,
      billStatus: status,
      note: customNote || '',
      userId: userId
    };
    try {
      await addBillStatusDetail(statusDetail);
      console.log("Status and note saved:", statusDetail);
    } catch (error) {
      console.error("Error updating status:", error);
    }
    fetchBillEdit();
    fetchBillStatusDetails();
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

    const billStoreRequest = {
      billRequest: {
        code: updatedBillData.code || "",
        bankCode: updatedBillData.bankCode || "",
        customer: updatedBillData.customer?.id || "",
        coupon: updatedBillData.coupon?.id || "",
        billStatus: status || updatedBillData.status || "",
        shipping: updatedBillData.shipping || 0,
        subtotal: updatedBillData.subtotal || 0,
        sellerDiscount: updatedBillData.sellerDiscount || 0,
        total: updatedBillData.total || 0,
        paymentMethod: updatedBillData.paymentMethod || "",
        message: updatedBillData.message || "",
        note: billNote || updatedBillData.note || "",
        paymentTime: updatedBillData.paymentTime || "",
        userId: userId || updatedBillData.userId,
      },
      billDetails: updatedBillData.billDetails.map((billDetail) => ({
        productDetail: billDetail.productDetail.id,
        quantity: billDetail.quantity,
        price: billDetail.productDetail.price,
        discountAmount: billDetail.discountAmount || billDetail.productDetail.price,
      })),
    };

    try {
      await addPayBillEdit(billStoreRequest);
      console.log("billStoreRequest:", billStoreRequest);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <Container maxWidth="max-Width" style={{ backgroundColor: '#c9dcdf', minHeight: '100vh', marginTop: '15px' }}>


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
        <Box>
          <Stepper>
            {/* Add the default 'Đã tạo hóa đơn' step first */}
            <Step completed={false}>
              <StepLabel icon={stepIcons[0]}>
                {statusMap['0']}
              </StepLabel>
            </Step>

            {/* Render the rest of the status steps */}
            {statusDetails.map((status, index) => {
              const statusCode = status.billStatus;
              const isCompleted = statusCode === '5' || statusCode === '3';
              const icon = stepIcons[parseInt(statusCode) - 1];

              return (
                <Step key={index} completed={isCompleted}>
                  <StepLabel icon={icon}>
                    {statusMap[statusCode] || 'Unknown'}
                    <Typography variant="caption" color="textSecondary">
                      {status.timestamp}
                    </Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
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
        </Box>

      </div>

      <div>
        <StatusModal
          open={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onStatusConfirm={handleStatusConfirm}
        />
      </div>

      {/* ------------------Thông tin đơn hàng------------------ */}

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

      {/* ------------------Thông tin khách hàng------------------ */}

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
                  disabled={!isCustomerAvailable || statuses === 8 || statuses === 7}
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

      {/* ------------------Lịch sử thanh toán------------------ */}

      <div>
        <hr />
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography level="h5" sx={{ color: 'red', fontWeight: 'bold' }}>
            LỊCH SỬ THANH TOÁN
          </Typography>
          {statuses !== undefined && (
            <Button
              variant="solid"
              sx={{ backgroundColor: '#FFD700' }}
              onClick={openNoteModal}
              disabled={statuses === 8 || statuses === 7}
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
                      <TableCell>{bill.paymentTime}</TableCell>
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
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3, justifyContent: 'space-between' }}>
          <Typography variant="h5" style={{ color: 'red', fontWeight: 'bold' }}>
            THÔNG TIN SẢN PHẨM
          </Typography>

          {billData?.map((bd) => (
            <Box
              key={bd.id}
              sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3, justifyContent: 'flex-end' }}
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<UpdateIcon />}
                onClick={() => navigate(`/bill/edit/${bd.id}`)}
                disabled={statuses === 8 || statuses === 7}
              >
                Sửa sản phẩm
              </Button>
            </Box>
          ))}
        </Box>


        <List sx={{ mb: 3 }}>
          {billData && Array.isArray(billData) && billData.length > 0 && billData[0].billDetails ? (
            billData[0].billDetails.map((product, index) => (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: 2,
                  mb: 2,
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 5,
                    backgroundColor: '#f9f9f9',
                  },
                }}
              >
                <Grid container alignItems="center" spacing={3}>
                  <Grid item xs={4} sm={3} md={2}>
                    {product.productDetail.imageUrl && Array.isArray(product.productDetail.imageUrl) && product.productDetail.imageUrl.length > 0 ? (
                      <ImageRotator imageUrl={product.productDetail.imageUrl} w={100} h={110} />
                    ) : (
                      <Box
                        sx={{
                          width: 90,
                          height: 100,
                          bgcolor: 'grey.300',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                        }}
                      >
                        <Typography variant="body2">No Image</Typography>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={4} sm={5} md={6}>
                    <ListItemText
                      primary={<Typography variant="h6" fontWeight="bold" color="text.primary">{product.productDetail.productName}</Typography>}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Kích thước: {product.productDetail.size} - Màu sắc: {product.productDetail.color}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Xuất xứ: {product.productDetail.origin} - Vật liệu: {product.productDetail.material}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} sm={2} md={2} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                      {product.quantity}
                    </Typography>

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
                          <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: 8 }}>
                            {formatCurrencyVND(product.productDetail.price * product.quantity)}
                          </span>
                          <span style={{ color: 'red' }}>
                            {formatCurrencyVND(product.discountAmount * product.quantity)}
                          </span>
                        </>
                      )}
                    </Typography>
                  </Grid>

                </Grid>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">Không có sản phẩm.</Typography>
          )}
        </List>
      </div>


    </Container >
  );
}
