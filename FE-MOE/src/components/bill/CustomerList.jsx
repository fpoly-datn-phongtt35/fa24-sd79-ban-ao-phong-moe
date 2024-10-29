import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { fetchAllCustomer, searchKeywordAndDate } from '~/apis/customerApi';
import Dialog from '@mui/material/Dialog';
import AddCustomerModal from './AddCustomerModal';

export default function CustomerList() {
    const [customer, setCustomer] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
    });
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        handleSetCustomer();
    }, []);

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
            fullName: selectedCustomer.fullName || 'N/A',
            email: selectedCustomer.email || 'N/A',
            phoneNumber: selectedCustomer.phoneNumber || 'N/A',
        });
        setSearchTerm(selectedCustomer.fullName);
        setShowDropdown(false);
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
                        <TextField
                            placeholder="Tìm kiếm khách hàng..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ flex: 1, minWidth: 0 }}
                        />
                        <Button
                            size="medium"
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
                                    <ListItem key={index} onClick={() => handleCustomerSelect(c)} role="button" tabIndex={0}>
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

            {searchTerm && filteredCustomers.length > 0 ? (
                <Box>
                    <Typography variant="body1"><strong>Tên khách hàng:</strong> {customer.fullName}</Typography>
                    <Typography variant="body1"><strong>Email:</strong> {customer.email}</Typography>
                    <Typography variant="body1"><strong>Số điện thoại:</strong> {customer.phoneNumber}</Typography>
                </Box>
            ) : (
                <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    Không có khách hàng nào lẻ.
                </Typography>
            )}

            <Dialog open={openModal} onClose={handleCloseModal}>
                <AddCustomerModal open={openModal} setOpenModal={setOpenModal} />
            </Dialog>
        </Paper>
    );
}
