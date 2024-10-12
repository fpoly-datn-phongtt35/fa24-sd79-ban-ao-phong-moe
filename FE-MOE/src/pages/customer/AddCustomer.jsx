import React, { useState } from 'react';
import { Container, Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { postCustomer } from '~/apis/customerApi'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

export const AddCustomer = () => {

  const formatDate = (dateString, time = "00:00:00") => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} | ${time}`;
  };

  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    image: '',
    createdAt: new Date(), 
    updatedAt: new Date()
  });

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();

    const customerWithTimestamps = {
      ...customerData,
      dateOfBirth: formatDate(customerData.dateOfBirth), 
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    try {
      await postCustomer(customerWithTimestamps); 
      toast.success('Customer added successfully!');
      navigate('/customer'); 
    } catch (error) {
      toast.error('There was an error adding the customer');
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Add New Customer
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={customerData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={customerData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={customerData.phoneNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={customerData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
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
                label="Image URL"
                name="image"
                value={customerData.image}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Customer
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
