import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';

export default function TopProductCard({product}) {
  return (
    <Card variant="outlined" sx={{ width: 300 }}>
      <CardOverflow>
        <AspectRatio ratio="2">
          <img
            src={product.imageUrl[0]}
            srcSet={`${product.imageUrl[0]} 2x`}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography level="title-md">{product.name}</Typography>
        <Typography level="body-sm">{product.origin}</Typography>
      </CardContent>
      <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
        <Divider inset="context" />
        <CardContent orientation="horizontal">
          <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: 'md' }}
          >
            6.3k lượt mua
          </Typography>
          <Divider orientation="vertical" />
          {/* <Typography
            level="body-xs"
            textColor="text.secondary"
            sx={{ fontWeight: 'md' }}
          >
            1 hour ago
          </Typography> */}
        </CardContent>
      </CardOverflow>
    </Card>
  );
}