import React, { useState } from 'react';
import { putPassword } from '~/apis/employeeApi';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Lấy userId từ localStorage
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleOldPasswordChange = (e) => {
    const value = e.target.value;
    setOldPassword(value);
    if (value) {
      setErrors((prev) => ({ ...prev, oldPassword: '' }));
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    if (value) {
      setErrors((prev) => {
        let newErrors = { ...prev, newPassword: '' };
        if (!passwordRegex.test(value)) {
          newErrors.newPassword = "Mật khẩu mới phải từ 6-20 ký tự, bao gồm ít nhất một chữ cái viết hoa và một ký tự đặc biệt";
        }
        return newErrors;
      });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value) {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,20}$/;

  const validateInputs = () => {
    let tempErrors = {};
    if (!oldPassword) {
      tempErrors.oldPassword = "Mật khẩu cũ là bắt buộc";
    }
    if (!newPassword) {
      tempErrors.newPassword = "Mật khẩu mới là bắt buộc";
    } else if (!passwordRegex.test(newPassword)) {
      tempErrors.newPassword = "Mật khẩu mới phải từ 6-20 ký tự, bao gồm ít nhất một chữ cái viết hoa và một ký tự đặc biệt";
    }
    if (!confirmPassword) {
      tempErrors.confirmPassword = "Mật khẩu nhập lại là bắt buộc";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    if (newPassword !== confirmPassword) {
       toast.error('Mật khẩu mới và mật khẩu nhắc lại không khớp.');
      return;
    }
    const data = { oldPassword, newPassword, confirmPassword };

    await putPassword(data, userId).then((res)=>{
      if(res?.data.status==200){
        toast.success(res?.data.message);
        navigate('/'); // Chuyển hướng sau khi đổi mật khẩu thành công
      }else{
        toast.error(res?.data.message);
      }
    })
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto', mt: 4 }}
    >
      <Typography variant="h5" textAlign="center">Đổi Mật Khẩu</Typography>
      <TextField
        label="Mật khẩu cũ"
        type="password"
        value={oldPassword}
        onChange={handleOldPasswordChange}
      />
      {errors.oldPassword && (
        <Typography color="error" variant="body2">{errors.oldPassword}</Typography>
      )}

      <TextField
        label="Mật khẩu mới"
        type="password"
        value={newPassword}
        onChange={handleNewPasswordChange}
      />
      {errors.newPassword && (
        <Typography color="error" variant="body2">{errors.newPassword}</Typography>
      )}

      <TextField
        label="Nhắc lại mật khẩu mới"
        type="password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
      />
      {errors.confirmPassword && (
        <Typography color="error" variant="body2">{errors.confirmPassword}</Typography>
      )}

      <Button type="submit" variant="contained" color="primary">Đổi mật khẩu</Button>
    </Box>
  );
};

export default ChangePasswordForm; 