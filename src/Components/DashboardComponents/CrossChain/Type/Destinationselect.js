import React, { useState, useEffect, useRef } from "react";
import dropDownStyles from "./destination.module.css";
import { Modal, Button, Tooltip } from "antd";
// import "antd/dist/antd.css";
import { PlusOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import { FaChevronDown } from "react-icons/fa";

// function NestedDropdown({ options, onSelect, placeholder }) {
//   const [isNestedOpen, setIsNestedOpen] = useState(false);

//   const handleNestedSelect = (value) => {
//     onSelect(value);
//     setIsNestedOpen(false);
//   };

//   return (
//     <div className={dropDownStyles.dropdown}>
//       <div
//         className={dropDownStyles.dropdownHeader}
//         onClick={() => setIsNestedOpen(!isNestedOpen)}
//       >
//         <span>{placeholder} ▾</span>
//       </div>
//       {isNestedOpen && (
//         <div className={dropDownStyles.dropdownList}>
//           {options.map((option) => (
//             <div
//               key={option.name}
//               className={dropDownStyles.dropdownItem}
//               onClick={() => handleNestedSelect(option)}
//             >
//               <img
//                 src={option.iconUrl}
//                 alt={option.name}
//                 className={dropDownStyles.icon}
//               />
//               {option.name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

function DesCustomDropdown({
  options,
  onSelect,
  selectedValue,
  placeholder,
  index,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    onSelect(value, index);
    setIsOpen(false);
    setIsModalVisible(false); // Close the modal after selection
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
      setIsModalVisible(true); // Show the modal when dropdown is clicked
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
        <FaChevronDown className={dropDownStyles.dropdownIcon}></FaChevronDown>
      </div>

      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            Select Destination Chain
            <Tooltip
              title="You can select chain from below options"
              placement="bottom"
              color="linear-gradient(160deg, rgba(24, 26, 83, 1) 47%, rgba(46, 13, 90, 1) 100%)"
              overlayInnerStyle={{
                marginTop: "10px",
                marginLeft: "40px",
                opacity: 0.6,
                borderRadius: "8px",
              }}
            >
              <InfoCircleOutlined
                style={{ opacity: 0.6, fontSize: "16px", marginTop: "2px" }}
              />
            </Tooltip>
          </div>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[]}
      >
        <div className={dropDownStyles.dropdownList}>
          {options.length === 0 ? (
            <div className={dropDownStyles.dropdownItem}>
              Please select destination chain first
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.name}
                className={`${dropDownStyles.dropdownItem} ${
                  selectedValue && selectedValue.name === option.name
                    ? dropDownStyles.dropdownItemSelected
                    : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                <img
                  src={option.iconUrl}
                  alt={option.name}
                  className={dropDownStyles.iconp}
                />
                {option.name}
                {selectedValue && selectedValue.name === option.name && (
                  <span className={dropDownStyles.dropdownItemSelectedText}>
                    {" "}
                    (selected)
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}

export default DesCustomDropdown;
