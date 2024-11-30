// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { Box, Grid, Typography } from "@mui/joy";
import DashboardMoneyCard from "~/components/cards/DashboardMoneyCard";
import DashboardNotification from "~/components/other/DashboardNotification";
import ProjectsOverview from "~/components/other/ProjectsOverview";
import SalesOverviewCard from "~/components/other/SalesOverviewCard";

import ProductIcon from "~/assert/icon/dashboards/product-svgrepo-com.svg";
import MoneyTodayIcon from "~/assert/icon/dashboards/money-today.svg";
import MoneyMonthIcon from "~/assert/icon/dashboards/money-month.svg";
import OrderPendingIcon from "~/assert/icon/dashboards/order-pending.svg";
import { useEffect, useState } from "react";
import { statisticData } from "~/apis/dashboardApi";
import { formatCurrencyVND } from "~/utils/format";
import { ScrollToTop } from "~/utils/defaultScroll";

export const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    ScrollToTop();
    const fetchData = async () => {
      await statisticData().then((data) => {
        setData(data);
      });
    };
    fetchData();
  }, []);
  return (
    <Box sx={{ padding: 3, minHeight: "100vh" }}>
      <Typography level="h3" sx={{ marginBottom: 3, color: "#333" }}>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Doanh số hôm nay"
            icon={MoneyTodayIcon}
            value={formatCurrencyVND(data?.todaySales)}
          />
        </Grid>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Doanh số tháng này"
            icon={MoneyMonthIcon}
            value={formatCurrencyVND(data?.monthsSales)}
          />
        </Grid>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Đơn hàng chưa xác nhận"
            icon={OrderPendingIcon}
            value={data?.pendingOrders}
          />
        </Grid>
        <Grid xs={12} sm={6} xl={3}>
          <DashboardMoneyCard
            title="Sản phẩm tồn kho"
            icon={ProductIcon}
            value={data?.stockQuantity}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid xs={12} sm={9} xl={9}>
          <ProjectsOverview />
        </Grid>
        <Grid xs={12} sm={3} xl={3}>
          <DashboardNotification />
        </Grid>
      </Grid>
      <Box mt={2}>
        <SalesOverviewCard data={data?.dataChart}/>
      </Box>
    </Box>
  );
};
