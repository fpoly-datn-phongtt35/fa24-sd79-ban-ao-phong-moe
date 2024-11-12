import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert } from '@mui/material';
import { putPassword } from '~/apis/employeeApi';

const ChangePasswordForm = ({ userId, open, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và mật khẩu nhắc lại không khớp.');
      return;
    }

    try {
      const data = { oldPassword, newPassword, confirmPassword };
      await putPassword(data, userId);
      setSuccess('Đổi mật khẩu thành công!');
      setError('');
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      setError('Đổi mật khẩu thất bại!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Đổi mật khẩu</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <TextField
          label="Mật khẩu cũ"
          type="password"
          fullWidth
          margin="dense"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <TextField
          label="Mật khẩu mới"
          type="password"
          fullWidth
          margin="dense"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <TextField
          label="Nhắc lại mật khẩu mới"
          type="password"
          fullWidth
          margin="dense"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Đổi mật khẩu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordForm;
