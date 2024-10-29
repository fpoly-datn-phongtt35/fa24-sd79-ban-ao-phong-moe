// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { Box, Button, Divider, Grid, IconButton, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  fetchAllProducts,
  fetchBestSellingProducts,
} from "~/apis/client/productApiClient";
import AdBanner from "~/components/clients/events/AdBanner";
import TopProductCard from "~/components/clients/cards/TopProductCard";
import { ProductCard } from "~/components/clients/cards/ProductCard";
import ListCategories from "~/components/clients/attributes/ListCategories";
import Features from "~/components/clients/other/Features";
import { ScrollToTop } from "~/utils/defaultScroll";

const Home = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToTop, setGoToTop] = useState(false);

  useEffect(() => {
    handleSetProducts();
  }, [currentPage]);

  useEffect(() => {
    ScrollToTop();
    const res = async () => {
      await fetchBestSellingProducts().then((res) => {
        setBestSellingProducts(res.data);
      });
    };
    res();

    const scrollableElement = document.querySelector(".content-area_client");
    const handleScroll = () => {
      if (scrollableElement.scrollTop > 200) {
        setGoToTop(true);
      } else {
        setGoToTop(false);
      }
    };

    scrollableElement.addEventListener("scroll", handleScroll);

    return () => {
      scrollableElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSetProducts = async () => {
    const res = await fetchAllProducts(currentPage);
    setProducts((prev) => [...prev, ...res.data]);
  };

  const viewMore = async () => {
    setCurrentPage(currentPage + 1);
    handleSetProducts();
  };

  return (
    <Box>
      <AdBanner />
      <Box padding={3}>
        <Typography level="h4">Sản Phẩm Bán Chạy</Typography>
        <Divider sx={{ my: 1, width: "100%" }} />
        <Grid marginTop={2} container spacing={2}>
          {bestSellingProducts &&
            bestSellingProducts?.map((product, index) => (
              <Grid key={index} xs={12} sm={6} md={3} lg={2}>
                <TopProductCard product={product} />
              </Grid>
            ))}
        </Grid>
      </Box>
      <Box>
        <Grid padding={3} container spacing={2}>
          <Grid xs={12} sm={1}>
            <ListCategories />
          </Grid>
          <Grid
            xs={12}
            sm={11}
            sx={{ display: "flex", justifyContent: "center", width: "80%" }}
          >
            <img
              src="https://cf.shopee.vn/file/vn-11134258-7ras8-m0tqrdrnnfynfd"
              alt="banner"
              width="95%"
              style={{ maxHeight: "350px", objectFit: "cover" }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box padding={3}>
        <Typography level="title-lg">Sản Phẩm Nổi Bật</Typography>
        <Divider sx={{ my: 1, width: "100%" }} />
        <Grid marginTop={2} container spacing={2}>
          {products &&
            products?.map((product, index) => (
              <Grid key={index} xs={12} sm={6} md={3} lg={2}>
                <ProductCard product={product} />
              </Grid>
            ))}
        </Grid>
        <Box sx={{ margin: 3, display: "flex", justifyContent: "center" }}>
          <Button color="neutral" variant="soft" onClick={() => viewMore()}>
            Xem thêm
          </Button>
        </Box>
      </Box>
      {goToTop && (
        <Box sx={{ position: "fixed", bottom: 30, right: 30 }}>
          <IconButton
            variant="soft"
            color="neutral"
            onClick={() => ScrollToTop()}
            sx={{ width: 50, height: 50, borderRadius: "50%" }}
          >
            <ArrowUpwardIcon />
          </IconButton>
        </Box>
      )}
      <Box>
        <Divider sx={{ my: 1, width: "100%" }} />
        <Features />
      </Box>
    </Box>
  );
};

export default Home;
