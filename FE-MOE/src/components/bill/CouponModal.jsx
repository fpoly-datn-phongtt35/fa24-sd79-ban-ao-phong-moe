import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField, Pagination } from '@mui/material';
import { formatCurrencyVND } from '~/utils/format';
import { deleteCoupon, fetchAllCouponCustomer } from '~/apis/billsApi';

export default function CouponModal({ open, onClose, onSelectCoupon, customerId, subtotal }) {
    const [coupons, setCoupons] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isAutoApplied, setIsAutoApplied] = useState(false);

    const validCustomerId = customerId ?? 0;

    useEffect(() => {
        if (open) {
            setIsAutoApplied(false);
            setSelectedCoupon(null);
            handleSetCouponCustomer(); // Fetch lại dữ liệu khi modal mở
        }
    }, [open, validCustomerId, keyword, page]); // Thêm `page` vào dependencies
    // Depend on `open`, `validCustomerId`, and `keyword`

    // useEffect(() => {
    //     if (subtotal > 0) {
    //         applyBestCouponAutomatically();
    //     }
    // }, [subtotal]);

    const handleSetCouponCustomer = async (allCoupons = false) => {
        try {
            const size = allCoupons ? 1000 : pageSize; // Số lượng item mỗi trang
            const res = await fetchAllCouponCustomer(validCustomerId, page, keyword, size);
            setCoupons(res.data.content || []); // Cập nhật danh sách coupon
            setTotalPages(res.data.totalPages || 0); // Cập nhật số trang         
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        }
    };

    const applyBestCouponAutomatically = async () => {
        try {
            // Lấy tất cả các phiếu giảm giá từ API
            const res = await fetchAllCouponCustomer(validCustomerId, 1, keyword, 1000); // Lấy toàn bộ phiếu giảm giá
            const allCoupons = res.data.content || [];
    
            // Lọc các phiếu giảm giá đủ điều kiện
            const eligibleCoupons = allCoupons.filter(coupon => subtotal >= coupon.conditions);
    
            if (eligibleCoupons.length === 0) {
                console.log('Không có phiếu giảm giá đủ điều kiện.');
                return; // Không có phiếu giảm giá nào đủ điều kiện
            }
    
            // Hàm tính giá trị giảm thực tế của phiếu giảm giá
            const calculateDiscount = (coupon) => {
                const rawDiscount = coupon.discountType === 'FIXED_AMOUNT'
                    ? coupon.discountValue
                    : subtotal * (coupon.discountValue / 100); // Giá trị giảm thô
                return coupon.maxValue
                    ? Math.min(rawDiscount, coupon.maxValue) // Áp dụng giới hạn tối đa
                    : rawDiscount;
            };
    
            // Tìm phiếu giảm giá tốt nhất từ danh sách
            const bestCoupon = eligibleCoupons.reduce((prev, current) => {
                const prevDiscount = calculateDiscount(prev);
                const currentDiscount = calculateDiscount(current);
    
                // So sánh giá trị giảm thực tế
                if (prevDiscount !== currentDiscount) {
                    return prevDiscount > currentDiscount ? prev : current;
                }
    
                // Nếu giá trị giảm bằng nhau, ưu tiên phiếu có maxDiscountValue lớn hơn
                if ((prev.maxValue || Infinity) !== (current.maxValue || Infinity)) {
                    return (prev.maxValue || Infinity) > (current.maxValue || Infinity) ? prev : current;
                }
    
                // Nếu tất cả các điều kiện bằng nhau, giữ phiếu trước (hoặc logic khác nếu cần)
                return prev;
            });
    
            // Tính giá trị giảm của phiếu giảm giá tốt nhất
            const bestDiscount = calculateDiscount(bestCoupon);
    
            // Tính giá trị giảm của phiếu hiện tại (nếu có)
            const currentDiscount = selectedCoupon ? calculateDiscount(selectedCoupon) : 0;
    
            // So sánh phiếu giảm giá hiện tại và phiếu giảm giá tốt nhất
            if (currentDiscount >= bestDiscount) {
                console.log('Giữ phiếu giảm giá hiện tại vì nó tốt hơn hoặc bằng phiếu tốt nhất.');
                return; // Không thay thế nếu phiếu hiện tại tốt hơn hoặc bằng
            }
    
            // Cập nhật phiếu giảm giá tốt nhất nếu nó có giá trị giảm nhiều hơn
            console.log('Áp dụng phiếu giảm giá tốt nhất:', bestCoupon);
            onSelectCoupon(bestCoupon);
            setSelectedCoupon(bestCoupon);
            setIsAutoApplied(true);
        } catch (error) {
            console.error('Failed to apply the best coupon:', error);
        }
    };
    

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event) => {
        setKeyword(event.target.value);
        setPage(1); // Reset page to 1 on search
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
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
                        const isEligible = subtotal >= coupon.conditions;
                        return (
                            <Box
                                key={index}
                                sx={{
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
                                        setSelectedCoupon(coupon);
                                        setIsAutoApplied(false);
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
                        variant="outlined"
                        shape="rounded"
                        color="primary"
                        sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
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
