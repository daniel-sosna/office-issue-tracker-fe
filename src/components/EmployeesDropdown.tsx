import { useState, useEffect } from "react";
import { Autocomplete, TextField, Popper } from "@mui/material";
import type { EmployeesDropdownProps } from "@data/issues";
import { useUsers } from "@api/queries/useUsers";

const MIN_INPUT_WIDTH = 190;

const getTextWidthByChars = (
  text: string,
  includePrefix = true,
  charWidth = 13
) => {
  const fullText = includePrefix ? `Employee: ${text}` : text;
  return fullText.length * charWidth;
};

const EmployeesDropdown: React.FC<EmployeesDropdownProps> = ({
  selectedUser,
  setSelectedUser,
  setPage,
  disabled,
}) => {
  const { data: users = [] } = useUsers();
  const [inputWidth, setInputWidth] = useState(MIN_INPUT_WIDTH);

  const options = [{ id: "", name: "All Employees" }, ...users];

  const selectedUserObj = selectedUser
    ? users.find((u) => u.id === selectedUser)
    : options[0];

  const displayText = selectedUserObj?.id
    ? selectedUserObj.name
    : "All Employees";

  useEffect(() => {
    const width = getTextWidthByChars(displayText, selectedUserObj?.id !== "");
    setInputWidth(width < MIN_INPUT_WIDTH ? MIN_INPUT_WIDTH : width);
  }, [displayText, selectedUserObj]);

  return (
    <Autocomplete
      disabled={disabled}
      options={options}
      getOptionLabel={(option) =>
        option.id ? `Employee: ${option.name}` : option.name
      }
      value={selectedUserObj ?? null}
      onChange={(_, newValue) => {
        setSelectedUser(newValue?.id ?? undefined);
        setPage(1);
      }}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      slots={{ popper: Popper }}
      slotProps={{
        popper: { style: { width: inputWidth } },
      }}
      sx={{
        width: inputWidth,
        minWidth: MIN_INPUT_WIDTH,
        "& .MuiAutocomplete-inputRoot": {
          width: "100%",
          "& input": { color: "text.primary" },
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "9999px",
          backgroundColor: "#f4f4f4",
        },
      }}
      renderOption={(props, option) => (
        <li
          {...props}
          style={{
            fontWeight: option.id === "" ? "bold" : "normal",
            color: "text.primary",
          }}
        >
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          variant="outlined"
          placeholder="Select Employee"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "9999px",
              backgroundColor: "#f4f4f4",
            },
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: params.InputProps.endAdornment,
          }}
        />
      )}
      noOptionsText="No users found"
    />
  );
};

export default EmployeesDropdown;
