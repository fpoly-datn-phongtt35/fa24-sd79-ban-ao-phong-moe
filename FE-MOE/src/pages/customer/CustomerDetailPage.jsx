import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllCustomer, putCustomer } from '~/apis/customerApi';
import { Container, TextField, MenuItem, Button, Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';

const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

const formatDate = (dateString, time = "00:00:00") => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year} | ${time}`;
};

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    customerAddress: "",
    image: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const response = await fetchAllCustomer();
        const foundCustomer = response.data.find((c) => c.id === Number(id));
        if (foundCustomer) {
          setCustomer(foundCustomer);
        } else {
          toast.error('Customer not found');
          navigate('/customer');
        }
      } catch (error) {
        toast.error('Error fetching customer data');
        console.error(error);
      }
    };

    getCustomer();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedCustomer = {
      ...customer,
      dateOfBirth: formatDate(customer.dateOfBirth), // Keep the date format
      updatedAt: new Date().toISOString(),
    };

    try {
      await putCustomer(updatedCustomer, id);
      toast.success('Customer updated successfully!');
      navigate('/customer');
    } catch (error) {
      toast.error('There was an error updating the customer');
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} mt={4}>
        <Typography variant="h4" mb={3}>
          Edit Customer
        </Typography>

        <TextField
          label="First Name"
          name="firstName"
          value={customer.firstName}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Last Name"
          name="lastName"
          value={customer.lastName}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={customer.phoneNumber}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Gender"
          name="gender"
          select
          value={customer.gender}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        >
          {GENDER_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          type="text"
          value={customer.dateOfBirth}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
        />

        <TextField
          label="Địa chỉ"
          name="customerAddress"
          value={customer.customerAddress}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Image URL"
          name="image"
          value={customer.image}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" type="submit">
            Update Customer
          </Button>
          <Button variant="outlined" onClick={() => navigate('/customer')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CustomerDetailPage;
