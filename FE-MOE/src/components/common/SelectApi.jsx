import { InputLabel, MenuItem, Select, FormControl } from "@mui/material";
import { useState } from "react";

export const SelectApi = (props) => {

  return (
    <FormControl fullWidth>
      <InputLabel id={props.id}>{props.label}</InputLabel>
      <Select
        labelId={props.id}
        value={props.value}
        label={props.label}
        name={props.name}
        onChange={(event) => props.handleSelect(event)}
      >
        {props.data &&
          props.data.map((item) => (
            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};
