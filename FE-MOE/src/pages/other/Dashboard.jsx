import { Box, Grid, Typography, Card, CardContent, Divider } from "@mui/joy";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";

export const Dashboard = () => {
  return (
    <Box sx={{ padding: 3, minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ marginBottom: 3, color: "#333" }}>
        Bảng Điều Khiển Bán Áo
      </Typography>

      {/* Cards Section */}
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid xs={3}>
          <Card
            variant="soft"
            sx={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}
          >
            <CardContent>
              <Typography variant="h6">Doanh Thu Tháng</Typography>
              <Typography variant="h4">$35,500</Typography>
              <Typography>+15% so với tháng trước</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={3}>
          <Card
            variant="soft"
            sx={{ backgroundColor: "#f1f8e9", color: "#388e3c" }}
          >
            <CardContent>
              <Typography variant="h6">Tổng Áo Đã Bán</Typography>
              <Typography variant="h4">1,350</Typography>
              <Typography>+10% so với tháng trước</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={3}>
          <Card
            variant="soft"
            sx={{ backgroundColor: "#fff3e0", color: "#f57c00" }}
          >
            <CardContent>
              <Typography variant="h6">Tổng Số Khách Hàng</Typography>
              <Typography variant="h4">420</Typography>
              <Typography>+8% so với tháng trước</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={3}>
          <Card
            variant="soft"
            sx={{ backgroundColor: "#fce4ec", color: "#d81b60" }}
          >
            <CardContent>
              <Typography variant="h6">Đánh Giá Trung Bình</Typography>
              <Typography variant="h4">4.5/5</Typography>
              <Typography>+0.1 từ tháng trước</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pie Chart and Bar Chart */}
      <Grid container spacing={2}>
        <Grid xs={6}>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "#333" }}>
            Loại Áo Bán Chạy
          </Typography>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 35, label: "Áo Thun" },
                  { id: 1, value: 25, label: "Áo Hoodie" },
                  { id: 2, value: 20, label: "Áo Polo" },
                  { id: 3, value: 10, label: "Áo Sơ Mi" },
                  { id: 4, value: 10, label: "Áo Khoác" },
                ],
              },
            ]}
            width={400}
            height={300}
          />
        </Grid>
        <Grid xs={6}>
          <Typography variant="h6" sx={{ marginBottom: 2, color: "#333" }}>
            Số Lượng Áo Bán Theo Tháng
          </Typography>
          <BarChart
            series={[
              {
                data: [
                  120, 150, 200, 220, 260, 280, 300, 320, 310, 330, 360, 400,
                ],
              },
            ]}
            height={300}
            xAxis={[
              {
                data: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                scaleType: "band",
              },
            ]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </Grid>
      </Grid>

      {/* Customer Overview Table */}
      <Box
        sx={{
          marginTop: 4,
          backgroundColor: "#ffffff",
          padding: 3,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2, color: "#333" }}>
          Tổng Quan Khách Hàng
        </Typography>
        <Divider />
        <Grid container sx={{ marginTop: 2 }}>
          <Grid xs={3}>
            <Typography variant="body1">
              <strong>Tên Khách Hàng</strong>
            </Typography>
          </Grid>
          <Grid xs={3}>
            <Typography variant="body1">
              <strong>Email</strong>
            </Typography>
          </Grid>
          <Grid xs={3}>
            <Typography variant="body1">
              <strong>Số Đơn Đặt Hàng</strong>
            </Typography>
          </Grid>
          <Grid xs={3}>
            <Typography variant="body1">
              <strong>Đánh Giá</strong>
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ marginY: 1 }} />
        {[
          {
            name: "Nguyễn Văn A",
            email: "vana@example.com",
            orders: 15,
            rating: "4.8/5",
          },
          {
            name: "Trần Thị B",
            email: "thib@example.com",
            orders: 12,
            rating: "4.6/5",
          },
          {
            name: "Lê Thị C",
            email: "lethi@example.com",
            orders: 10,
            rating: "4.7/5",
          },
          {
            name: "Phạm Văn D",
            email: "pvd@example.com",
            orders: 8,
            rating: "4.9/5",
          },
        ].map((customer, index) => (
          <Grid container key={index} sx={{ marginY: 1 }}>
            <Grid xs={3}>
              <Typography>{customer.name}</Typography>
            </Grid>
            <Grid xs={3}>
              <Typography>{customer.email}</Typography>
            </Grid>
            <Grid xs={3}>
              <Typography>{customer.orders}</Typography>
            </Grid>
            <Grid xs={3}>
              <Typography>{customer.rating}</Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    </Box>
  );
};
