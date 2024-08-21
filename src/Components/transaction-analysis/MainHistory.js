"use client";
import React, { useState, useEffect, useRef } from "react";
import history from "./history.module.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchUserLabels } from "@/Helpers/FetchUserLabels";
import {
  getERC20Tokens,
  getERC20Transactions,
  getEthTransactions,
} from "@/Helpers/GetSentTransactions";
import { useAccount, useChainId } from "wagmi";

import SameAnalysis from "../Same-Analysis/History";
import CrossAnalysis from "../Cross-Analysis/History";

function MainHistory() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [selectedToken, setSelectedToken] = useState("Select");
  const [tokenListOfUser, setTokenListOfUser] = useState([]);
  const [transactionData, setTransactionData] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [activeTab, setActiveTab] = useState("crossAnalysis");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(()=>{
    inputRef.current.focus()
  },[])
  
  const inputRef = useRef(null)


  // Event handler for changing start date
  const handleStartDateChange = (event) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate);
  };

  // Event handler for changing end date
  const handleEndDateChange = (event) => {
    const newEndDate = event.target.value;
    setEndDate(newEndDate);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTokenChange = async (tokenAddress, tokenSymbol) => {
    setIsLoading(true); // Set loading state to true
    try {
      setSelectedToken(tokenAddress);
      setSelectedTokenSymbol(tokenSymbol);
      setIsDropdownOpen(false); // Close the dropdown
    } catch (error) {
      console.error("Error fetching token data:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const calculateTotalAmount = async (transactions) => {
    if (transactions) {
      let total = 0;
      transactions.forEach((transaction) => {
        total += parseFloat(transaction.value);
      });
      console.log(total.toFixed(8));
      setTotalAmount(total.toFixed(8));
    } else {
      console.log("first");
      setTotalAmount(0);
    }
  };


  useEffect(() => {
    console.log("fetchinggg");
    const fetchData = async () => {
      // setIsLoading(true);
      try {
        const { allNames, allAddress } = await fetchUserLabels(address);
        console.log("all names", allNames);
        var ethData = [];
        if (selectedToken === "Eth") {
          console.log(address, chainId);
          ethData = await getEthTransactions(address, chainId);
          console.log(ethData);
          // ethData = ethData.filter(
          //   (transaction) => transaction.tokenName == null
          // );
        } else {
          ethData = await getERC20Transactions(address, selectedToken, chainId);
          console.log(ethData);
        }
        if (ethData && ethData.length > 0) {
          for (let i = 0; i < ethData.length; i++) {
            const recipientAddress = ethData[i].recipient.toLowerCase();

            const index = allAddress.findIndex(
              (addr) => addr === recipientAddress
            );
            if (index !== -1) {
              ethData[i].label = allNames[index];
            }
          }
          console.log(ethData);
          setTransactionData(ethData);
          setFilteredTransactions(ethData);
          const userTokens = await getERC20Tokens(address, chainId);
          console.log("usertokens", userTokens);
          setTokenListOfUser(userTokens);
          setIsLoading(false);
          setDataNotFound(false);
        } else {
          setDataNotFound(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData(address);
  }, [address, selectedToken]);




  return (
    <div className={history.maindiv}>
      <div className={history.maindivofhisotry}>
        <div className={history.headingdiv}>Latest Transactions</div>

        <div className={history.tablediv1}>
          <div className={history.menubardashboard}>
            <button
              id="crossAnalysis"
              className={
                activeTab === "crossAnalysis" ? `${history.active}` : ""
              }
              onClick={() => setActiveTab("crossAnalysis")}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-custom-class="color-tooltip"
            >
              Cross Analysis
            </button>
            <button
              id="sameAnalysis"
              className={
                activeTab === "sameAnalysis" ? `${history.active}` : ""
              }
              onClick={() => setActiveTab("sameAnalysis")}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-custom-class="color-tooltip"
            >
              Same Analysis
            </button>
          </div>

          <div className={history.filterdiv}>
            <div style={{ display: "flex", gap: "5px" }}>
              <div className={history.labeldate}>
                <input
                  type="date"
                  className={history.dateInput}
                  value={startDate}
                  onChange={handleStartDateChange}
                  placeholder="Start Date"
                />
              </div>
              <div className={history.labeldate}>
                <input
                  type="date"
                  className={history.dateInput}
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </div>
            </div>

            <div className={history.dropdownWrapper} ref={dropdownRef}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={history.dropdown}
              >
                {selectedToken || "Select"}
              </div>
              {isDropdownOpen && (
                <div className={history.dropdownMenu}>
                  <div
                    onClick={() => handleTokenChange("Select", "Select")}
                    className={history.chainOptions}
                  >
                    Select
                  </div>
                  <div
                    onClick={() => handleTokenChange("Eth", "ETH")}
                    className={history.chainOptions}
                  >
                    ETH
                  </div>

                  {tokenListOfUser.length > 0 &&
                    tokenListOfUser.map((token, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          handleTokenChange(token.tokenAddress, token.symbol)
                        }
                        className={history.chainOptions}
                      >
                        {token.symbol}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={history.maintablediv}>

          <div className={history.searchdiv}>
            <input
              placeholder="Search by address or hash"
              ref={inputRef}
              className={history.searchinputbox}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className={history.searchbtn}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={history.searchicon}
              />
            </button>
          </div>

          {activeTab === "sameAnalysis" ? (
            <SameAnalysis
            searchQuery={searchQuery}
            startDate={startDate}
            endDate={endDate}
          />
          ) : (
            <CrossAnalysis
              searchQuery={searchQuery}
              startDate={startDate}
              endDate={endDate}
            />
          )}

          {/* <div className={history.tableandheadingdiv}>
            <div className={popup.tablediv}>
              <div className={popup.head}>
                <table className={popup.table}>
                  <thead>
                    <tr className={popup.row}>
                      <th className={popup.column1}>Recipient Address</th>
                      <th className={popup.column2}>
                        Amount
                        {sortingByAmount ? (
                          <button
                            className={popup.btnhoverpointer}
                            style={{
                              background: "transparent",
                              color: "black",
                              border: "none",
                            }}
                            onClick={dortAmount}
                          >
                            <FontAwesomeIcon icon={faArrowUp} />
                          </button>
                        ) : (
                          <button
                            className={popup.btnhoverpointer}
                            style={{
                              background: "transparent",
                              color: "black",
                              border: "none",
                            }}
                            onClick={sortAmount}
                          >
                            <FontAwesomeIcon icon={faArrowDown} />
                          </button>
                        )}
                      </th>

                      <th className={popup.column3}>Chain</th>
                      <th className={popup.column4}>Token</th>
                      <th className={popup.column5}>
                        Label
                        {sortingByLabel ? (
                          <button
                            className={popup.btnhoverpointer}
                            style={{
                              background: "transparent",
                              color: "black",
                              border: "none",
                            }}
                            onClick={dortLabels}
                          >
                            <FontAwesomeIcon icon={faArrowUp} />
                          </button>
                        ) : (
                          <button
                            className={popup.btnhoverpointer}
                            style={{
                              background: "transparent",
                              color: "black",
                              border: "none",
                            }}
                            onClick={sortLabels}
                          >
                            <FontAwesomeIcon icon={faArrowDown} />
                          </button>
                        )}
                      </th>

                      <th className={popup.column6}>
                        Date
                        {sortingByDate ? (
                          <button
                            className={popup.btnhoverpointer}
                            style={{
                              background: "transparent",
                              color: "black",
                              border: "none",
                            }}
                            onClick={dortDate}
                          >
                            <FontAwesomeIcon icon={faArrowUp} />
                          </button>
                        ) : (
                          <button
                            className={popup.btnhoverpointer}
                            style={{
                              background: "transparent",
                              color: "black",
                              border: "none",
                            }}
                            onClick={sortDate}
                          >
                            <FontAwesomeIcon icon={faArrowDown} />
                          </button>
                        )}
                      </th>

                      <th className={popup.column7}>Transaction Hash</th>
                    </tr>
                  </thead>
                </table>
              </div>

              {isLoading ? (
                <div style={{ position: "relative", top: "100px" }}>
                  Fetching transaction History...
                </div>
              ) : filteredTransactions.length > 0 ? (
                <div className={popup.content}>
                  <table className={popup.table}>
                    <tbody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction, index) => (
                          <tr className={popup.row} key={index}>
                            <td
                              className={popup.column1}
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {`${transaction.recipient.substring(
                                0,
                                3
                              )}...${transaction.recipient.substring(
                                transaction.recipient.length - 5
                              )}`}
                              {isCopied && isCopiedAddressIndex === index ? (
                                <FontAwesomeIcon
                                  icon={faCircleCheck}
                                  size="sm"
                                  alt="Check Icon"
                                  style={{
                                    margin: "0px 10px",
                                    cursor: "pointer",
                                    color: "#ffffff",
                                  }}
                                />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faCopy}
                                  size="sm"
                                  alt="Copy Icon"
                                  onClick={() =>
                                    copyToClipboard(
                                      transaction.recipient,
                                      index
                                    )
                                  }
                                  className={popup.copyIcon}
                                />
                              )}
                            </td>
                            <td
                              className={popup.column2}
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {`${transaction.value.substring(
                                0,
                                3
                              )}...${transaction.value.substring(
                                transaction.value.length - 5
                              )}`}
                            </td>
                            <td
                              className={popup.column3}
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {transaction.chainName}
                            </td>
                            <td
                              className={popup.column4}
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {transaction.tokenName || "ETH"}
                            </td>
                            <td
                              className={popup.column5}
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {transaction.label ? transaction.label : "---"}
                            </td>
                            <td
                              className={popup.column6}
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {new Date(
                                transaction.blockTimestamp
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td
                              className={popup.column7}
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                              }}
                            >
                              {transaction.transactionHash && (
                                <a
                                  href={`https://${explorerUrl}/tx/${transaction.transactionHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#FFFFFF",
                                    textDecoration: "none",
                                  }}
                                >
                                  {`${transaction.transactionHash.substring(
                                    0,
                                    3
                                  )}...${transaction.transactionHash.substring(
                                    transaction.transactionHash.length - 5
                                  )}`}
                                </a>
                              )}

                              {isCopiedHash &&
                              isCopiedAddressIndexHash === index ? (
                                <FontAwesomeIcon
                                  icon={faCircleCheck}
                                  size="sm"
                                  alt="Check Icon"
                                  style={{
                                    margin: "0px 10px",
                                    cursor: "pointer",

                                    color: "#ffffff",
                                  }}
                                />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faCopy}
                                  size="2xs"
                                  alt="Copy Icon"
                                  onClick={() =>
                                    copyToClipboardHash(
                                      transaction.transactionHash,
                                      index
                                    )
                                  }
                                  className={popup.copyIcon}
                                />
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <tr>
                            <td colSpan="7" className={popup.Nodata}>
                              No transactions found.
                            </td>
                          </tr>
                        </div>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : dataNotFound ? (
                <div className={popup.Nodata}>No transactions found.</div>
              ) : (
                <div className={popup.Nodata}>No data found</div>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default MainHistory;
