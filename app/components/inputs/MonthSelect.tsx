'use client';

import React from 'react';
import Select, { SingleValue } from 'react-select';
import './MonthSelect.css';


const months = [
  { value: 0, label: 'Január' },
  { value: 1, label: 'Február' },
  { value: 2, label: 'Marec' },
  { value: 3, label: 'Apríl' },
  { value: 4, label: 'Máj' },
  { value: 5, label: 'Jún' },
  { value: 6, label: 'Júl' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'Október' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' }
];
interface MonthSelectProps {
  startMonth: number;
  endMonth: number;
  onChange: (startMonth: number, endMonth: number) => void;
}

const MonthSelect: React.FC<MonthSelectProps> = ({ startMonth, endMonth, onChange }) => {
  const handleStartChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
    if (selectedOption) {
      onChange(selectedOption.value, endMonth);
    }
  };

  const handleEndChange = (selectedOption: SingleValue<{ value: number}>) => {
    if (selectedOption) {
      onChange(startMonth, selectedOption.value);
    }
  };

  return (
    <div className="month-select-container">
      <div className="month-select">
        <label>Start Month</label>
        <Select
          value={months.find(month => month.value === startMonth)}
          onChange={handleStartChange}
          options={months.filter(month => month.value >= new Date().getMonth())}
        />
      </div>
      <div className="month-select">
        <label>End Month</label>
        <Select
          value={months.find(month => month.value === endMonth)}
          onChange={handleEndChange}
          options={months.filter(month => month.value >= startMonth)}
        />
      </div>
    </div>
  );
};

export default MonthSelect;
