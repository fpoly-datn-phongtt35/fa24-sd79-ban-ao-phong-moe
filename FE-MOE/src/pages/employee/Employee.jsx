
import { getAllEmployee, deleteEmployee } from "~/apis/employeeApi";
import { useState, useEffect } from 'react'
import { redirect, useNavigate } from 'react-router-dom'

export const Employee = () => {

    const [employee, setEmployee] = useState([])
    const navigator = useNavigate();

    useEffect(() => {
        handleSetEmployee();
    }, []);

    const handleSetEmployee = async () => {
        const res = await getAllEmployee();
        setEmployee(res.data);
    };

    function addNewEmployee() {
        navigator('/employee/add')
    }

    function removeEmployee(id) {
        console.log(id);
        deleteEmployee(id)
            .then((response) => {
                console.log("Xóa thành công!", response);
                handleSetEmployee();
            })
            .catch((error) => {
                console.error(error);
            });
    }
    function updateEmployee(id) {
        navigator(`/employee/${id}`)
    }
    return (
        <div>
            <div className="fs-5">
                <span className="fw-bold">Quản lý nhân viên</span>
            </div>
            <div className="text-end">
                <button onClick={addNewEmployee} className="btn btn-primary m-3">Thêm nhân viên</button>
            </div>
            <table className="table">
                <thead>
                    <tr className="text-center">

                        <th scope="col">STT</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Tên Đệm</th>
                        <th scope="col">Sđt</th>
                        <th scope="col">Giới Tính</th>
                        {/* <th scope="col">Ngày Sinh</th> */}
                        <th scope="col">Lương</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Chức vụ</th>
                        <th scope="col">Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {employee &&
                        employee.map((employee, index) => (
                            <tr key={index} className="text-center">
                                <th scope="row">{index + 1}</th>
                                {/* <td>{employee.id}</td> */}
                                <td>{employee.first_name}</td>
                                <td>{employee.last_name}</td>
                                <td>{employee.phone_number}</td>
                                <td>{employee.gender}</td>
                                {/* <td>{employee.date_of_birth}</td> */}
                                <td>{employee.salaries}</td>
                                <td>{employee.employee_address}</td>
                                <td>{employee.position}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => removeEmployee(employee.id)}>Xóa</button>	&nbsp;
                                    <button className="btn btn-info" onClick={() => updateEmployee(employee.id)}>Sửa</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}

