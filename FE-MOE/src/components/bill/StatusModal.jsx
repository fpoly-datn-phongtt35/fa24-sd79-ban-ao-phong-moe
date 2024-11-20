import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@mui/material';
import { getAllStatuses } from '~/apis/billListApi';

const StatusModal = ({ open, onClose, onStatusConfirm, currentStatuses }) => {
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBillStatus();
  }, []);

  const fetchBillStatus = async () => {
    try {
      const status = await getAllStatuses();
      const filteredStatuses = status.data.filter((status) =>
        [5, 7, 8, 9].includes(status.id)
      );
      setStatuses(filteredStatuses);
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };

  const handleStatusChange = (event) => {
    const statusValue = event.target.value;
    console.log(currentStatuses.includes(Number(statusValue)))

    // Kiểm tra trạng thái đã tồn tại
    if (currentStatuses.includes(Number(statusValue))) {
      setError('Trạng thái này đã tồn tại!');
      return;
    }

    setError(''); // Xóa lỗi nếu hợp lệ
    setSelectedStatus(statusValue);
    if (statusValue !== '9') {
      setCustomNote('');
    }
  };

  const handleCustomNoteChange = (event) => {
    setCustomNote(event.target.value);
  };

  const handleConfirm = () => {
    if (selectedStatus === '') {
      setError('Vui lòng chọn trạng thái.');
      return;
    }

    onStatusConfirm(selectedStatus, customNote);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chọn trạng thái đơn hàng</DialogTitle>
      <DialogContent>
        <RadioGroup value={selectedStatus} onChange={handleStatusChange}>
          {statuses.map((status) => (
            <FormControlLabel
              key={status.id}
              value={status.id}
              control={<Radio />}
              label={status.name}
            />
          ))}
        </RadioGroup>
        {selectedStatus === '9' && (
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Nhập ghi chú..."
            value={customNote}
            onChange={handleCustomNoteChange}
            style={{ marginTop: '10px' }}
          />
        )}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Hủy</Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusModal;
