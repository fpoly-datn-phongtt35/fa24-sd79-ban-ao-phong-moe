import React, { useState } from "react";
import statisticalAPI from "~/apis/statisticalApi";
import { TextField, MenuItem, Button, Grid, Card, CardContent, CardHeader, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, FormControl, InputLabel } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, LabelList, PieChart, Pie, Cell } from "recharts";
import * as XLSX from "xlsx";
import { Select } from "@mui/joy";

const ITEMS_PER_PAGE = 3;

export default function ThongKe() {
    const [granularity, setGranularity] = useState("daily");
    const [startDate, setStartDate] = useState(dayjs().startOf("month"));
    const [endDate, setEndDate] = useState(dayjs().endOf("month"));
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);

    const quantityKeys = ["totalBills", "totalProductsSold", "customerRegistrations", "totalBillsByStatus"];
    const currencyKeys = ["totalRevenue", "totalProductAmount", "totalDiscountAmount"];

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    const COLORS = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#A633FF', '#33FFF5', '#FF9633', '#33FF96', '#9633FF', '#FF3333',
        '#33FFA6', '#A633FF', '#F5FF33', '#FF5733', '#33FFF5', '#FFA633', '#33FF57', '#3333FF', '#FF57F5', '#FF9633',
        '#96FF33', '#5733FF', '#FF33FF', '#F5FF33', '#9633FF', '#33FF96', '#57FF33', '#FF5733', '#33FF57', '#57FF57',
        '#FF3333', '#33F5FF', '#5733FF', '#A6FF33', '#33A6FF', '#FFA6FF', '#FF57A6', '#FF33FF', '#33FFA6', '#33FF57',
        '#A633FF', '#F5A633', '#33F5FF', '#FFA633', '#57FF33', '#9633FF', '#33FF57', '#FF5733', '#FF33A6', '#A633FF',
        '#33FFF5', '#FF9633', '#FF33FF', '#57A6FF', '#33FFA6', '#57FF57', '#FF33F5', '#33FF96', '#96FF33', '#5733FF',
        '#FFA633', '#A6FF57', '#FF5733', '#33F5FF', '#FF57FF', '#FF57A6', '#FF3333', '#33FF57', '#F5FF33', '#FF5733',
        '#A633FF', '#33FF57', '#FF33A6', '#33FFF5', '#33FFA6', '#9633FF', '#57FF33', '#33FF57', '#F5FF57', '#FF3333',
        '#FF57F5', '#FF9633', '#33F5FF', '#5733FF', '#FF33FF', '#A633FF', '#33FFA6', '#FF57A6', '#A6FF33', '#33FF96',
        '#FF5733', '#FF9633', '#33FF57', '#A6FF57', '#5733FF', '#33F5FF', '#57FF33', '#33FFF5', '#33FF96', '#FF57FF'
    ];

    //validate ngày 

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    //chuyển đổi tiếng anh qua việt
    const keyToVietnamese = {
        totalRevenue: "Tổng doanh thu",
        totalProductAmount: "Tổng số tiền sản phẩm",
        totalDiscountAmount: "Tổng số tiền giảm giá",
        customerRegistrations: "Tổng số khách hàng đăng ký",
        totalBills: "Tổng số hóa đơn",
        totalProductsSold: "Tổng số sản phẩm đã bán",
        totalBillsByStatus: "Tổng số hóa đơn theo trạng thái",
    };

    //cho dữ nhiều vào bảng và sơ đồ
    const transformStatisticsData = (rawData) => {
        const transformedData = {};

        Object.entries(rawData).forEach(([key, values]) => {
            if (key === "totalBillsByStatus") {
                transformedData[key] = values.map(([period, successCount, failureCount]) => ({
                    period: String(period),
                    success: successCount || 0, // Gán mặc định là 0 nếu giá trị null/undefined
                    failure: failureCount || 0,
                }));
            } else {
                transformedData[key] = values.map(([period, value]) => ({
                    period: String(period),
                    value: value || 0, // Gán mặc định 0 cho các giá trị null/undefined
                    originalKey: quantityKeys.includes(key) ? "quantity" : "currency",
                }));
            }
        });

        return transformedData;
    };

    //lấy dữ liệu
    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const filter = {
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                granularity,
            };

            const response = await statisticalAPI.getSummaryStatistics(filter);
            if (response && response.data) {
                const transformedData = transformStatisticsData(response.data);
                setStatistics(transformedData);
            } else {
                console.warn("Không có dữ liệu từ API.");
                setStatistics(null);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thống kê:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatLabel = (key) =>
        key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

    const formatNumber = (value, isCurrency) => {
        if (value == null || isNaN(value)) {
            return "N/A";
        }

        return isCurrency
            ? Number(value).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
            : Number(value).toLocaleString("vi-VN");
    };


    const determineColumnLabel = (originalKey) => {
        return quantityKeys.includes(originalKey) ? "Số lượng" : "Giá trị (VNĐ)";
    };

    const determineUnit = (originalKey) => {
        return currencyKeys.includes(originalKey);
    };

    const exportToExcel = () => {
        const consolidatedData = {};
        Object.entries(statistics).forEach(([key, data]) => {
            const vietnameseKey = keyToVietnamese[key] || key;
            data.forEach((row) => {
                const period = row.period;

                if (!consolidatedData[period]) {
                    consolidatedData[period] = { "Thời kỳ": period };
                }
                if (key === "totalBillsByStatus") {
                    consolidatedData[period][`${vietnameseKey} (Thành công)`] = row.success || 0;
                    consolidatedData[period][`${vietnameseKey} (Thất bại)`] = row.failure || 0;
                } else {
                    consolidatedData[period][vietnameseKey] = formatNumber(row.value, determineUnit(row.originalKey));
                }
            });
        });
        const dataForExport = Object.values(consolidatedData);
        const ws = XLSX.utils.json_to_sheet(dataForExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Statistics");
        XLSX.writeFile(wb, "ThongKe.xlsx");
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const getPagedData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const handleItemsPerPageChange = (event) => {
        const value = event.target.value;
        if (value && !isNaN(value) && value > 0) {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
        }
    };

    const renderColorLegend = (key, data) => {
        if (key === "totalBillsByStatus") {
            return (
                <Grid container spacing={1} sx={{ marginTop: 2 }}>
                    <Grid item xs={6} container alignItems="center">
                        <div
                            style={{
                                width: 16,
                                height: 16,
                                backgroundColor: "#33FF57",
                                marginRight: 8,
                                borderRadius: "50%",
                            }}
                        />
                        <Typography variant="body2">Thành công</Typography>
                    </Grid>
                    <Grid item xs={6} container alignItems="center">
                        <div
                            style={{
                                width: 16,
                                height: 16,
                                backgroundColor: "#FF3333",
                                marginRight: 8,
                                borderRadius: "50%",
                            }}
                        />
                        <Typography variant="body2">Thất bại</Typography>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid container spacing={1} sx={{ marginTop: 2 }}>
                    {data.map((entry, index) => (
                        <Grid
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            container
                            alignItems="center"
                            key={index}
                        >
                            <div
                                style={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: COLORS[index % COLORS.length],
                                    marginRight: 8,
                                    borderRadius: "50%",
                                }}
                            />
                            <Typography variant="body2">{entry.period}</Typography>
                        </Grid>
                    ))}
                </Grid>
            );
        }
    };

    const renderChart = (key, data) => {
        if (key === "totalBillsByStatus") {
            return (
                <>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip formatter={(value) => [formatNumber(value), "Số lượng"]} />
                            <Legend />
                            <Bar dataKey="success" name="Thành công" fill="#33FF57" />
                            <Bar dataKey="failure" name="Thất bại" fill="#FF3333" />
                        </BarChart>
                    </ResponsiveContainer>
                    {renderColorLegend(key, data)}
                </>
            );
        } else {
            return (
                <>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [formatNumber(value), "Giá trị"]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    {renderColorLegend(key, data)}
                </>
            );
        }
    }

    const getColumns = (key) => {
        if (key === "totalBillsByStatus") {
            return [
                { label: "Thành công", key: "success" },
                { label: "Thất bại", key: "failure" },
            ];
        }
        return [{ label: determineColumnLabel(key), key: "value" }];
    };

    return (
        <Grid container spacing={3} maxWidth="max-Width" className="bg-white" style={{ height: "100%" }}>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom className="text-center">
                    BẢNG THỐNG KÊ
                </Typography>
            </Grid>

            {/* Bộ lọc */}
            <Grid item xs={12}>
                <Card elevation={3}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid item xs={12} sm={4}>
                                    <DatePicker
                                        label="Ngày bắt đầu"
                                        value={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <DatePicker
                                        label="Ngày kết thúc"
                                        value={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                    />
                                </Grid>
                            </LocalizationProvider>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="Độ chi tiết"
                                    value={granularity}
                                    onChange={(e) => setGranularity(e.target.value)}
                                    fullWidth
                                >
                                    <MenuItem value="daily">Theo ngày</MenuItem>
                                    <MenuItem value="weekly">Theo tuần</MenuItem>
                                    <MenuItem value="monthly">Theo tháng</MenuItem>
                                    <MenuItem value="yearly">Theo năm</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={fetchStatistics}
                                            disabled={loading}
                                            fullWidth
                                        >
                                            {loading ? "Đang tải..." : "Lấy dữ liệu"}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={exportToExcel}
                                            fullWidth
                                        >
                                            Xuất Excel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Hiển thị thống kê */}
            <Grid item xs={12}>
                {loading ? (
                    <Grid container justifyContent="center">
                        <CircularProgress />
                    </Grid>
                ) : statistics ? (
                    <Grid container spacing={3}>
                        {Object.entries(statistics).map(([key, data]) => (
                            <Grid item xs={12} md={6} key={key}>
                                <Card elevation={3}>
                                    <CardHeader
                                        title={keyToVietnamese[key] || key}
                                        titleTypographyProps={{ variant: "h6" }}
                                        sx={{ textAlign: "center" }}
                                    />
                                    <CardContent>
                                        {renderChart(key, data)}

                                        {/* Bảng số liệu */}
                                        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Thời kỳ</TableCell>                                                      
                                                        {getColumns(key).map((column) => (
                                                            <TableCell key={column.key} align="right">
                                                                {column.label}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {getPagedData(data).map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{row.period}</TableCell>
                                                            {getColumns(key).map((column) => (
                                                                <TableCell key={column.key} align="right">
                                                                    {formatNumber(row[column.key], determineUnit(row.originalKey))}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>

                                        </TableContainer>

                                        {/* Phân trang */}
                                        <Grid container justifyContent="flex-end" spacing={2} sx={{ marginTop: 2 }}>
                                            <Grid item>
                                                <FormControl>
                                                    <TextField
                                                        type="number"
                                                        value={itemsPerPage || ''}
                                                        onChange={handleItemsPerPageChange}
                                                        size="small"
                                                        sx={{ width: "100px" }}
                                                        inputProps={{ min: 1 }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item>
                                                <Pagination
                                                    count={Math.ceil(data.length / itemsPerPage)}
                                                    page={currentPage}
                                                    onChange={handlePageChange}
                                                    color="primary"
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography className="text-center">Không có dữ liệu. Vui lòng bấm lấy dữ liệu.</Typography>
                )}
            </Grid>
        </Grid>
    );
}
