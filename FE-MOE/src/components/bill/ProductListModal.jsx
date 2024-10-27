import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
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
    Select,
    InputLabel,
    FormControl,
    Pagination,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { fetchAllBillProducts } from '~/apis/billsApi';
import { ImageRotator } from '../common/ImageRotator ';

function ProductListModal() {
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
            setProducts(res.data);        
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

    const totalPages = Math.ceil(totalProducts / pageSize) || 0;

    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom align="center">
                    Danh sách sản phẩm
                </Typography>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Tên sản phẩm"
                            variant="outlined"
                            placeholder="Tìm kiếm sản phẩm theo tên"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel>Kích cỡ</InputLabel>
                            <Select
                                label="Kích cỡ"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Chọn kích cỡ</em>
                                </MenuItem>
                                <MenuItem value="39">39</MenuItem>
                                {/* Add more sizes as needed */}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel>Màu sắc</InputLabel>
                            <Select
                                label="Màu sắc"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Chọn màu sắc</em>
                                </MenuItem>
                                <MenuItem value="Trắng">Trắng</MenuItem>
                                {/* Add more colors as needed */}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={handleRefresh}
                            startIcon={<RefreshIcon />}
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
                                <TableCell>Image</TableCell>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Đơn giá</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products && products.map((product, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {(currentPage - 1) * pageSize + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <ImageRotator imageUrl={product.imageUrl} w={70} h={90} />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{product.productName}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Màu: {product.color} - Kích cỡ: {product.size}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Thương hiệu: {product.brand}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>{product.price} đ</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddShoppingCartIcon />}
                                        >
                                            Thêm
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    padding={3}
                >
                    {products.totalPages > 1 && (
                        <Stack>
                            <Pagination
                                count={products.totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                variant="outlined"
                                shape="rounded"
                            />
                        </Stack>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}

export default ProductListModal;
