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
import { MoeAlert } from '../other/MoeAlert';  // Assuming MoeAlert is a custom alert component

const StatusModal = ({ open, onClose, onStatusConfirm, currentStatuses }) => {
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);  // State to show the confirmation alert
  const [pendingStatus, setPendingStatus] = useState(null);  // Store the selected status temporarily

  useEffect(() => {
    fetchBillStatus();
  }, []);

  const fetchBillStatus = async () => {
    try {
      const status = await getAllStatuses();
      const filteredStatuses = status.data.filter((status) =>
        [4, 8, 7].includes(status.id)
      );
      setStatuses(filteredStatuses);
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };

  const handleStatusChange = (event) => {
    const statusValue = event.target.value;
    if (currentStatuses.includes(Number(statusValue))) {
      setError('Trạng thái này đã tồn tại!');
      return;
    }

    setError('');  
    setSelectedStatus(statusValue);  
    setPendingStatus(statusValue); 
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
    setShowAlert(true);
  };

  const handleAlertConfirm = () => {
    onStatusConfirm(pendingStatus, customNote);
    setShowAlert(false); 
    onClose(); 
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
    setPendingStatus(null);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
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

          <MoeAlert
            title="Chú ý"
            message="Bạn có muốn thay đổi trạng thái đơn hàng này?"
            event={handleAlertConfirm}
            cancelButton={<Button onClick={handleAlertCancel}>Hủy</Button>}
            button={<Button color="primary" variant="contained">
              Xác nhận
            </Button>}
          />
        </DialogActions>
      </Dialog>

    </>
  );
};

export default StatusModal;
