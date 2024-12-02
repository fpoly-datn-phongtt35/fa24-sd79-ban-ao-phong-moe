// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { Card, Typography, Table, Stack } from "@mui/joy";
import { ImageRotator } from "../common/ImageRotator ";
import { useNavigate } from "react-router-dom";

const ProjectsOverview = ({ data }) => {
  const navigate = useNavigate();
  return (
    <Card
      variant="outlined"
      sx={{
        minHeight: "50vh",
        borderRadius: "lg",
        boxShadow: "sm",
        p: 3,
        background: "linear-gradient(to right, #ffffff, #f9f9f9)",
      }}
    >
      {/* Header */}
      <Typography fontWeight="bold" level="h6">
        Sản phẩm bán chạy
      </Typography>

      <Stack sx={{ maxHeight: "300px", overflowY: "auto" }}>
        <Table stickyHeader>
          <thead>
            <tr>
              <th
                style={{
                  color: "#333",
                  fontWeight: "bold",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                Ảnh
              </th>
              <th
                style={{
                  color: "#333",
                  fontWeight: "bold",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                Tên sản phẩm
              </th>
              <th
                style={{
                  color: "#333",
                  fontWeight: "bold",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                Số lượt mua
              </th>
              <th
                style={{
                  color: "#333",
                  fontWeight: "bold",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                Số lượng tồn kho
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((value, index) => (
              <tr
                key={index}
                style={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f1f1f1" },
                  transition: "background-color 0.3s",
                }}
                onClick={() => navigate(`/product/view/${value.id}`)}
              >
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <ImageRotator imageUrl={value?.imageUrl} w={100} />
                </td>
                <td style={{ padding: "12px", textAlign: "start" }}>
                  <Typography level="title-md">
                    {value?.name || "Đang cập nhật"}
                  </Typography>
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {value?.totalSales || 0}
                  </Typography>
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {value?.stockQuantity || 0}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Stack>
    </Card>
  );
};

export default ProjectsOverview;
