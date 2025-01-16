import React, { useState, useEffect, useRef } from "react";
import textStyle from "./textify.module.css";
import { isValidAddress } from "@/Helpers/ValidateInput.js";
import { isValidValue } from "@/Helpers/ValidateInput.js";
import { isValidTokenValue } from "@/Helpers/ValidateInput.js";
import { useAccount } from "wagmi";

function Textify({
  listData,
  setListData,
  tokenDecimal,
  allNames,
  allAddresses,
  selectedDestinationChain,
}) {
  // Add state for each chain's text value
  const [chainTextValues, setChainTextValues] = useState(
    Object.fromEntries(
      selectedDestinationChain.map((chain) => [chain.chainId, ""])
    )
  );

  const [textValue, setTextValue] = useState("");
  const [ethToUsdExchangeRate, setEthToUsdExchangeRate] = useState(null); //store ETH to USD exchange rate
  const [suggestions, setSuggestions] = useState([]);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1); // Define focusedSuggestionIndex state variable
  const textareaRef = useRef(null);
  const [suggestionItemHeight, setSuggestionItemHeight] = useState(0);
  const dropdownRef = useRef(null);
  const { address } = useAccount();

  // Modify handleInputChange
  const handleInputChange = (e, chainId) => {
    const { value } = e.target;
    setChainTextValues((prev) => ({
      ...prev,
      [chainId]: value,
    }));

    if (value.includes("@")) {
      const searchTerm = value.split("@").pop().toLowerCase();
      const filteredSuggestions = allNames?.filter((name) =>
        name.toLowerCase().includes(searchTerm)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
    parseText(value, chainId);
  };

  const handleSuggestionClick = (suggestion) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = textValue.substring(0, cursorPosition);
    const textAfterCursor = textValue.substring(cursorPosition);
    const lastAtSymbolIndex = textBeforeCursor.lastIndexOf("@");
    const updatedTextValue =
      textBeforeCursor.substring(0, lastAtSymbolIndex + 1) +
      suggestion +
      " " +
      textAfterCursor;

    // Find the index of the first non-whitespace character after the inserted address
    const nextNonWhitespaceIndex = updatedTextValue.indexOf(
      /\S/,
      lastAtSymbolIndex + suggestion.length + 2
    );

    // Calculate the new cursor position
    const updatedCursorPosition =
      nextNonWhitespaceIndex !== -1
        ? nextNonWhitespaceIndex
        : updatedTextValue.length;

    setTextValue(updatedTextValue);
    setSuggestions([]);

    // Set the cursor position after the inserted address
    // Ensure the textarea is focused before setting the cursor position
    textareaRef.current.setSelectionRange(
      updatedCursorPosition,
      updatedCursorPosition
    );

    parseText(updatedTextValue);
  };

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
        );
        const data = await response.json();
        const rate = data.USD;

        setEthToUsdExchangeRate(rate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
  }, [listData]);

  // Modify parseText to handle multiple chains
  const parseText = async (textValue, chainId) => {
    // Create a copy of the current list data
    let updatedRecipients = [...listData];
    const lines = textValue.split("\n").filter((line) => line.trim() !== "");
    
    // First, remove all entries for this specific chain
    updatedRecipients = updatedRecipients.filter(item => item.chainId !== chainId);
    
    // Then add new entries for this chain
    for (const line of lines) {
      const [recipientAddress, ...valueParts] = line.split(/[,= \t]+/);
      const recipientAddressFormatted = recipientAddress.toLowerCase();
      const value = valueParts.join(" ");

      if (value) {
        let validValue = tokenDecimal ? 
          isValidTokenValue(value, tokenDecimal) : 
          isValidValue(value);

        if (!validValue) continue;

        const index = allAddresses.indexOf(recipientAddressFormatted);
        if (isValidAddress(recipientAddressFormatted)) {
          updatedRecipients.push({
            address: recipientAddressFormatted,
            value: validValue,
            label: allNames[index] ? allNames[index] : "",
            chainId: chainId,
            chainName: selectedDestinationChain.find(chain => chain.chainId === chainId)?.name
          });
        }
      }
    }

    await setListData(updatedRecipients);
};

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = focusedSuggestionIndex + (e.key === "ArrowUp" ? -1 : 1);

      if (
        newIndex >= 0 && newIndex < suggestions.length ? suggestions.length : 0
      ) {
        setFocusedSuggestionIndex(newIndex);

        // Calculate the scroll position
        const dropdownElement = dropdownRef.current;
        const scrollTop = newIndex * suggestionItemHeight;
        dropdownElement.scrollTop = scrollTop;
      }
    } else if (e.key === "Enter" && focusedSuggestionIndex !== -1) {
      // Check if "@" is present in the input text
      if (textValue.includes("@")) {
        e.preventDefault(); // Prevent the default Enter behavior
        handleSuggestionClick(suggestions[focusedSuggestionIndex]);
      }
    }
  };

  useEffect(() => {
    // Calculate suggestion item height when suggestions change
    const suggestionElement = dropdownRef.current?.firstChild;
    if (suggestionElement) {
      setSuggestionItemHeight(suggestionElement.offsetHeight);
    }
  }, [suggestions]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedSuggestionIndex, suggestions]);

  const handleSuggestionMouseEnter = (index) => {
    setFocusedSuggestionIndex(index);
  };

  const handleSuggestionMouseLeave = () => {
    setFocusedSuggestionIndex(-1);
  };

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  return (
    <div>
      {selectedDestinationChain.map((chain) => (
        <div key={chain.chainId} className={textStyle.divtocoversametextdi}>
          <div>
            <div
              id={`textify-input-${chain.chainId}`}
              className={textStyle.textlistdiv}
            >
              <div className={textStyle.titlesametexttextarea}>
                <h2
                  style={{
                    padding: "15px",
                    fontSize: "20px",
                    margin: "0px",
                    letterSpacing: "1px",
                    fontWeight: "300",
                    lineHeight: "25px",
                  }}
                >
                  {/* Display chain name and optionally the icon */}
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
                  Enter Recipients and Amount for {chain.name}
                </h2>
              </div>
              <div style={{ position: "relative", height: "100px" }}>
                <textarea
                  ref={
                    chain.chainId === selectedDestinationChain[0].chainId
                      ? textareaRef
                      : null
                  }
                  spellCheck="false"
                  value={chainTextValues[chain.chainId]}
                  onChange={(e) => handleInputChange(e, chain.chainId)}
                  style={{
                    width: "100%",
                    minHeight: "90px",
                    padding: "10px",
                    border: "none",
                    background: "#e6e6fa",
                    color: "black",
                    fontSize: "16px",
                    fontFamily: "Arial, sans-serif",
                    boxSizing: "border-box",
                    resize: "none",
                  }}
                  className={textStyle.textareaInput}
                  placeholder={`@Justin/0xe57f4c84539a6414C4Cf48f135210e01c477EFE0 1.41421`}
                />
                {suggestions?.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className={textStyle.dropdown}
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`${textStyle.dropdownItem} ${
                          index === focusedSuggestionIndex
                            ? textStyle.dropdownItemActive
                            : ""
                        }`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => handleSuggestionMouseEnter(index)}
                        onMouseLeave={handleSuggestionMouseLeave}
                        style={{
                          background:
                            index === focusedSuggestionIndex
                              ? "#8f00ff"
                              : "white",
                          color:
                            index === focusedSuggestionIndex
                              ? "white"
                              : "#8f00ff",
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Textify;
