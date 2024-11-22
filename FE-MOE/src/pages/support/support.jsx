import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSupport } from "~/apis/supportApi";

export const Support = () => {
const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unresolvedCount, setUnresolvedCount] = useState(0);

  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        const response = await getAllSupport();
        const data = response.data; // Truyền dữ liệu trả về từ API

        console.log(data); // Kiểm tra dữ liệu nhận được từ API

        if (Array.isArray(data)) {
          // Xử lý mảng yêu cầu hỗ trợ
          setNotifications(data);

          // Lọc các yêu cầu hỗ trợ có trạng thái "Đang chờ xử lý"
          const unresolved = data.filter((support) => support.status === "Đang chờ xử lý");
          setUnresolvedCount(unresolved.length);
        } else {
          console.error("Dữ liệu không phải là mảng:", data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin yêu cầu hỗ trợ:", error);
      }
    };
    fetchSupportRequests();
  }, []);
  return(
    <div>
        <h3>Danh Sách liên hệ </h3>
    </div>
  );
}