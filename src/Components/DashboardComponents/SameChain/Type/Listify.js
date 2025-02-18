"use client";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import listStyle from "./listify.module.css";
import { isValidAddress } from "@/Helpers/ValidateInput.js";
import { isValidValue } from "@/Helpers/ValidateInput.js";
import { isValidTokenValue } from "@/Helpers/ValidateInput.js";
import Modal from "react-modal";
import textStyle from "./textify.module.css";
import oopsimage from "@/Assets/oops.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import {
  faChevronDown,
  faChevronUp,
  faRotate,
  faMagnifyingGlass,
  faDoorOpen,
  faCirclePlus,
  faTag,
  faUserLarge,
} from "@fortawesome/free-solid-svg-icons";

function Listify({
  listData,
  setListData,
  tokenDecimal,
  allNames,
  allAddresses,
}) {
  const [formData, setFormData] = useState({
    address: "",
    value: "",
    label: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); //error in model
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); //model switch
  // const [LabelModelIsOpen, setLabelModelIsOpen] = useState(false); //model switch
  // const [label, setLabel] = useState(""); //model switch
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [validInput, setValidInput] = useState(true);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  // Function to close the error modal
  const closeErrorModal = () => {
    setErrorModalIsOpen(false);
    setErrorMessage("");
  };

  const handleReceiverAddressChange = (event) => {
    const receiverAddress = event.target.value.toLowerCase();

    const index = allAddresses.findIndex((n) => n === receiverAddress);
    if (index !== -1) {
      setFormData({
        ...formData,
        address: receiverAddress,
        label: allNames[index],
      });
    } else {
      setFormData({
        ...formData,
        address: receiverAddress,
        label: "",
      });
    }
  };

  const handleValueInputChange = (e) => {
    const { name, value } = e.target;

    // Regular expression to allow numeric and decimal values
    const validInputRegex = /^\d*\.?\d*$/;

    if (validInputRegex.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const triggerSlide = () => {
    setIsOpen(!isOpen);
  };

  const handleNameChange = (e) => {
    const enteredName = e.target.value.toLowerCase();

    // Find suggestions based on the entered name
    const filteredSuggestions = allNames.filter((name) =>
      name.toLowerCase().includes(enteredName)
    );
    setNameSuggestions(filteredSuggestions);
    // Find the index of the entered name in the allNames array (case-insensitive)
    const index = allNames.findIndex((n) => n === enteredName);
    if (index !== -1) {
      setFormData({
        ...formData,
        address: allAddresses[index],
        // address: enteredName,
        label: enteredName,
      });
    } else {
      setFormData({
        ...formData,
        label: enteredName,
        address: "",
      }); // Only reset the address if the name is not found
    }
  };

  const handleNameSuggestionClick = (suggestion) => {
    setFormData({
      ...formData,
      label: suggestion,
    });
    setNameSuggestions([]);
  };

  const validateFormData = async () => {
    var address = formData.address;
    var amount = formData.value;
    if (!/^\d/.test(amount)) {
      amount = amount.slice(1);
    }

    if (!isValidValue(amount) && !isValidAddress(address)) {
      setErrorMessage("Incorrect details");
      setErrorModalIsOpen(true);
      return false;
    }

    if (!isValidValue(amount)) {
      setErrorMessage("Invalid Eth Value");
      setErrorModalIsOpen(true);
      return false;
    }
    if (!isValidAddress(address)) {
      setErrorMessage("Invalid recipient Address");
      setErrorModalIsOpen(true);
      return false;
    }
    if (tokenDecimal) {
      formData.value = isValidTokenValue(amount, tokenDecimal);
    } else {
      formData.value = isValidValue(amount);
    }

    return true;
  };

  // Function to close the suggestion dropdown
  const closeSuggestions = () => {
    setNameSuggestions([]);
  };

  // Event listener to handle Escape key press
  useEffect(() => {
    const handleEscapeKeyPress = (e) => {
      if (e.key === "Escape") {
        closeSuggestions();
      }
    };

    document.addEventListener("keydown", handleEscapeKeyPress);

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, []);

  // Event listener to handle click outside the suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Scroll the dropdown container to keep the selected suggestion in view
    if (dropdownRef.current && selectedIndex !== -1) {
      const selectedElement = dropdownRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e) => {
    if (nameSuggestions.length > 0) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : nameSuggestions.length - 1
        );
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < nameSuggestions.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "Enter" && selectedIndex !== -1) {
        handleNameSuggestionClick(nameSuggestions[selectedIndex]);
      }
    }
  };
  const handleAddClick = async () => {
    const isvalid = await validateFormData();

    if (isvalid) {
      setListData([...listData, formData]);
      setFormData({
        address: "",
        value: "",
        label: "",
      });
      localStorage.removeItem("address");
      localStorage.removeItem("value");
      localStorage.removeItem("label");
    }
  };

  useEffect(() => {
    const index = allNames.findIndex((name) => name === formData.label);
    if (index !== -1) {
      setFormData({
        ...formData,
        address: allAddresses[index],
      });
    } else {
      setFormData({
        ...formData,
        address: "",
      });
    }
  }, [formData.label]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <div className={listStyle.divinsamecreatelisttokenload}>
        <div className={listStyle.enteraddressdivtitle}>
          <h2
            style={{
              padding: "15px",
              fontSize: "20px",
              margin: "0px",
              letterSpacing: "1px",
              fontWeight: "300",
            }}
            className={listStyle.enteraddressdivtitleh2}
          >
            Enter the Recipient Address and Token Amount{" "}
          </h2>
        </div>
        <div className={listStyle.addMain}>
          <div className={listStyle.inputflexlist}>
            <label>Enter Name </label>
            <input
              className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
              type="text"
              name="value"
              value={formData.label}
              placeholder="Enter name"
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              autoComplete="off"
            />
            {nameSuggestions.length > 0 && (
              <div ref={dropdownRef} className={listStyle.listdropdown}>
                {nameSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        index === selectedIndex ? "#8f00ff" : "#ffffff",
                      color: index === selectedIndex ? "#ffffff" : "#8f00ff",
                    }}
                    className={`${listStyle.listdropdownItem} ${
                      index === selectedIndex ? listStyle.selected : ""
                    }`} // Apply selected class if index matches selectedIndex
                    onClick={() => handleNameSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={listStyle.inputflexlist}>
            <label className={listStyle.enteraddressdivtitlelabel}>
              Enter Receiver Address:{" "}
            </label>
            <input
              // id="blue-div"
              // className={`each-input-of-create-list token-input ${themeClass}`}
              className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
              type="text"
              name="receiverAddress"
              value={formData.address}
              placeholder="0x9b4716573622751e7F6a56da251D054b6BBa4B00"
              onChange={handleReceiverAddressChange}
               autoComplete="off"
            />
            {!validInput && <p style={{ color: "red" }}>Invalid input</p>}
          </div>
          <div className={listStyle.inputflexlist}>
            <label>Enter Token Amount: </label>
            <input
              // style={{ color: "black" }}
              // className={`each-input-of-create-list token-input ${themeClass}`}
              className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
              type="text"
              name="value"
              value={formData.value}
              placeholder="0.50"
              onChange={handleValueInputChange}
               autoComplete="off"
            />
          </div>

          <div className={listStyle.inputflexlist}>
            <button
              id={listStyle.addtolistbuttonid}
              // className={`${listStyle["buttontoaddformdata"]} ${listStyle["maddtolist"]}}`}
              onClick={handleAddClick}
              style={{ width: "180px", borderRadius: "63px", marginTop: "3px" }}
            >
              Add to List
            </button>
          </div>
        </div>
      </div>
      <>
        <Modal
          className={textStyle.popupforpayment}
          isOpen={errorModalIsOpen}
          onRequestClose={() => setErrorModalIsOpen(false)}
          contentLabel="Error Modal"
        >
          <>
            <h2>Oops...</h2>
            <p>Something went Wrong,</p>
            <div>
              {/* <Image src={oopsimage} alt="not found" /> */}
              <Image
                height={150}
                width={150}
                src={oopsimage.src}
                alt="not found"
              />
            </div>
            <p className={textStyle.errormessagep}>{errorMessage}</p>

            <div className={textStyle.divtocenter}>
              <button onClick={closeErrorModal}>Close</button>
            </div>
          </>
        </Modal>
      </>
      {/* {listData.length > 0 ? null : (
        <div>
          <div
            className={textStyle.titlesametexttextarea}
            onClick={triggerSlide}
          >
            <h2
              className={textStyle.tutorialheading}
              style={{
                padding: "15px",
                fontSize: "20px",
                margin: "0px",
                letterSpacing: "1px",
                fontWeight: "300",
              }}
            >
              How it works{" "}
              <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
            </h2>
          </div>
          {isOpen ? (
            <div
              id="Slider"
              className={`${textStyle.slider} ${
                isOpen ? textStyle.sliderOpen : ""
              }`}
            >
              <div>
                <ui
                  style={{ listStyleType: "none" }}
                  className={textStyle.contents}
                >
                  <div
                    className={textStyle.tutorialcardscontainer}
                    style={{ textAlign: "left" }}
                  >
                    <div className={textStyle.tutorialcards}>
                      <li className={textStyle.contentincard}>
                        <FontAwesomeIcon
                          className={textStyle.iconintutorial}
                          icon={faDoorOpen}
                        />
                        <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                          Direct Entry
                        </div>
                        <div className={textStyle.subtextintutorial}>
                          Enter Ethereum addresses and amounts in Ether or USD.
                        </div>
                      </li>
                    </div>
                    <div className={textStyle.tutorialcards}>
                      <li className={textStyle.contentincard}>
                        <FontAwesomeIcon
                          className={textStyle.iconintutorial}
                          icon={faRotate}
                        />

                        <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                          Auto-Fill Sync
                        </div>
                        <div className={textStyle.subtextintutorial}>
                          Entering address or label auto-fills the corresponding
                          assigned field.
                        </div>
                      </li>
                    </div>
                    <div className={textStyle.tutorialcards}>
                      <li className={textStyle.contentincard}>
                        <FontAwesomeIcon
                          className={textStyle.iconintutorial}
                          icon={faMagnifyingGlass}
                        />

                        <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                          Label Lookup
                        </div>
                        <div className={textStyle.subtextintutorial}>
                          Type labelname to access assigned labels list; select
                          or type "labelname".
                        </div>
                      </li>
                    </div>
                    <div className={textStyle.tutorialcards}>
                      <li className={textStyle.contentincard}>
                        <FontAwesomeIcon
                          className={textStyle.iconintutorial}
                          icon={faCirclePlus}
                        />

                        <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                          Label Assignment
                        </div>
                        <div className={textStyle.subtextintutorial}>
                          Input address and amount; assign label in transaction
                          lineup.
                        </div>
                      </li>
                    </div>
                  </div>
                </ui>
              </div>
            </div>
          ) : null}
        </div>
      )} */}
    </div>
  );
}

export default Listify;
