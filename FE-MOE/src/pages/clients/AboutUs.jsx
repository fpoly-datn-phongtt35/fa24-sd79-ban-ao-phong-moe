// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
} from "@mui/joy";
import Features from "~/components/clients/other/Features";
import { ScrollToTop } from "~/utils/defaultScroll";
import StoreIcon from "@mui/icons-material/Store";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SavingsIcon from "@mui/icons-material/Savings";

const AboutUs = () => {
  ScrollToTop();

  const stats = [
    {
      title: "10.5k",
      subtitle: "Cửa hàng liên kết",
      icon: <StoreIcon fontSize="large" />,
      color: "default",
    },
    {
      title: "33k",
      subtitle: "Sản phẩm bán mỗi tháng",
      icon: <AttachMoneyIcon fontSize="large" />,
      color: "default",
    },
    {
      title: "45.5k",
      subtitle: "Khách hàng đang hoạt động",
      icon: <ShoppingBagIcon fontSize="large" />,
      color: "default",
    },
    {
      title: "25k",
      subtitle: "Doanh thu hàng năm",
      icon: <SavingsIcon fontSize="large" />,
      color: "default",
    },
  ];

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9" }}>
      {/* Title Section */}
      <Typography
        level="h2"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{ color: "#333", textTransform: "uppercase", mb: 3 }}
      >
        Về Chúng Tôi
      </Typography>

      {/* Story Section */}
      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          <Typography
            level="h3"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#444" }}
          >
            Câu chuyện của chúng tôi
          </Typography>
          <Typography
            level="body1"
            gutterBottom
            sx={{ color: "#555", lineHeight: 1.8 }}
          >
            Được thành lập vào năm 2023, MOE Store đã từng bước khẳng định vị
            thế của mình trong ngành thương mại điện tử. Ban đầu, chúng tôi chỉ
            là một cửa hàng nhỏ phục vụ khách hàng địa phương. Nhưng nhờ sự nỗ
            lực không ngừng nghỉ và niềm đam mê dành cho việc mang đến trải
            nghiệm mua sắm tuyệt vời nhất, MOE Store đã phát triển thành một
            trong những nền tảng mua sắm trực tuyến đáng tin cậy và được yêu
            thích nhất tại khu vực Nam Á.
          </Typography>
          <Typography
            level="body1"
            gutterBottom
            sx={{ color: "#555", lineHeight: 1.8 }}
          >
            Chúng tôi tự hào sở hữu hơn 1 triệu sản phẩm trong danh mục, đặc
            biệt nổi bật với các mẫu áo phông thời trang, phù hợp với mọi độ
            tuổi và phong cách. Từ những thiết kế cơ bản đến những sản phẩm mang
            phong cách hiện đại, sáng tạo, MOE Store luôn cam kết mang lại sự
            hài lòng tối đa cho khách hàng.
          </Typography>
          <Typography
            level="body1"
            gutterBottom
            sx={{ color: "#555", lineHeight: 1.8 }}
          >
            Điều làm nên sự khác biệt của MOE Store không chỉ nằm ở sản phẩm, mà
            còn ở dịch vụ chăm sóc khách hàng tận tâm và chu đáo. Chúng tôi hiểu
            rằng mỗi khách hàng đều có những nhu cầu và mong muốn riêng, vì vậy
            chúng tôi luôn sẵn sàng hỗ trợ, tư vấn để khách hàng có thể tìm thấy
            những sản phẩm phù hợp nhất. Bên cạnh đó, hệ thống giao hàng nhanh
            chóng, chính sách đổi trả linh hoạt và đội ngũ nhân viên chuyên
            nghiệp đã giúp chúng tôi xây dựng được niềm tin vững chắc từ khách
            hàng.
          </Typography>
          <Typography
            level="body1"
            gutterBottom
            sx={{ color: "#555", lineHeight: 1.8 }}
          >
            Không dừng lại ở đó, MOE Store còn hướng đến mục tiêu trở thành một
            thương hiệu toàn cầu. Chúng tôi không ngừng cải tiến và mở rộng để
            đáp ứng nhu cầu của thị trường, đồng thời tiếp tục mang đến những
            sản phẩm chất lượng và dịch vụ hoàn hảo nhất. Với sứ mệnh "Mang
            phong cách đến gần hơn với mọi người", chúng tôi hy vọng sẽ trở
            thành người bạn đồng hành đáng tin cậy trên hành trình mua sắm của
            bạn.
          </Typography>
        </Grid>

        <Grid xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/80oIbalUOco"
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
        </Grid>
      </Grid>

      {/* Stats Section */}
      <Grid container spacing={3} mt={6}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                textAlign: "center",
                border:
                  stat.color === "error"
                    ? "1px solid red"
                    : "1px solid #e0e0e0",
                borderRadius: 2,
                boxShadow: stat.color === "error" ? 4 : 2,
                backgroundColor: stat.color === "error" ? "#fbe9e7" : "#fff",
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.05)",
                },
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                    color: stat.color === "error" ? "red" : "black",
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={stat.color === "error" ? "red" : "text.primary"}
                >
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Team Section */}
      <Typography level="h3" fontWeight="bold" mt={6} mb={4} textAlign="center">
        Đội Ngũ Của Chúng Tôi
      </Typography>
      <Grid container spacing={4}>
        {[
          {
            name: "Nông Hoàng Vũ",
            role: "Người sáng lập & Chủ tịch",
            img: "https://avatars.githubusercontent.com/u/117331143?v=4",
          },
          {
            name: "Khương Văn Thành",
            role: "Giám đốc điều hành",
            img: "https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/457097707_1294496031931867_3245612015580574624_n.jpg",
          },
          {
            name: "MOE",
            role: "Thiết kế sản phẩm",
            img: "./src/assert/MainLogo.jpg",
          },
        ].map((member, index) => (
          <Grid xs={12} md={4} key={index}>
            <Card
              variant="outlined"
              sx={{
                textAlign: "center",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                }}
              >
                <Avatar
                  src={member.img}
                  alt={member.name}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    border: "4px solid #1976d2",
                  }}
                />
                <Typography level="h5" fontWeight="bold">
                  {member.name}
                </Typography>
                <Typography level="body2" color="text.secondary">
                  {member.role}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Section */}
      <Box mt={6}>
        <Divider sx={{ my: 3 }} />
        <Features />
      </Box>
    </Box>
  );
};

export default AboutUs;
