import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { postCustomer } from '~/apis/customerApi'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

export const AddCustomer = () => {

  const formatDate = (dateString, time = "00:00:00") => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
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
      console.log(customerWithTimestamps)
    } catch (error) {
      toast.error('There was an error adding the customer');
    }
  };

  return (
    <Container>
      <h2>Add New Customer</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={customerData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={customerData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            value={customerData.phoneNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="gender">
          <Form.Label>Gender</Form.Label>
          <Form.Control
            as="select"
            name="gender"
            value={customerData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="dateOfBirth">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dateOfBirth"
            value={customerData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="image">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={customerData.image}
            onChange={handleChange}
          />
        </Form.Group>

        <br />
        <Button variant="primary" type="submit">
          Add Customer
        </Button>
      </Form>
    </Container>
  );
};
