import React, { useEffect, useState, useRef } from 'react';
import {
    Paper,
    Typography,
    Box,
    TextField,
    InputAdornment,
    Button,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Dialog,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { fetchAllCustomer, fetchCustomerById, searchKeywordAndDate } from '~/apis/customerApi';
import { deleteCustomer, fetchBill, fetchCustomer } from '~/apis/billsApi';
import AddCustomerModal from './AddCustomerModal';

export default function CustomerList({ selectedOrder, onAddCustomer, customerId, setCustomerId }) {
    const [customer, setCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const searchRef = useRef(null);
    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        city: '',
        district: '',
        ward: '',
        streetName: ''
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    useEffect(() => {
        if (customerId === null) {
            setCustomer(null);
            setSearchTerm('');
        }
    }, [customerId]);

    useEffect(() => {
        if (selectedOrder) {
            handleSetCustomer(selectedOrder);
        }
    }, [selectedOrder]);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const response = await fetchAllCustomer();
            if (response.data.content) {
                setCustomers(response.data.content);
                setFilteredCustomers(response.data.content);
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (keyword) => {
        setLoading(true);
        try {
            const res = await searchKeywordAndDate(keyword || '', '', '');
            if (res.data.content) {
                setFilteredCustomers(res.data.content);
            }
        } catch (error) {
            console.error('Error during search:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        if (term.trim()) {
            handleSearch(term);
        } else {
            setFilteredCustomers(customers);
        }
        setShowDropdown(true);
    };

    const handleCustomerSelect = (selectedCustomer) => {
        setCustomer(selectedCustomer);
        setSearchTerm(selectedCustomer.fullName);
        setShowDropdown(false);
        onAddCustomer(selectedCustomer);
        setCustomerId(selectedCustomer.id);
    };

    const handleDeleteCustomer = async (id) => {
        try {
            await deleteCustomer(id);
            setCustomers((prevCustomers) => prevCustomers.filter(c => c.id !== id));
            setFilteredCustomers((prevFiltered) => prevFiltered.filter(c => c.id !== id));

            setCustomer(null);
            setSearchTerm('');
            onAddCustomer({ id: 0 });
            loadCustomers();
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchCustomerDetail();
        } else {
            setCustomerData(null);
        }
    }, [customerId]);

    const fetchCustomerDetail = async () => {
        if (!customerId) {
            console.error("Customer ID is missing");
            return;
        }

        try {
            const response = await fetchCustomerById(customerId);
            const customerData = response.data;

            setCustomerData({
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                phoneNumber: customerData.phoneNumber,
                email: customerData.email,
                city: customerData.city,
                district: customerData.district,
                ward: customerData.ward,
                streetName: customerData.streetName
            });
        } catch (error) {
            console.error("Failed to fetch customer detail:", error);
        }
    };

    const handleSetCustomer = async (orderId) => {
        const response = await fetchCustomer(orderId);
        if (response?.data) {
            setCustomers(response.data);
            setCustomer(response.data[0]);
            setCustomerId(response.data[0]?.id || null);
        }
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    return (
        <Paper elevation={2} sx={{ padding: 2, borderRadius: 2, mb: 3 }}>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Thông tin khách hàng
                </Typography>
                <Box display="flex" gap={1} alignItems="center" justifyContent="space-between">
                    {customer ? (
                        <>
                            <span>{customer.lastName} {customer.firstName} </span>
                            <Button
                                onClick={() => handleDeleteCustomer(customer.id)}
                                size="small"
                                sx={{ minWidth: 'auto', padding: '4px', color: 'red' }}
                            >
                                <ClearIcon fontSize="small" />
                            </Button>
                        </>
                    ) : null}
                </Box>
                <Box display="flex" flexDirection="column" gap={1} position="relative" width="40%">
                    <Box display="flex" gap={1} alignItems="center" width="100%">
                        <TextField
                            placeholder="Tìm kiếm khách hàng..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            disabled={!selectedOrder}
                            inputRef={searchRef}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ flex: 3, minWidth: 0, width: 100 }}
                        />
                        <Button
                            size="large"
                            variant="contained"
                            color="warning"
                            startIcon={<AddIcon />}
                            sx={{ whiteSpace: 'nowrap' }}
                            onClick={handleOpenModal}
                        >
                            Thêm mới KH
                        </Button>
                    </Box>

                    {loading ? (
                        <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', right: '10px', marginTop: '-12px' }} />
                    ) : (
                        showDropdown && filteredCustomers.length > 0 && (
                            <List
                                sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'background.paper',
                                    zIndex: 1,
                                    maxHeight: 200,
                                    overflow: 'auto',
                                    border: '1px solid #ddd',
                                    mt: 1,
                                }}
                            >
                                {filteredCustomers.map((c, index) => (
                                    <ListItem
                                        key={index}
                                        onClick={() => handleCustomerSelect(c)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <ListItemText
                                            primary={`${c.lastName + " " + c.firstName || 'N/A'} - ${c.phoneNumber || 'N/A'}`}
                                            secondary={null}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )
                    )}
                </Box>
            </Box>

            {customerData ? (
                <Box>
                    <Typography variant="body1"><strong>Tên khách hàng:</strong> {customerData.lastName} {customerData.firstName}</Typography>
                    <Typography variant="body1"> <strong>Email:</strong> {customerData.email}</Typography>
                    <Typography variant="body1"><strong>Số điện thoại:</strong> {customerData.phoneNumber}</Typography>
                </Box>
            ) : (
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    Khách hàng lẻ.
                </Typography>
            )}

            <Dialog open={openModal} onClose={handleCloseModal}>
                <AddCustomerModal open={openModal} setOpenModal={setOpenModal} />
            </Dialog>
        </Paper>
    );
}
