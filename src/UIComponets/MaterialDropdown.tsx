import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

interface DropdownOption<T> {
  label: string;
  value: T;
}

interface MaterialDropdownProps<T> {
  label: string;
  options: DropdownOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
}

const MaterialDropdown = <T extends string>({
  label,
  options,
  selectedValue,
  onChange,
}: MaterialDropdownProps<T>): React.JSX.Element => {
  return (
    <FormControl fullWidth style={{ marginTop: "16px" }}>
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        value={selectedValue}
        onChange={(e) => onChange(e.target.value as T)}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MaterialDropdown;