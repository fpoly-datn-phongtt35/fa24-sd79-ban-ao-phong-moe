import React from 'react';
import { Checkbox, Typography, Box, Stack, Pagination, TextField, Grid } from '@mui/material';

const CustomerTableCreate = ({
    keyword,
    setKeyword,
    customers,
    type,
    isAllSelected,
    handleSelectAll,
    isSelected,
    handleSelectCustomer,
    formatDateCustomer,
    selectedCustomersError,
    totalPages,
    page,
    handlePageChange,
}) => {
    return (
        <Grid item xs={6}>
            <TextField
                variant="outlined"
                label="Tìm kiếm khách hàng"
                fullWidth
                margin="normal"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            <table className="table table-bordered table-hover">
                <thead className="table-primary text-center">
                    <tr>
                        {type === 'PERSONAL' ? (
                            <th>
                                <Checkbox
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        ) : (
                            <th style={{ width: '1%' }}></th>
                        )}
                        <th>Tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Ngày sinh</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length === 0 && (
                        <tr>
                            <td colSpan={5} align="center">
                                Không tìm thấy khách hàng!
                            </td>
                        </tr>
                    )}
                    {customers && customers.map((customer, index) => (
                        <tr key={index}>
                            {type === 'PERSONAL' ? (
                                <td>
                                    <Checkbox
                                        checked={isSelected(customer.id)}
                                        onChange={() => handleSelectCustomer(customer.id)}
                                    />
                                </td>
                            ) : (
                                <td></td>
                            )}
                            <td>{customer.fullName}</td>
                            <td>{customer.phoneNumber}</td>
                            <td>{customer.email}</td>
                            <td>{formatDateCustomer(customer.dateOfBirth)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedCustomersError && (
                <Typography color="error">{selectedCustomersError}</Typography>
            )}
            <Box mt={2} display="flex" justifyContent="center">
                {totalPages > 1 && (
                    <Stack spacing={2}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            variant="outlined"
                            shape="rounded"
                        />
                    </Stack>
                )}
            </Box>
        </Grid>
    );
};

export default CustomerTableCreate;
