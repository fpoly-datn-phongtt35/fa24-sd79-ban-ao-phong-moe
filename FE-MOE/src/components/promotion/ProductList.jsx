import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { fetchAllProducts } from '~/apis/productApi';
import { Checkbox } from '@mui/joy';

export const ProductList = ({ selectedProducts, setSelectedProducts }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [allProducts, setAllProducts] = useState([]); // State to hold all products

    useEffect(() => {
        handleSetProducts();
    }, [currentPage, pageSize, keyword]);

    const handleSetProducts = async () => {
        const res = await fetchAllProducts(currentPage, pageSize, keyword);
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
    
        if (currentPage === 1) { // Only fetch all products on the first page
            const MAX_PAGE_SIZE = 1000; // Set a reasonable limit
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
                return prevSelected.filter(id => id !== productId); 
            } else {
                return [...prevSelected, productId]; 
            }
        });
        console.log(productId);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allProductIds = allProducts.map(product => product.id); // Use allProducts here
            setSelectedProducts(allProductIds);
            console.log(allProductIds);
        } else {
            setSelectedProducts([]);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Danh sách sản phẩm</h2>
            <table className="table table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th><Checkbox onChange={handleSelectAll} /></th>
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
                onChange={handlePageChange}
                color="primary"
                className="mt-3"
            />
        </div>
    );
};
