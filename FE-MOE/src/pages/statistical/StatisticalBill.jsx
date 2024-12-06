import React, { useState, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Input,
  Button,
  Select,
} from "@mui/joy";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  getAvgInvoice,
  getBillsWithFilters,
  getMaxInvoice,
  getMinInvoice,
  getTotalBills,
  getTotalRevenue,
  getSuccessfulBills,
  getFailedBills,
  getUnpaidBills,
} from "~/apis/statisticalApi";
import { formatCurrencyVND } from "~/utils/format";
import { MenuItem, TextField } from "@mui/material";
import { AttachMoney, TrendingUp, TrendingDown, Calculate, AccountBalance, CheckCircle, Cancel, Payment, Visibility, GetApp } from '@mui/icons-material';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from "xlsx";
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

export default function StatisticalBill() {
  const [billsData, setBillsData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [minInvoice, setMinInvoice] = useState(0);
  const [maxInvoice, setMaxInvoice] = useState(0);
  const [avgInvoice, setAvgInvoice] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [successfulBills, setSuccessfulBills] = useState(0);
  const [failedBills, setFailedBills] = useState(0);
  const [unpaidBills, setUnpaidBills] = useState(0);

  const [filter, setFilter] = useState({
    startDate: dayjs().subtract(30, "day").format("YYYY-MM-DDTHH:mm"),
    endDate: dayjs().format("YYYY-MM-DDTHH:mm"),
    granularity: "DAY",
    pageNo: 0,
    pageSize: 10,
    status: null,
    paymentMethod: null,
  });

  const sanitizeDate = (dateString) => {
    const date = dayjs(dateString);
    if (date.isValid()) {
      return date.format("YYYY-MM-DDTHH:mm");
    }

    const [year, month, day, hour, minute] = dateString
      .replace(/[^\d]/g, " ")
      .split(" ")
      .map(Number);

    const sanitizedDate = dayjs()
      .year(year || dayjs().year())
      .month(Math.max(0, Math.min((month || 1) - 1, 11)))
      .date(Math.max(1, Math.min(day || 1, dayjs().daysInMonth())))
      .hour(hour || 0)
      .minute(minute || 0);

    return sanitizedDate.format("YYYY-MM-DDTHH:mm");
  };

  const validateDates = (start, end) => {
    const sanitizedStart = sanitizeDate(start);
    const sanitizedEnd = sanitizeDate(end);

    if (dayjs(sanitizedStart).isAfter(dayjs(sanitizedEnd))) {
      toast.error("Start date cannot be later than end date.");
      return false;
    }

    setFilter((prev) => ({
      ...prev,
      startDate: sanitizedStart,
      endDate: sanitizedEnd,
    }));

    return true;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "startDate" || name === "endDate") {
      const sanitizedValue = sanitizeDate(value);
      setFilter((prev) => ({ ...prev, [name]: sanitizedValue || "" }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [name]: value || "",
      }));
    }
  };

  const fetchData = useCallback(async () => {
    if (!validateDates(filter.startDate, filter.endDate)) return;

    try {
      const formattedFilter = {
        ...filter,
        paymentMethod: filter.paymentMethod || null,
        startDate: dayjs(filter.startDate).format("DD/MM/YYYY | HH:mm:ss"),
        endDate: dayjs(filter.endDate).format("DD/MM/YYYY | HH:mm:ss"),
      };

      const billsResponse = await getBillsWithFilters(formattedFilter);
      setBillsData(billsResponse?.data || []);

      setTotalRevenue((await getTotalRevenue(formattedFilter)).data || 0);
      setMinInvoice((await getMinInvoice(formattedFilter)).data || 0);
      setMaxInvoice((await getMaxInvoice(formattedFilter)).data || 0);
      setAvgInvoice((await getAvgInvoice(formattedFilter)).data || 0);
      setTotalBills((await getTotalBills(formattedFilter)).data || 0);
      setSuccessfulBills((await getSuccessfulBills(formattedFilter)).data || 0);
      setFailedBills((await getFailedBills(formattedFilter)).data || 0);
      setUnpaidBills((await getUnpaidBills(formattedFilter)).data || 0);
    } catch (error) {
      toast.error("Error fetching statistical data");
      console.error("Fetch Data Error:", error.response || error.message || error);
    }
  }, [filter]);

  const DashboardMoneyCard = ({ title, value, icon }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        borderRadius: 1,
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 40,
          height: 40,
          backgroundColor: "rgb(52 189 234)",
          borderRadius: "50%",
          color: "white",
          marginRight: 2,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: "500", color: "#333" }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: "#00796b", fontWeight: "600" }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  const exportToExcel = () => {
    // Dữ liệu chính
    const dataForExport = [
      ["Danh mục", "Tổng Doanh Thu", "Hóa Đơn Thấp Nhất", "Hóa Đơn Cao Nhất", "Hóa Đơn Trung Bình", "Tổng Số Hóa Đơn", "Hóa Đơn Thành Công", "Hóa Đơn Thất Bại", "Hóa Đơn C.Thanh Toán"],
      ["Doanh thu", 
        formatCurrencyVND(totalRevenue), 
        formatCurrencyVND(minInvoice), 
        formatCurrencyVND(maxInvoice), 
        formatCurrencyVND(avgInvoice), 
        totalBills, 
        successfulBills, 
        failedBills, 
        unpaidBills
      ],
      [], // Dòng trống
      ["Thời gian", ...billsData.map((bill) => bill[0] || "N/A")],
      ["Doanh thu", ...billsData.map((bill) => formatCurrencyVND(bill[1]) || "0")],
    ];
  
    // Tạo sheet từ dữ liệu
    const ws = XLSX.utils.aoa_to_sheet(dataForExport);
  
    // Kẻ bảng (cấu hình phạm vi)
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) ws[cellAddress] = { t: "s", v: "" }; // Thêm ô trống nếu thiếu
        ws[cellAddress].s = { border: { top: "thin", bottom: "thin", left: "thin", right: "thin" } };
      }
    }
  
    // Tạo workbook và thêm sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statistics");
  
    // Lưu file
    const fileName = "ThongKe.xlsx";
    XLSX.writeFile(wb, fileName);
  };
  
  return (
    <Box sx={{ padding: 3, minHeight: "100vh" }}>
      <Typography level="h3" sx={{ marginBottom: 3, color: "#333" }}>
        Thống kê hóa đơn
      </Typography>

      <Box sx={{ marginBottom: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Input
          type="datetime-local"
          value={filter.startDate || ""}
          onChange={handleFilterChange}
          name="startDate"
          sx={{ minWidth: 200 }}
          placeholder="Start Date"
        />

        <Input
          type="datetime-local"
          value={filter.endDate || ""}
          onChange={handleFilterChange}
          name="endDate"
          sx={{ minWidth: 200 }}
          placeholder="End Date"
        />

        <TextField
          select
          label="Thời gian"
          name="granularity"
          value={filter.granularity || ""}
          onChange={handleFilterChange}
          sx={{ minWidth: 150 }}
        >
          {[
            { value: "DAY", label: "Ngày" },
            { value: "WEEK", label: "Tuần" },
            { value: "MONTH", label: "Tháng" },
            { value: "QUARTER", label: "Quý" },
            { value: "YEAR", label: "Năm" },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Phương thức"
          name="paymentMethod"
          value={filter.paymentMethod || ""}
          onChange={handleFilterChange}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={""}>Tất cả</MenuItem>
          {[
            { value: "BANK", label: "Chuyển khoản" },
            { value: "CASH", label: "Tiền mặt" },
            { value: "CASH_ON_DELIVERY", label: "Thanh toán khi nhận hàng" },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button onClick={fetchData} sx={{ minWidth: 150, display: 'flex', alignItems: 'center', gap: 1 }} variant="outlined">
          <Visibility sx={{ fontSize: 20 }} />Hiển thị dữ liệu
        </Button>

        <Button onClick={exportToExcel} color="success" sx={{display: 'flex', alignItems: 'center'}} variant="outlined"  >
          <FaFileExcel style={{ fontSize: '2.0rem' }} />
        </Button>

      </Box>

      <Grid container spacing={2}>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Tổng Doanh Thu"
            value={formatCurrencyVND(totalRevenue)}
            icon={<AttachMoney />}
          />
        </Grid>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Hóa Đơn Thấp Nhất"
            value={formatCurrencyVND(minInvoice)}
            icon={<TrendingDown />}
          />
        </Grid>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Hóa Đơn Cao Nhất"
            value={formatCurrencyVND(maxInvoice)}
            icon={<TrendingUp />}
          />
        </Grid>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Hóa Đơn Trung Bình"
            value={formatCurrencyVND(avgInvoice)}
            icon={<Calculate />}
          />
        </Grid>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Tổng Số Hóa Đơn"
            value={totalBills}
            icon={<AccountBalance />}
          />
        </Grid>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Hóa Đơn Thành Công"
            value={successfulBills}
            icon={<CheckCircle />}
          />
        </Grid>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Hóa Đơn Thất Bại"
            value={failedBills}
            icon={<Cancel />}
          />
        </Grid>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Hóa Đơn C.Thanh Toán"
            value={unpaidBills}
            icon={<Payment />}
          />
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography level="h5">Sơ đồ tổng doanh thu</Typography>
        <Line
          data={{
            labels: billsData.map((bill) => bill[0] || "N/A"),
            datasets: [
              {
                label: "Doanh thu",
                data: billsData.map((bill) => bill[1] || 0),
                borderColor: "#4BC0C0",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
                tension: 0.4,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              title: { display: true, text: "Sơ đồ tổng doanh thu" },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => `Tổng tiền: ${formatCurrencyVND(tooltipItem.raw)}`,
                },
              },
            },
          }}
        />
      </Box>
    </Box >
  );
}
