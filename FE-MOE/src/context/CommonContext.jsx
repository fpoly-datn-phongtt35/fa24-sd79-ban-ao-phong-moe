// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { createContext, useEffect, useState } from "react";
import { fetchCarts } from "~/apis/client/apiClient";

const CommonContext = createContext();

function CommonProvider({ children }) {
  const [amoutCart, setAmoutCart] = useState(null);
  const [carts, setCarts] = useState(null);

  const [filters, setFilters] = useState({
    pageNo: 0,
    pageSize: 10,
    keyword: "",
    categoryIds: [],
    brandIds: [],
    materialIds: [],
    minPrice: null,
    maxPrice: null,
    sortBy: "DEFAULT",
  });

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      handleFetchCarts();
    }
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

  const data = {
    amoutCart,
    setAmoutCart,
    carts,
    handleFetchCarts,
    filters,
    setFilters,
  };

  return (
    <CommonContext.Provider value={data}>{children}</CommonContext.Provider>
  );
}

export { CommonContext, CommonProvider };
