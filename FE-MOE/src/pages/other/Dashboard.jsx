// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  SvgIcon,
  CardActions,
  Button,
} from "@mui/joy";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

export const Dashboard = () => {
  return (
    <Box sx={{ padding: 3, minHeight: "100vh" }}>
      <Typography level="title-lg" sx={{ marginBottom: 3, color: "#333" }}>
        Dashboard
      </Typography>

      {/* Cards Section */}
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid xs={3}>
          <Card variant="plain" color="neutral" invertedColors>
            <CardContent orientation="horizontal">
              <CircularProgress size="lg" determinate value={20}>
                <SvgIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                    />
                  </svg>
                </SvgIcon>
              </CircularProgress>
              <CardContent>
                <Typography level="body-md">Tổng Áo Đã Bán</Typography>
                <Typography level="h2">31.542</Typography>
              </CardContent>
            </CardContent>
            <CardActions>
              <Button variant="soft" size="sm">
                Chi tiết
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid xs={3}>
          <Card variant="plain" color="neutral" invertedColors>
            <CardContent orientation="horizontal">
              <CircularProgress size="lg" determinate value={20}>
                <SvgIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                    />
                  </svg>
                </SvgIcon>
              </CircularProgress>
              <CardContent>
                <Typography level="body-md">Doanh Thu</Typography>
                <Typography level="h2">123.456.789</Typography>
              </CardContent>
            </CardContent>
            <CardActions>
              <Button variant="soft" size="sm">
                Chi tiết
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid xs={3}>
          <Card variant="plain" color="neutral" invertedColors>
            <CardContent orientation="horizontal">
              <CircularProgress size="lg" determinate value={20}>
                <SvgIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                    />
                  </svg>
                </SvgIcon>
              </CircularProgress>
              <CardContent>
                <Typography level="body-md">Tổng Số Khách Hàng</Typography>
                <Typography level="h2">1.542</Typography>
              </CardContent>
            </CardContent>
            <CardActions>
              <Button variant="soft" size="sm">
                Chi tiết
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid xs={3}>
          <Card variant="plain" color="neutral" invertedColors>
            <CardContent orientation="horizontal">
              <CircularProgress size="lg" determinate value={20}>
                <SvgIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                    />
                  </svg>
                </SvgIcon>
              </CircularProgress>
              <CardContent>
                <Typography level="body-md">Trung Bình Đánh Giá</Typography>
                <Typography level="h2">4.7/5</Typography>
              </CardContent>
            </CardContent>
            <CardActions>
              <Button variant="soft" size="sm">
                Chi tiết
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Pie Chart and Bar Chart */}
      <Grid container spacing={2}>
        <Grid xs={6}>
          <Typography level="title-lg" sx={{ marginBottom: 2, color: "#333" }}>
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
            width={500}
            height={300}
          />
        </Grid>
        <Grid xs={6}>
          <Typography level="title-lg" sx={{ marginBottom: 2, color: "#333" }}>
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
        <Typography level="title-lg" sx={{ marginBottom: 2, color: "#333" }}>
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
