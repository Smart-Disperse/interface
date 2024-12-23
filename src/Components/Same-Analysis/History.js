"use client";
import React, { useState, useEffect, useRef } from "react";
import histroyStyle from "./history.module.css";
import { DatePicker, Space } from "antd";
import { FaChevronDown } from "react-icons/fa";
import moment from "moment";
import {
  faArrowDown,
  faArrowUp,
  faCopy,
  faMagnifyingGlass,
  faChevronDown,
  faChevronUp,
  faChartColumn,
  faFilter,
  faFilterCircleXmark,
  faLineChart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchUserLabels } from "@/Helpers/FetchUserLabels";
import {
  getERC20Tokens,
  getERC20Transactions,
  getEthTransactions,
} from "@/Helpers/GetSentTransactions";
import { useAccount, useChainId } from "wagmi";
import popup from "@/Components/Dashboard/popupTable.module.css";
import { FaFilter } from "react-icons/fa";

function History() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [render, setRender] = useState(1);
  const [selectedToken, setSelectedToken] = useState("Select Token");
  const [tokenListOfUser, setTokenListOfUser] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataNotFound, setDataNotFound] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortingByAmount, setSortingByAmount] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedAddressIndex, setIsCopiedAddressIndex] = useState(false);
  const [isCopiedHash, setIsCopiedHash] = useState(false);
  const [sortingByLabel, setSortingByLabel] = useState(false);
  const [sortingByDate, setSortingByDate] = useState(false);
  const [isCopiedAddressIndexHash, setIsCopiedAddressIndexHash] =
    useState(false);
  const [transactions, setTransactions] = useState(filteredTransactions);
  const [explorerUrl, setExplorerUrl] = useState("Eth");
  const inputRef1 = useRef();
  const [totalAmount, setTotalAmount] = useState(0);
  const inputRef3 = useRef();

  // State for selected token and dates
  // const [selectedToken, setSelectedToken] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const filterContainerRef = useRef(null);

  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState("ETH");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // /............sorting label function ............./
  const sortLabels = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      if (!a.label || !b.label) {
        return 0;
      }
      return a.label.localeCompare(b.label);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByLabel(true);
  };
  const dortLabels = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      if (!a.label || !b.label) {
        return 0;
      }
      return b.label.localeCompare(a.label);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByLabel(false);
  };
  // /............sorting amount function ............./
  const sortAmount = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      return parseFloat(b.value) - parseFloat(a.value);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByAmount(true);
  };

  const dortAmount = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      return parseFloat(a.value) - parseFloat(b.value);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByAmount(false);
  };

  // /............sorting amount function ............./
  const sortDate = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      return new Date(b.blockTimestamp) - new Date(a.blockTimestamp);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByDate(true);
  };
  const dortDate = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      return new Date(a.blockTimestamp) - new Date(b.blockTimestamp);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByDate(false);
  };

  const copyToClipboard = (text, index) => {
    setIsCopiedAddressIndex(index);
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000); // Reset the copy status after 2 seconds
      },
      (err) => {
        console.error("Unable to copy to clipboard:", err);
      }
    );
  };
  const copyToClipboardHash = (text, index) => {
    setIsCopiedAddressIndexHash(index);
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopiedHash(true);
        setTimeout(() => {
          setIsCopiedHash(false);
        }, 2000); // Reset the copy status after 2 seconds
      },
      (err) => {
        console.error("Unable to copy to clipboard:", err);
      }
    );
  };

  // Function to handle changes in both address and label search inputs
  const handleSearchChange = (event) => {
    const { value } = event.target;
    handleSearch(value);
  };

  // Event handler for changing start date
  const handleStartDateChange = (date, dateString) => {
    checkAllFieldsFilled();
    setStartDate(date);
  };

  // Event handler for changing end date
  const handleEndDateChange = (date) => {
    checkAllFieldsFilled();
    setEndDate(date);
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
      checkAllFieldsFilled();
    } catch (error) {
      console.error("Error fetching token data:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // const handleTokenChange = async (event) => {
  //   const selectedToken = event.target.value;
  //   setIsLoading(true); // Set loading state to true
  //   try {
  //     const selectedTokenObject = tokenListOfUser.find(
  //       (token) => token.tokenAddress === selectedToken
  //     );
  //     setSelectedToken(selectedToken);
  //     setSelectedTokenSymbol(
  //       selectedTokenObject ? selectedTokenObject.symbol : "ETH"
  //     );
  //   } catch (error) {
  //     console.error("Error fetching token data:", error);
  //   } finally {
  //     setIsLoading(false); // Reset loading state
  //   }
  // };
  const handleSearch = (searchQuery) => {
    var filtered = transactionData;
    filtered = transactionData.filter(
      (transaction) =>
        transaction.recipient
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase()) !== -1 ||
        (transaction.label &&
          transaction.label.toLowerCase().indexOf(searchQuery.toLowerCase()) !==
            -1) ||
        transaction.transactionHash
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase()) !== -1
    );

    setFilteredTransactions(filtered);
    calculateTotalAmount(filtered);
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
  const checkAllFieldsFilled = () => {
    if (startDate && endDate && selectedToken) {
      setIsOpen(false);
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    // Recalculate total amount whenever filtered transactions change
    calculateTotalAmount(filteredTransactions);
  }, [filteredTransactions]);

  useEffect(() => {
    let filtered = transactionData;
    if (Array.isArray(filtered) && startDate && endDate) {
      // Filter by date range
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.blockTimestamp);
        const nextDayEndDate = new Date(endDate);
        nextDayEndDate.setDate(nextDayEndDate.getDate() + 1); // Increment endDate by 1 day
        return (
          transactionDate >= new Date(startDate) &&
          transactionDate < nextDayEndDate // Adjusted comparison to include endDate
        );
      });
    }
    setFilteredTransactions(filtered);
  }, [startDate, endDate, transactionData]);

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

  useEffect(() => {
    if (address) {
      setRender((prev) => prev + 1);
    }
  }, [address, chainId]);
  const [isOpen, setIsOpen] = useState(false);

  const contentRef = useRef(null);

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

  const toggleOpen = () => setIsOpen(!isOpen);
  const filterbuttonref = useRef([]);


  const [isSelectingDate, setIsSelectingDate] = useState(false);

  const handleClickOutside = (event) => {
    if (isSelectingDate) {
      return;
    }
    if (
      filterbuttonref.current &&
      !filterbuttonref.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      contentRef.current &&
      !contentRef.current.contains(event.target)
    ) {
      setIsOpen(false);
      setIsDropdownOpen(false);
    }
  };

  const handleDatePicker = () => {
    setIsSelectingDate(!isSelectingDate);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelectingDate]);

  return (
    <div className={histroyStyle.maindivofhisotry}>
      <div className={histroyStyle.searchtablediv}>
        <div className={histroyStyle.maintablediv}>
          <div className={histroyStyle.tablediv1}>
            <div className={histroyStyle.searchdiv}>
              <input
                placeholder="Search by address or hash"
                className={histroyStyle.searchinputbox}
              />
              <button className={histroyStyle.searchbtn}>
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className={histroyStyle.searchicon}
                />
              </button>
            </div>
            <div className={histroyStyle.filterContainer}>
              <button
                ref={filterbuttonref}
                onClick={toggleOpen}
                className={`${histroyStyle.filterButton} flex items-center justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200`}
              >
                <span>Filter</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path
                    d="M2.5 5.83333H17.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 10H15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8.33333 14.1667H11.6667"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              {isOpen ? (
                <div
                  ref={contentRef}
                  style={{
                    maxHeight: isOpen
                      ? `${contentRef.current?.scrollHeight}px`
                      : "0",

                    transition: "max-height 0.3s ease-in-out",
                  }}
                  className={`${histroyStyle.filterContent} bg-white rounded-b-md shadow-md`}
                >
                  <div className={`${histroyStyle.filterdiv} p-4`}>
                    <div className="flex gap-4 mb-4">
                      <div className={histroyStyle.labeldate}>
                        <DatePicker
                          value={startDate}
                          className={histroyStyle.dateInput}
                          onChange={handleStartDateChange}
                          placeholder="Start Date"
                          onOpenChange={handleDatePicker}
                        />
                      </div>
                      <div className={histroyStyle.labeldate}>
                        <DatePicker
                          className={histroyStyle.dateInput}
                          value={endDate}
                          onChange={handleEndDateChange}
                          placeholder="End Date"
                          onOpenChange={handleDatePicker}
                        />
                      </div>
                    </div>
                    <div
                      className={histroyStyle.dropdownWrapper}
                      ref={dropdownRef}
                    >
                      <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`${histroyStyle.dropdown} cursor-pointer`}
                      >
                        {selectedToken || "Select Token"}
                        <FaChevronDown className={histroyStyle.dropdownIcon} />
                      </div>
                      {isDropdownOpen && (
                        <div
                          className={`${histroyStyle.dropdownMenu} absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg`}
                        >
                          {/* <div
                      onClick={() => handleTokenChange(" Select Token", " Select Token")}
                      className={histroyStyle.chainOptions}
                    >
                      Select Token
                   </div> */}
                          <div
                            onClick={() => {
                              handleTokenChange("ETH", "ETH");
                              setIsDropdownOpen(false);
                            }}
                            className={`${histroyStyle.chainOptions} px-4 py-2 hover:bg-gray-100 cursor-pointer`}
                          >
                            ETH
                          </div>
                          {tokenListOfUser.length > 0 &&
                            tokenListOfUser.map((token, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  handleTokenChange(
                                    token.tokenAddress,
                                    token.symbol
                                  );
                                  setIsDropdownOpen(false);
                                }}
                                className={`${histroyStyle.chainOptions} px-4 py-2 hover:bg-gray-100 cursor-pointer`}
                              >
                                {token.symbol}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          {/* <div className={histroyStyle.tableandheadingdiv}>
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
          <div className={histroyStyle.parentDivofTable}>
            <div className={histroyStyle.tableWrapper}>
              <table>
                <thead>
                  <tr className={histroyStyle.sticky}>
                    <th>Recipient Address</th>
                    <th>
                      Amount
                      {sortingByAmount ? (
                        <button
                          className={popup.btnhoverpointer}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ffffff7a",
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
                            border: "none",
                            color: "#ffffff7a",
                          }}
                          onClick={sortAmount}
                        >
                          <FontAwesomeIcon icon={faArrowDown} />
                        </button>
                      )}
                    </th>

                    <th>Chain</th>
                    <th>Token</th>
                    <th>
                      Label
                      {sortingByLabel ? (
                        <button
                          className={popup.btnhoverpointer}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ffffff7a",
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
                            border: "none",
                            color: "#ffffff7a",
                          }}
                          onClick={sortLabels}
                        >
                          <FontAwesomeIcon icon={faArrowDown} />
                        </button>
                      )}
                    </th>

                    <th>
                      Date
                      {sortingByDate ? (
                        <button
                          className={popup.btnhoverpointer}
                          style={{
                            background: "transparent",
                            color: "#ffffff7a",
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
                            border: "none",
                            color: "#ffffff7a",
                          }}
                          onClick={sortDate}
                        >
                          <FontAwesomeIcon icon={faArrowDown} />
                        </button>
                      )}
                    </th>

                    <th>Transaction Hash</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>
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
                                copyToClipboard(transaction.recipient, index)
                              }
                              style={{
                                margin: "0px 10px",
                                cursor: "pointer",
                                color: "#ffffff",
                              }}
                            />
                          )}
                        </td>
                        <td>
                          {`${transaction.value.substring(
                            0,
                            3
                          )}...${transaction.value.substring(
                            transaction.value.length - 5
                          )}`}
                        </td>
                        <td>{transaction.chainName}</td>
                        <td>{transaction.tokenName || "ETH"}</td>
                        <td>{transaction.label ? transaction.label : "---"}</td>
                        <td>
                          {new Date(
                            transaction.blockTimestamp
                          ).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td>
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
                    <tr>
                      <td colSpan="7" style={{height: "270px"}}>No transactions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
