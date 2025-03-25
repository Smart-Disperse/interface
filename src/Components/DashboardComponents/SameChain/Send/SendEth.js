import React from "react";
import Textify from "../Type/Textify";
import Listify from "../Type/Listify";
import Uploadify from "../Type/Uploadify";
import { useState, useEffect } from "react";
import textStyle from "../Type/textify.module.css";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faClipboardList,
  faDollarSign,
  faDoorOpen,
  faTag,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import ExecuteEth from "../Execute/ExecuteEth";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { isContractAddress } from "@/Helpers/ValidateInput.js";
import samechainStyle from "../../../Dashboard/samechaindashboard.module.css";
import Modal from "react-modal";
import warning from "@/Assets/warning.webp";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserLabels } from "@/Helpers/FetchUserLabels";
import Cookies from "js-cookie";
import AddLabel from "../Type/Addlabel";

import {
  faUser,
  faRotate,
  faUpload,
  faCirclePlus,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import HowItWorks from "./HowItWorks";
import { Tooltip } from "antd";
import { LoadToken } from "@/Helpers/LoadToken";

function SendEth({ listData, setListData }) {
  const [activeTab, setActiveTab] = useState("text");
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const [ethToUsdExchangeRate, setEthToUsdExchangeRate] = useState(null); //store ETH to USD exchange rate
  const [totalEth, setTotalEth] = useState(null); // store total amount of Ether in the transaction
  const [remaining, setRemaining] = useState(null); // store remaining amount after deducting already sent value
  const [ethBalance, setEthBalance] = useState(null); // store user's Ether balance
  const { address } = useAccount(); /*/gather account data for current user */
  const [addressLabelMap, setAddressLabelMap] = useState([]);
  const [labels, setLabels] = useState([]);
  const [allNames, setAllNames] = useState([]);
  const [allAddresses, setAllAddresses] = useState([]);
  const [errormsg, setErrormsg] = useState("");
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [suffecientBalance, setSuffecientBalance] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const firstVisit = Cookies.get("firstVisit");
    if (firstVisit === undefined) {
      // First time visiting the site
      setIsOpen(true);
      Cookies.set("firstVisit", "true", { expires: 365 }); // Set the cookie to expire in 1 year
    } else {
      setIsOpen(true);
    }
  }, []);

  const triggerSlide = () => {
    setIsOpen(!isOpen);
  };

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
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      case "list":
        return (
          <Listify
            listData={listData}
            setListData={setListData}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      case "csv":
        return (
          <Uploadify
            listData={listData}
            setListData={setListData}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
      default:
        return (
          <Textify
            listData={listData}
            setListData={setListData}
            allNames={allNames}
            allAddresses={allAddresses}
          />
        );
    }
  };

  // For fetching the Exchange rate of ETH to USD to display value in USD
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

  /* For getting the user Balance
   */
  const getEthBalance = async () => {
    const { ethereum } = window;
    console.log("window", window);

    if (!ethBalance) {

      console.log("Ethereum:", ethereum);
      const provider = new ethers.providers.Web3Provider(ethereum); 
      console.log("Provider:", provider);
      if (address) {
        console.log("get balance for:", address);
        let ethBalance = await provider.getBalance(address);
        console.log("ethBalance:", ethBalance);
        setEthBalance(ethBalance);
      }
    }
  };

  const handleDeleteRow = (index) => {
    const updatedList = [...listData];
    updatedList.splice(index, 1);
    setListData(updatedList);
    toast.success("Transaction Deleted Successfully");
  };

  /*
  For Calculating the total amount of sending ETH
  */
  useEffect(() => {
    const calculateTotal = () => {
      let totalEth = ethers.BigNumber.from(0);
      if (listData.length > 0) {
        listData.forEach((data) => {
          totalEth = totalEth.add(data.value);
        });
      }

      setTotalEth(totalEth);
    };

    calculateTotal();
  }, [listData]);

  /* for getting values on render */
  useEffect(() => {
    getEthBalance();
  }, [address]);

  useEffect(() => {
    calculateRemaining();
  }, [totalEth]);

  const calculateRemaining = () => {
    if (ethBalance && totalEth) {
      const remaining = ethBalance.sub(totalEth);
      setRemaining(ethers.utils.formatEther(remaining));
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
      console.log(allAddress);
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
    // console.log(updatedLabels);
    setLabels(updatedLabels);
  };

  const handleAddressChange = (e, index) => {
    const newAddress = e.target.value;
    const updatedListData = [...listData];
    updatedListData[index].address = newAddress;

    const existingEntry = addressLabelMap.find(
      (entry) => entry.address.toLowerCase() === newAddress.toLowerCase()
    );
    if (existingEntry) {
      updatedListData[index].label = existingEntry.label;
    } else {
      updatedListData[index].label = "";
    }

    setListData(updatedListData);
    console.log("Updated List Data:", updatedListData);
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
      if (typeof result.error === "string") {
        setErrorModalIsOpen(true);
        toast.warn("Name Already Exist! Please Enter Unique Name.");
        setErrormsg(result.error);
      } else {
        if (result.message === "Success") {
          toast.success("Label Added successfully");
        }
      }
    } catch (error) {
      setErrormsg("Some Internal Error Occured");
      console.error("Error:", error);
    }

    const newEntry = {
      address: recipientAddress.toLowerCase(),
      label: labels[index],
    };

    setAddressLabelMap((prevMap) => {
      const existingIndex = prevMap.findIndex(
        (entry) => entry.address === newEntry.address
      );
      if (existingIndex !== -1) {
        const updatedMap = [...prevMap];
        updatedMap[existingIndex] = newEntry;
        return updatedMap;
      } else {
        return [...prevMap, newEntry];
      }
    });

    const { allNames, allAddress } = await fetchUserLabels(address);

    const updatedListData = await listData.map((item) => {
      if (
        (item.label === undefined || item.label === "") &&
        allAddress.includes(item.address.toLowerCase())
      ) {
        const index = allAddress.indexOf(item.address.toLowerCase());
        item.label = allNames[index];
      }
      return item;
    });

    await fetchUserDetails();
    await setListData(updatedListData);

    // Log the updated address-label mapping
    console.log("Address-Label Mapping:", addressLabelMap);
  };

  useEffect(() => {
    calculateRemaining();
  });

  return (
    <>
      {address ? (
        <>
          <div className={samechainStyle.maindivofSendEth}>
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

            {renderComponent(activeTab)}

            {
              listData.length > 0 ?
                (
                  <div>
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
                          }}
                        >
                          Your Transaction Lineup{" "}
                          <span style={{ opacity: "0.5", fontSize: "14px" }}>
                            ({listData.length})
                          </span>
                        </h2>
                      </div>
                      <div className={textStyle.tMargin}>
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
                              {listData.length > 0
                                ? listData.map((data, index) => (
                                  <tr key={index}>
                                    <td>
                                      {data.address.substr(0, 7)}...
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
                                            index={0}
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
                                      <p style={{ marginBottom: "2px" }}>
                                        {`${(+ethers.utils.formatEther(
                                          data.value
                                        )).toFixed(4)} ETH`}
                                      </p>
                                      <p
                                        style={{
                                          opacity: "0.6",
                                          marginBottom: "0",
                                          marginTop: "2px",
                                          fontSize: "13px",
                                        }}
                                      >
                                        {`~ $${(
                                          ethers.utils.formatUnits(
                                            data.value,
                                            18
                                          ) * ethToUsdExchangeRate
                                        ).toFixed(2)}`}
                                      </p>
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
                          Account Summary{" "}
                          <span style={{ opacity: "0.5", fontSize: "14px" }}>
                            {/* ({tokenDetails.symbol}) */}
                            (ETH)
                          </span>
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
                              <td>
                                <p style={{ marginBottom: "1px" }}>
                                  {totalEth
                                    ? `${(+ethers.utils.formatEther(
                                      totalEth
                                    )).toFixed(4)}  `
                                    : null}
                                </p>
                                <p
                                  style={{
                                    opacity: "0.6",
                                    marginBottom: "0",
                                    marginTop: "2px",
                                    fontSize: "13px",
                                  }}
                                >
                                  {totalEth
                                    ? `~ $${(
                                      ethers.utils.formatUnits(totalEth, 18) *
                                      ethToUsdExchangeRate
                                    ).toFixed(2)}`
                                    : null}
                                </p>
                              </td>
                              <td style={{ opacity: "0.6" }}>
                                {ethBalance
                                  ? `${(+ethers.utils.formatEther(
                                    ethBalance
                                  )).toFixed(4)}  `
                                  : null}
                              </td>
                              <td
                                style={{
                                  background: "transparent",
                                  color: remaining < 0 ? "red" : "white",
                                }}
                                className={`showtoken-remaining-balance ${remaining < 0
                                  ? "showtoken-remaining-negative"
                                  : ""
                                  }`}
                              >
                                {remaining === null
                                  ? null
                                  : `${Math.max(+remaining, 0).toFixed(0)}  `}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <Modal
                        id={textStyle.popupwarning}
                        className={textStyle.popupforpayment}
                        isOpen={errorModalIsOpen}
                        onRequestClose={() => setErrorModalIsOpen(false)}
                        contentLabel="Error Modal"
                      >
                        <Image src={warning} alt="none" width={100} height={100} />
                        <h2>Warning!</h2>
                        <p>{errormsg}</p>
                        <p>Please try different name</p>
                        <button onClick={() => setErrorModalIsOpen(false)}>
                          Close
                        </button>
                      </Modal>
                    </div>

                    <div>
                      <ExecuteEth
                        listData={listData}
                        setListData={setListData}
                        ethBalance={ethBalance}
                        totalEth={totalEth}
                        suffecientBalance={suffecientBalance}
                      />
                    </div>
                  </div>
                ) : null
            }
          </div>
        </>
      ) : (
        <div
          style={{ textAlign: "center", padding: "25px 0px", fontSize: "20px" }}
        >
          Please connect your wallet to proceed
        </div>
      )}
    </>
  );
}

export default SendEth;
