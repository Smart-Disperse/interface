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
  const [activeTab, setActiveTab] = useState("crossAnalysis");

  return (
    <div className={history.maindiv}>
      <div className={history.maindivofhisotry}>
        <div className={history.tablediv1}>
          <div className={history.headingdiv}>Latest Transactions</div>
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
        </div>

        <div className={history.maintablediv}>
          {activeTab === "sameAnalysis" ? <SameAnalysis /> : <CrossAnalysis />}
        </div>
      </div>
    </div>
  );
}

export default MainHistory;
