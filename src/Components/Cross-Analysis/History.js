"use client";
import React, { useState, useEffect, useRef } from "react";
import histroyStyle from "@/Components/Same-Analysis/history.module.css";
import {
  faArrowDown,
  faArrowUp,
  faCopy,
  faMagnifyingGlass,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FaChevronDown } from "react-icons/fa";
import { DatePicker, Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchUserLabels } from "@/Helpers/FetchUserLabels";
import {
  getERC20Tokens,
  getERC20Transactions,
  getEthTransactions,
} from "@/Helpers/GetSentTransactions";
import { useAccount, useChainId } from "wagmi";
import popup from "@/Components/Dashboard/popupTable.module.css";
import { getCrossChainTransactions } from "@/Helpers/CrosschainHelpers/GetCrossChainTransactions";
import chainNameMapping from "@/Helpers/CrosschainHelpers/ChainNameMapping";
import { LoadTokenForAnalysis } from "@/Helpers/LoadToken";
import { ethers } from "ethers";

function History() {
  const { address } = useAccount();
  const toggleOpen = () => setIsOpen(!isOpen);
  const chainId = useChainId();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("Select Token");
  const [tokenListOfUser, setTokenListOfUser] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

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
  const [expandedRows, setExpandedRows] = useState({}); // State to manage expanded rows

  // State for selected token and dates
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState("ETH");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  // ***************  FETCHING TRANSACTION DATA FROM GetCrossChainTransactions  *****************
  const fetchCrossChainTransactions = async () => {
    const data = await getCrossChainTransactions(address, chainId);
    console.log("Tx data: ", data);
    setTransactionData(data);
    setFilteredTransactions(data);
  };

  useEffect(() => {
    fetchCrossChainTransactions();
  }, [address, chainId]);

  /*...............Load Token Symbol for Display ................................. */
  const loadTokenForDisplay = async (tokenAddr) => {
    const tokenDetails = await LoadTokenForAnalysis(tokenAddr);
    return tokenDetails.symbol;
  };

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
      return parseFloat(b.tokenAmount) - parseFloat(a.tokenAmount);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByAmount(true);
  };

  const dortAmount = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      return parseFloat(a.tokenAmount) - parseFloat(b.tokenAmount);
    });
    setFilteredTransactions(sortedTransactions);
    setSortingByAmount(false);
  };

  // /............sorting date function ............./
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
  const handleStartDateChange = (date) => {
    checkAllFieldsFilled()
        setStartDate(date);
  };

  // Event handler for changing end date
  const handleEndDateChange = (date) => {
    checkAllFieldsFilled()  
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
      checkAllFieldsFilled()
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
    setSearchLoading(true);
    var filtered = transactionData;
    filtered = transactionData.filter(
      (transaction) =>
        transaction.recipientsData.some(
          (recipient) =>
            recipient.recipient
              .toLowerCase()
              .indexOf(searchQuery.toLowerCase()) !== -1
        ) ||
        transaction.transactionHash
          .toLowerCase()
          .indexOf(searchQuery.toLowerCase()) !== -1
    );

    setFilteredTransactions(filtered);
    calculateTotalAmount(filtered);
    setSearchLoading(false);
  };

  const calculateTotalAmount = async (transactions) => {
    if (transactions) {
      let total = 0;
      transactions.forEach((transaction) => {
        total += parseFloat(transaction.tokenAmount);
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
    if (startDate && endDate) {
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
  }, [startDate, endDate]);

  useEffect(() => {
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
        } else {
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(address);
  }, [address, selectedToken]);

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

  return (
    <div className={histroyStyle.maindivofhisotry}>
      <div className={histroyStyle.searchtablediv}>
        <div className={histroyStyle.maintablediv}>
          <div className={histroyStyle.tablediv1}>
          

            <div className={histroyStyle.searchdiv}>
              <input
                placeholder="Search by address or hash"
                className={histroyStyle.searchinputbox}
                onChange={handleSearchChange}
              />
              <button className={histroyStyle.searchbtn}>
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className={histroyStyle.searchicon}
                />
              </button>
            </div>
            <div className={histroyStyle.filterContainer} >
              <button
                ref={dropdownRef}
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
                        />
                      </div>
                      <div className={histroyStyle.labeldate}>
                        <DatePicker
                          className={histroyStyle.dateInput}
                          value={endDate}
                          onChange={handleEndDateChange}
                          placeholder="End Date"
                        />
                      </div>
                    </div>
                    <div className={histroyStyle.dropdownWrapper} ref={dropdownRef}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={histroyStyle.dropdown}
                >
                  {selectedToken || "Select Token"}
                  <FaChevronDown className={histroyStyle.dropdownIcon} />
                </div>
                {isDropdownOpen && (
                  <div className={histroyStyle.dropdownMenu}>
                    {/* <div
                      onClick={() => handleTokenChange("Select", "Select")}
                      className={histroyStyle.chainOptions}
                    >
                      Select
                    </div> */}
                    <div
                      onClick={() => handleTokenChange("USDC", "USDC")}
                      className={histroyStyle.chainOptions}
                    >
                      USDC
                    </div>
                    {tokenListOfUser.length > 0 &&
                      tokenListOfUser.map((token, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleTokenChange(token.tokenAddress, token.symbol)
                          }
                          className={histroyStyle.chainOptions}
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
           <div className={histroyStyle.parentDivofTable}>

          <div className={histroyStyle.tableWrapper}>
            <table>
              <thead>
                <tr className={histroyStyle.sticky}>
                  <th>Sender</th>
                  <th>Destination Chain</th>
                  <th>Token</th>
                  <th>Amount</th>
                  <th>Fees (ETH)</th>
                  <th>Transaction Hash</th>
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
                          color: "#ffffff7a",
                          border: "none",
                        }}
                        onClick={sortDate}
                      >
                        <FontAwesomeIcon icon={faArrowDown} />
                      </button>
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                {!searchLoading &&
                filteredTransactions &&
                filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>
                        {`${transaction.sender.slice(
                          0,
                          7
                        )}...${transaction.sender.slice(-4)}`}
                      </td>

                      <td>
                        {(chainNameMapping &&
                          chainNameMapping[transaction.destinationChainSelector]
                            ?.chainName) ||
                          "Unknown Chain"}
                      </td>

                      <td>
                        {loadTokenForDisplay(transaction.tokenAddress)}
                      </td>
                      <td>
                        {transaction.tokenAmount}
                      </td>

                      <td>
                        {(+ethers.utils.formatEther(transaction.fees)).toFixed(
                          4
                        )}
                      </td>
                      <td>
                        <a
                          href={`https://ccip.chain.link/tx/${transaction.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "white" }}
                        >
                          {`${transaction.transactionHash.slice(
                            0,
                            7
                          )}...${transaction.transactionHash.slice(-4)}`}
                        </a>
                      </td>
                      <td>
                        {transaction.blockTimestamp}
                      </td>
                    </tr>
                  ))
                ) : (
                 
                    <tr className={histroyStyle.notfound}>
                      <td colSpan="7">
                        No transactions found.
                      </td>
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
