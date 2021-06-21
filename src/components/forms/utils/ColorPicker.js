import { ReactComponent as IconError } from "../../../assets/icons/icon-error.svg";
import React from "react";

const ColorPicker = ({
  colorname,
  colorerror,
  onChangeEvent,
  colorstate,
  title,
  placeholderColor
}) => {
  return (
    <div>
      <label htmlFor={colorname} className="block text-sm font-medium leading-5 text-cool-gray-700">
        {title}
      </label>

      <div className="mt-1 flex rounded-md shadow-sm">
        <span
          className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-cool-gray-500 text-sm"
          style={{ backgroundColor: colorstate || placeholderColor }}
        >
          .
        </span>
        <input
          id={colorname}
          name={colorname}
          className={`${
            colorerror
              ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
              : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
          } form-input block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
          value={colorstate || ""}
          onChange={onChangeEvent}
          placeholder={placeholderColor}
        />
        {colorerror && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <IconError />
          </div>
        )}
      </div>
      {colorerror && <p className="mt-2 text-sm text-red-600">This field is required</p>}
    </div>
  );
};

export default ColorPicker;
