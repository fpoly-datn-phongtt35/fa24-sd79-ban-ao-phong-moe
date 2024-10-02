import React, { useEffect, useState } from 'react'
import { getEmployee, putEmployee, getAllPositions } from "~/apis/employeeApi";
import { useNavigate, useParams } from 'react-router-dom'

const EmployeesUpdate = () => {
    const [data, setData] = useState(null);

    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [phone_number, setPhone_number] = useState('');
    const [gender, setGender] = useState('');
    //    const[date_of_birth,setDate_of_birth] = useState('')
    const [salary, setSalary] = useState('');
    const [city, setCity] = useState('');
    const [positionId, setPositionId] = useState([]);
    const [selectedPositionId, setSelectedPositionId] = useState('');
    const navigartor = useNavigate();
    const { id } = useParams();

    const [errors, setErros] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        salary: '',
        city: '',
        positionId: ''
    })

    useEffect(() => {
        handleSetPositions();
    }, []);

    const handleSetPositions = async () => {
        try {
            const res = await getAllPositions();
            setPositionId(res.data); // Cập nhật danh sách chức vụ
        } catch (error) {
            console.error('Failed to fetch positions', error);
        }
    };

    useEffect(() => {
        handleSetPositions();
        if (id) {
            getEmployee(id)
                .then((response) => {
                setData(response);
                console.log(response);
                setFirst_name(response.data.first_name);
                setLast_name(response.data.last_name);
                setPhone_number(response.data.phone_number);
                setGender(response.data.gender);
                setSalary(response.data.salaries);
                setCity(response.data.employee_address);
                const position = response.data.position || '';
                setSelectedPositionId(position);
                console.log("Fetched position from API: ", position)
                })
                .catch(error => {
                    console.error(error);
                    toast.error('Failed to fetch employee data');
                });
        }
    }, [id]);

    getEmployee(id)
    .then((response) => {
        const positionName = response.data.position; // Lấy tên vị trí
        setSelectedPositionId(positionId.find(pos => pos.name === positionName)?.id || ''); // Tìm ID dựa trên tên
        console.log("Fetched position from API: ", positionName); // Log tên vị trí
    })
    .catch(error => {
        console.error(error);
        toast.error('Failed to fetch employee data');
    });

    const saveEmployee = (e) => {
        e.preventDefault();
       
            const employee = {
                first_name: first_name,
                last_name: last_name,
                phone_number: phone_number,
                gender: gender,
                salary: salary,
                city: city,
                positionId: selectedPositionId // Sử dụng selectedPosition ở đây
            }
            console.log(employee);
            putEmployee(employee, id).then((response) => {
                // console.log(response.data);
                navigartor('/employee')
            });
        
    }

    // function validateForm() {
    //     let valid = true;
    //     const errorsCopy = { ...errors }

    //     if (first_name.trim()) {
    //         errorsCopy.first_name = '';
    //     } else {
    //         errorsCopy.first_name = 'Không được trống tên';
    //         valid = false;
    //     }

    //     if (last_name.trim()) {
    //         errorsCopy.last_name = '';
    //     } else {
    //         errorsCopy.last_name = 'Không được trống tên đệm';
    //         valid = false;
    //     }

    //     if (phone_number.trim()) {
    //         errorsCopy.phone_number = '';
    //     } else {
    //         errorsCopy.phone_number = 'Không được trống số điện thoại';
    //         valid = false;
    //     }

    //     if (salary.trim()) {
    //         errorsCopy.salary = '';
    //     } else {
    //         errorsCopy.salary = 'Không được trống lương';
    //         valid = false;
    //     }

    //     if (city.trim()) {
    //         errorsCopy.city = '';
    //     } else {
    //         errorsCopy.city = 'Không được trống thành phố';
    //         valid = false;
    //     }

    //     setErros(errorsCopy);
    //     return valid;
    // }
    const pageTitle = () => {
        if (id) {
            return <h2 className='text-center'>Update Employee</h2>;
        } else {
            return <h2 className='text-center'>Add Employee</h2>;
        }
    };

    return (
        <div>
            <div className='container'>
                <div className='card col-md-8 offset-md-2 offset-md-2'>
                    {pageTitle()}
                    <div className='card-body'>
                        <form action="">
                            <div className='form-group mb-2'>
                                <label className='form-label'> First Name</label>
                                <input
                                    type="text"
                                    placeholder='Nhập tên'
                                    name='first_name'
                                    value={first_name}
                                    className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                    onChange={(e) => setFirst_name(e.target.value)}
                                />
                                {/* {errors.first_name && <div className='invalid-feedback'>{errors.first_name}</div>} */}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Tên Đệm</label>
                                <input type="text" placeholder='nhập tên đệm' name='last_name'
                                    value={last_name}
                                    className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} onChange={(e) => setLast_name(e.target.value)} />
                                {/* {errors.last_name && <div className='invalid-feedback'>{errors.last_name}</div>} */}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Sđt</label>
                                <input type="text" placeholder='nhập số điện thoại' name='phone_number'
                                    value={phone_number} className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`} onChange={(e) => setPhone_number(e.target.value)} />
                                {/* {errors.phone_number && <div className='invalid-feedback'>{errors.phone_number}</div>} */}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Giới Tính</label>

                                <div className='form-check form-check-inline'>
                                    <input
                                        name='gender'
                                        className='form-check-input'
                                        type='radio'
                                        id='MALE'
                                        checked={gender === 'MALE'} // Kiểm tra xem gender có phải là 'MALE' không
                                        onChange={() => setGender('MALE')} // Cập nhật gender khi chọn 'MALE'
                                    />
                                    <label className="form-check-label" htmlFor="MALE">MALE</label>
                                </div>

                                <div className='form-check form-check-inline'>
                                    <input
                                        name='gender'
                                        className='form-check-input'
                                        type='radio'
                                        id='FEMALE'
                                        checked={gender === 'FEMALE'} // Kiểm tra xem gender có phải là 'FEMALE' không
                                        onChange={() => setGender('FEMALE')} // Cập nhật gender khi chọn 'FEMALE'
                                    />
                                    <label className="form-check-label" htmlFor="FEMALE">FEMALE</label>
                                </div>

                                <div className='form-check form-check-inline'>
                                    <input
                                        name='gender'
                                        className='form-check-input'
                                        type='radio'
                                        id='OTHER'
                                        checked={gender === 'OTHER'} // Kiểm tra xem gender có phải là 'OTHER' không
                                        onChange={() => setGender('OTHER')} // Cập nhật gender khi chọn 'OTHER'
                                    />
                                    <label className="form-check-label" htmlFor="OTHER">OTHER</label>
                                </div>
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Lương</label>
                                <input type="text" placeholder='nhập lương' name='salary'
                                    value={salary} className={`form-control ${errors.salary ? 'is-invalid' : ''}`} onChange={(e) => setSalary(e.target.value)} />
                                {/* {errors.salary && <div className='invalid-feedback'>{errors.salary}</div>} */}
                            </div>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Địa chỉ</label>
                                <input type="text" placeholder='nhập địa chỉ' name='employee_address'
                                    value={city} className={`form-control ${errors.city ? 'is-invalid' : ''}`} onChange={(e) => setCity(e.target.value)} />
                                {/* {errors.city && <div className='invalid-feedback'>{errors.city}</div>} */}
                            </div>
                            <div className="form-group">
                                <label htmlFor="position">Chức vụ</label>
                                <select
                                    className="form-control"
                                    id="position"
                                    value={selectedPositionId} // Giá trị của combobox
                                    onChange={(e) => setSelectedPositionId(e.target.value)}
                                >
                                    <option value="">Chọn chức vụ</option>
                                    {positionId.map((pos) => (
                                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button className='btn btn-primary ' onClick={saveEmployee}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default EmployeesUpdate