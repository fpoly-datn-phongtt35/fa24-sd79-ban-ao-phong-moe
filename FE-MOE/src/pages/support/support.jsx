import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumbs, Button, Link } from '@mui/joy';
import { getAllSupport } from "~/apis/supportApi";
import {
  Grid, TextField, Typography, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Pagination, IconButton, Switch, Box, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const Support = () => {
  const [supports, setSupports] = useState([]); // Mặc định là mảng rỗng
  const [formValues, setFormValues] = useState({
    hoTen: "",
    email: "",
    sdt: "",
    issue_description: "",
    status: "",
  });

  // Gọi API khi component mount
  useEffect(() => {
    const fetchSupports = async () => {
      try {
        const response = await getAllSupport();
        const data = response.data; // Giả sử data nằm trong response.data
        // Kiểm tra xem data có phải là mảng không trước khi gọi filter
        if (Array.isArray(data)) {
          const validData = data.filter((item) => item.hoTen && item.email && item.sdt && item.issueDescription);
          if (validData.length > 0) {
            setSupports(validData); // Cập nhật dữ liệu hợp lệ vào state
          } else {
            console.log("Không có dữ liệu hợp lệ.");
          }
        } else {
          console.error("Dữ liệu trả về không phải mảng:", data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchSupports();
  }, []);
  

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 3, border: "1px solid", borderColor: "divider", borderRadius: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Danh Sách Liên Hệ
      </Typography>
      <Box sx={{ mt: 4 }}>
        {/* Table hiển thị dữ liệu */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Họ Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số Điện Thoại</TableCell>
                <TableCell>Mô Tả</TableCell>
                <TableCell>Trạng Thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(supports) && supports.map((support) => (
                <TableRow key={support.id}>
                  <TableCell>{support.hoTen || "(Chưa có dữ liệu)"}</TableCell>
                  <TableCell>{support.email || "(Chưa có dữ liệu)"}</TableCell>
                  <TableCell>{support.sdt || "(Chưa có dữ liệu)"}</TableCell>
                  <TableCell>{support.issueDescription || "(Chưa có dữ liệu)"}</TableCell>
                  <TableCell>{support.status || "(Chưa có dữ liệu)"}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Support;
