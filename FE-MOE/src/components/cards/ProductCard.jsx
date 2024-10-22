import AspectRatio from "@mui/joy/AspectRatio";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
export const ProductCard = ({product}) => {
  return (
    <Card sx={{ width: 300, maxWidth: "100%", boxShadow: "lg" }}>
      <CardOverflow>
        <AspectRatio sx={{ minWidth: 200 }}>
          <img
            src={product.imageUrl[0]}
            srcSet={`${product.imageUrl[0]} 2x`}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography level="body-xs">{product.brand}</Typography>
        <Link
          href="#product-card"
          color="neutral"
          textColor="text.primary"
          overlay
          endDecorator={<ArrowOutwardIcon />}
          sx={{ fontWeight: "md" }}
        >
          {product.name}
        </Link>

        <Typography
          level="title-lg"
          sx={{ mt: 1, fontWeight: "xl" }}
          endDecorator={
            <Chip component="span" size="sm" variant="soft" color="success">
              Giảm giá
            </Chip>
          }
        >
          100,000 VNĐ
        </Typography>
        <Typography level="body-sm">
          (Số lượng <b>{product.productQuantity}</b> Sản phẩm)
        </Typography>
      </CardContent>
      <CardOverflow>
        <Button variant="solid" color="danger" size="lg">
          Thêm vào giỏ hàng
        </Button>
      </CardOverflow>
    </Card>
  );
};
