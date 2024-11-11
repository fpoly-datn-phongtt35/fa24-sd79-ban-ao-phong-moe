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

const StatusModal = ({ open, onClose, onStatusConfirm }) => {
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [customNote, setCustomNote] = useState('');

  useEffect(() => {
    fetchBillStatus();
  }, []);

  const fetchBillStatus = async () => {
    try {
      const status = await getAllStatuses();
      setStatuses(status.data);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    }
  };

  const handleStatusChange = (event) => {
    const statusValue = event.target.value;
    setSelectedStatus(statusValue);
    if (statusValue !== '9') {
      setCustomNote('');
    }
  };

  const handleCustomNoteChange = (event) => {
    setCustomNote(event.target.value);
  };

  const handleConfirm = () => {
    onStatusConfirm(selectedStatus, customNote);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nhập ghi chú</DialogTitle>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Hủy</Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">Xác nhận</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusModal;
