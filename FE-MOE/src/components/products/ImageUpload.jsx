import { Box, Card, CardContent, CardCover, Grid, Typography } from "@mui/joy";
import Button from "@mui/joy/Button";
import SvgIcon from "@mui/joy/SvgIcon";

import { useState } from "react";



export const ImageUpload = ({ onImagesUpload }) => {
  const [uploadedImages, setUploadedImages] = useState([]);

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

    setUploadedImages(newImages);
    onImagesUpload(newImageUrls);
  };
  return (
    <Box>
      <Box>
        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          variant="outlined"
          color="neutral"
          sx={{ marginBottom: 1 }}
          startDecorator={
            <SvgIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
            </SvgIcon>
          }
        >
          Upload a file
          <VisuallyHiddenInput
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
      </Box>
      <Box
        component="ul"
        sx={{ display: "flex", gap: 2, flexWrap: "wrap", p: 0, m: 0 }}
      >
        {uploadedImages.length > 0 &&
          uploadedImages.map((item) => (
            <Card
              key={item.img}
              component="li"
              sx={{
                minWidth: 100,
                maxWidth: 150,
                minHeight: 100,
                maxHeight: 150,
                flexGrow: 1,
              }}
            >
              <CardCover>
                <img src={item.img} loading="lazy" alt={item.title} />
              </CardCover>
            </Card>
          ))}
      </Box>
    </Box>
  );
};
