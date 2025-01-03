"use client";

import React, { useState, useEffect } from "react";
import uploadStyle from "./uploadify.module.css";
import { isValidAddress } from "@/Helpers/ValidateInput.js";
import { isValidValue } from "@/Helpers/ValidateInput.js";
import { isValidTokenValue } from "@/Helpers/ValidateInput.js";
import { fetchUserLabels } from "@/Helpers/FetchUserLabels";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

function Uploadify({
  listData,
  setListData,
  tokenDecimal,
  allNames,
  allAddresses,
  selectedDestinationChain,
}) {
  const [csvData, setCsvData] = useState([]);
  const [isCsvDataEmpty, setIsCsvDataEmpty] = useState(true);
  const [allnames, setAllNames] = useState([]);
  const [alladdresses, setAllAddresses] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [labels, setLabels] = useState([]);

  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      fetchUserDetails();
    }
  }, [address]);

  const fetchUserDetails = async () => {
    try {
      const { allNames, allAddress } = await fetchUserLabels(address);
      setAllNames(allNames);
      setAllAddresses(allAddress);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const parseCSV = (content) => {
    const rows = content.split("\n");
    if (rows.length < 2) {
      alert("Invalid CSV format. Please check the CSV file.");
      return [];
    }

    const headers = rows[0].split(",").map((header) => header.trim());

    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",").map((item) => item.trim());

      if (row.length === headers.length) {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        data.push(rowData);
      }
    }

    return data;
  };

  const handleFileUpload = (chain) => (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;
      try {
        const parsedData = parseCSV(content);

        if (parsedData) {
          // Get existing data for other chains
          const existingData = listData?.filter(
            (item) => item.chainId !== chain.chainId
          ) || [];

          const newEntries = [];
          for (let i = 0; i < parsedData.length; i++) {
            if (tokenDecimal) {
              var validValue = isValidTokenValue(
                parsedData[i]["Token Amount"],
                tokenDecimal
              );
            } else {
              var validValue = isValidValue(parsedData[i]["Token Amount"]);
            }

            if (
              isValidAddress(parsedData[i]["Receiver Address"]) &&
              validValue
            ) {
              const recipientAddressFormatted =
                parsedData[i]["Receiver Address"].toLowerCase();
              const index = allAddresses.indexOf(recipientAddressFormatted);
              
              // Convert the value to BigNumber
              const valueBigNumber = ethers.utils.parseUnits(
                parsedData[i]["Token Amount"],
                tokenDecimal || 18
              );

              newEntries.push({
                address: recipientAddressFormatted,
                value: valueBigNumber,
                label: allNames[index] ? allNames[index] : "",
                chainId: chain.chainId,
                chainName: chain.name
              });
            } else if (
              !isValidAddress(parsedData[i]["Receiver Address"]) &&
              validValue
            ) {
              const index = allNames.indexOf(parsedData[i]["Receiver Address"]);
              if (index !== -1) {
                let recAddress = allAddresses[index];
                
                // Convert the value to BigNumber
                const valueBigNumber = ethers.utils.parseUnits(
                  parsedData[i]["Token Amount"],
                  tokenDecimal || 18
                );

                newEntries.push({
                  address: recAddress,
                  value: valueBigNumber,
                  label: parsedData[i]["Receiver Address"],
                  chainId: chain.chainId,
                  chainName: chain.name
                });
              }
            }
          }
          
          // Combine existing data with new entries
          setListData([...existingData, ...newEntries]);
        } else {
          console.error("Parsed data is empty.");
        }
      } catch (error) {
        console.error("Error parsing CSV data:", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className={uploadStyle.divmainforupload}>
      {selectedDestinationChain.map((chain) => (
        <div key={chain.chainId} className="mb-6">
          <div className={uploadStyle.titleforuploadfilecsvsame}>
            <h2
              style={{
                padding: "15px",
                fontSize: "20px",
                margin: "0px",
                fontWeight: "300",
                lineHeight: "28px",
                letterSpacing: "1px",
              }}
              className={uploadStyle.sametextmain}
            >
              <img 
                src={chain.iconUrl} 
                alt={chain.name}
                style={{
                  width: "24px",
                  height: "24px",
                  marginRight: "10px",
                  verticalAlign: "middle"
                }}
              />
              Upload your CSV file for {chain.name}
              <a
                href="/SampleUpload.csv"
                download="SampleUpload.csv"
                className={uploadStyle.downloadbtn}
                style={{ fontSize: "12px", marginLeft: "10px", color: "#00FFFF" }}
              >
                (Download Sample CSV file)
              </a>
            </h2>
          </div>
          <div className={uploadStyle.uploadordownload}>
            <div className={uploadStyle.inputdivforcsv}>
              <input
                className={uploadStyle.uploadFile}
                type="file"
                accept=".csv"
                onChange={handleFileUpload(chain)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Uploadify;