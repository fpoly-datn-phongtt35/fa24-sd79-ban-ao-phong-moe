import Carousel from "react-bootstrap/Carousel";
const SlideSlideShowHeader = () => {
  return (
    <Carousel>
      <Carousel.Item interval={1000}>
        <img
          src="https://cf.shopee.vn/file/vn-50009109-727a24a85a60935da5ccb9008298f681"
          alt="1"
          width="100%"
        />
      </Carousel.Item>
      <Carousel.Item interval={500}>
        <img
          src="https://cf.shopee.vn/file/vn-11134258-7ras8-m1i2r6dg93yr87"
          alt="1"
          width="100%"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="https://cf.shopee.vn/file/vn-11134258-7ras8-m0tq5wrda8dp3e"
          alt="1"
          width="100%"
        />
      </Carousel.Item>
    </Carousel>
  );
};
export default SlideSlideShowHeader;
