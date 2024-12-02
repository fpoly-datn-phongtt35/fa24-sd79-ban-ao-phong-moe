// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { createContext, useEffect, useState } from "react";
import { fetchCarts } from "~/apis/client/apiClient";
import { getAllSupport } from "~/apis/supportApi";

const CommonContext = createContext();

function CommonProvider({ children }) {
  const [amoutCart, setAmoutCart] = useState(null);
  const [carts, setCarts] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [unresolvedCount, setUnresolvedCount] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      handleFetchCarts();
    }
    fetchSupportRequests();
  }, []);

  const handleFetchCarts = async () => {
    await fetchCarts()
      .then((response) => {
        setCarts(response.data);
        setAmoutCart(response.data?.length);
      })
      .catch((error) => {
        console.error("Fetch carts error:", error);
      });
  };

  const fetchSupportRequests = async () => {
    try {
      const response = await getAllSupport();
      const data = response.data;

      if (Array.isArray(data)) {

        const unresolved = data.filter((support) => support.status === 0);
        setUnresolvedCount(unresolved.length);
      } else {
        console.error("Dữ liệu không phải là mảng:", data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin yêu cầu hỗ trợ:", error);
    }
  };

  const data = {
    amoutCart,
    setAmoutCart,
    carts,
    handleFetchCarts,
    keyword,
    setKeyword,
    setIsManager,
    isManager,
    setUnresolvedCount,
    unresolvedCount,
    fetchSupportRequests
  };

  return (
    <CommonContext.Provider value={data}>{children}</CommonContext.Provider>
  );
}

export { CommonContext, CommonProvider };
