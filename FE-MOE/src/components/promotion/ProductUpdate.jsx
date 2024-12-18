import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { fetchAllProducts } from "~/apis/productApi";
import { Checkbox } from "@mui/joy";
import debounce from "lodash/debounce";

export const ProductUpdate = ({ selectedProducts, setSelectedProducts }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        handleSetProducts();
    }, [currentPage, pageSize, keyword]);

    const handleSetProducts = async () => {
        const res = await fetchAllProducts(currentPage, pageSize, keyword);
        const fetchedProducts = res.data.content;

        setTotalPages(res.data.totalPages);

        if (currentPage === 1) {
            const MAX_PAGE_SIZE = 1000;
            const allRes = await fetchAllProducts(1, MAX_PAGE_SIZE, keyword);
            setAllProducts(allRes.data.content);
        }

        // Sắp xếp sản phẩm để hiển thị các sản phẩm đã chọn ở trên cùng
        const sortedProducts = fetchedProducts.sort((a, b) => {
            const isASelected = selectedProducts.includes(a.id);
            const isBSelected = selectedProducts.includes(b.id);
            return (isBSelected ? 1 : 0) - (isASelected ? 1 : 0);
        });

        setProducts(sortedProducts);
    };

    useEffect(() => {
        // Cập nhật `checked` của hộp kiểm bất cứ khi nào `selectedProducts` thay đổi
        setProducts((prevProducts) =>
            prevProducts.map((product) => ({
                ...product,
                checked: selectedProducts.includes(product.id),
            }))
        );
    }, [selectedProducts]);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allProductIds = allProducts.map((product) => product.id);
            setSelectedProducts(allProductIds);
        } else {
            setSelectedProducts([]);
        }
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

    // Chức năng tìm kiếm bị trả lại để giảm thiểu các cuộc gọi API
    const debouncedSearch = debounce((value) => {
        setKeyword(value); // Cập nhật từ khóa cho tìm kiếm API
        setCurrentPage(1); // Đặt lại trang đầu tiên trên tìm kiếm mới
    }, 500); // 500ms delay

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        debouncedSearch(value);
    };

    return (
        <div className="container mt-5">
            <h2>Danh sách sản phẩm</h2>

            {/* Search bar */}
            <div className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập từ khóa tìm kiếm..."
                    onChange={handleSearchInputChange}
                />
            </div>

            <table className="table table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th>
                            <Checkbox
                                onChange={handleSelectAll}
                                checked={selectedProducts.length === allProducts.length && allProducts.length > 0}
                            />
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

            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
            />
        </div>
    );
};
