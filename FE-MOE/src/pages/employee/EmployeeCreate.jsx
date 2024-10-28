import React, { useEffect, useState } from 'react';
import { getEmployee, postEmployee, getAllPositions } from '~/apis/employeeApi';
import { getAllProvinces, getDistrictsByProvinceId, getWardsByDistrictId } from '~/apis/addressEmployeeApi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { FormControl, FormLabel, Input } from '@mui/joy';

const EmployeeForm = () => {
    const [data, setData] = useState(null);
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [phone_number, setPhone_number] = useState('');
    const [gender, setGender] = useState('');
    const [salary, setSalary] = useState('');
    const [positionId, setPositionId] = useState([]);
    const [selectedPositionId, setSelectedPositionId] = useState('');

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedProvinceName, setSelectedProvinceName] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedDistrictName, setSelectedDistrictName] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedWardName, setSelectedWardName] = useState('');

    const navigartor = useNavigate();
    const { id } = useParams();

    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        salary: '',
        positionId: ''
    });

    useEffect(() => {
        fetchPositions();
        fetchProvinces();
        if (id) {
            fetchEmployeeData(id);
        }
    }, [id]);

    const fetchPositions = async () => {
        try {
            const res = await getAllPositions();
            setPositionId(res.data);
        } catch (error) {
            console.error('Failed to fetch positions', error);
        }
    };

    const fetchProvinces = async () => {
        try {
            const data = await getAllProvinces();
            setProvinces(data); // Lưu danh sách tỉnh/thành phố vào state
        } catch (error) {
            console.error('Error fetching provinces:', error);
            toast.error('Không thể tải tỉnh/thành phố. Vui lòng thử lại sau.');
        }
    };

    const fetchEmployeeData = async (employeeId) => {
        try {
            const response = await getEmployee(employeeId);
            setData(response);
            setFirst_name(response.data.first_name);
            setLast_name(response.data.last_name);
            setPhone_number(response.data.phone_number);
            setGender(response.data.gender);
            setSalary(response.data.salaries);
            const position = response.data.position || '';
            setSelectedPositionId(position);

            // Gán tên tỉnh, huyện, xã từ dữ liệu nhân viên vào state
            setSelectedProvinceName(response.data.address.province);
            setSelectedDistrictName(response.data.address.district);
            setSelectedWardName(response.data.address.ward);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch employee data');
        }
    };

    const handleProvinceChange = async (event) => {
        const provinceId = event.target.value;
        const provinceName = event.target.options[event.target.selectedIndex].text; // Lấy tên tỉnh từ dropdown
        setSelectedProvince(provinceId);
        setSelectedDistrict(''); // Xóa huyện đã chọn khi thay đổi tỉnh
        setWards([]); // Xóa danh sách xã khi thay đổi tỉnh
    
        if (provinceId) {
            try {
                const data = await getDistrictsByProvinceId(provinceId);
                setDistricts(data);
                setSelectedProvinceName(provinceName); // Lưu tên tỉnh đã chọn
            } catch (error) {
                console.error('Error fetching districts:', error);
                toast.error('Không thể tải quận/huyện. Vui lòng thử lại sau.');
            }
        }
    };
    
    const handleDistrictChange = async (event) => {
        const districtId = event.target.value;
        const districtName = event.target.options[event.target.selectedIndex].text; // Lấy tên huyện từ dropdown
        setSelectedDistrict(districtId);
        setWards([]); // Xóa danh sách xã khi thay đổi huyện
    
        if (districtId) {
            try {
                const data = await getWardsByDistrictId(districtId);
                setWards(data);
                setSelectedDistrictName(districtName); // Lưu tên huyện đã chọn
            } catch (error) {
                console.error('Error fetching wards:', error);
                toast.error('Không thể tải xã/phường. Vui lòng thử lại sau.');
            }
        }
    };
    const handleWardChange = (event) => {
        const wardId = event.target.value;
        const wardName = event.target.options[event.target.selectedIndex].text;

        // Lưu ID và tên xã/phường đã chọn
        setSelectedWard(wardId);
        setSelectedWardName(wardName);
    };

    const saveEmployee = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const employee = {
                first_name,
                last_name,
                phone_number,
                gender,
                salary,
                positionId: selectedPositionId,
                address: {
                    province: selectedProvinceName, // Sử dụng tên tỉnh đã chọn
                    district: selectedDistrictName, // Sử dụng tên huyện đã chọn
                    ward: selectedWardName, // Sử dụng tên xã/phường đã chọn
                }
            };
            try {
                await postEmployee(employee);
                navigartor('/employee'); // Chuyển hướng sau khi lưu thành công
            } catch (error) {
                console.error('Error saving employee:', error);
                toast.error('Lưu nhân viên thất bại. Vui lòng thử lại sau.');
            }
        }
    };
    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (first_name.trim()) {
            errorsCopy.first_name = '';
        } else {
            errorsCopy.first_name = 'Không được trống tên';
            valid = false;
        }

        if (last_name.trim()) {
            errorsCopy.last_name = '';
        } else {
            errorsCopy.last_name = 'Không được trống tên đệm';
            valid = false;
        }

        if (phone_number.trim()) {
            errorsCopy.phone_number = '';
        } else {
            errorsCopy.phone_number = 'Không được trống số điện thoại';
            valid = false;
        }

        if (salary.trim()) {
            errorsCopy.salary = '';
        } else {
            errorsCopy.salary = 'Không được trống lương';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    };

    const pageTitle = () => {
        return id ? <h2 className='text-center'>Sửa nhân viên</h2> : <h2 className='text-center'>Thêm nhân viên</h2>;
    };

    return (
        <div className='container'>
            <div className='card col-md-8 offset-md-2'>
                {pageTitle()}
                <div className='card-body'>
                    <form onSubmit={saveEmployee}>
                        <FormControl >
                            <FormLabel required > Tên </FormLabel>
                            <Input
                                type="text"
                                placeholder='Nhập tên'
                                value={first_name}
                                className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                onChange={(e) => setFirst_name(e.target.value)}
                            />
                            {errors.first_name && <div className='invalid-feedback'>{errors.first_name}</div>}
                        </FormControl>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Tên Đệm</label>
                            <input type="text" placeholder='Nhập tên đệm'
                                value={last_name}
                                className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                onChange={(e) => setLast_name(e.target.value)} />
                            {errors.last_name && <div className='invalid-feedback'>{errors.last_name}</div>}
                        </div>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Sđt</label>
                            <input type="text" placeholder='Nhập số điện thoại'
                                value={phone_number} className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                                onChange={(e) => setPhone_number(e.target.value)} />
                            {errors.phone_number && <div className='invalid-feedback'>{errors.phone_number}</div>}
                        </div>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Giới Tính</label>
                            <div className='form-check form-check-inline'>
                                <input
                                    name='gender'
                                    className='form-check-input'
                                    type='radio'
                                    id='MALE'
                                    checked={gender === 'MALE'}
                                    onChange={() => setGender('MALE')}
                                />
                                <label className="form-check-label" htmlFor="MALE">Nam</label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <input
                                    name='gender'
                                    className='form-check-input'
                                    type='radio'
                                    id='FEMALE'
                                    checked={gender === 'FEMALE'}
                                    onChange={() => setGender('FEMALE')}
                                />
                                <label className="form-check-label" htmlFor="FEMALE">Nữ</label>
                            </div>
                            <div className='form-check form-check-inline'>
                                <input
                                    name='gender'
                                    className='form-check-input'
                                    type='radio'
                                    id='OTHER'
                                    checked={gender === 'OTHER'}
                                    onChange={() => setGender('OTHER')}
                                />
                                <label className="form-check-label" htmlFor="OTHER">Khác</label>
                            </div>
                        </div>
                        <div className='form-group mb-2'>
                            <label className='form-label'>Lương</label>
                            <input type="text" placeholder='Nhập lương'
                                value={salary} className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                                onChange={(e) => setSalary(e.target.value)} />
                            {errors.salary && <div className='invalid-feedback'>{errors.salary}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="position">Chức vụ</label>
                            <select
                                className="form-control"
                                value={selectedPositionId}
                                onChange={(e) => setSelectedPositionId(e.target.value)}
                            >
                                <option value="">--Chọn chức vụ--</option>
                                {positionId.map((position) => (
                                    <option key={position.id} value={position.id}>
                                        {position.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="province">Tỉnh/Thành phố</label>
                            <select
                                id="province"
                                className="form-control"
                                value={selectedProvince}
                                onChange={handleProvinceChange}
                            >
                                <option value="">Chọn Tỉnh/Thành Phố</option>
                                {provinces.map((province) => (
                                    <option key={province.ProvinceID} value={province.ProvinceID}>
                                        {province.ProvinceName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="district">Quận/Huyện</label>
                            <select
                                id="district"
                                className="form-control"
                                value={selectedDistrict}
                                onChange={handleDistrictChange}
                            >
                                <option value="">--Chọn quận/huyện--</option>
                                {districts.map((district) => (
                                    <option key={district.DistrictID} value={district.DistrictID}>
                                        {district.DistrictName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="ward">Xã/Phường</label>
                            <select
                                id="ward"
                                className="form-control"
                                value={selectedWard}
                                onChange={handleWardChange}
                            >
                                <option value="">--Chọn xã/phường--</option>
                                {wards.map((ward) => (
                                    <option key={ward.WardCode} value={ward.WardCode}>
                                        {ward.WardName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className='btn btn-primary'>
                            {id ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeForm;
