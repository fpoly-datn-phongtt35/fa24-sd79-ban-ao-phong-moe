// import React from 'react';
// import { Checkbox, Typography, Box, Stack, Pagination, TextField, Grid } from '@mui/material';

// const ProductTableCreate = ({
//     keyword,
//     setKeyword,
//     promotionDetails,
//     isAllSelected,
//     handleSelectAll,
//     isSelected,
//     handleSelectPromotionDetail,
//     selectedPromotionsError,
//     totalPages,
//     page,
//     handlePageChange,
// }) => {
//     return (
//         <Grid item xs={6}>
//             <TextField
//                 variant="outlined"
//                 label="Tìm kiếm chi tiết khuyến mãi"
//                 fullWidth
//                 margin="normal"
//                 value={keyword}
//                 onChange={(e) => setKeyword(e.target.value)}
//             />

//             <table className="table table-bordered table-hover">
//                 <thead className="table-primary text-center">
//                     <tr>
//                         <th>
//                             <Checkbox
//                                 checked={isAllSelected}
//                                 onChange={handleSelectAll}
//                             />
//                         </th>
//                         <th>ID</th>
//                         <th>Product ID</th>
//                         <th>Promotion ID</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {promotionDetails.length === 0 && (
//                         <tr>
//                             <td colSpan={4} align="center">
//                                 Không tìm thấy chi tiết khuyến mãi!
//                             </td>
//                         </tr>
//                     )}
//                     {promotionDetails.map((detail) => (
//                         <tr key={detail.id}>
//                             <td>
//                                 <Checkbox
//                                     checked={isSelected(detail.id)}
//                                     onChange={() => handleSelectPromotionDetail(detail.id)}
//                                 />
//                             </td>
//                             <td>{detail.id}</td>
//                             <td>{detail.product_id}</td>
//                             <td>{detail.promotion_id}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             {selectedPromotionsError && (
//                 <Typography color="error">{selectedPromotionsError}</Typography>
//             )}
//             <Box mt={2} display="flex" justifyContent="center">
//                 {totalPages > 1 && (
//                     <Stack spacing={2}>
//                         <Pagination
//                             count={totalPages}
//                             page={page}
//                             onChange={handlePageChange}
//                             variant="outlined"
//                             shape="rounded"
//                         />
//                     </Stack>
//                 )}
//             </Box>
//         </Grid>
//     );
// };

// export default PromotionDetailsTable;
