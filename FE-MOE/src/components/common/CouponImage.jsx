import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

export default function CouponImage({ onImagesUpload, initialImages = [] }) {
    const [uploadedImages, setUploadedImages] = React.useState(initialImages);

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

    const handleImageUpload = (event) => {
        const files = event.target.files;
        const newImages = [];
        const newImageUrls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = URL.createObjectURL(file);
            newImages.push({ img: url, title: file.name });
            newImageUrls.push(files[i]);
        }

        setUploadedImages([...uploadedImages, ...newImages]);
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
            {uploadedImages.length > 0 && (
                <ImageList
                    sx={{ width: "100%", height: 150, marginTop: 2 }}
                    cols={4}
                    rowHeight={120}
                >
                    {uploadedImages.map((item, index) => (
                        <ImageListItem 
                          key={index} 
                          sx={{ 
                            width: "100%", 
                            aspectRatio: "10 / 2",
                            margin: "5px" 
                          }}
                        >
                            <img
                                src={item.img}
                                alt={item.title}
                                loading="lazy"
                                style={{ objectFit: "cover", width: "100%", height: "100%" }}  
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            )}
        </Box>
    );
}
