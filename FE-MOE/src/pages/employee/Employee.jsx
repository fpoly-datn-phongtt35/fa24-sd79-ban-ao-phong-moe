import { getAllEmployee, deleteEmployee, searchNameAndPhone } from "~/apis/employeeApi";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid, TextField, Typography, Button, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { toast } from 'react-toastify';

export const Employee = () => {
    const [employee, setEmployee] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [phone_number, setPhone_number] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        handleSetEmployee();
    }, []);

    useEffect(() => {
        if (!keyword && !phone_number) {
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            handleSearchNameAndPhone();
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [keyword, phone_number]);

    const handleSearchNameAndPhone = async () => {
        try {
            const res = await searchNameAndPhone(keyword.trim(), phone_number.trim());
            console.log('Search results:', res);

            if (res && res.data && Array.isArray(res.data.data)) {
                setEmployee(res.data.data);
            } else {
                setEmployee([]);
            }
        } catch (error) {
            console.error('Error during search:', error);
            setEmployee([]);
        }
    };

    const handleSetEmployee = async () => {
        try {
            const res = await getAllEmployee();
            if (res && Array.isArray(res.data)) {
                setEmployee(res.data);
            } else if (res && Array.isArray(res.data.data)) {
                setEmployee(res.data.data);
            } else {
                console.warn('API response data is not an array:', res);
                setEmployee([]);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            setEmployee([]);
        }
    };

    const addNewEmployee = () => {
        navigate('/employee/add');
    };

    const removeEmployee = async (id) => {
        try {
            await deleteEmployee(id);
            console.log("Xóa thành công!", id);
            handleSetEmployee();
            toast.success("Xóa nhân viên thành công!");
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
        handleSetEmployee(); // Đặt lại danh sách nhân viên
    };

    return (
        <div>
            <Typography variant="h5" component="span" fontWeight="bold">
                Quản lý nhân viên
            </Typography>
            <Grid container spacing={2} alignItems="center" style={{ marginTop: '20px' }}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Tìm  nhân viên"
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
                    variant="contained"
                    color="primary"
                    onClick={addNewEmployee}
                    style={{ margin: '20px' }}
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
                            <TableCell>STT</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Tên Đệm</TableCell>
                            <TableCell>SĐT</TableCell>
                            <TableCell>Giới Tính</TableCell>
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
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{emp.first_name || 'N/A'}</TableCell>
                                    <TableCell>{emp.last_name || 'N/A'}</TableCell>
                                    <TableCell>{emp.phone_number || 'N/A'}</TableCell>
                                    <TableCell>{emp.gender || 'N/A'}</TableCell>
                                    <TableCell>
                                        {typeof emp.salaries === 'object' ? 
                                            (emp.salaries.amount || 'N/A') : 
                                            (emp.salaries || 'N/A')}
                                    </TableCell>
                                    <TableCell>
                                        {typeof emp.employee_address === 'object' ? 
                                            `${emp.employee_address.city }` : 
                                            (emp.employee_address || 'N/A')}
                                    </TableCell>
                                    <TableCell>
                                        {typeof emp.position === 'object' ? 
                                            (emp.position.name || 'N/A') : 
                                            (emp.position || 'N/A')}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="error" onClick={() => removeEmployee(emp.id)} style={{ marginRight: '10px' }}>
                                            Xóa
                                        </Button>
                                        <Button variant="contained" color="info" onClick={() => updateEmployee(emp.id)}>
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
        </div>
    );
};

export default Employee;
