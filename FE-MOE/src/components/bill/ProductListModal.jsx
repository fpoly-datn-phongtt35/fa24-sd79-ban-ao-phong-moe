import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    Stack,
    IconButton,
    Dialog,
    Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { fetchAllBillProducts } from '~/apis/billsApi';
import { FormLabel, FormControl, Input, Select, Option } from '@mui/joy';
import { formatCurrencyVND } from '~/utils/format';
import { ImageRotator } from '../common/ImageRotator ';
import { attributeProducts } from '~/apis/productApi';

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

function ProductListModal({ onAddProduct, onClose }) {
    const pageSize = 5;
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const handlePageChange = (event, value) => setCurrentPage(value);
    const [attributes, setAttributes] = useState('');

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        console.log('Size:', size, 'Color:', color);
    }, [size, color]);

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            setCurrentPage(1);
            fetchProducts();
        }, 1000);

        debouncedSearch();
        return () => clearTimeout(debouncedSearch);
    }, [keyword, size, color]);

    useEffect(() => {
        fetchProducts();
    }, [currentPage, keyword, size, color]);

    const fetchProducts = async () => {
        const res = await fetchAllBillProducts(currentPage, pageSize, keyword, size, color);
        setProducts(res.data.content);
        setTotalProducts(res.data.totalElements);
    };

    const fetchFilterOptions = async () => {
        const res = await attributeProducts();
        setAttributes(res);
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        setKeyword('');
        setSize('');
        setColor('');
    };

    const handleAddProduct = (product) => {
        const productWithQuantity = { ...product, availableQuantity: product.quantity };
        onAddProduct(productWithQuantity);
    };
    

    const totalPages = Math.ceil(totalProducts / pageSize) || 1;

    return (
        <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
            <Container maxWidth="lg" sx={{ position: 'relative' }}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" gutterBottom align="center">
                    Danh sách sản phẩm
                </Typography>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={3}>
                        <FormControl sx={{ width: '100%' }}>
                            <FormLabel>Tìm kiếm</FormLabel>
                            <Input
                                placeholder="Tìm kiếm sản phẩm theo tên"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl sx={{ width: '100%' }}>
                            <FormLabel>Kích cỡ</FormLabel>
                            <Select
                                placeholder="Chọn kích cỡ"
                                value={size || ''}
                                onChange={(e, v) => {
                                    const selectedValue = v;
                                    console.log('Selected Size:', selectedValue);
                                    setSize(selectedValue);
                                }}
                            >
                                <Option value="">Chọn kích cỡ</Option>
                                {attributes?.sizes?.map((s) => (
                                    <Option key={s.id} value={s.name}>
                                        {s.name}
                                    </Option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl sx={{ width: '100%' }}>
                            <FormLabel>Màu sắc</FormLabel>
                            <Select
                                placeholder="Chọn màu sắc"
                                value={color || ''}
                                onChange={(e, v) => {
                                    const selectedValue = v;
                                    console.log('Selected Color:', selectedValue);
                                    setColor(selectedValue);
                                }}
                            >
                                <Option value="">Chọn màu sắc</Option>
                                {attributes?.colors?.map((c) => (
                                    <Option key={c.id} value={c.name}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleRefresh}
                            startIcon={<RefreshIcon />}
                            sx={{ marginTop: 3 }}
                        >
                            Làm mới
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell align="center">Số lượng</TableCell>
                                <TableCell align="center">Đơn giá</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow key={product.id}>
                                    <TableCell align="center">
                                        {(currentPage - 1) * pageSize + index + 1}
                                    </TableCell>

                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={2} position="relative">
                                            <Box position="relative">
                                                <ImageRotator imageUrl={product.imageUrl} w={110} h={120}/>
                                                {product.percent && (
                                                    <Box
                                                        position="absolute"
                                                        top={0}
                                                        left={0}
                                                        bgcolor="error.main"
                                                        color="white"
                                                        fontSize="0.5rem"
                                                        fontWeight="bold"
                                                        px={1}
                                                        py={0.5}
                                                        borderRadius="3px"
                                                        sx={{
                                                            transform: "translate(10%, -10%)",
                                                        }}
                                                    >
                                                        -{product.percent}%
                                                    </Box>
                                                )}
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {product.productName}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Màu: {product.color} - Kích cỡ: {product.size}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Thương hiệu: {product.brand}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell align="center">
                                        <Typography variant="body2" fontWeight="medium">
                                            {product.quantity}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="center">
                                        {product.sellPrice && product.percent ? (
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <Typography variant="body2" color="textSecondary" style={{ textDecoration: "line-through" }}>
                                                    {formatCurrencyVND(product.price)}
                                                </Typography>
                                                <Typography variant="body2" color="error" fontWeight="bold">
                                                    {formatCurrencyVND(product.sellPrice)}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" fontWeight="medium">
                                                {formatCurrencyVND(product.price)}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            startIcon={<AddShoppingCartIcon />}
                                            onClick={() => handleAddProduct(product)}
                                            sx={{
                                                padding: "4px 12px",
                                                fontSize: "0.875rem",
                                                fontWeight: "medium",
                                            }}
                                        >
                                            Thêm
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


                <Box display="flex" justifyContent="center" alignItems="center" padding={3}>
                    {totalPages > 1 && (
                        <Stack>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                variant="outlined"
                                shape="rounded"
                            />
                        </Stack>
                    )}
                </Box>
            </Container>
        </Dialog>
    );
}

export default ProductListModal;
