import { Box, Modal, ModalDialog } from "@mui/joy";

export const ZoomImage = ({ url, handleClose, open }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        aria-labelledby="zoomed-image"
        aria-describedby="zoomed image display"
        layout="center"
        sx={{
          p: 0,
          maxWidth: '90vw',
          maxHeight: '90vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <img
            src={`${url}`}
            alt="Zoomed"
            style={{
              maxWidth: "500px",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </ModalDialog>
    </Modal>
  );
};
