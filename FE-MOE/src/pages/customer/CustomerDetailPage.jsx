import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { putCustomer, fetchCustomerById } from '~/apis/customerApi'; 
import { useNavigate, useParams } from 'react-router-dom';

export const CustomerDetailPage = () => {
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    image: '',
    city: '',
    district: '',
    ward: '',
    streetName: ''
     
     
  });

  const formatDate = (dateString, time = "00:00:00") => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} | ${time}`;
  };

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
          const response = await fetchCustomerById(id);
          console.log("API Response:", response.data); 
  
          const customerData = response.data;
  
         
  
          setCustomerData({
              firstName: customerData.firstName,
              lastName: customerData.lastName,
              phoneNumber: customerData.phoneNumber,
              gender: customerData.gender,
              dateOfBirth: customerData.dateOfBirth.split('T')[0],
              image: customerData.image,
              city: customerData.city,
              district: customerData.district,
              ward: customerData.ward,
              streetName: customerData.streetName
                  
              
          });
      } catch (error) {
          console.error("Error details:", error);
          toast.error('Error fetching customer details: ' + (error.response?.data?.message || error.message));
      }
  };
  
    
    
    fetchCustomerDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (customerData.address && name in customerData.address) {
      setCustomerData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setCustomerData({ ...customerData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedCustomer = {
      ...customerData,
      dateOfBirth: formatDate(customerData.dateOfBirth), // Keep the date format
      updatedAt: new Date().toISOString(),
    };
    try {
      await putCustomer(updatedCustomer, id); 
      toast.success('Customer updated successfully!');
      navigate('/customer'); 
    } catch (error) {
      toast.error('There was an error updating the customer');
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Update Customer
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên"
                name="firstName"
                value={customerData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ"
                name="lastName"
                value={customerData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điện thoại"
                name="phoneNumber"
                value={customerData.phoneNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={customerData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày sinh"
                name="dateOfBirth"
                type="text"
                value={customerData.dateOfBirth}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ảnh"
                name="image"
                value={customerData.image}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Thành Phố"
                name="city"
                value={customerData.city}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Huyện"
                name="district"
                value={customerData.district}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Xã/ Phường"
                name="ward"
                value={customerData.ward}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên Đường"
                name="streetName"
                value={customerData.streetName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update Customer
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default CustomerDetailPage;
