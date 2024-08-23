import React from "react";
import Textify from "../Type/Textify";
import Listify from "../Type/Listify";
import Uploadify from "../Type/Uploadify";
import { useState, useEffect } from "react";
import textStyle from "../Type/textify.module.css";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExecuteToken from "../Execute/CrossChainTransfer";
import { LoadToken } from "@/Helpers/LoadToken.js";
import {
  faCircleExclamation,
  faTrashAlt,
  faExclamationTriangle,
  faTriangleExclamation,
  faCopy,
  faGasPump,
} from "@fortawesome/free-solid-svg-icons";
import homeStyle from "@/Components/Homepage/landingpage.module.css";
import Modal from "react-modal";
import warning from "@/Assets/warning.webp";
import Image from "next/image";
import oopsimage from "@/Assets/oops.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserLabels } from "@/Helpers/FetchUserLabels";
import CrossChainTransfer from "../Execute/CrossChainTransfer";
import loaderimg from "@/Assets/loader.gif";
import loadjson from "@/Assets/tokenload.json";
import allchains from "@/Helpers/CrosschainHelpers/ChainSelector";
import { useChainId } from "wagmi";
import CustomDropdown from "../Type/CustomDropDown";
import { text } from "@fortawesome/fontawesome-svg-core";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import DesCustomDropdown from "../Type/Destinationselect";
import Addlabel from "../Type/Addlabel";
import samechainStyle from "../../../Dashboard/samechaindashboard.module.css";

