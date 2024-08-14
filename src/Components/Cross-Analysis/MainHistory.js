import React from "react";
import history from "@/Components/Same-Analysis/history.module.css";
import History from "./History";
import samechainStyle from "@/Components/Dashboard/samechaindashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlassChart,
  faShare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import AnalysisNav from "./AnalysisNav";

function MainHistory() {
  return (
    <div className={history.maindiv}>
      <div>
        <div className={samechainStyle.stickyIcon}>
          <a href="/cross-chain" className={samechainStyle.Instagra}>
            <FontAwesomeIcon icon={faShare} width={"1em"} height={"1em"} />
            <div style={{ marginLeft: "25px" }}>Cross Chain</div>
          </a>
        </div>
        <div className={samechainStyle.stickyIcon1}>
          <a href="/same-chain" className={samechainStyle.Instagra}>
            <FontAwesomeIcon icon={faShare} width={"1em"} height={"1em"} />
            <div style={{ marginLeft: "25px" }}>Same Chain</div>
          </a>
        </div>
        <div className={samechainStyle.stickyIcon2}>
          <a href="/all-user-lists" className={samechainStyle.Instagra}>
            <FontAwesomeIcon icon={faUser} width={"1em"} height={"1em"} />{" "}
            <div style={{ marginLeft: "25px" }}>Manage Labels</div>
          </a>
        </div>
      </div>
      {/* <AnalysisNav /> */}
      <History />
    </div>
  );
}

export default MainHistory;
