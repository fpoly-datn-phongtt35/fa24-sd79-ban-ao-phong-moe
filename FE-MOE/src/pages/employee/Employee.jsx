// src/pages/employee/Employee.jsx
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid, TextField, Typography, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Pagination, IconButton,Switch
} from '@mui/material';
import { toast } from 'react-toastify';
import { getAllEmployee, deleteEmployee, searchNameAndPhone, setLocked } from "~/apis/employeeApi";
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
    const [lockedStates, setLockedStates] = useState({});

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
                // console.log(res.data.data);
                setTotalPages(Math.ceil(res.data.totalElements / itemsPerPage));
            } else {
                setEmployee([]);
            }
        } catch (error) {
            console.error('Error during search:', error);
            setEmployee([]);
        }
    };

    const onSetLocked = async (id, currentLockedState) => {
        const updatedLockedState = !currentLockedState;

        try {

            await setLocked(id, updatedLockedState);


            setLockedStates((prevStates) => ({
                ...prevStates,
                [id]: updatedLockedState,
            }));

            console.log(`employee ${id} isLocked: ${updatedLockedState}`);
        } catch (error) {
            console.error("Failed to update lock status:", error);
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
                <div className="text-end" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '15px' }}>
                    <Button
                        startDecorator={<AddIcon />}
                        onClick={addNewEmployee}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                    >
                        Thêm nhân viên
                    </Button>
                    <Button
                        size="sm"
                        variant="solid"
                        color="danger"
                        onClick={handleClear}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b32d3a'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                    >
                        Xóa Tìm Kiếm
                    </Button>
                </div>

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
                            {/* <TableCell>Địa chỉ</TableCell> */}
                            <TableCell>Trạng Thái</TableCell>
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
                                    <TableCell>{emp.full_name || 'N/A'}</TableCell>
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
                                    {/* <TableCell>
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
                                    </TableCell> */}
                                    <TableCell>
                                        <Switch size="lg"
                                            checked={lockedStates[emp.id] ?? emp.isLocked}
                                            onClick={() => onSetLocked(emp.id, lockedStates[emp.id] ?? emp.isLocked)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {typeof emp.position === 'object' ? (emp.position.name || 'N/A') : (emp.position || 'N/A')}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => removeEmployee(emp.id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>

                                        <IconButton onClick={() => updateEmployee(emp.id)}>
                                            <EditIcon />
                                        </IconButton>
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
