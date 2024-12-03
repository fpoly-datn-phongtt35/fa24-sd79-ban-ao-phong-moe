// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React from "react";
import { Box, Card, Option, Select, Typography } from "@mui/joy";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatCurrencyVND } from "~/utils/format";

const SalesOverviewCard = ({ data }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "lg",
        boxShadow: "sm",
        background: "linear-gradient(to right, #ffffff, #f9f9f9)",
        p: 3,
      }}
    >
      {/* Title Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Typography fontWeight="bold" level="h6" mb={1}>
          Thống Kê
        </Typography>
        <Select defaultValue={2024} sx={{ maxWidth: 200 }}>
          <Option value={2024}>Năm 2024</Option>
        </Select>
      </Box>

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3 " />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(tick) => tick.toLocaleString()}
            tick={{ angle: -45, textAnchor: "end" }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Doanh thu") {
                return [formatCurrencyVND(value), name];
              }
              return [value, name];
            }}
          />
          <Line
            type="monotone"
            dataKey="client"
            stroke="#4CAF50"
            strokeWidth={2}
            dot={true}
            name="Khách hàng mới"
          />
          <Line
            type="monotone"
            dataKey="total_order"
            stroke="#8BC34A"
            strokeWidth={2}
            dot={true}
            name="Tổng số đơn đặt hàng"
          />
          <Line
            type="monotone"
            dataKey="total_revenue"
            stroke="#3F51B5"
            strokeWidth={2}
            dot={true}
            name="Doanh thu"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesOverviewCard;
