// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import Carousel from "react-bootstrap/Carousel";
const AdBanner = () => {
  const images = [
    "https://cf.shopee.vn/file/vn-11134258-7ras8-m1we2ohomhxv87",
    "https://cf.shopee.vn/file/vn-11134258-7ras8-m1nv6e5girmb1c",
    "https://cf.shopee.vn/file/vn-11134258-7ras8-m1wdynrggfv7cb",
    "https://cf.shopee.vn/file/vn-11134258-7ras8-m0tqdx5itqxbe5",
    "https://cf.shopee.vn/file/vn-11134258-7ras8-m1we5219fwzja1",
    "https://cf.shopee.vn/file/vn-11134258-7ras8-m0woo5ys0f1p30",
    "https://cf.shopee.vn/file/vn-11134258-7ras8-m1xkpujbgkan42",
  ];

  return (
    <Carousel>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            src={image}
            alt={index}
            width="98%"
            height="500px"
            style={{ objectFit: "cover" }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};
export default AdBanner;
