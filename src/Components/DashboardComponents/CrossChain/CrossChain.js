import React, { useState, useEffect } from "react";
import "driver.js/dist/driver.css";
import textStyle from "./Type/textify.module.css";
import SendToken from "./Send/SendToken";
import allchains from "@/Helpers/CrosschainHelpers/ChainSelector";
import { useAccount, useChainId } from "wagmi";
import CustomDropdown from "./Type/CustomDropDown";


function CrossChain() {
  const [listData, setListData] = useState([]);
  const { address } = useAccount();
  const [destinationChainsOptions, setDestinationChainsOptions] = useState([]);
  const [selectedDestinationChains, setSelectedDestinationChains] = useState([]);
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

  const handleDestinationChainChange = (selectedChains) => {
    setTokenAddress("");
    setSelectedToken(null);
    setSelectedDestinationChains(selectedChains);
  
    const chainDetails = allchains[chainId];
    const allTokenOptions = new Set();

    selectedChains.forEach((selectedChain) => {
      const selectedChainDetails = chainDetails.destinationChains[selectedChain.name];
      if (selectedChainDetails) {
        Object.entries(selectedChainDetails.tokens).forEach(([key, value]) => {
          allTokenOptions.add(JSON.stringify({
            name: key,
            address: value,
            iconUrl: key === "ETH"
              ? "https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png"
              : "https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png",
          }));
        });
      }
    });

    setTokenOptions(Array.from(allTokenOptions).map(JSON.parse));
    setErrorMessage("");
  };

  const handleDestinationTokenChange = (selectedToken) => {
    if (selectedDestinationChains.length === 0) {
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

  const removeSelectedChain = (chainToRemove) => {
    setSelectedDestinationChains(prevChains => 
      prevChains.filter(chain => chain.name !== chainToRemove.name)
    );
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
                selectedValue={selectedDestinationChains}
                placeholder="Select destination chain "
                disabled={!isMetaMaskConnected}
                multiple={true}
              />
            </div>

            <div className={textStyle.importtokendiv}>
              <div style={{ margin: "10px 10px" }}>⇨</div>
              {/* Dropdown of tokens */}
              <CustomDropdown
                options={tokenOptions}
                onSelect={handleDestinationTokenChange}
                selectedValue={selectedToken}
                placeholder="Select token"
                disabled={!isMetaMaskConnected}
              />
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
          selectedDestinationChain={selectedDestinationChains}
        />
      </div>
    </>
  );
}

export default CrossChain;
