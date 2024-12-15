import React from 'react';
import { TextField } from '@mui/material';

interface MaterialInputProps {
  value: string | number | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  label?: string;
  helperText?: string;
}

const MaterialInput: React.FC<MaterialInputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  label,
  helperText,
}) => {
  return (
    <div>
      <br />
    <TextField
      type={type}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      label={label}
      variant="outlined"
      fullWidth
      helperText={helperText}
    />
    
    </div>
  );
};

export default MaterialInput;