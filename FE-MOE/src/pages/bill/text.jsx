// const getStepStatus = (stepIndex) => {
//     if (statusDetails.length === 0) return 'disabled';

//     const currentStatus = statusDetails[stepIndex]?.billStatus; // Get status based on step index
//     if (currentStatus) {
//       return currentStatus === 3 ? 'active' : 'disabled';
//     }
//     return 'disabled';
//   };

//   const openStatusModal = () => {
//     setIsStatusModalOpen(true);
//   };

//   const closeStatusModal = () => {
//     setIsStatusModalOpen(false);
//   };

// const checkShippingButtonStatus = (statusData) => {
//     if (statusData.some(status => status.billStatus === 3)) {
//       setIsShippingDisabled(true);
//     } else {
//       setIsShippingDisabled(false);
//     }
//   };