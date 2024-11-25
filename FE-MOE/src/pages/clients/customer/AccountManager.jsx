import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Sheet, Typography, Input, Button, Grid, Select, Option, FormControl, FormLabel, Breadcrumbs, Link, Box, Radio, RadioGroup, Avatar } from "@mui/joy";
import HomeIcon from "@mui/icons-material/Home";
import { toast } from 'react-toastify';
import { fetchAccountInfoById, postcustomerImage, putAccountInfo } from '~/apis/client/apiAccountManager';



export const AccountInfo = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageObject, setImageObject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    image: '',
  });

  const [errors, setErrors] = useState({
    lastName: '',
    firstName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    email: '',
  });

  const validateForm = () => {
    const specialCharRegex = /^[a-zA-ZÀ-ỹ]+( [a-zA-ZÀ-ỹ]+)*$/;
    const phoneRegex = /^0\d{9,11}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const minAge = 16;

    const calculateAge = (dob) => {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const newErrors = {
      lastName: accountData.lastName
        ? accountData.lastName.length > 20
          ? "Họ không được vượt quá 20 ký tự"
          : !specialCharRegex.test(accountData.lastName)
            ? "Họ chỉ được chứa chữ cái và dấu tiếng Việt"
            : ""
        : "Họ không được để trống",

      firstName: accountData.firstName
        ? accountData.firstName.length > 50
          ? "Tên không được vượt quá 50 ký tự"
          : !specialCharRegex.test(accountData.firstName)
            ? "Tên chỉ được chứa chữ cái và dấu tiếng Việt"
            : ""
        : "Tên không được để trống",

      phoneNumber: accountData.phoneNumber
        ? phoneRegex.test(accountData.phoneNumber)
          ? ""
          : "Số điện thoại Không hợp lệ"
        : "Số điện thoại không được để trống",

      gender: accountData.gender ? "" : "Phải chọn giới tính",

      dateOfBirth: accountData.dateOfBirth
        ? calculateAge(accountData.dateOfBirth) >= minAge
          ? ""
          : "Phải trên 16 tuổi"
        : "Phải chọn ngày sinh",

      email: accountData.email
        ? emailRegex.test(accountData.email)
          ? ""
          : "Email không đúng định dạng"
        : "Email không được để trống",

    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };


  const formatDate = (dateString, time = "00:00:00") => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} | ${time}`;
  };

  const formatDate2 = (dateTimeString) => {
    const [datePart] = dateTimeString.split(' ');
    const [year, month, day] = datePart.split('-');
    return `${year}-${month}-${day}`;
  };

  const handleImageChange = (event) => {
    var file = event.target.files[0];
    var url = URL.createObjectURL(file)
    setImagePreview(url)
    setImageObject(file)
  }

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        const data = await fetchAccountInfoById(localStorage.getItem("userId"));
        const customerData = data.data;
        setAccountData({
          firstName: capitalizeFirstLetter(customerData.firstName),
          lastName: capitalizeFirstLetter(customerData.lastName),
          phoneNumber: customerData.phoneNumber,
          gender: customerData.gender,
          dateOfBirth: formatDate2(customerData.dateOfBirth),
          image: customerData.image,        
          email: customerData.email,
        });
        setImagePreview(customerData.image || '/placeholder-image.png');
      } catch (error) {
        toast.error("Error loading account information.");
      }
    };
    loadCustomerData();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    setAccountData((prevData) => ({
      ...prevData,
      [name]: ['firstName', 'lastName'].includes(name)
        ? capitalizeFirstLetter(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form không hợp lệ, dừng xử lý.");
      return;
    }
    const updatedCustomer = {
      ...accountData,
      dateOfBirth: formatDate(accountData.dateOfBirth),
      updatedAt: new Date().toISOString(),
    };
    setIsLoading(true);
    await putAccountInfo(updatedCustomer, localStorage.getItem("userId")).then(async (res) => {
      if (imageObject === null) {
        toast.success('Sửa thành công');
        setIsLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("images", imageObject)
      formData.append("UserId", id)
      await postcustomerImage(formData).then(() => {
        toast.success('Sửa thành công');
        setIsLoading(false);
      })

    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Grid sx={{ mb: 2 }}>
        <Sheet variant="outlined" sx={{ display: 'flex', flexDirection: 'column', borderRadius: 'md' }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ ml: "5px" }}>
            <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Trang chủ
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate("/my-account")}>
              Tài khoản
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate("/my-account")}>
              Thông Tin Tài Khoản
            </Link>
          </Breadcrumbs>
        </Sheet>
      </Grid>

      <Grid container spacing={2}>
        <Grid xs={12} md={3}>
          <Sheet variant="outlined" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, borderRadius: 'md' }}>
            <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate("//my-account")}>Thông tin tài khoản</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Tích lũy điểm</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Chia sẻ</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Đổi quà</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Quản lý đơn hàng</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate("/my-address")}>Sổ địa chỉ</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Sản phẩm bạn đã xem</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate("/my-passWord")}>Đổi mật khẩu</Typography>
          </Sheet>
        </Grid>

        <Grid xs={12} md={9}>
          <Box p={0}>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
              <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md' }}>
                <Typography level="h5" fontWeight="lg" gutterBottom>THÔNG TIN TÀI KHOẢN</Typography>

                <Grid container spacing={2}>
                  <Grid xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5 }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Avatar
                        src={imagePreview || '/placeholder-image.png'}
                        alt="User Image"
                        sx={{ width: 150, height: 150 }}
                        variant="solid"
                      />
                      <Button disabled={isLoading} variant="outlined" component="label" sx={{ mt: 2 }}>
                        Chọn Ảnh
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                      </Button>
                    </Box>
                  </Grid>

                  <Grid xs={12} sm={8}>
                    <Grid spacing={2}>
                      <Grid xs={12} mb={2}>
                        <FormControl>
                          <FormLabel required>Họ</FormLabel>
                          <Input
                            value={accountData.lastName}
                            name="lastName"
                            onChange={handleChange}
                            placeholder="Nhập họ"
                            sx={{
                              border: `1px solid ${errors.lastName ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                              '&:hover:not(.Mui-disabled):before': { borderColor: errors.lastName ? 'red' : 'rgba(0, 0, 0, 0.23)' },
                              '&.Mui-focused': { borderColor: errors.lastName ? 'red' : 'primary.main' },
                            }}
                          />
                          {errors.lastName && (
                            <Typography color="danger" variant="body2">{errors.lastName}</Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid xs={12} mb={2}>
                        <FormControl>
                          <FormLabel required>Tên</FormLabel>
                          <Input
                            placeholder="Nhập tên"
                            value={accountData.firstName}
                            name="firstName"
                            onChange={handleChange}
                            sx={{
                              border: `1px solid ${errors.firstName ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                              '&:hover:not(.Mui-disabled):before': { borderColor: errors.firstName ? 'red' : 'rgba(0, 0, 0, 0.23)' },
                              '&.Mui-focused': { borderColor: errors.firstName ? 'red' : 'primary.main' },
                            }}
                          />
                          {errors.firstName && (
                            <Typography color="danger" variant="body2">{errors.firstName}</Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid xs={12} mb={2}>
                        <FormControl>
                          <FormLabel required>Điện thoại</FormLabel>
                          <Input
                            placeholder="Nhập điện thoại"
                            value={accountData.phoneNumber}
                            name="phoneNumber"
                            onChange={handleChange}
                            sx={{
                              border: `1px solid ${errors.phoneNumber ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                              '&:hover:not(.Mui-disabled):before': { borderColor: errors.phoneNumber ? 'red' : 'rgba(0, 0, 0, 0.23)' },
                              '&.Mui-focused': { borderColor: errors.phoneNumber ? 'red' : 'primary.main' },
                            }}
                          />
                          {errors.phoneNumber && (
                            <Typography color="danger" variant="body2">{errors.phoneNumber}</Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid xs={12} mb={2}>
                        <FormControl>
                          <FormLabel required>Email</FormLabel>
                          <Input
                            placeholder="Nhập email"
                            value={accountData.email}
                            name="email"
                            onChange={handleChange}
                            sx={{
                              border: `1px solid ${errors.email ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                              '&:hover:not(.Mui-disabled):before': { borderColor: errors.email ? 'red' : 'rgba(0, 0, 0, 0.23)' },
                              '&.Mui-focused': { borderColor: errors.email ? 'red' : 'primary.main' },
                            }}
                          />
                          {errors.email && (
                            <Typography color="danger" variant="body2">{errors.email}</Typography>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid xs={12} mb={2}>
                        <FormControl>
                          <FormLabel>Giới tính</FormLabel>
                          <RadioGroup>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Radio
                                label="Nam"
                                checked={accountData.gender === 'MALE'}
                                onChange={handleChange}
                                value="MALE"
                                name="gender"
                                sx={{
                                  color: errors.gender ? 'red' : 'default',
                                  '&.Mui-checked': { color: errors.gender ? 'red' : 'primary.main' },
                                }}
                              />
                              <Radio
                                label="Nữ"
                                checked={accountData.gender === 'FEMALE'}
                                onChange={handleChange}
                                value="FEMALE"
                                name="gender"
                                sx={{
                                  color: errors.gender ? 'red' : 'default',
                                  '&.Mui-checked': { color: errors.gender ? 'red' : 'primary.main' },
                                }}
                              />
                              <Radio
                                label="Khác"
                                checked={accountData.gender === 'OTHER'}
                                onChange={handleChange}
                                value="OTHER"
                                name="gender"
                                sx={{
                                  color: errors.gender ? 'red' : 'default',
                                  '&.Mui-checked': { color: errors.gender ? 'red' : 'primary.main' },
                                }}
                              />
                            </Box>
                            {errors.gender && (
                              <Typography color="danger" variant="body2">{errors.gender}</Typography>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      <Grid xs={12} mb={2}>
                        <FormControl>
                          <FormLabel required>Ngày sinh</FormLabel>
                          <Input
                            name="dateOfBirth"
                            value={accountData.dateOfBirth}
                            onChange={handleChange}
                            placeholder='Ngày sinh'
                            type='date'
                            sx={{
                              border: `1px solid ${errors.dateOfBirth ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                              '&:hover:not(.Mui-disabled):before': {
                                borderColor: errors.dateOfBirth ? 'red' : 'rgba(0, 0, 0, 0.23)',
                              },
                              '&.Mui-focused': {
                                borderColor: errors.dateOfBirth ? 'red' : 'primary.main',
                              },
                            }}
                          />
                          {errors.dateOfBirth && (
                            <Typography color="danger" variant="body2">{errors.dateOfBirth}</Typography>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid xs={6} sx={{ marginTop: 1 }}>
                        <Button loading={isLoading} variant="soft" type="submit" color='primary' sx={{ marginRight: 1 }}>
                          Cập Nhật Người Dùng
                        </Button>
                        {/* <Button variant="soft" color="danger" onClick={() => navigate("/")}>
                          Hủy
                        </Button> */}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Sheet>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );

}

export default AccountInfo;
