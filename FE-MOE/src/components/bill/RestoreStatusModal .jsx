import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const RestoreStatusModal = ({ open, onClose, onConfirm }) => {
  const [customNote, setCustomNote] = useState("");

  const handleConfirm = () => {
    if (!customNote.trim()) {
      alert("Ghi chú không được để trống.");
      return;
    }
    onConfirm(customNote); // Gửi ghi chú cho hàm xử lý
    setCustomNote(""); // Xóa nội dung khi đóng modal
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Khôi phục trạng thái</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Nhập ghi chú"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestoreStatusModal;
