import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    InputLabel,
    Pagination,
    Stack,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { fetchAllBillProducts } from '~/apis/billsApi';
import { ImageRotator } from '../common/ImageRotator ';
import { FormLabel, FormControl, Input, Select, Option, Grid } from '@mui/joy';
import { formatCurrencyVND } from '~/utils/format';

function ProductListModal({ onAddProduct, onClose }) {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalProducts, setTotalProducts] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [status, setStatus] = useState('ALL');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [material, setMaterial] = useState('');
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        handleSetProducts();
    }, [
        currentPage,
        pageSize,
        keyword,
        status,
        category,
        brand,
        material,
        origin,
    ]);

    const handleSetProducts = async () => {
        try {
            const res = await fetchAllBillProducts(
                currentPage,
                pageSize,
                keyword,
                size,
                color,
                brand
            );
            console.log(res.data);
            setProducts(res.data.content);
            setTotalProducts(res.data.totalElements);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSearch = () => {
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        setKeyword('');
        setSize('');
        setColor('');
    };

    const handleAddProduct = (product) => {
        onAddProduct(product);
    };

    const totalPages = Math.ceil(totalProducts / pageSize) || 1;

    return (
        <Container maxWidth="maxWidth" sx={{ position: 'relative' }}>        
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
            
            {/* Filter and Search Fields */}
            <Grid container spacing={2} mb={2}>
                <Grid item="true" xs={3}>
                    <FormControl sx={{ width: '100%' }}>
                        <FormLabel>Tìm kiếm</FormLabel>
                        <Input
                            label="Tên sản phẩm"
                            variant="outlined"
                            placeholder="Tìm kiếm sản phẩm theo tên"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </FormControl>
                </Grid>
                <Grid item="true" xs={3}>
                    <FormControl sx={{ width: '100%' }}>
                        <FormLabel>Kích cỡ</FormLabel>
                        <Select
                            placeholder="Chọn kích cỡ"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        >
                            <Option value="">Chọn kích cỡ</Option>
                            <Option value="39">39</Option>
                            {/* Add more sizes as needed */}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item="true" xs={3}>
                    <FormControl sx={{ width: '100%' }}>
                        <FormLabel>Màu sắc</FormLabel>
                        <Select
                            placeholder="Chọn màu sắc"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        >
                            <Option value="">Chọn màu sắc</Option>
                            <Option value="Trắng">Trắng</Option>
                            {/* Add more colors as needed */}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item="true" xs={3}>
                    <FormControl sx={{ width: '100%', marginTop: 3 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleRefresh}
                            startIcon={<RefreshIcon />}
                        >
                            Làm mới
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Product List Table */}
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
                            <TableRow key={index}>
                                <TableCell>
                                    {(currentPage - 1) * pageSize + index + 1}
                                </TableCell>
                                <TableCell>
                                    <Box display="flex">
                                        <ImageRotator imageUrl={product.imageUrl} w={100} h={110} />
                                        <Box>
                                            <Typography variant="h6" color="textPrimary">
                                                {product.productName}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Màu: {product.color} - Kích cỡ: {product.size}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Thương hiệu: {product.brand}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Chất liệu: {product.material}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Quốc gia: {product.origin}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">{product.quantity}</TableCell>
                                <TableCell align="center">{formatCurrencyVND(product.price)}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddShoppingCartIcon />}
                                        onClick={() => handleAddProduct(product)}
                                    >
                                        Thêm
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
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
    );
}

export default ProductListModal;
