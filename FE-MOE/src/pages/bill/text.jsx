// const findCustomerInBills = (orderId) => {
    //     const billWithCustomer = bills.find(bill => bill.id === orderId);
    //     return billWithCustomer ? billWithCustomer.customer : null;
    // };

    
    // const loadBills = async () => {
    //     try {
    //         const response = await fetchBill();
    //         if (response?.data) {
    //             setBills(response.data);
    //         }
    //     } catch (error) {
    //         console.error('Failed to fetch bills:', error);
    //     }
    // };

     // useEffect(() => {
    //     if (selectedOrder) {
    //         const customerFromBill = findCustomerInBills(selectedOrder);
    //         setCustomer(customerFromBill);
    //         if (customerFromBill) {
    //             setCustomerId(customerFromBill.id);
    //         }
    //     } else {
    //         setCustomer(null);
    //     }
    //     // [selectedOrder, bills, setCustomerId]
    // }, [selectedOrder, setCustomerId]);