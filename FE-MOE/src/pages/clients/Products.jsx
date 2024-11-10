import { Box } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { getProductsFilter } from "~/apis/client/apiClient";
import { CommonContext } from "~/context/CommonContext";

function Products() {
  const context = useContext(CommonContext);

  // useEffect(() => {
  //   fetchData();
  // }, [context.filters]);

  const fetchData = async () => {
    await getProductsFilter(context.filters).then((res) => {
      console.log(res);
    });
  };
  return (
    <Box padding={3}>
      <h1>Coming soon</h1>
      <button onClick={() => console.log(context.filters)}>Add</button>
    </Box>
  );
}

export default Products;
