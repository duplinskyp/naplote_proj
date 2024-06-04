'use client';

import React, { useState } from 'react';
import MonthSelect from './MonthSelect';
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
  { value: 9, label: 'Októberr' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' }
];

interface CalendarProps {
  startMonth: number;
  endMonth: number;
  onChange: (startMonth: number, endMonth: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({ startMonth, endMonth, onChange }) => {
  const [dateRange, setDateRange] = useState({
    startMonth,
    endMonth,
  });

  const handleDateChange = (startMonth: number, endMonth: number) => {
    setDateRange({ startMonth, endMonth });
    onChange(startMonth, endMonth);
  };

  const isValidMonth = (month: number) => month >= 0 && month < months.length;

  return (
    <div>
      <MonthSelect
        startMonth={dateRange.startMonth}
        endMonth={dateRange.endMonth}
        onChange={handleDateChange}
      />
      <div className="selected-dates">
        <p className="selected-date">
          Začiatok prenájmu:
          {isValidMonth(dateRange.startMonth) && (
            <span className="selected-month"> {months[dateRange.startMonth].label}</span>
          )}
        </p>
        <p className="selected-date">
          Ukončenie prenájmu ( k poslednému dňu v mesiaci ):
          {isValidMonth(dateRange.endMonth) && (
            <span className="selected-month"> {months[dateRange.endMonth].label}</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Calendar;
