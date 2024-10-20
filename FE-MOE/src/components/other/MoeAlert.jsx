import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

export const MoeAlert = ({ button, event, title, message }) => {
  const [open, setOpen] = React.useState(false);
  const handleOk = () => {
    event();
    setOpen(false);
  };
  return (
    <React.Fragment>
      <span onClick={() => setOpen(true)}>{button}</span>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            {title}
          </DialogTitle>
          <Divider />
          <DialogContent>{message}</DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() => handleOk()}>
              Đồng ý
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};
