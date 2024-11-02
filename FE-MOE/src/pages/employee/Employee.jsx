// src/pages/employee/Employee.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid, TextField, Typography, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Pagination
} from '@mui/material';
import { toast } from 'react-toastify';
import { getAllEmployee, deleteEmployee, searchNameAndPhone } from "~/apis/employeeApi";
import AddIcon from '@mui/icons-material/Add';
import { Avatar, Breadcrumbs, Button, Link } from '@mui/joy';
import HomeIcon from "@mui/icons-material/Home";
import { formatCurrencyVND, formatDateWithoutTime } from '~/utils/format';
export const Employee = () => {
    const [employee, setEmployee] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [phone_number, setPhone_number] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại (bắt đầu từ 1)
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [itemsPerPage] = useState(5); // Số lượng nhân viên mỗi trang
    const navigate = useNavigate();

    useEffect(() => {
        handleSetEmployee(currentPage);
    }, [currentPage]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    useEffect(() => {
        if (!keyword && !phone_number) {
            handleSetEmployee(currentPage);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            handleSearchNameAndPhone();
        }, 500); // Đặt thời gian debounce ngắn hơn

        return () => clearTimeout(delayDebounceFn);
    }, [keyword, phone_number]);

    const handleSearchNameAndPhone = async () => {
        try {
            const res = await searchNameAndPhone(keyword.trim(), phone_number.trim());
            if (res && res.data && Array.isArray(res.data.data)) {
                setEmployee(res.data.data);
                setTotalPages(Math.ceil(res.data.totalElements / itemsPerPage));
            } else {
                setEmployee([]);
            }
        } catch (error) {
            console.error('Error during search:', error);
            setEmployee([]);
        }
    };

    const handleSetEmployee = async (page) => {
        try {
            const res = await getAllEmployee(page - 1, itemsPerPage); // API bắt đầu từ 0
            if (res && res.data) {
                setEmployee(res.data.content || res.data.data);
                setTotalPages(res.data.totalPages || Math.ceil(res.data.totalElements / itemsPerPage));
            } else {
                setEmployee([]);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            setEmployee([]);
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const addNewEmployee = () => {
        navigate('/employee/add');
    };

    const removeEmployee = async (id) => {
        try {
            await deleteEmployee(id);
            toast.success("Xóa nhân viên thành công!");
            handleSetEmployee(currentPage);
        } catch (error) {
            console.error("Error deleting employee:", error);
            toast.error("Xóa nhân viên thất bại!");
        }
    };

    const updateEmployee = (id) => {
        navigate(`/employee/${id}`);
    };

    const handleClear = () => {
        setKeyword('');
        setPhone_number('');
        setCurrentPage(1);
        handleSetEmployee(1);
    };

    return (
        <div>
            <Grid
                container
                spacing={2}
                alignItems="center"
                marginBottom={2}
                height={"50px"}
            >
                <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
                    <Link
                        underline="hover"
                        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                        color="inherit"
                        onClick={() => navigate("/")}
                    >
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Trang chủ
                    </Link>
                    <Typography sx={{ color: "text.white", cursor: "pointer" }}>
                        Quản lý nhân viên
                    </Typography>
                </Breadcrumbs>
            </Grid>

            <Grid container spacing={2} alignItems="center" style={{ marginTop: '20px' }}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Tìm nhân viên"
                        variant="standard"
                        fullWidth
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Số điện thoại"
                        variant="standard"
                        fullWidth
                        value={phone_number}
                        onChange={(e) => setPhone_number(e.target.value)}
                        size="small"
                    />
                </Grid>
            </Grid>

            <div className="text-end">
                <Button
                    startDecorator={<AddIcon />}
                    onClick={addNewEmployee}

                >
                    Thêm nhân viên
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClear}
                    style={{ margin: '20px' }}
                >
                    Xóa Tìm Kiếm
                </Button>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow className="text-center">
                            <TableCell>Avatar</TableCell>
                            <TableCell>Họ Và Tên</TableCell>
                            <TableCell>SĐT</TableCell>
                            <TableCell>Giới Tính</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Ngày Sinh</TableCell>
                            <TableCell>Lương</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Chức vụ</TableCell>
                            <TableCell>Thao Tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(employee) && employee.length > 0 ? (
                            employee.map((emp, index) => (
                                <TableRow key={emp.id} className="text-center">
                                    <TableCell>
                                        <Avatar alt={emp.first_name} src={emp?.avatar} />
                                    </TableCell>
                                    <TableCell>{emp.fullName || 'N/A'}</TableCell>
                                    <TableCell>{emp.phone_number || 'N/A'}</TableCell>
                                    <TableCell>{emp.gender || 'N/A'}</TableCell>
                                    <TableCell>{emp.email || 'N/A'}</TableCell>
                                    <TableCell>{formatDateWithoutTime(emp.date_of_birth)}</TableCell>

                                    <TableCell>
                                        {emp.salaries && typeof emp.salaries === 'object' ? (
                                            formatCurrencyVND(emp.salaries.amount) || 'N/A'
                                        ) : (
                                            formatCurrencyVND(emp.salaries) || 'N/A'
                                        )}

                                    </TableCell>
                                    <TableCell>
                                        {emp.employee_address && typeof emp.employee_address === 'object' ? (
                                            <div>
                                                <div>{emp.employee_address.province || 'N/A'}</div>
                                                <div>{emp.employee_address.district || 'N/A'}</div>
                                                <div>{emp.employee_address.ward || 'N/A'}</div>
                                                <div>{emp.employee_address.streetName || 'N/A'}</div>
                                            </div>
                                        ) : (
                                            'N/A'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {typeof emp.position === 'object' ? (emp.position.name || 'N/A') : (emp.position || 'N/A')}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => removeEmployee(emp.id)}
                                            style={{ marginRight: '10px' }}
                                        >
                                            Xóa
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            onClick={() => updateEmployee(emp.id)}
                                        >
                                            Sửa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    Không tìm thấy nhân viên nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>
        </div>
    );
};

export default Employee;
