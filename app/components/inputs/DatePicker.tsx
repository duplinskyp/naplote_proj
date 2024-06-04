'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css'; // Vlastné štýly

interface DatePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (dates: { startDate: Date; endDate: Date }) => void;
}

const MonthRangePicker: React.FC<DatePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const handleStartDateChange = (date: Date) => {
    const newStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
    onChange({ startDate: newStartDate, endDate });
  };

  const handleEndDateChange = (date: Date) => {
    const newEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    onChange({ startDate, endDate: newEndDate });
  };

  return (
    <div className="month-range-picker">
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        showFullMonthYearPicker
        minDate={new Date()}
        inline
      />
      <DatePicker
        selected={endDate}
        onChange={handleEndDateChange}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        showFullMonthYearPicker
        minDate={new Date()}
        inline
      />
    </div>
  );
};

export default MonthRangePicker;
