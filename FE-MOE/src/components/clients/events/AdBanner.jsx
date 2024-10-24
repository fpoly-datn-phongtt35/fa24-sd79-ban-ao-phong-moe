import Carousel from "react-bootstrap/Carousel";
const AdBanner = () => {
  return (
    <Carousel>
      <Carousel.Item interval={1000}>
        <img
          src="https://cf.shopee.vn/file/vn-11134258-7ras8-m1nv6e5girmb1c"
          alt="1"
          width="98%"
          height="500px"
          style={{ objectFit: "cover" }}
        />
      </Carousel.Item>
      <Carousel.Item interval={500}>
        <img
          src="https://cf.shopee.vn/file/vn-11134258-7ras8-m0tqdx5itqxbe5"
          alt="1"
          width="98%"
          height="500px"
          style={{ objectFit: "cover" }}
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="https://cf.shopee.vn/file/vn-11134258-7ras8-m0tqrdrnnfynfd"
          alt="1"
          width="98%"
          height="500px"
          style={{ objectFit: "cover" }}
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="https://cf.shopee.vn/file/vn-11134258-7ras8-m0woo5ys0f1p30"
          alt="1"
          width="98%"
          height="500px"
          style={{ objectFit: "cover" }}
        />
      </Carousel.Item>
    </Carousel>
  );
};
export default AdBanner;
