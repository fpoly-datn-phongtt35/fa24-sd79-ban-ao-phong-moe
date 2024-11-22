// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import * as React from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { fetchCategories } from "~/apis/client/apiClient";
import { useNavigate } from "react-router-dom";

export default function ListCategories() {
  const [categories, setCategories] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const func = async () => {
      await fetchCategories().then((res) => {
        setCategories(res.data);
      });
    };
    func();
  }, []);

  return (
    <Sheet
      variant="outlined"
      sx={{
        minHeight: 360,
        maxHeight: 360,
        overflow: "auto",
        borderRadius: "md",
        p: 2,
        boxShadow: "sm",
        bgcolor: "background.surface",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <ListSubheader
        sticky
        sx={{
          textAlign: "center",
          fontSize: "lg",
          fontWeight: "bold",
          color: "primary.700",
          mb: 1,
        }}
      >
        Danh mục sản phẩm
      </ListSubheader>
      <List sx={{ gap: 1 }}>
        {categories?.map((category, index) => (
          <ListItem key={index}>
            <ListItemButton
            onClick={() => navigate("/search")}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: "md",
                bgcolor: "neutral.softBg",
                boxShadow: "xs",
                ":hover": {
                  bgcolor: "primary.softBg",
                  boxShadow: "sm",
                  transform: "scale(1.02)", // Phóng to nhẹ
                },
                transition: "all 0.2s ease",
              }}
            >
              <Typography
                level="body-md"
                sx={{ fontWeight: "medium", color: "neutral.800" }}
              >
                {category.name}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Sheet>
  );
}
