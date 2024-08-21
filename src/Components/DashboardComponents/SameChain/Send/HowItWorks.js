import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faDollarSign,
  faTag,
  faClipboardList,
  faRotate,
  faMagnifyingGlass,
  faCirclePlus,
  faUser,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";


const tutorialContent = {
  text: [
    { icon: faDoorOpen, heading: "Direct Entry", subtext: "Enter Ethereum addresses and amounts in Ether or USD." },
    { icon: faDollarSign, heading: "Currency Indicator", subtext: "Use a dollar sign ($) for USD; Ether amounts without a symbol." },
    { icon: faTag, heading: "Label Lookup", subtext: "Type \"@\" to access assigned labels; select or type \"@labelname\"." },
    { icon: faClipboardList, heading: "Label Assignment", subtext: "Input address and amount; assign label in transaction lineup." },
  ],
  list: [
    { icon: faDoorOpen, heading: "Direct Entry", subtext: "Enter Ethereum addresses and amounts in Ether or USD." },
    { icon: faRotate, heading: "Auto-Fill Sync", subtext: "Entering address or label auto-fills the corresponding assigned field." },
    { icon: faMagnifyingGlass, heading: "Label Lookup", subtext: "Type labelname to access assigned labels list; select or type \"labelname\"." },
    { icon: faCirclePlus, heading: "Label Assignment", subtext: "Input address and amount; assign label in transaction lineup." },
  ],
  csv: [
    { icon: faUser, heading: "New Users", subtext: "Download the sample CSV for data order reference." },
    { icon: faRotate, heading: "Auto-Fill Sync", subtext: "Enter address or label and amount. Auto-fills format, don't add both." },
    { icon: faUpload, heading: "Edit & Upload", subtext: "You can also edit and upload the sample CSV file." },
    { icon: faCirclePlus, heading: "Label Assignment", subtext: "Input address and amount; assign label in transaction lineup." },
  ],
};

function HowItWorks({ activeTab, isOpen, textStyle }) {
  return (
    <div id="Slider" className={`${textStyle.textlistdiv} ${textStyle.slider} ${isOpen ? textStyle.sliderOpen : ""}`}>
      <div>
        <ul style={{ listStyleType: "none" }} className={textStyle.contents}>
          <div className={textStyle.tutorialcardscontainer} style={{ textAlign: "left" }}>
            {tutorialContent[activeTab].map((item, index) => (
              <div key={index} className={textStyle.tutorialcards}>
                <li className={textStyle.contentincard}>
                  <FontAwesomeIcon className={textStyle.iconintutorial} icon={item.icon} />
                  <div className={textStyle.headingintutorial}>{item.heading}</div>
                  <div className={textStyle.subtextintutorial}>{item.subtext}</div>
                </li>
              </div>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
}

export default HowItWorks;