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
import Image from "next/image";

function Listify({
  listData,
  setListData,
  tokenDecimal,
  allNames,
  allAddresses,
  selectedDestinationChain,
}) {
  // Initialize form data for each chain
  const [chainForms, setChainForms] = useState(
    selectedDestinationChain.reduce(
      (acc, chain) => ({
        ...acc,
        [chain.chainId]: {
          address: "",
          value: "",
          label: "",
          chainId: chain.chainId,
          chainName: chain.name,
        },
      }),
      {}
    )
  );
  const [activeChainId, setActiveChainId] = useState(
    selectedDestinationChain[0]?.chainId
  );
  const [errorMessage, setErrorMessage] = useState(""); //error in model
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); //model switch
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  // Function to close the error modal
  const closeErrorModal = () => {
    // console.log("clicked");
    setErrorModalIsOpen(false);
    setErrorMessage("");
    // console.log("modal open");
  };

  console.log("selected chain in listify", selectedDestinationChain);

  useEffect(() => {
    Object.keys(chainForms).forEach((chainId) => {
      const label = chainForms[chainId].label;
      const index = allNames.findIndex(
        (name) => name.toLowerCase() === label.toLowerCase()
      );
      if (index !== -1) {
        setChainForms((prev) => ({
          ...prev,
          [chainId]: {
            ...prev[chainId],
            address: allAddresses[index],
          },
        }));
      }
    });
  }, [chainForms, allNames, allAddresses]);

  const handleReceiverAddressChange = (chainId, event) => {
    const receiverAddress = event.target.value.toLowerCase();
    const index = allAddresses.findIndex((n) => n === receiverAddress);

    setChainForms((prev) => ({
      ...prev,
      [chainId]: {
        ...prev[chainId],
        address: receiverAddress,
        label: index !== -1 ? allNames[index] : prev[chainId].label,
      },
    }));
  };

  const handleValueInputChange = (chainId, e) => {
    const { value } = e.target;
    const validInputRegex = /^\d*\.?\d*$/;

    if (validInputRegex.test(value)) {
      setChainForms((prev) => ({
        ...prev,
        [chainId]: {
          ...prev[chainId],
          value: value,
        },
      }));
    }
  };

  const handleNameChange = (chainId, e) => {
    const enteredName = e.target.value.toLowerCase();
    const filteredSuggestions = allNames.filter((name) =>
      name.toLowerCase().includes(enteredName)
    );
    setNameSuggestions(filteredSuggestions);

    setChainForms((prev) => ({
      ...prev,
      [chainId]: {
        ...prev[chainId],
        label: enteredName,
      },
    }));
  };

  const handleNameSuggestionClick = (chainId, suggestion) => {
    setChainForms((prev) => ({
      ...prev,
      [chainId]: {
        ...prev[chainId],
        label: suggestion,
      },
    }));
    setNameSuggestions([]);
  };

  const validateFormData = async (chainId) => {
    const formData = chainForms[chainId];
    const address = formData.address;
    let amount = formData.value;

    if (!/^\d/.test(amount)) {
      amount = amount.slice(1);
    }

    if (!isValidValue(amount) && !isValidAddress(address)) {
      setErrorMessage("Incorrect details");
      setErrorModalIsOpen(true);
      return false;
    }

    if (!isValidValue(amount)) {
      setErrorMessage("Invalid Value");
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

  const handleKeyDown = (chainId, e) => {
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
        e.preventDefault();
        handleNameSuggestionClick(chainId, nameSuggestions[selectedIndex]);
      }
    }
  };

  const handleAddClick = async (chainId) => {
    const isvalid = await validateFormData(chainId);
    if (isvalid) {
      const formDataToAdd = chainForms[chainId];
      console.log("form data", formDataToAdd);
      setListData([...listData, formDataToAdd]);

      // Reset only the form for this chain
      setChainForms((prev) => ({
        ...prev,
        [chainId]: {
          ...prev[chainId],
          address: "",
          value: "",
          label: "",
        },
      }));
    }
  };

  const renderChainForm = (chain) => (
    <div key={chain.chainId} className={listStyle.chainFormContainer}>
      {/* <div className={listStyle.chainHeader}>
        <img 
          src={chain.iconUrl} 
          alt={chain.name} 
          className={listStyle.chainIcon} 
          width={24} 
          height={24}
        />
        <h3>{chain.name}</h3>
      </div> */}

      <div className={listStyle.enteraddressdivtitle}>
        <h2
          className={listStyle.enteraddressdivtitleh2}
          style={{
            padding: "15px",
            fontSize: "20px",
            margin: "0px",
            letterSpacing: "1px",
            fontWeight: "300",
          }}
        >
          <img
            src={chain.iconUrl}
            alt={chain.name}
            style={{
              width: "24px",
              height: "24px",
              marginRight: "8px",
              verticalAlign: "middle",
            }}
          />
          Enter the Recipient Address and Token Amount for {chain.name}
        </h2>
      </div>

      <div className={listStyle.addMain}>
        <div className={listStyle.inputflexlist}>
          <label>Enter Name </label>
          <input
            className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
            type="text"
            value={chainForms[chain.chainId].label}
            placeholder="Enter name"
            onChange={(e) => handleNameChange(chain.chainId, e)}
            onKeyDown={(e) => handleKeyDown(chain.chainId, e)}
            autoComplete="off"
          />
          {nameSuggestions.length > 0 && (
            <div ref={dropdownRef} className={listStyle.listdropdown}>
              {nameSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`${listStyle.listdropdownItem} ${
                    index === selectedIndex ? listStyle.selected : ""
                  }`}
                  style={{
                    backgroundColor:
                      index === selectedIndex ? "#49058eed" : "#49058e91",
                  }}
                  onClick={() =>
                    handleNameSuggestionClick(chain.chainId, suggestion)
                  }
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={listStyle.inputflexlist}>
          <label>Enter Receiver Address: </label>
          <input
            className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
            type="text"
            value={chainForms[chain.chainId].address}
            placeholder="0x9b4716573622751e7F6a56da251D054b6BBa4B00"
            onChange={(e) => handleReceiverAddressChange(chain.chainId, e)}
            autoComplete="off"
          />
        </div>

        <div className={listStyle.inputflexlist}>
          <label>Enter Token Amount: </label>
          <input
            className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
            type="text"
            name="value"
            value={chainForms[chain.chainId].value}
            placeholder="0.50"
            onChange={(e) => handleValueInputChange(chain.chainId, e)}
            autoComplete="off"
          />
        </div>

        <div className={listStyle.inputflexlist}>
          <button
            className={listStyle.addtolistbuttonid}
            onClick={() => handleAddClick(chain.chainId)}
            style={{ width: "180px", borderRadius: "63px", marginTop: "3px" }}
          >
            Add to List
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={listStyle.divinsamecreatelisttokenload}>
      <div className={listStyle.chainFormsContainer}>
        {selectedDestinationChain.map((chain) => renderChainForm(chain))}
      </div>

      <Modal
        className={textStyle.popupforpayment}
        isOpen={errorModalIsOpen}
        onRequestClose={() => setErrorModalIsOpen(false)}
        contentLabel="Error Modal"
      >
        <h2>Oops...</h2>
        <p>Something went Wrong</p>
        <div>
          <Image height={150} width={150} src={oopsimage.src} alt="not found" />
        </div>
        <p className={textStyle.errormessagep}>{errorMessage}</p>
        <div className={textStyle.divtocenter}>
          <button onClick={() => setErrorModalIsOpen(false)}>Close</button>
        </div>
      </Modal>
    </div>
  );
}

export default Listify;
