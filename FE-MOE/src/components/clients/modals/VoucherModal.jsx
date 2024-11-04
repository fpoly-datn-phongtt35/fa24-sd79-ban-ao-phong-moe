import React from "react";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  CardOverflow,
  FormControl,
  Input,
  Typography,
} from "@mui/joy";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
function VoucherModal({ handleDiscount }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Button variant="plain" size="md" onClick={handleClickOpen}>
        Chọn hoặc nhập mã
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Khuyễn Mãi
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ width: "400px", height: "500px" }} dividers>
          <Box
            sx={{
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
              borderRadius: 5,
              padding: 2,
            }}
          >
            <FormControl>
              <Input
                size="lg"
                sx={{ border: "none" }}
                placeholder="Nhập mã giảm giá..."
                endDecorator={<Button size="sm">Áp dụng</Button>}
              />
            </FormControl>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Card orientation="horizontal" variant="outlined">
              <CardOverflow>
                <AspectRatio ratio="1" sx={{ width: 90 }}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/256/3050/3050241.png"
                    srcSet="https://cdn-icons-png.flaticon.com/256/3050/3050241.png"
                    loading="lazy"
                    alt=""
                  />
                </AspectRatio>
              </CardOverflow>
              <CardContent>
                <Typography
                  textColor="success.plainColor"
                  sx={{ fontWeight: "md" }}
                >
                  Ngày hội Halloween
                </Typography>
                <Typography level="body-sm">Khuyễn mãi 50%</Typography>
              </CardContent>
              <CardOverflow
                variant="solid"
                color="primary"
                sx={{
                  px: 0.2,
                  writingMode: "vertical-rl",
                  justifyContent: "center",
                  fontSize: "xs",
                  fontWeight: "xl",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  borderLeft: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Button
                  size="sm"
                  color="primary"
                  onClick={() => {
                    handleDiscount("PERCENT", 50);
                    handleClose();
                  }}
                >
                  ÁP DỤNG
                </Button>
              </CardOverflow>
            </Card>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}

export default VoucherModal;
