import { Box, Card, Divider, Typography } from "@mui/joy";

function DashboardNotification() {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "50vh",
        borderRadius: "lg",
        boxShadow: "sm",
        p: 3,
        background: "linear-gradient(to right, #ffffff, #f9f9f9)",
      }}
    >
      <Typography fontWeight="bold" level="h6">
        Thông báo
      </Typography>
      <Box
        sx={{
          maxHeight: "35vh",
          overflowY: "auto",
        }}
      >
        {/* Nội dung thông báo */}
        <Notification />
        <Notification />
        <Notification />
        <Notification />
        <Notification />
        <Notification />
        <Notification />
        <Notification />
        <Notification />
      </Box>
    </Card>
  );
}

const Notification = () => {
  return (
    <Box
      sx={{
        borderRadius: "md",
        maxWidth: 600,
        margin: "auto",
      }}
    >
      <Typography
        fontWeight="bold"
        level="h5"
        sx={{
          mb: 1,
          color: "#1e40af",
        }}
      >
        Cập nhật hệ thống Cập nhật hệ thống Cập nhật hệ thống Cập nhật hệ thống
      </Typography>

      {/* Ngày thông báo */}
      <Typography
        level="body2"
        sx={{
          mb: 2,
          fontStyle: "italic",
          color: "#6b7280",
        }}
      >
        Ngày thông báo: 30/11/2024
      </Typography>
      <Divider/>
    </Box>
  );
};

export default DashboardNotification;
