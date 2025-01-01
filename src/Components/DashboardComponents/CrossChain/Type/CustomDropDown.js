import React, { useState, useRef, useEffect } from "react";
import dropDownStyles from "./CustomDropDown.module.css";
import { FaChevronDown } from "react-icons/fa";

function CustomDropdown({
  options,
  onSelect,
  selectedValue,
  placeholder,
  index,
  disabled,
  multiple = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    if (multiple) {
      const updatedSelection = Array.isArray(selectedValue)
        ? selectedValue.some((item) => item.name === value.name)
          ? selectedValue.filter((item) => item.name !== value.name)
          : [...selectedValue, value]
        : [value];
      onSelect(updatedSelection, index);
    } else {
      onSelect([value], index);
    }
    if (!multiple) {
      onSelect(value, index);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("selectedValue changed:", selectedValue);
  }, [selectedValue]);

  const handleTokendropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className={dropDownStyles.dropdown} ref={dropdownRef}>
      <div
        className={`${dropDownStyles.dropdownHeader} ${
          disabled ? dropDownStyles.disabled : ""
        }`}
        onClick={handleTokendropdown}
      >
        {Array.isArray(selectedValue) && selectedValue.length > 0 ? (
            <div className={dropDownStyles.selectedItem}>
              {selectedValue.map((chain, index) => (
                <div key={chain.name} className={dropDownStyles.flexstyle}>
                  <img
                    src={chain.iconUrl}
                    alt={chain.name}
                    className={dropDownStyles.icon}
                  />
                  {chain.name}
                  {/* {index < selectedValue.length - 1 && ", "} */}
                </div>
              ))}
            </div>
        ) : !Array.isArray(selectedValue) && selectedValue?.name ? (
          <div className={dropDownStyles.selectedItem}>
            {selectedValue.iconUrl && (
              <img
                src={selectedValue.iconUrl}
                alt={selectedValue.name}
                className={dropDownStyles.icon}
              />
            )}
            {selectedValue.name}
          </div>
        ) : (
          <span>{placeholder}</span>
        )}
        <FaChevronDown className={dropDownStyles.dropdownIcon} />
      </div>
      {isOpen && (
        <div className={dropDownStyles.dropdownList}>
          {options.length === 0 ? (
            <div className={dropDownStyles.dropdownItem}>
              Please select destination chain
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.name}
                className={`${dropDownStyles.dropdownItem} ${
                  Array.isArray(selectedValue) &&
                  selectedValue.some((item) => item.name === option.name)
                    ? dropDownStyles.selected
                    : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                <img
                  src={option.iconUrl}
                  alt={option.name}
                  className={dropDownStyles.icon}
                />
                {option.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
