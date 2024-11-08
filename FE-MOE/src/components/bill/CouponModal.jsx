import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField, Pagination } from '@mui/material';
import { formatCurrencyVND } from '~/utils/format';
import { fetchAllCouponCustomer } from '~/apis/billsApi';

export default function CouponModal({ open, onClose, onSelectCoupon, customerId, subtotal }) {
    const [coupons, setCoupons] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');

    const validCustomerId = customerId ?? 0;

    useEffect(() => {
        if (open) {
            handleSetCouponCustomer();
        }
    }, [open, page, keyword]);

    useEffect(() => {
        if (validCustomerId) {
            handleSetCouponCustomer();
        }
    }, [validCustomerId]);

    // Function to apply the best eligible coupon automatically
    const applyBestCouponAutomatically = () => {
        if (coupons.length > 0) {
            const bestCoupon = coupons
                .filter(coupon => subtotal >= coupon.conditions) // filter eligible coupons
                .reduce((prev, current) => {
                    // Find the coupon with the highest discount value
                    const prevDiscount = prev.discountType === 'FIXED_AMOUNT' ? prev.discountValue : subtotal * (prev.discountValue / 100);
                    const currentDiscount = current.discountType === 'FIXED_AMOUNT' ? current.discountValue : subtotal * (current.discountValue / 100);
                    return prevDiscount > currentDiscount ? prev : current;
                });

            if (bestCoupon) {
                onSelectCoupon(bestCoupon); // apply the best coupon
                onClose(); // close the modal
            }
        }
    };

    const handleSetCouponCustomer = async () => {
        try {
            const res = await fetchAllCouponCustomer(validCustomerId, page, keyword, pageSize);
            setCoupons(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event) => {
        setKeyword(event.target.value);
        setPage(1); // Reset to the first page on new search
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Chọn phiếu giảm giá</DialogTitle>
            <DialogContent dividers>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Tìm kiếm phiếu giảm giá theo mã, tên..."
                    margin="dense"
                    value={keyword}
                    onChange={handleSearchChange}
                />

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Phiếu giảm giá dành riêng cho bạn
                </Typography>

                {coupons.length > 0 ? (
                    coupons.map((coupon, index) => {
                        // Check if coupon meets the subtotal condition
                        const isEligible = subtotal >= coupon.conditions;

                        return (
                            <Box
                                key={index}
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 1,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    mb: 1,
                                    bgcolor: isEligible ? '#f9f9f9' : '#e0e0e0', 
                                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                                    cursor: isEligible ? 'pointer' : 'not-allowed', 
                                    opacity: isEligible ? 1 : 0.5 
                                }}
                                onClick={() => {
                                    if (isEligible) {
                                        onSelectCoupon(coupon);
                                        onClose();
                                    }
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" color="textPrimary" sx={{ fontWeight: 'bold' }}>
                                        <span style={{ color: '#FFD700' }}>[{coupon.code}]</span> {coupon.name}
                                        <Box component="span" sx={{ ml: 1, bgcolor: '#FFD700', color: 'black', px: 1, borderRadius: '4px', fontSize: '12px' }}>
                                            {coupon.discountType === 'FIXED_AMOUNT' ? `${formatCurrencyVND(coupon.discountValue)}` : `${coupon.discountValue}%`}
                                        </Box>
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Đơn tối thiểu: {formatCurrencyVND(coupon.conditions)}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption" color="textSecondary">
                                        Ngày kết thúc: {formatDate(coupon.endDate)}
                                    </Typography>
                                    {!isEligible && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                            Không đủ điều kiện sử dụng
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        );
                    })
                ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography color="textSecondary">Không có phiếu giảm giá nào khả dụng</Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={applyBestCouponAutomatically} color="primary">
                    Áp dụng phiếu giảm giá tốt nhất
                </Button>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}
