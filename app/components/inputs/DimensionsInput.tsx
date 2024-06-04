import { useRouter } from "next/router";
import React, { useCallback } from "react";
import qs from 'query-string';

interface DimensionInputProps {
  id: string;
  placeholder: string;
}

const DimensionInput: React.FC<DimensionInputProps> = ({ id, placeholder }) => {
  const router = useRouter();

  // Create a state-controlled input value
  const [value, setValue] = React.useState('');

  // Update the URL parameters when the input value changes
  const updateParams = useCallback(() => {
    // Use the router's query object directly, which is a plain object
    const currentQuery = { ...router.query };

    const updatedQuery = {
      ...currentQuery,
      [id]: value // Update the dimension in the query params
    };

    // If the value is empty, remove the parameter from the URL
    if (!value) {
      delete updatedQuery[id];
    }

    // Use the router to update the URL with the new query parameters
    router.push({
      pathname: router.pathname,
      query: updatedQuery,
    }, undefined, { shallow: true }); // Shallow routing can be used to prevent reloading data
  }, [id, value, router]);

  // Handle the change event of the input
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    // Optionally, you can call updateParams here if you want to update the URL in real-time
  }, []);

  // Optionally, use useEffect to call updateParams when value changes
  // React.useEffect(() => {
  //   updateParams();
  // }, [value, updateParams]);

  return (
    <div className="w-full relative">
      <input
        id={id}
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={updateParams} // Call updateParams when the input loses focus
        className={`
          peer
          w-full
          p-4
          pt-6
          font-light
          bg-white
          border-2
          rounded-md
          outline-none
          transition
          pl-4
          border-neutral-300
          focus:border-black
          disabled:opacity-70
          disabled:cursor-not-allowed
        `}
      />
      <label
        htmlFor={id}
        className={`
          absolute
          text-md
          duration-150
          transform
          -translate-y-3
          top-5
          z-10
          origin-[0]
          left-4
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
          text-zinc-400
        `}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default DimensionInput;
