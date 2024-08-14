"use client";
import React, { useState, useEffect } from "react";
import "driver.js/dist/driver.css";
import textStyle from "./Type/textify.module.css";

import SendEth from "./Send/SendEth";
import SendToken from "./Send/SendToken";
import { useAccount } from "wagmi";

/*
Main Component : the prop is use to get which of the three from textify, listify or uplaodify should ne loaded
It will be handled further by sendEth or sendToken component
*/
function SameChain() {
  const [isSendingEth, setIsSendingEth] = useState(true);

  const [isSendingToken, setIsSendingToken] = useState(false);
  const [listData, setListData] = useState([]);
  const [render, setRender] = useState(1);
  const { address } = useAccount();
  const [activeButton, setActiveButton] = useState("sendEth");

  /*
  Funtion : To load SendEth component
  */
  const handleSendEthbuttonClick = () => {
    setIsSendingEth(true);
    setIsSendingToken(false);
    setActiveButton("sendEth");
  };

  /*
  Funtion : To load SendToken component
  */

  const handleImporttokenbuttonClick = () => {
    setIsSendingToken(true);
    setListData([]);
    setIsSendingEth(false);
    setActiveButton("importToken");
  };

  return (
    <>
    
      <div >
        <div className={textStyle.divforwholetoken}>
          <div className={textStyle.titleloadtokensametext}>
            <h2
              style={{
                padding: "15px",
                letterSpacing: "1px",
                fontSize: "20px",
                margin: "0px",
                fontWeight: "300",
              }}
            >
              Select or Import Token you want to Disperse
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
              <button
                // id={isSendingEth ? textStyle.truee : textStyle.falsee}
                className={`${textStyle.buttontoaddformdata} ${
                  activeButton === "sendEth" ? textStyle.activeButton : ""
                }`}
                onClick={handleSendEthbuttonClick}
              >
                Send Eth
              </button>
            </div>

            <div className={textStyle.importtokendiv}>
              <div style={{ margin: "10px 0px" }}>OR</div>

              <button
                id={isSendingToken ? textStyle.truee : textStyle.falsee}
                style={{
                  backgroundColor: isSendingToken ? "" : " white",
                  color: isSendingToken ? "" : "white",
                  // border: "none",
                }}
                className={`${textStyle.buttontoaddformdataunload} ${
                  activeButton === "importToken" ? textStyle.activeButton : ""
                }`}
                onClick={() => handleImporttokenbuttonClick()}
              >
                Import Token
              </button>
            </div>
          </div>
        </div>
        {render && isSendingEth ? (
          <SendEth listData={listData} setListData={setListData} />
        ) : null}

        {isSendingToken ? (
          <SendToken listData={listData} setListData={setListData} />
        ) : null}
      </div>
    </>
  );
}

export default SameChain;
