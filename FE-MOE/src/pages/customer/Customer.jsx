// Customer.jsx
import { Container } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { fetchAllCustomer, deleteCustomer } from "~/apis/customerApi"; 
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import { toast } from 'react-toastify'; 
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export const Customer = () => {
  const [customers, setCustomers] = useState([]); 

  useEffect(() => {
    handleSetCustomer();
  }, []);

  const handleSetCustomer = async () => {
    const response = await fetchAllCustomer();
    setCustomers(response.data);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) { 
      try {
        await deleteCustomer(id); 
        toast.success("Customer deleted successfully!"); 
        setCustomers(customers.filter(customer => customer.id !== id));
      } catch (error) {
        toast.error("There was an error deleting the customer"); 
      }
    }
  };

  return (
    <Container>
      <table className="table">
        <thead>
          <tr>
            <th>STT</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Date Of Birth</th>
            <th>Image</th>
            <th>CreateAt</th>
            <th>UpdateAt</th>
            <th>Actions</th> 
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.phoneNumber}</td>
                <td>{customer.gender}</td>
                <td>{formatDate(customer.dateOfBirth)}</td>
                <td>{customer.image}</td>
                <td>{formatDate(customer.createdAt)}</td>
                <td>{formatDate(customer.updatedAt)}</td>
                <td>
                  <Link to={`/customer/${customer.id}`}>
                    <FaEdit style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }} />
                  </Link>
                  <FaTrashAlt
                    style={{ cursor: 'pointer', color: 'red' }}
                    onClick={() => handleDelete(customer.id)} 
                  />
                </td> 
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No customers available</td>
            </tr>
          )}
        </tbody>
      </table>
    </Container>
  );
};
