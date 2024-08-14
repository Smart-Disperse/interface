import React from 'react'
import History from './History'
import history from "./history.module.css";
import samechainStyle from "@/Components/Dashboard/samechaindashboard.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassChart, faShare, faUser } from '@fortawesome/free-solid-svg-icons';
import AnalysisNav from '../Cross-Analysis/AnalysisNav';

function MainHistory() {
  return (
    <div className={history.maindiv}>
        <div>
        <div className={samechainStyle.stickyIcon}>
          <a href="/cross-chain" className={samechainStyle.Instagra}>
          <FontAwesomeIcon icon={faShare} /> <div style={{ marginLeft: "25px" }}>Cross Chain</div>
          </a>
        </div>
        <div className={samechainStyle.stickyIcon1}>
          <a href="/same-chain" className={samechainStyle.Instagra}>
            <FontAwesomeIcon icon={faShare} /> <div style={{ marginLeft: "25px" }}>Same Chain</div>
          </a>
        </div>
        <div className={samechainStyle.stickyIcon2}>
          <a href="/all-user-lists" className={samechainStyle.Instagram}>
            <FontAwesomeIcon icon={faUser} /> <div style={{ marginLeft: "25px" }}>Manage Labels</div>
          </a>
        </div>
      </div>
      {/* <AnalysisNav /> */}
     <History/>
    </div>
  )
}

export default MainHistory
