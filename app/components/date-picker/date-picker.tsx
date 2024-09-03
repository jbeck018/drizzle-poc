import ReactDatePicker from 'react-datepicker';
import { Input } from '@chakra-ui/react';

import 'react-datepicker/dist/react-datepicker.css?url';

export interface DatePickerProps {
  isClearable?: boolean;
  onChange: (date: Date | null) => any;
  selectedDate: Date | undefined;
  showPopperArrow?: boolean;
}

export const DatePicker = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
}: DatePickerProps) => {
  return (
    <ReactDatePicker
        selected={selectedDate}
        onChange={onChange}
        isClearable={isClearable}
        showPopperArrow={showPopperArrow}
        customInput={<Input />}
    />
  );
};