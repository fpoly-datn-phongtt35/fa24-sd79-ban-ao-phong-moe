// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { toast } from "react-toastify";
import { createOrder } from "~/apis/client/apiClient";

const handleBanking = async () => {
  const data = JSON.parse(localStorage.getItem("temp_data"));
  await createOrder(data).then(() => {
    localStorage.removeItem("temp_data");
    localStorage.removeItem("orderItems");
  });
};

export const handleVerifyBanking = (status, bankCode) => {
  if (status === "00") {
    let data = JSON.parse(localStorage.getItem("temp_data"));
    data.bankCode = bankCode;
    localStorage.setItem("temp_data", JSON.stringify(data));
    handleBanking();
    return true;
  } else if (status === "01") {
    toast.error("Giao dịch chưa hoàn tất");
  } else if (status === "02") {
    localStorage.removeItem("temp_data");
    toast.error("Giao dịch bị lỗi");
  } else if (status === "04") {
    localStorage.removeItem("temp_data");
    toast.error(
      "Giao dịch đảo (Khách hàng đã bị trừ  tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)"
    );
  } else if (status === "05") {
    localStorage.removeItem("temp_data");
    toast.error("VNPAY đang xử lý giao dịch này (GD hoàn tiền)");
  } else if (status === "06") {
    localStorage.removeItem("temp_data");
    toast.error("VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)");
  } else if (status === "07") {
    localStorage.removeItem("temp_data");
    toast.error("Giao dịch bị nghi ngờ gian lận ");
  } else if (status === "08") {
    localStorage.removeItem("temp_data");
    toast.error("Giao dịch quá thời gian thanh toán ");
  } else if (status === "09") {
    localStorage.removeItem("temp_data");
    toast.error("GD Hoàn trả bị từ chối ");
  } else if (status === "10") {
    localStorage.removeItem("temp_data");
    toast.error("Đã giao hàng");
  } else if (status === "11") {
    localStorage.removeItem("temp_data");
    toast.error("Giao dịch bị hủy");
  } else if (status === "20") {
    localStorage.removeItem("temp_data");
    toast.error("Giao dịch đã được thanh quyết toán cho merchant ");
  }
  return false;
};
