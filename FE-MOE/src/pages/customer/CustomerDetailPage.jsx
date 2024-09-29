// CustomerDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllCustomer, putCustomer } from '~/apis/customerApi';
import { Container, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'ORTHER', label: 'Other' },
];

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    image: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getCustomer = async () => {
      const response = await fetchAllCustomer();
      const foundCustomer = response.data.find(c => c.id === Number(id));
      if (foundCustomer) {
        setCustomer(foundCustomer);
      }
      console.log(response);
    };
    
    getCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedCustomer = {
      ...customer,
      updatedAt: new Date().toISOString(),
    };

    try {
      await putCustomer(updatedCustomer, id);
      toast.success('Customer updated successfully!');
      navigate('/customer'); // Navigate back to the customer list
    } catch (error) {
      toast.error('There was an error updating the customer');
    }
  };

  return (
    <Container>
      <h2>Edit Customer</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={customer.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={customer.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            value={customer.phoneNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="gender">
          <Form.Label>Gender</Form.Label>
          <Form.Control
            as="select"
            name="gender"
            value={customer.gender }
            onChange={handleChange}
            required
          >
            {GENDER_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="dateOfBirth">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dateOfBirth"
            value={customer.dateOfBirth.split('T')[0]} // Format date for input
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="image">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={customer.image}
            onChange={handleChange}
          />
        </Form.Group>
        <br />
        <Button variant="primary" type="submit">
          Update Customer
        </Button>
        <Button variant="secondary" onClick={() => navigate('/customer')}>
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default CustomerDetailPage;
