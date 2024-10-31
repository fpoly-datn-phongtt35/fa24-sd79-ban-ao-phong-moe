

{/* ------------------------------- Customer ----------------------------------- */ }


{/* ------------------------------- Bill ----------------------------------- */ }

<Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
    <Typography variant="h6" fontWeight="bold" color="textPrimary">
        Thông tin thanh toán
    </Typography>
    <Divider sx={{ my: 2 }} />

    <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
            <img
                src="https://via.placeholder.com/300x300?text=Product+Image"
                alt="Shoe"
                style={{ maxWidth: '100%', borderRadius: '8px' }}
            />
        </Grid>
        {/* ------------------------------- Coupon ----------------------------------- */}
        <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button
                    startIcon={<DiscountIcon />}
                    variant="text"
                    onClick={openCouponModal}
                >
                    Phiếu giảm giá
                </Button>
                <Typography variant="body2" color="textSecondary">
                    Chọn hoặc nhập mã &gt;
                </Typography>
            </Box>

            <CouponModal
                open={isCouponModalOpen}
                onClose={closeCouponModal}
                onSelectCoupon={handleSelectCoupon}
            />



            {/* ------------------------------- Thong tin hoa don ----------------------------------- */}
            <Grid container spacing={1}>
                <Grid item xs={6}><Typography>Tạm tính:</Typography></Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography>470,000 đ</Typography></Grid>

                <Grid item xs={6}><Typography>Giảm giá:</Typography></Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography>47,000 đ</Typography></Grid>
            </Grid>

            {/* ------------------------------- Hien thi coupon ----------------------------------- */}
            {getCurrentOrderData().coupon && (
                <Box sx={{ backgroundColor: '#e6f4ea', p: 1, borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
                    <Typography variant="body2" color="green">
                        Áp dụng thành công phiếu giảm giá <strong>{getCurrentOrderData().coupon.name}</strong>
                    </Typography>
                    <Chip
                        label={
                            getCurrentOrderData().coupon.discountType === 'FIXED_AMOUNT'
                                ? `Giảm ${formatCurrencyVND(getCurrentOrderData().coupon.discountValue)} đơn tối thiểu ${formatCurrencyVND(getCurrentOrderData().coupon.conditions)}`
                                : `Giảm ${getCurrentOrderData().coupon.discountValue}% đơn tối thiểu ${formatCurrencyVND(getCurrentOrderData().coupon.conditions)}`
                        }
                        color="success"
                    />
                    <IconButton color="error" size="small" onClick={handleRemoveCoupon}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}

            {/* Total Amount */}
            <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6}><Typography variant="h6">Tổng tiền:</Typography></Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}><Typography variant="h6" color="error">423,000 đ</Typography></Grid>
            </Grid>

            {/* Customer Payment Input */}
            <TextField
                label="Tiền khách đưa"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                Vui lòng nhập đủ tiền khách đưa!
            </Typography>

            {/* Change Due */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography>Tiền thừa:</Typography>
                <Typography fontWeight="bold">0 đ</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Payment Methods */}
            <Typography variant="body2" sx={{ mb: 1 }}>Chọn phương thức thanh toán:</Typography>
            <Box display="flex" justifyContent="space-between">
                <Button variant="contained" sx={{ backgroundColor: '#FFD700', color: 'black' }} startIcon={<LocalAtmIcon />}>
                    Tiền mặt
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#2196f3', color: 'white' }} startIcon={<CreditCardIcon />}>
                    Chuyển khoản
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#424242', color: 'white' }} startIcon={<LocalAtmIcon />}>
                    Tiền mặt & Chuyển khoản
                </Button>
            </Box>

            {/* Generate Invoice Button */}
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Tạo hóa đơn
            </Button>
        </Grid>
    </Grid>
</Paper>