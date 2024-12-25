import React, { useState, useEffect, useRef } from "react";
import dropDownStyles from "./CustomDropDown.module.css";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { FaChevronDown } from "react-icons/fa";

function CustomDropdown({
  options,
  onSelect,
  selectedValue,
  placeholder,
  index,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  console.log("frommm", options);
  const handleSelect = (value) => {
    onSelect(value, index);
    setIsOpen(false);
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

  const driverObj = driver({
    overlayColor: "#00000094",
    // popoverClass: ` ${samechainStyle.driverpopover01}`,
    showProgress: true,
    steps: [
      {
        element: "#finaldropdown",
        popover: {
          title: "Textify",
          description:
            "Effortlessly input recipient addresses and amounts in one line with Textify, whether through copy-paste or direct entry",
          side: "right",
          align: "start",
        },
      },
    ],
  });

  const handleTokendropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      // driverObj.drive();
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
        {console.log(selectedValue)}
        {selectedValue ? (
          <div className={dropDownStyles.selectedItem}>
            <img
              src={selectedValue.iconUrl}
              alt={selectedValue.name}
              className={dropDownStyles.icon}
            />
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
                className={dropDownStyles.dropdownItem}
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
