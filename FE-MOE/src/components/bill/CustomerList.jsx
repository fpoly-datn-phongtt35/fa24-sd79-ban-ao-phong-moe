import React, {useEffect, useState } from 'react';
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
import { fetchAllCustomer, searchKeywordAndDate } from '~/apis/customerApi';
import AddCustomerModal from './AddCustomerModal';
import { deleteCustomer, fetchBill } from '~/apis/billsApi';
import ClearIcon from '@mui/icons-material/Clear';
import { Input } from '@mui/joy';

export default function CustomerList({ selectedOrder, onAddCustomer, onUpdateCouponCustomer }) {

    const [customer, setCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [bills, setBills] = useState([]);

    useEffect(() => {
        handleSetCustomer();
        handleSetBill();
    }, []);

    useEffect(() => {
        if (selectedOrder) {
            const customerFromBill = findCustomerInBills(selectedOrder);
            setCustomer(customerFromBill);
        }
    }, [selectedOrder, bills]);

    const handleSetBill = async () => {
        try {
            const response = await fetchBill();
            if (response?.data) {
                setBills(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch bills:', error);
        }
    };

    const handleSetCustomer = async () => {
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

    const handleSearchKeywordAndDate = async (keyword) => {
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
            handleSearchKeywordAndDate(term);
        } else {
            setFilteredCustomers(customers);
        }
        setShowDropdown(true);
    };

    const handleCustomerSelect = (selectedCustomer) => {
        setCustomer({
            ...selectedCustomer,
            user: selectedCustomer.user || {}
        });
        setSearchTerm(selectedCustomer.fullName);
        setShowDropdown(false);
        onAddCustomer(selectedCustomer);  
    };

    const handleAddCustomer = (customer) => {
        onAddCustomer(customer);  
    };

    const handleDeleteCustomer = async (customerId) => {
        try {
            await deleteCustomer(customerId);
            setCustomer(null);
            setSearchTerm('');
            setFilteredCustomers(customers);  
            onAddCustomer({ id: 0 });
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };
    
    const findCustomerInBills = (orderId) => {
        const billWithCustomer = bills.find(bill => bill.id === orderId);
        return billWithCustomer ? billWithCustomer.customer : null;
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    return (
        <Paper elevation={2} sx={{ padding: 2, borderRadius: 2, mb: 3 }}>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Thông tin khách hàng
                </Typography>
                <Box display="flex" flexDirection="column" gap={1} position="relative" width="40%">
                    <Box display="flex" gap={1} alignItems="center" width="100%">
                        <Box sx={{ flex: customer ? '1' : '0' }}>
                            {customer ? (
                                <>
                                    <span>{customer.firstName} {customer.lastName}</span>
                                    <Button
                                        onClick={() => handleDeleteCustomer(selectedOrder)}
                                        size="small"
                                        sx={{ minWidth: 'auto', padding: '4px', color: 'red' }}
                                    >
                                        <ClearIcon fontSize="small" />
                                    </Button>
                                </>
                            ) : null}
                        </Box>
                        <TextField
                            placeholder="Tìm kiếm khách hàng..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            disabled={!selectedOrder}
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
                                            primary={`${c.fullName || 'N/A'} - ${c.phoneNumber || 'N/A'}`}
                                            secondary={null}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )
                    )}
                </Box>
            </Box>

            {customer ? (
                <Box>
                    <Typography variant="body1"><strong>Tên khách hàng:</strong> {customer.firstName} {customer.lastName}</Typography>
                    <Typography variant="body1"><strong>Email:</strong> {customer.user ? customer.user.email : 'N/A'}</Typography>
                    <Typography variant="body1"><strong>Số điện thoại:</strong> {customer.phoneNumber}</Typography>
                </Box>
            ) : (
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    Không có thông tin khách hàng.
                </Typography>
            )}

            <Dialog open={openModal} onClose={handleCloseModal}>
                <AddCustomerModal open={openModal} setOpenModal={setOpenModal} />
            </Dialog>
        </Paper>
    );
}
