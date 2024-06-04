'use client';

import React, { useState, useEffect } from 'react';
import Button from '../Button';
import Calendar from '../inputs/Calendar';

interface ListingReservationProps {
  price: number;
  totalPrice: number;
  onSubmit: () => void;
  disabled?: boolean;
  onChangeDate: (startMonth: number, endMonth: number) => void;
  dateRange: {
    startMonth: number;
    endMonth: number;
  };
  disabledDates: Date[];
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  totalPrice,
  onSubmit,
  disabled,
  disabledDates,
}) => {
  const [startMonth, setStartMonth] = useState(new Date().getMonth());
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1);

  const handleDateChange = (newStartMonth: number, newEndMonth: number) => {
    setStartMonth(newStartMonth);
    setEndMonth(newEndMonth);
  };

  useEffect(() => {
    // Any side-effects based on date changes can be handled here
  }, [startMonth, endMonth]);

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">${price}</div>
        <div className="font-light text-neutral-600">night</div>
      </div>
      <hr />
      <Calendar
        startMonth={startMonth}
        endMonth={endMonth}
        onChange={handleDateChange}
      />
      <hr />
      <div className="p-4">
        <Button
          disabled={disabled}
          label="Reserve"
          onClick={onSubmit}
        />
      </div>
      <hr />
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>Total</div>
        <div>${totalPrice}</div>
      </div>
    </div>
  );
};

export default ListingReservation;
