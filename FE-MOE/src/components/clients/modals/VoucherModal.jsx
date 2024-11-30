// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React from "react";
import {
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
import SvgIconDisplay from "~/components/other/SvgIconDisplay";
import DiscountSvgIcon from "~/assert/icon/discount-svgrepo-com.svg";
import DiscountMoneySvgIcon from "~/assert/icon/discount-svgrepo-com-money.svg";
import { formatCurrencyVND, formatDateTypeSecond } from "~/utils/format";
import { debounce } from "lodash";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
function VoucherModal({ handleDiscount, vouchers, totalAmout, setKeword }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const debouncedSearch = debounce((value) => {
    setKeword(value);
  }, 300);

  const onChangeSearch = (e) => {
    debouncedSearch(e.target.value);
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
          Chọn Phiếu Giảm Giá
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
        <DialogContent sx={{ width: "600px", height: "700px" }} dividers>
          <Box
            sx={{
              boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
              borderRadius: 5,
            }}
          >
            <FormControl>
              <Input
                size="lg"
                sx={{ border: "none" }}
                placeholder="Nhập mã giảm giá..."
                onChange={onChangeSearch}
              />
            </FormControl>
          </Box>
          {vouchers?.length === 0 && (
            <Typography
              sx={{
                textAlign: "center",
                color: "text.disabled",
                marginTop: 20,
              }}
            >
              Không tìm thấy phiếu giảm giá nào
            </Typography>
          )}
          {vouchers &&
            vouchers.map((value) => (
              <Box sx={{ marginTop: 2 }} key={value.id}>
                <Card orientation="horizontal" variant="outlined">
                  <CardOverflow>
                    <Box
                      sx={{
                        width: 90,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {value.discountType === "PERCENTAGE" ? (
                        <SvgIconDisplay
                          icon={DiscountSvgIcon}
                          width="70px"
                          height="70px"
                        />
                      ) : (
                        <SvgIconDisplay
                          icon={DiscountMoneySvgIcon}
                          width="70px"
                          height="70px"
                        />
                      )}
                    </Box>
                  </CardOverflow>
                  <CardContent width="100%">
                    <Typography
                      textColor="success.plainColor"
                      sx={{
                        fontWeight: "md",
                        wordBreak: "break-word",
                        maxWidth: "100%",
                      }}
                    >
                      [{value.code}] {value.name}
                    </Typography>
                    <Typography level="body-sm">
                      Giảm &nbsp;
                      {value.discountType === "PERCENTAGE"
                        ? `${value.discountValue}%`
                        : formatCurrencyVND(value.discountValue)}
                      &nbsp; đơn tối đa {formatCurrencyVND(value.conditions)}
                    </Typography>
                    {value.type === "PERSONAL" && (
                      <Typography level="body-sm" color="danger">
                        Dành riêng cho bạn
                      </Typography>
                    )}
                    <Typography level="body-sm" color="text.disabled">
                      Ngày áp dụng: {formatDateTypeSecond(value.startDate)} -{" "}
                      {formatDateTypeSecond(value.endDate)}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      disabled={totalAmout < value.conditions}
                      size="sm"
                      variant="plain"
                      onClick={() => {
                        handleDiscount(value);
                        handleClose();
                      }}
                    >
                      ÁP DỤNG
                    </Button>
                  </Box>
                </Card>
              </Box>
            ))}
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}

export default VoucherModal;
