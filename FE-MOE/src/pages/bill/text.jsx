<div>
<hr />
<div>
  <Typography variant="h5" style={{ color: 'red', fontWeight: 'bold' }}>
    THÔNG TIN SẢN PHẨM
  </Typography>
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'end', mt: 3, justifyContent: 'flex-end' }}>
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
    >
      Thêm sản phẩm
    </Button>
  </Box>

  <Dialog open={isProductListModalOpen} onClose={closeProductListModal} maxWidth="lg" fullWidth>
    <ProductListModal
      onAddProduct={onProduct}
      onClose={closeProductListModal}
      order={selectedOrder}
    />
  </Dialog>

</div> 

  <List sx={{ mb: 3 }}>
  {billData?.map((bd, index) => (
    <ListItem
      key={index}
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: 1,
        mb: 2,
        transition: '0.3s',
        '&:hover': {
          boxShadow: 3,
          backgroundColor: '#f9f9f9',
        },
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={4} sm={3} md={2}>
          {bd?.billDetails?.productDetail?.imageUrl?.length > 0 ? (
            <ImageRotator imageUrl={bd.billDetails.productDetail.imageUrl} w={100} h={110} />
          ) : (
            <Box
              sx={{
                width: 90,
                height: 100,
                bgcolor: 'grey.300',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2">No Image</Typography>
            </Box>
          )}

        </Grid>
        <Grid item xs={4} sm={5} md={6}>
          <ListItemText
            primary={<Typography variant="h6" fontWeight="bold">{bd.productDetail?.productName}</Typography>}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Kích thước: {bd.productDetail?.size} - Màu sắc: {bd.productDetail?.color}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Xuất xứ: {bd.productDetail?.origin} - Vật liệu: {bd.productDetail?.material}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={2} md={2} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
          <Input
            type="number"
            value={bd.quantity}
            // onChange={(e) => handleQuantityChange(bd.id, parseInt(e.target.value, 10) || '')}
            sx={{
              width: '80%',
              '& input': {
                textAlign: 'center',
              },
            }}
          />
          {errorMessage && (
            <Typography color="error" sx={{ marginTop: 1, fontSize: '0.875rem' }}>
              {errorMessage}
            </Typography>
          )}
        </Grid>
        <Grid item xs={4} sm={2} md={2} display="flex" justifyContent="flex-end" alignItems="center">
          <Typography variant="body2" sx={{ mr: 1 }}>
            {bd.discountAmount === bd.productDetail?.price ? (
              formatCurrencyVND(bd.productDetail?.price * bd.quantity)
            ) : (
              <>
                <span style={{ textDecoration: "line-through", color: "gray", marginRight: 8 }}>
                  {formatCurrencyVND(bd.productDetail?.price * bd.quantity)}
                </span>
                <span style={{ color: "red" }}>
                  {formatCurrencyVND(bd.discountAmount * bd.quantity)}
                </span>
              </>
            )}
          </Typography>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  ))}
</List> 

</div>