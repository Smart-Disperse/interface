import React from "react";
import Textify from "../Type/Textify";
import Listify from "../Type/Listify";
import Uploadify from "../Type/Uploadify";
import { useState, useEffect, useRef } from "react";
import textStyle from "../Type/textify.module.css";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExecuteToken from "../Execute/ExecuteToken";
import { LoadToken } from "@/Helpers/LoadToken.js";
import {
  faCircleExclamation,
  faTrashAlt,
  faExclamationTriangle,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import homeStyle from "@/Components/Homepage/landingpage.module.css";
import samechainStyle from "../../../Dashboard/samechaindashboard.module.css";
import Modal from "react-modal";
import warning from "@/Assets/warning.webp";
import Image from "next/image";
import oopsimage from "@/Assets/oops.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserLabels } from "@/Helpers/FetchUserLabels";
import AddLabel from "../Type/Addlabel";
import { Tooltip } from "antd";
import HowItWorks from "./HowItWorks";

function SendToken({ listData, setListData }) {
  const [activeTab, setActiveTab] = useState("text");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [errormsg, setErrormsg] = useState("");
  const inputRef = useRef(null);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // State for modal visibility
  const [nameErrorModalIsOpen, setNameErrorModalIsOpen] = useState(false);
  const [ethToUsdExchangeRate, setEthToUsdExchangeRate] =
    useState(null); /*/USD/ETH exchange rate */
  const [totalERC20, setTotalERC20] =
    useState(null); /* Total ERC20 tokens in wallet */
  const [remaining, setRemaining] = useState(null); // store remaining amount after deducting already sent value
  const [ERC20Balance, setERC20Balance] =
    useState(null); /* User's ERC20 token balance */
  const { address } = useAccount(); /*/User's Ethereum Address*/
  const [loading, setLoading] =
    useState(false); /* Loading indicator for sending transaction */
  const [customTokenAddress, setCustomTokenAddress] =
    useState(""); /* Custom token address input field state */
  const [isTokenLoaded, setTokenLoaded] =
    useState(
      false
    ); /* Flag to check if the user has loaded their ERC20 Tokens */
  const [suffecientBalance, setSuffecientBalance] = useState(true);

  const defaultTokenDetails = {
    name: null,
    symbol: null,
    balance: null,
    decimal: null,
  };
  const [erroroccured, setErroroccured] = useState(false);
  const [labels, setLabels] = useState([]);
  const [allNames, setAllNames] = useState([]);
  const [allAddresses, setAllAddresses] = useState([]);
  const [tokenDetails, setTokenDetails] =
    useState(defaultTokenDetails); 

  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const showModal = () => {
    setIsHowItWorksOpen(true);
  };

  const closeModal = () => {
    setIsHowItWorksOpen(false);
  };

  const renderComponent = (tab) => {
    switch (tab) {
      case "text":
        return (
          <Textify
            listData={listData}
            setListData={setListData}
            tokenDecimal={tokenDetails.decimal}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      case "list":
        return (
          <Listify
            listData={listData}
            setListData={setListData}
            tokenDecimal={tokenDetails.decimal}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      case "csv":
        return (
          <Uploadify
            listData={listData}
            setListData={setListData}
            tokenDecimal={tokenDetails.decimal}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      default:
        return (
          <Textify
            listData={listData}
            setListData={setListData}
            tokenDecimal={tokenDetails.decimal}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
    }
  };

  /*
  For fetching the Exchnage rate of ETH to USD to display value in USD
  */
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
        );
        const data = await response.json();
        const rate = data.USD;
        // console.log(typeof data.USD);

        // console.log("data here", data.USD);
        setEthToUsdExchangeRate(rate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
    // const interval = setInterval(fetchExchangeRate, 10000); // Call fetchExchangeRate every 2 seconds

    // Clean up the interval when the component unmounts
    // return () => clearInterval(interval);
  }, [listData]);

  // Function to delete row in table
  const handleDeleteRow = (index) => {
    const updatedList = [...listData];
    updatedList.splice(index, 1);
    setListData(updatedList);
    toast.success("Transaction Deleted Successfully");
  };

  // Function to load token details
  const loadToken = async () => {
    setRemaining(null);
    setTotalERC20(null);
    setListData([]);
    if (customTokenAddress === "") {
      setErrorMessage("Please add token address");
      setErroroccured(true);

      // setErrorModalIsOpen(true);
      return;
    }

    setTokenDetails(defaultTokenDetails);

    try {
      const tokenDetails = await LoadToken(customTokenAddress, address);
      if (tokenDetails) {
        setTokenDetails(tokenDetails);
        setERC20Balance(tokenDetails.balance);
        setTokenLoaded(true);
        setErroroccured(false);
      } else {
        throw new Error("Token details not found"); // Throw error if token details are not found
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Invalid Token Address"); // Set error message
      setErroroccured(true);
      // setErrorModalIsOpen(true); // Open modal
    }
  };
  // Function to close the error modal
  const closeErrorModal = () => {
    // console.log("clicked");
    setErrorModalIsOpen(false);
    setErrorMessage(false);
    // console.log("modal open");
  };

  // Function to unload token details
  const unloadToken = async () => {
    setTokenDetails(defaultTokenDetails);
    setRemaining(null);
    setTotalERC20(null);
    setTokenLoaded(false);
    setListData([]);
  };

  // Handle input change for token address
  const handleInputTokenAddressChange = (e) => {
    const inputValue = e.target.value;
    const isValidInput = /^[a-zA-Z0-9]+$/.test(inputValue);

    if (isValidInput || inputValue === "") {
      setCustomTokenAddress(inputValue);
    }
    setErrorMessage("");
    setErroroccured(false);
  };

  const onAddLabel = async (index, recipientAddress) => {
    const userData = {
      userid: address,
      name: labels[index],
      address: recipientAddress.toLowerCase(),
    };

    try {
      let result = await fetch(`api/all-user-data?address=${address}`, {
        method: "POST",
        body: JSON.stringify(userData),
      });

      result = await result.json();
      console.log("Result after submission:", result);

      if (typeof result.error === "string") {
        setNameErrorModalIsOpen(true);
        toast.warn("Name Already Exist! Please Enter Unique Name.");
        setErrormsg(result.error);
      } else {
        if (result.message === "Success") {
          toast.success("Label Added successfully");
        }
      }
    } catch (error) {
      setNameErrorModalIsOpen(true);
      setErrormsg("Some Internal Error Occured");
      console.error("Error:", error);
    }

    const { allNames, allAddress } = await fetchUserLabels(address);

    const updatedListData = await listData.map((item) => {
      if (
        (item.label === undefined || item.label === "") &&
        allAddress.includes(item.address)
      ) {
        const index = allAddress.indexOf(item.address);
        console.log(index);
        item.label = allNames[index];
      }
      return item;
    });
    await fetchUserDetails();
    await setListData(updatedListData);
  };

  /*
  For Calculating the total amount of sending ETH
  */

  useEffect(() => {
    const calculateTotal = () => {
      let totalERC20 = ethers.BigNumber.from(0);
      if (listData.length > 0) {
        listData.forEach((data) => {
          console.log(data);
          totalERC20 = totalERC20.add(data.value);
        });
      }
      // console.log(totalERC20);

      setTotalERC20(totalERC20);
    };

    calculateTotal();
  }, [listData]); // Execute when listData changes

  useEffect(() => {
    calculateRemaining();
  }, [totalERC20]);

  const calculateRemaining = () => {
    if (ERC20Balance && totalERC20) {
      const remaining = ERC20Balance.sub(totalERC20);
      setRemaining(remaining);
      if (remaining < 0) {
        setSuffecientBalance(false);
      } else {
        setSuffecientBalance(true);
      }
    } else {
      setRemaining(null);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const { allNames, allAddress } = await fetchUserLabels(address);
      setAllNames(allNames);
      setAllAddresses(allAddress);

      setLabels([]);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (address) {
      fetchUserDetails();
    }
  }, [address]);

  const setLabelValues = (index, name) => {
    const updatedLabels = [...labels]; // Create a copy of the labels array
    updatedLabels[index] = name; // Update the value at the specified index
    setLabels(updatedLabels);
  };
  useEffect(() => {
    calculateRemaining();
    inputRef.current.focus();
  }, []); // Execute once on component mount

  return (
    <>
      <>
        {address ? (
          <>
            <div className={textStyle.tablecontainer}>
              <div className={textStyle.titleforlinupsametext}>
                <h2
                  style={{
                    padding: "15px",
                    fontSize: "20px",
                    margin: "0px",
                    letterSpacing: "1px",
                    fontWeight: "300",
                  }}
                >
                  Load Your Token
                </h2>
              </div>
              <div
                className={textStyle.entertokenaddress}
                // style={{ padding: "20px" }}
              >
                <label>Enter Token Address: </label>
                <div className={textStyle.rightside}>
                  <div
                    className={textStyle.inputdiv}
                    // style={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   flexDirection: "column",
                    // }}
                  >
                    <input
                      id={erroroccured ? textStyle.yeserror : textStyle.noerror}
                      type="text"
                      className={textStyle.tokeninput}
                      // className={`${textStyle["eachinputofcreatelist"]} ${textStyle["tokeninput"]}`}
                      placeholder="Enter token Address"
                      value={customTokenAddress}
                      ref={inputRef}
                      onChange={(e) => handleInputTokenAddressChange(e)}
                      // style={{
                      //   borderRadius: "5px",
                      //   // border: "1px solid #9D79FF",
                      //   // background:
                      //   //   "linear-gradient(90deg, rgba(97, 38, 193, 0.58) 0.06%, rgba(63, 47, 110, 0.58) 98.57%)",
                      //   padding: "15px 30px",
                      //   margin: "0px 20px",
                      //   color: "white",
                      // }}
                    />
                    {erroroccured && (
                      <div
                        className={textStyle.errdiv}
                        // style={{ color: "red", fontSize: "12px" }}
                      >
                        {errorMessage}
                      </div>
                    )}
                  </div>
                  {isTokenLoaded ? (
                    <button
                      id={textStyle.backgroundgreen}
                      className={textStyle.unloadbutton}
                      onClick={() => {
                        unloadToken();
                      }}
                    >
                      Unload Token
                    </button>
                  ) : (
                    <button
                      id={textStyle.backgroundgreen}
                      className={textStyle.addbutton}
                      onClick={() => {
                        loadToken();
                      }}
                    >
                      Load Token
                    </button>
                  )}
                </div>
              </div>
            </div>
            {isTokenLoaded ? (
              <>
                <div className={textStyle.tablecontainer}>
                  <div className={textStyle.titleforlinupsametext}>
                    <h2
                      style={{
                        padding: "15px",
                        fontSize: "20px",
                        margin: "0px",
                        letterSpacing: "1px",
                        fontWeight: "300",
                      }}
                    >
                      Token Details
                    </h2>
                  </div>
                  <div>
                    <div className={textStyle.tableWrapper}>
                      <table>
                        <thead>
                          <tr className={textStyle.sticky}>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{tokenDetails.name}</td>
                            <td>{tokenDetails.symbol}</td>
                            <td>
                              {ethers.utils.formatUnits(
                                tokenDetails.balance,
                                tokenDetails.decimal
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className={samechainStyle.maindivforalloptiondashboard}>
                  <div className={samechainStyle.menubardashboard}>
                    <button
                      className={
                        activeTab === "text" ? `${samechainStyle.active}` : ""
                      }
                      onClick={() => setActiveTab("text")}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="color-tooltip"
                    >
                      Textify
                    </button>
                    <button
                      id="list"
                      className={
                        activeTab === "list" ? `${samechainStyle.active}` : ""
                      }
                      onClick={() => setActiveTab("list")}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="color-tooltip"
                    >
                      Listify
                    </button>
                    <button
                      id="csv"
                      className={
                        activeTab === "csv" ? `${samechainStyle.active}` : ""
                      }
                      onClick={() => setActiveTab("csv")}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="color-tooltip"
                    >
                      Uploadify
                    </button>
                  </div>
                  <div>
                    <Tooltip
                      title="How it works"
                      placement="bottom"
                      color="white"
                      overlayInnerStyle={{
                        borderRadius: "8px",
                        fontWeight: "600",
                        color: "#8d38fb",
                      }}
                    >
                      <button
                        className={samechainStyle.howWorks}
                        onClick={showModal}
                      >
                        ?
                      </button>
                    </Tooltip>
                  </div>
                </div>
                {isHowItWorksOpen && (
                  <HowItWorks
                    activeTab={activeTab}
                    isOpen={isHowItWorksOpen}
                    textStyle={textStyle}
                    onClose={closeModal}
                  />
                )}
                {renderComponent(activeTab)}{" "}
                {listData.length > 0 ? (
                  <div>
                    <div className={textStyle.tablecontainer}>
                      <div className={textStyle.titleforlinupsametext}>
                        <h2
                          style={{
                            padding: "15px",
                            letterSpacing: "1px",
                            fontSize: "20px",
                            fontWeight: "300",
                          }}
                        >
                          Your Transaction Lineup
                        </h2>
                      </div>
                      <div className={textStyle.tableWrapper}>
                        <table>
                          <thead>
                            <tr className={textStyle.sticky}>
                              <th>Receiver Address</th>
                              <th>Label</th>
                              <th>Amount</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listData.map((data, index) => (
                              <tr key={index}>
                                <td>
                                  {data.address.substr(0, 6)}...
                                  {data.address.substr(-5)}
                                </td>
                                <td>
                                  {data.label ? (
                                    data.label
                                  ) : (
                                    <>
                                      <AddLabel
                                        labels={labels}
                                        setLabelValues={setLabelValues}
                                        onAddLabel={onAddLabel}
                                        index={0} // Example index, you can dynamically pass different indexes
                                        data={data}
                                      />
                                      {errorMessage && (
                                        <p
                                          style={{
                                            color: "red",
                                            margin: "0px",
                                            fontSize: "13px",
                                          }}
                                        >
                                          {errorMessage}
                                        </p>
                                      )}
                                    </>
                                  )}
                                </td>
                                <td
                                  style={{ color: "white" }}
                                >
                                   {(+ethers.utils.formatUnits(
                                        data.value,
                                        tokenDetails.decimal
                                      )).toFixed(4)}{" "}

                                      <span style={{opacity: "0.6", fontWeight: "400"}}>{" "}{tokenDetails.symbol} </span>
                                  
                                  
                                </td>
                                <td>
                                  <button
                                    className={textStyle.deletebutton}
                                    onClick={() => handleDeleteRow(index)}
                                  >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className={textStyle.tablecontainer}>
                      <div className={textStyle.titleforaccountsummarytextsame}>
                        <h2
                          style={{
                            padding: "15px",
                            letterSpacing: "1px",
                            fontSize: "20px",
                            fontWeight: "300",
                          }}
                        >
                          Account Summary{" "}
                          <span style={{ opacity: "0.5", fontSize: "14px" }}>
                            ({tokenDetails.symbol})
                          </span>{" "}
                        </h2>
                      </div>
                      <div className={textStyle.tableWrapper}>
                        <table>
                          <thead>
                            <tr className={textStyle.sticky}>
                              <th>Total Amount</th>
                              <th>Your Balance</th>
                              <th>Remaining Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={{ color: "white", fontWeight: "700" }}>
                                {totalERC20
                                  ? (+ethers.utils.formatUnits(
                                      totalERC20,
                                      tokenDetails.decimal
                                    )).toFixed(4)
                                  : null}{" "}
                              </td>

                              <td
                                style={{
                                  opacity: "0.6",
                                }}
                              >
                                {ERC20Balance
                                  ? (+ethers.utils.formatUnits(
                                      ERC20Balance,
                                      tokenDetails.decimal
                                    )).toFixed(4)
                                  : null}
                              </td>
                              <td
                                className={`showtoken-remaining-balance ${
                                  remaining < 0
                                    ? "showtoken-remaining-negative"
                                    : ""
                                }`}
                                style={{
                                  color: remaining < 0 ? "red" : "white",
                                }}
                              >
                                {remaining === null
                                  ? null
                                  : (+ethers.utils.formatUnits(
                                      remaining < 0
                                        ? ethers.BigNumber.from(0)
                                        : remaining,
                                      tokenDetails.decimal
                                    )).toFixed(4)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div>
                  <ExecuteToken
                    listData={listData}
                    setListData={setListData}
                    ERC20Balance={ERC20Balance}
                    totalERC20={totalERC20}
                    loading={loading}
                    setLoading={setLoading}
                    tokenDetails={tokenDetails}
                    customTokenAddress={customTokenAddress}
                    suffecientBalance={suffecientBalance}
                  />
                </div>
              </>
            ) : null}
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "25px 0px",
              fontSize: "20px",
            }}
          >
            Please connect your wallet to proceed
          </div>
        )}
      </>
      <>
        <Modal
          id={textStyle.popupwarning}
          className={textStyle.popupforpayment}
          isOpen={nameErrorModalIsOpen}
          onRequestClose={() => setNameErrorModalIsOpen(false)}
          contentLabel="Error Modal"
        >
          <Image src={warning} alt="none" width={100} height={100} />
          <h2>Warning!</h2>
          <p>{errormsg}</p>
          <p>Please try different name</p>
          <button onClick={() => setNameErrorModalIsOpen(false)}>Close</button>
        </Modal>
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
            {/* <p>{errorMessage}</p> */}
            <p className={textStyle.errormessagep}>{errorMessage}</p>

            <div className={textStyle.divtocenter}>
              <button onClick={closeErrorModal}>Close</button>
            </div>
          </>
        </Modal>
      </>
    </>
  );
}

export default SendToken;
