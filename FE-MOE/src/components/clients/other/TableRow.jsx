import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconButton, Sheet, Typography } from "@mui/joy";

function TableRow(props) {
  const [open, setOpen] = React.useState(props.initialOpen || false);
  return (
    <>
      <tr>
        <td>
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </td>
        <td className="text-start" scope="row">
          HD01
        </td>
        <td>10</td>
        <td>100.000đ</td>
        <td>Chờ thanh toán</td>
        <td>20-10-2004</td>
      </tr>
      <tr>
        <td style={{ height: 0, padding: 0 }} colSpan={6}>
          {open && (
            <Sheet
              variant="soft"
              sx={{
                p: 2,
                pl: 6,
                backgroundColor: "#fafafa",
                boxShadow: "inset 0 3px 6px 0 rgba(0 0 0 / 0.1)",
              }}
            >
              <Typography level="body-lg" component="div">
                View Details
              </Typography>
            </Sheet>
          )}
        </td>
      </tr>
    </>
  );
}

export default TableRow;
