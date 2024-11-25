import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { fetchAllProducts } from '~/apis/productApi';
import { Checkbox } from '@mui/joy';
import debounce from 'lodash/debounce';

export const ProductList = ({ selectedProducts, setSelectedProducts }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [allProducts, setAllProducts] = useState([]); // State để lưu tất cả sản phẩm

    useEffect(() => {
        handleSetProducts();
    }, [currentPage, pageSize, keyword]);

    // Hàm lấy danh sách sản phẩm từ API
    const handleSetProducts = async () => {
        const res = await fetchAllProducts(currentPage, pageSize, keyword);
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);

        // Chỉ lấy toàn bộ sản phẩm khi đang ở trang đầu
        if (currentPage === 1) {
            const MAX_PAGE_SIZE = 1000; // Giới hạn số lượng sản phẩm tối đa
            const allRes = await fetchAllProducts(1, MAX_PAGE_SIZE, keyword);
            setAllProducts(allRes.data.content);
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts((prevSelected) => {
            if (prevSelected.includes(productId)) {
                return prevSelected.filter((id) => id !== productId);
            } else {
                return [...prevSelected, productId];
            }
        });
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allProductIds = allProducts.map((product) => product.id);
            setSelectedProducts(allProductIds);
        } else {
            setSelectedProducts([]);
        }
    };

    // Hàm xử lý thay đổi tìm kiếm với debounce
    const debouncedSearch = debounce((value) => {
        setKeyword(value); // Cập nhật từ khóa tìm kiếm
        setCurrentPage(1); // Reset về trang đầu
    }, 500); // Delay 500ms

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        debouncedSearch(value);
    };

    return (
        <div className="container mt-5">
            <h2>Danh sách sản phẩm</h2>

            {/* Thanh tìm kiếm */}
            <div className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập từ khóa tìm kiếm..."
                    onChange={handleSearchInputChange}
                />
            </div>

            {/* Bảng sản phẩm */}
            <table className="table table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th>
                            <Checkbox onChange={handleSelectAll} />
                        </th>
                        <th>STT</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Thương hiệu</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.id}>
                            <td>
                                <Checkbox
                                    checked={selectedProducts.includes(product.id)}
                                    onChange={() => handleSelectProduct(product.id)}
                                />
                            </td>
                            <td>{(currentPage - 1) * pageSize + index + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Phân trang */}
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                className="mt-3"
            />
        </div>
    );
};
