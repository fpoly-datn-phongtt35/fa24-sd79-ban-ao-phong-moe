import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Stack } from "@mui/joy";
import { fetchBestSellingProducts } from "~/apis/client/apiClient";

const ProjectsOverview = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchBestSellingProducts().then((result) => {
        console.log(result.data);
        setData(result.data);
      });
    };
    fetchData();
  }, []);
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
            {data.map((value, index) => (
              <tr
                key={index}
                style={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f1f1f1" },
                  transition: "background-color 0.3s",
                }}
                onClick={() => console.log(project.id)}
              >
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <img
                    src={value?.imageUrl}
                    width={100}
                    alt=""
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                  />
                </td>
                <td style={{ padding: "12px", textAlign: "start" }}>
                  <Typography level="title-md" noWrap>
                    {value?.name || "Đang cập nhật"}
                  </Typography>
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <Typography sx={{ color: "#00c6ff", fontWeight: "bold" }}>
                    {value?.total_order || 0}
                  </Typography>
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <Typography sx={{ color: "#00c6ff", fontWeight: "bold" }}>
                    {value?.stock_quantity || 0}
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
