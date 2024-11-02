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

function ProductListModal({ onAddProduct, onClose }) {
    const pageSize = 5; // If pageSize is constant, we can define it here.
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetchAllBillProducts(currentPage, pageSize, keyword, size, color);
                console.log(res.data); 
                setProducts(res.data.content || []); 
                setTotalProducts(res.data.totalElements || 0);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [currentPage, keyword, size, color]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
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
        <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
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
                    <Grid item xs={3}> {/* Add item={true} */}
                        <FormControl sx={{ width: '100%' }}>
                            <FormLabel>Tìm kiếm</FormLabel>
                            <Input
                                placeholder="Tìm kiếm sản phẩm theo tên"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}> {/* Add item={true} */}
                        <FormControl sx={{ width: '100%' }}>
                            <FormLabel>Kích cỡ</FormLabel>
                            <Select
                                placeholder="Chọn kích cỡ"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                            >
                                <Option value="">Chọn kích cỡ</Option>
                                <Option value="39">39</Option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}> {/* Add item={true} */}
                        <FormControl sx={{ width: '100%' }}>
                            <FormLabel>Màu sắc</FormLabel>
                            <Select
                                placeholder="Chọn màu sắc"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            >
                                <Option value="">Chọn màu sắc</Option>
                                <Option value="Trắng">Trắng</Option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}> {/* Add item={true} */}
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
                                <TableRow key={product.id}>
                                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                                    <TableCell>
                                        <Box display="flex">
                                            <ImageRotator imageUrl={product.imageUrl} w={100} h={110} />
                                            <Box>
                                                <Typography variant="h6">{product.productName}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Màu: {product.color} - Kích cỡ: {product.size}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Thương hiệu: {product.brand}
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
        </Dialog>
    );
}

export default ProductListModal;
