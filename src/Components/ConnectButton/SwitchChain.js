import React, { useState, useRef, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import connectStyle from "../ConnectButton/connect.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaChevronDown } from "react-icons/fa";
import { faL, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import Cookies from "universal-cookie";

function SwitchChain({ closeAccountModal }) {
  // useChainChangeReload(); // Call this hook on every render to ensure the page reloads when chain changes
  const { chain } = useAccount();
  const path = usePathname();
  const [isMainnet, setIsMainnet] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const cookie = new Cookies();
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // State for modal visibility
  const { chains, error, isLoading, pendingChainId, switchChain } =
    useSwitchChain();

  const isCrosschainPage = path === "/cross-chain";
  const isSamePage = path === "/same-chain";

  // const mainnetChains = [34443, 534352, 8453, 10];
  const mainnetChains = ["Available Soon"];
  // const testnetChains = [901, 902, 11155111, 534351, 11155420, 919, 84532,];
  // const testnetChains = [11155420, 84532, 919];
  const testnetChains = [10, 8453, 7777777]

  const crossChainMainnet = ["Available Soon"];
  // const crossChainTestnet = [11155111, 11155420, 84532, 421614, 80002, 901, 902];
  const crossChainTestnet = [11155420, 84532, 919];
  // const sameChainMainnet = [10, 8453, 534352, 34443];
  const sameChainMainnet = [34443, 534352, 8453, 10];
  // const sameChainTestnet = [11155111, 534351, 11155420, 919, 84532, 901, 902];
  const sameChainTestnet = [901, 902];

  let displayChains = isMainnet
    ? chains.filter((chain) => mainnetChains.includes(chain.id))
    : chains.filter((chain) => testnetChains.includes(chain.id));

  // if (isCrosschainPage) {
  //   displayChains = isMainnet
  //     ? displayChains.filter((chain) => crossChainMainnet.includes(chain.id))
  //     : displayChains.filter((chain) => crossChainTestnet.includes(chain.id));
  // }

  // if (isSamePage) {
  //   displayChains = isMainnet
  //     ? displayChains.filter((chain) => sameChainMainnet.includes(chain.id))
  //     : displayChains.filter((chain) => sameChainTestnet.includes(chain.id));
  // }

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const buttonRef = useRef(null);
  useEffect(() => {
    setIsMounted(true); // This ensures the component is mounted before using the router
  }, []);

  const handleButtonClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionClick = async (networkId) => {
    if (isMounted) {
      switchChain({ chainId: networkId });
      setDropdownVisible(false);
    }
  };

  const handleNetworkChange = (isMainnet) => {
    setIsMainnet(isMainnet);
    console.log("is mainnet");

    cookie.set("isMainnet", !isMainnet);
  };

  useEffect(() => {
    const getIsMainnetFromCookies = () => {
      const isMainnetCookie = cookie.get("isMainnet");

      if (isMainnetCookie !== undefined) {
        setIsMainnet(isMainnetCookie);
      }
    };

    getIsMainnetFromCookies();

    // Clean up function to avoid memory leaks
    return () => { };
  }, []);

  useEffect(() => {
    console.log("erroe is ", error);

    if (error && error.code !== "UNSUPPORTED_CHAIN") {
      toast.error("Failed to change Network: User rejected the Request");
    }
  }, [error]);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
    closeAccountModal();
  };
  const handleMouseLeave = () => {
    setDropdownVisible(true);
    closeAccountModal();
  };

  const isChainAvailable = (chainId) => {
    const allAvailableChains = [
      ...mainnetChains,
      ...testnetChains,
      ...crossChainMainnet,
      ...crossChainTestnet,
      ...sameChainMainnet,
      ...sameChainTestnet,
    ];
    return allAvailableChains.includes(chainId);
  };
  return (
    <div
      className={connectStyle.switchchaincontainer}
      // onMouseEnter={() => setDropdownVisible(true)}
      onMouseLeave={() => setDropdownVisible(false)}
    >
      <button
        ref={buttonRef}
        className={
          chain && isChainAvailable(chain.id)
            ? connectStyle.connectchain
            : connectStyle.wrongbtn
        }
        type="button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleButtonClick}
      >
        {chain && isChainAvailable(chain.id) ? (
          <>
            <img
              src={chain.iconUrl}
              alt={`${chain.name} icon`}
              className={connectStyle.logo}
            />
            <span className={connectStyle.chainName}>{chain.name}</span>
            <FaChevronDown className={connectStyle.chainName} />
          </>
        ) : (
          <div className={connectStyle.wrong}>
            Wrong Network
            <FaChevronDown className={connectStyle.chainName1} />
          </div>
        )}

      </button>

      <div
        className={connectStyle.ChainDropdownMain}
        // onMouseEnter={() => setDropdownVisible(true)}
        onMouseLeave={() => setDropdownVisible(false)}
      >
        {dropdownVisible && (
          <div className={connectStyle.dropdown} style={{}}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px 0px",
              }}
            >
              <button
                className={`${connectStyle.networkButton} ${isMainnet ? connectStyle.active : ""
                  }`}
                onClick={() => handleNetworkChange(true)}
              >
                Mainnet
              </button>
              <button
                className={`${connectStyle.networkButton} ${!isMainnet ? connectStyle.active : ""
                  }`}
                onClick={() => handleNetworkChange(false)}
              >
                Testnet
              </button>
            </div>
            {displayChains.map((network) => (
              <button
                key={network.id}
                className={connectStyle.networkoption}
                disabled={isLoading || pendingChainId === network.id}
                onClick={() => handleOptionClick(network.id)}
              >
                <div className={connectStyle.icon2}>
                  {network.iconUrl && (
                    <img
                      src={network.iconUrl}
                      alt={network.name}
                      style={{
                        width: "20px",
                        marginRight: "10px",
                        background: "white",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                  <div className={connectStyle.netName}>{network.name}</div>
                  {chain && chain.id === network.id && (
                    <div className={connectStyle.selectedDot}></div>
                  )}
                </div>
              </button>
            ))}
            {isMainnet && displayChains.length === 0 ? (
              <>
                <button className={connectStyle.networkoption}>
                  <div className={connectStyle.icon2}>
                    <div className={connectStyle.netName}>Available soon</div>
                  </div>
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default SwitchChain;
