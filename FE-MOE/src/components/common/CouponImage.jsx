import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { Image } from "react-bootstrap";

export default function CouponImage({ onImagesUpload, initialImages = [], storedImageUrl = "" }) {
    const [uploadedImages, setUploadedImages] = React.useState(
        initialImages.length ? initialImages : storedImageUrl ? [{ img: storedImageUrl, title: "stored-image" }] : []
    );

    const VisuallyHiddenInput = styled("input")({
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: 1,
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        left: 0,
        whiteSpace: "nowrap",
        width: 1,
    });

    // Xử lý upload ảnh
    const handleImageUpload = (event) => {
        const files = event.target.files;
        const newImages = [];
        const newImageUrls = [];

        // Thay thế ảnh cũ bằng ảnh mới, không cộng dồn
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = URL.createObjectURL(file);
            newImages.push({ img: url, title: file.name });
            newImageUrls.push(files[i]);
        }

        // Chỉ giữ ảnh mới, bỏ ảnh cũ
        setUploadedImages(newImages);
        // Gửi files ảnh về component cha
        onImagesUpload(newImageUrls); 
    };

    return (
        <Box>
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
            >
                Upload files
                <VisuallyHiddenInput
                    type="file"
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                />
            </Button>

            {uploadedImages.length > 0 ? (
                <ImageList sx={{ width: "100%", height: 150, marginTop: 2 }} cols={4} rowHeight={120}               >
                    {uploadedImages.map((item, index) => (
                        <ImageListItem key={index} sx={{ width: "100%", aspectRatio: "10 / 5", margin: "5px" }}>
                            <img src={item.img} alt={item.title} loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                        </ImageListItem>
                    ))}
                </ImageList>
            ) : (
                <div >
                    <ImageList sx={{ width: "100%", height: 150, marginTop: 2 }} cols={4} rowHeight={120}>
                        <ImageListItem
                            sx={{ width: "100%", aspectRatio: "10 / 5", margin: "5px" }}                      >
                            <Image
                                src={storedImageUrl || "https://flysunrise.com/wp-content/uploads/2024/03/featured-image-placeholder.jpg"}
                                loading="lazy" style={{ objectFit: "cover", width: "100%", height: "100%", }}
                            />
                        </ImageListItem>
                    </ImageList>

                </div>

            )}
        </Box>
    );
}
