import React, { useState, useEffect } from "react";
import "driver.js/dist/driver.css";
import textStyle from "./Type/textify.module.css";
import SendToken from "./Send/SendToken";
import allchains from "@/Helpers/CrosschainHelpers/ChainSelector";
import { useAccount, useChainId } from "wagmi";
import CustomDropdown from "./Type/CustomDropDown";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import select from "../../../Assets/select.png";
import Image from "next/image";

function CrossChain() {
  const [listData, setListData] = useState([]);
  const { address } = useAccount();
  const [connectedChain, setConnectedChain] = useState(null);
  const [destinationChainsOptions, setDestinationChainsOptions] = useState([]);
  const [selectedDestinationChain, setSelectedDestinationChain] =
    useState(null);
  const [tokenOptions, setTokenOptions] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const chainId = useChainId();

  const getChainsForDropDown = () => {
    try {
      const chainDetails = allchains[chainId];
      if (!chainDetails) {
        throw new Error(`Chain details for chainId ${chainId} are undefined.`);
      }

      console.log("chain detailsssssss", chainDetails);
      const options = Object.entries(chainDetails.destinationChains).map(
        ([name, details]) => ({
          name,
          iconUrl: details.iconUrl,
          chainId: details.chainId,
        })
      );
      setDestinationChainsOptions(options);
    } catch (error) {
      console.error(error.message);
      setDestinationChainsOptions([]);
    }
  };

  useEffect(() => {
    if (address) {
      setIsMetaMaskConnected(true);
      getChainsForDropDown();
    } else {
      setIsMetaMaskConnected(false);
    }
  }, [address, chainId]);

  // const handleDestinationChainChange = (selectedChain) => {
  //   console.log(selectedChain);
  //   setTokenAddress("");
  //   setSelectedToken(null);
  //   const selectedChainName = selectedChain.name;
  //   const chainDetails = allchains[chainId];
  //   const selectedChainDetails =
  //     chainDetails.destinationChains[selectedChainName];

  //   setSelectedDestinationChain(selectedChain);

  //   console.log(selectedChainDetails);

  //   if (selectedChainDetails) {
  //     setErrorMessage("");
  //     const tokenOptions = Object.entries(selectedChainDetails.tokens).map(
  //       ([key, value]) => ({
  //         name: key,
  //         address: value,
  //         iconUrl:
  //           "https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png",
  //       })
  //     );

  //     setTokenOptions(tokenOptions);
  //   } else {
  //     setTokenOptions([]);
  //   }
  // };

  const handleDestinationChainChange = (selectedChain) => {
    console.log("seeeeeeeeeeeeelected... ", selectedChain);
    console.log("selected chains", selectedChain);
    setTokenAddress("");
    setSelectedToken(null);
  
    const selectedChainName = selectedChain.name;
    const chainDetails = allchains[chainId];
    const selectedChainDetails =
      chainDetails.destinationChains[selectedChainName];
  
    setSelectedDestinationChain(selectedChain);
  
    console.log(selectedChainDetails);
  
    if (selectedChainDetails) {
      setErrorMessage("");
  
      // Map tokens from the destination chain
      const tokenOptions = Object.entries(selectedChainDetails.tokens).map(
        ([key, value]) => ({
          name: key,
          address: value,
          iconUrl:
            key === "ETH"
              ? "https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png"
              : "https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png",
        })
      );
  
      setTokenOptions(tokenOptions);
    } else {
      setTokenOptions([]);
    }
  };
  

  const handleDestinationTokenChange = (selectedToken) => {
    if (!selectedDestinationChain) {
      setErrorMessage("Please select a destination chain first.");
    } else {
      setSelectedToken(selectedToken);
      // Set tokenAddress to "ETH" for ETH, otherwise use the token's address
      setTokenAddress(
        selectedToken.name === "ETH" ? "ETH" : selectedToken.address
      );
      setErrorMessage(""); // Clear error message when a token is selected
    }
  };

  return (
    <>
      <div>
        <div className={textStyle.divforwholetoken}>
          <div className={textStyle.titleloadtokensametext}>
            <h2
              style={{
                padding: "15px",
                letterSpacing: "1px",
                fontSize: "20px",
                margin: "0px",
              }}
            >
              Choose Your Token, Define Your Destination
            </h2>
          </div>
          <div
            id="seend-eth"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={textStyle.sametextmain}
          >
            <div id="send-eth" className={textStyle.sendethdiv}>
              {/* Dropdown of chains */}
              <CustomDropdown
                className={textStyle.dropdownbtn}
                options={destinationChainsOptions}
                onSelect={handleDestinationChainChange}
                selectedValue={selectedDestinationChain}
                placeholder="Select destination chain "
                disabled={!isMetaMaskConnected}
              />
              {/* <Image src={select} style={{position:"absolute", left:"10%"}}/> */}
            </div>

            <div className={textStyle.importtokendiv}>
              <div style={{ margin: "10px 10px" }}>⇨</div>
              {/* Dropdown of tokens */}
              <CustomDropdown
                options={tokenOptions}
                onSelect={handleDestinationTokenChange}
                selectedValue={selectedToken}
                placeholder="Select token "
                disabled={!isMetaMaskConnected}
              />
              {/* <Image src={select} style={{position:"relative", right:"20%"}}/> */}
            </div>
            {errorMessage && (
              <div className={textStyle.errorMessage}>{errorMessage}</div>
            )}
          </div>
        </div>
        <SendToken
          listData={listData}
          setListData={setListData}
          tokenAddress={tokenAddress}
          selectedDestinationChain={selectedDestinationChain}
        />
      </div>
    </>
  );
}

export default CrossChain;
