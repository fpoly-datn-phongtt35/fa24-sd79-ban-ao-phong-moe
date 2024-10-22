import React from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
} from "@mui/joy";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from '@mui/icons-material/Instagram';

const FooterClient = () => {
  return (
    <Box
      sx={{
        p: 3,
        mt: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Divider sx={{ my: 2, width: "100%", maxWidth: "100%" }} />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1500,
        }}
      >
        <Box>
          <Typography level="title-lg" color="neutral">
            Đặt mua sản phẩm quần áo thời trang hàng hiệu chính hãng tại MOE
            Store ngay hôm nay
          </Typography>
          <Typography level="body-sm">
            Lựa chọn và đặt mua các sản phẩm quần áo thời trang hàng hiệu chính
            hãng trở nên rất đơn giản trong thời đại công nghệ 4.0 hiện nay. Bạn
            không cần phải tốn thời gian đến cửa hàng để mua sắm. Bạn hoàn toàn
            có thể ngồi tại nhà và lựa chọn những sản phẩm quần áo nam cao cấp,
            chất lượng chỉ với một cú click chuột.
          </Typography>
          <Typography level="body-sm" marginTop={1}>
            MOE Store với thủ tục đặt hàng đơn giản, giao hàng nhanh chóng. Bên
            cạnh đó, MOE Store còn có nhiều chương trình ưu đãi giảm giá, miễn
            phí giao hàng, khuyến mãi Voucher Xtra cực sốc, hoàn tiền đối với
            các sản phẩm chính hãng MOE Mall, mang đến cho bạn những trải nghiệm
            mua hàng thú vị. Hãy đến ngay MOEStore.vn và chọn cho mình những sản
            phẩm thời trang áo thun nam hàng hiệu cá tính ngay ngày hôm nay.
            Công việc đơn giản là chỉ cần chọn sản phẩm cho vào giỏ hàng online,
            MOE.vn sẽ giao hàng cho bạn nhanh chóng. Hãy đến với MOE.vn
            ngay bây giờ để mua hàng các bạn nhé.
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2, width: "100%", maxWidth: "100%" }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 1200,
        }}
      >
        <List>
          <ListSubheader>Chăm sóc khách hàng</ListSubheader>
          <ListItem>
            <ListItemButton component="a" href="#">
              Trung tâm trợ giúp
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              MOE Store Blog
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              MOE Store Mall
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Hướng dẫn mua hàng
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Hướng dẫn bán hàng
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Thanh toán
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Vận chuyển
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Trả hàng & Hoàn tiền
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Liên hệ MOE
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Chính sách bảo hành
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListSubheader>Về MOE Store</ListSubheader>
          <ListItem>
            <ListItemButton component="a" href="#">
              Giới thiệu về MOE Store Việt Nam
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Tuyển dụng
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Điều Khoản MOE Store
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Chính sách bảo mật
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Chính Hãng
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Flash Sales
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Chương trình Tiếp thị liên kết MOE Store
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="#">
              Liên Hệ Với Truyền Thông
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListSubheader>Theo dõi chúng tôi trên</ListSubheader>
          <ListItem>
            <ListItemButton component="a" href="https://facebook.com/NongHoangVu04">
              <FacebookRoundedIcon /> 
              <Typography level="body-md">Facebook</Typography>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component="a" href="https://instagram.com/nonghoangvu04/">
              <InstagramIcon /> 
              <Typography level="body-md">Instagram</Typography>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider sx={{ my: 2, width: "100%", maxWidth: 1200 }} />
      <Typography level="body-sm">
        &copy; 2024 MOE. Software Development SD79.
      </Typography>
    </Box>
  );
};

export default FooterClient;