function SendToken({
  listData,
  setListData,
  tokenAddress,
  selectedDestinationChain,
}) {
  const [activeTab, setActiveTab] = useState("text"); //default tab is textify
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [errormsg, setErrormsg] = useState("");
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
  /* Custom token address input field state */
  const [isTokenLoaded, setTokenLoaded] =
    useState(
      false
    ); /* Flag to check if the user has loaded their ERC20 Tokens */
  const [Istokenloading, setIstokenloading] = useState(false);
  const { tkloadimg } = loadjson;
  const [showestimatedgasprice, setshowestimatedgasprice] = useState("");
  const [RecipientAddressarray, setRecipientaddressarray] = useState([]);
  const [RecipientAmountarray, setRecipientamountarray] = useState([]);
  const defaultTokenDetails = {
    name: null,
    symbol: null,
    balance: null,
    decimal: null,
  };
  const [labels, setLabels] = useState([]);
  const [allNames, setAllNames] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [allAddresses, setAllAddresses] = useState([]);
  const [tokenDetails, setTokenDetails] =
    useState(defaultTokenDetails); /*Details of the selected token to be sent*/
  const chainId = useChainId();
  const [destinationFinalChainsOptions, setDestinationFinalChainsOptions] =
    useState([]);
  const [selectedDestinationfinalChains, setSelectedDestinationfinalChains] =
    useState(new Array(listData.length).fill(selectedDestinationChain));
  const [finalchainSelectors, setFinalchainSelectors] = useState(
    Array(listData.length).fill("")
  );
  const [uniqueReceiverAddresses, setUniqueReceiverAddresses] = useState([]);
  const [suffecientBalance, setSuffecientBalance] = useState(true);

  useEffect(() => {
    setSelectedDestinationfinalChains((prevChains) => {
      // Create a copy of the previous array
      const updatedChains = [...prevChains];
      // Ensure the updated array has the correct length
      for (let i = 0; i < listData.length; i++) {
        // Only update the index if it doesn't already have a value
        if (updatedChains[i] === undefined || updatedChains[i] === null) {
          updatedChains[i] = selectedDestinationChain;
        }
      }
      return updatedChains;
    });
  }, [listData.length, selectedDestinationChain]);

  // const driverObj = driver({
  //   overlayColor: "#00000094",
  //   // popoverClass: ` ${samechainStyle.driverpopover01}`,
  //   showProgress: true,
  //   steps: [
  //     {
  //       element: "#finaldropdown",
  //       popover: {
  //         title: "Textify",
  //         description:
  //           "Effortlessly input recipient addresses and amounts in one line with Textify, whether through copy-paste or direct entry",
  //         side: "right",
  //         align: "start",
  //       },
  //     },
  //   ],
  // });

  // useEffect(()=>{
  //   if(listData > 0 {
  //     driverObj.drive();
  //   })
  // },[])

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
    toast.success("Transaction deleted successfully");
  };

  // Function to load token details
  const loadTokenDetails = async (_tokenAddress) => {
    setIstokenloading(true);
    setTokenLoaded(false);
    setRemaining(null);
    setTotalERC20(null);
    setListData([]);
    console.log(_tokenAddress);

    setTokenDetails(defaultTokenDetails);
    console.log(address);
    const tokenDetails = await LoadToken(_tokenAddress, address);
    console.log(tokenDetails);
    setIstokenloading(false);
    if (tokenDetails) {
      setTokenDetails(tokenDetails);
      setERC20Balance(tokenDetails.balance);
      setTokenLoaded(true);
    } else {
      // toast.error("Token details not found");
      console.log("error-Token not found");
      // Throw error if token details are not found
    }
  };

  useEffect(() => {
    const loadSelectedToken = async () => {
      if (tokenAddress) {
        if (tokenAddress === "") {
          setTokenLoaded(false);
        } else {
          await loadTokenDetails(tokenAddress);
        }
      } else {
        setTokenLoaded(false);
      }
    };
    loadSelectedToken();
  }, [tokenAddress]);

  // Function to close the error modal
  const closeErrorModal = () => {
    // console.log("clicked");
    setErrorModalIsOpen(false);
    setErrorMessage("");
    // console.log("modal open");
  };

  // Function to unload token details

  const onAddLabel = async (index, recipientAddress) => {
    const userData = {
      userid: address,
      name: labels[index],
      address: recipientAddress.toLowerCase(),
    };
    console.log(userData);
    try {
      let result = await fetch(`api/all-user-data?address=${address}`, {
        method: "POST",
        body: JSON.stringify(userData),
      });

      console.log(result);
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
      console.log(totalERC20);

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
    console.log(updatedLabels);
    setLabels(updatedLabels);
    console.log("set label.....", updatedLabels);
  };
  useEffect(() => {
    calculateRemaining();
  }, []); // Execute once on component mount

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000); // Reset the copy status after 2 seconds
        toast.success("Token Address Copied Successfully!");
      },
      (err) => {
        console.error("Unable to copy to clipboard:", err);
      }
    );
  };

  // ------------------- Chain Drop down code ------------------------
  const getChainsForFinalDropDown = () => {
    try {
      const chainDetails = allchains[chainId];
      if (!chainDetails) {
        throw new Error(`Chain details for chainId ${chainId} are undefined.`);
      }

      console.log(chainDetails);
      const options = Object.entries(chainDetails.destinationChains).map(
        ([name, details]) => ({
          name,
          iconUrl: details.iconUrl,
        })
      );
      setDestinationFinalChainsOptions(options);
    } catch (error) {
      console.error(error.message);
      setDestinationFinalChainsOptions([]);
    }
  };

  useEffect(() => {
    getChainsForFinalDropDown();
  }, [address, chainId, selectedDestinationChain]);

  const handleDestinationFinalChainChange = (selectedChain, index) => {
    console.log(selectedChain);
    // setSelectedDestinationfinalChains(selectedChain);
    setSelectedDestinationfinalChains((prevChains) => {
      // Create a copy of the previous array
      const updatedChains = [...prevChains];
      // Update the specific index
      updatedChains[index] = selectedChain;
      return updatedChains;
    });

    console.log(listData);
  };

  return (
    <>
      {address ? (
        <>
          <div className={textStyle.maindivofSendEth}>
            {Istokenloading ? (
              <div className={textStyle.loaderdiv}>
                <div className={textStyle.loader}></div>
              </div>
            ) : (
              <div>
                {isTokenLoaded ? (
                  <div className={textStyle.accountsummarycreatetitle}>
                    <h2
                      style={{
                        padding: "15px",
                        fontSize: "20px",
                        margin: "0px",
                        textAlign: "center",
                        letterSpacing: "1px",
                        fontWeight: "300",
                      }}
                    >
                      Token Details
                    </h2>
                    <div className={textStyle.tableWrapper}>
                      <table>
                        <thead>
                          <tr className={textStyle.sticky}>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Token Address</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{tokenDetails.name}</td>
                            <td>{tokenDetails.symbol}</td>
                            <td>
                              {`${tokenAddress.slice(
                                0,
                                7
                              )}...${tokenAddress.slice(-4)}`}{" "}
                              <FontAwesomeIcon
                                className={textStyle.copyicon}
                                onClick={() => copyToClipboard(tokenAddress)}
                                icon={faCopy}
                              />
                            </td>
                            <td>
                              {ethers.utils.formatUnits(
                                tokenDetails.balance,
                                tokenDetails.decimal
                              )}{" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
          {isTokenLoaded ? (
            <div className={textStyle.maindivofsendtokencross}>
              <div className={samechainStyle.maindivforalloptiondashboard}>
                <div className={samechainStyle.menubardashboard}>
                  <button
                    id="text"
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
              </div>{" "}
              {isTokenLoaded ? renderComponent(activeTab) : null}
            </div>
          ) : null}

          {listData.length > 0 ? (
            <div className={textStyle.maindivofsendtokencross}>
              <div className={textStyle.tablecontainer}>
                <div
                  className={textStyle.titleforlinupsametext}
                  // style={{ padding: "5px 0px" }}
                >
                  <h2
                    style={{
                      padding: "15px",
                      letterSpacing: "1px",
                      fontSize: "20px",
                      fontWeight: "300",
                      textAlign: "center",
                      margin: "0px",
                    }}
                  >
                    Your Transaction Lineup{" "}
                    <span style={{ opacity: "0.5", fontSize: "14px" }}>
                      ({listData.length})
                    </span>
                  </h2>
                </div>
                <div className={textStyle.tableWrapper}>
                  <table>
                    <thead>
                      <tr className={textStyle.sticky}>
                        <th>Receiver Address</th>
                        <th>Label</th>
                        <th>Amount({tokenDetails.symbol})</th>
                        <th>Destination Chain</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listData.length > 0
                        ? listData.map((data, index) => (
                            <tr key={index}>
                              <td>
                                {`${data.address.slice(
                                  0,
                                  7
                                )}...${data.address.slice(-4)}`}
                              </td>
                              <td>
                                {data.label ? (
                                  data.label
                                ) : (
                                  <>
                                    <Addlabel
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
                              <td>
                                {(+ethers.utils.formatUnits(
                                  data.value,
                                  tokenDetails.decimal
                                )).toFixed(4)}
                              </td>
                              <td>
                                <DesCustomDropdown
                                  id="text"
                                  options={destinationFinalChainsOptions}
                                  onSelect={handleDestinationFinalChainChange}
                                  selectedValue={
                                    selectedDestinationfinalChains[index]
                                  }
                                  placeholder="Select destination chain"
                                  index={index}
                                  style={{ fontSize: "15px" }}
                                />
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
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : // </div>
          null}

          {listData.length > 0 ? (
            <div className={textStyle.tablecontainer}>
              <div className={textStyle.titleforaccountsummarytextsame}>
                <h2
                  style={{
                    padding: "15px",
                    letterSpacing: "1px",
                    fontSize: "20px",
                    fontWeight: "300",
                    textAlign: "center",
                  }}
                >
                  Account Summary{" "}
                  <span style={{ opacity: "0.5", fontSize: "14px" }}>
                    ({tokenDetails.symbol})
                  </span>
                </h2>
              </div>
              <div className={textStyle.tableWrapper}>
                <table>
                  <thead>
                    <tr className={textStyle.sticky}>
                      <th>Total Amount</th>
                      <th>
                        Estimated Gas Price
                        <FontAwesomeIcon icon={faGasPump} />
                      </th>
                      <th>Your Balance</th>
                      <th>Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
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
                          width: "200px",
                        }}
                      >
                        {showestimatedgasprice
                          ? (+ethers.utils.formatEther(
                              showestimatedgasprice
                            )).toFixed(4)
                          : null}
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
                            )).toFixed(4) + " "
                          : null}
                      </td>
                      <td
                        style={{
                          color: remaining < 0 ? "red" : "white",
                        }}
                      >
                        {remaining === null
                          ? null
                          : (+ethers.utils.formatUnits(
                              remaining,
                              tokenDetails.decimal
                            )).toFixed(4) + " "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          <div>
            {listData.length > 0 ? (
              <CrossChainTransfer
                listData={listData}
                setListData={setListData}
                ERC20Balance={ERC20Balance}
                totalERC20={totalERC20}
                tokenDetails={tokenDetails}
                setshowestimatedgasprice={setshowestimatedgasprice}
                tokenAddress={tokenAddress}
                selectedDestinationfinalChains={selectedDestinationfinalChains}
                suffecientBalance={suffecientBalance}
              />
            ) : null}
          </div>
        </>
      ) : (
        <div
          style={{ textAlign: "center", padding: "25px 0px", fontSize: "20px" }}
        >
          Please connect your wallet to proceed
        </div>
      )}

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
