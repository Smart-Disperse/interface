import React, { useState } from "react";
import { Modal, Button, Tooltip } from "antd";
import "antd/dist/reset.css";
import { PlusOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Type/label.css";
import {
  faArrowDown,
  faArrowUp,
  faCopy,
  faMagnifyingGlass,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddLabel = ({ labels, setLabelValues, onAddLabel, index, data }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000); // Reset the copy status after 2 seconds
        toast.success("Token Address Copied Successfully!");
      },
      (err) => {
        console.error("Unable to copy to clipboard:", err);
      }
    );
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setErrorMessage("Enter Label");
    } else {
      setErrorMessage("");
    }

    const regex = /^[a-zA-Z]*$/;

    if (regex.test(inputValue) && inputValue.length <= 10) {
      setLabelValues(index, inputValue);
    }
  };

  const handleSubmit = () => {
    if (labels[index] && labels[index].trim() !== "") {
      onAddLabel(index, data.address);
      setIsModalVisible(false);
    } else {
      setErrorMessage("Enter Label");
    }
  };
  const truncateAddress = (address) => {
    if (!address) return "";
    const start = address.slice(0, 10);
    const end = address.slice(-15);
    return `${start}...${end}`;
  };
  return (
    <>
      <Tooltip
        title={
          <span style={{ color: "white", fontSize: "10px" }}>
            Assign a label to this
            <br /> receiver's address
          </span>
        }
        placement="bottom"
        color="white"
        overlayInnerStyle={{
          borderRadius: "8px",
          lineHeight: "12px",
          color: "#8d37fb",
        }}
      >
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined style={{ fill: "black" }} />}
          onClick={() => setIsModalVisible(true)}
        />
      </Tooltip>
      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            Enter Label
            <Tooltip
              title="You can add a label from here to identify the transaction."
              placement="bottom"
              color="linear-gradient(160deg, rgba(24, 26, 83, 1) 47%, rgba(46, 13, 90, 1) 100%)"
              overlayInnerStyle={{
                marginTop: "10px",
                marginLeft: "40px",
                opacity: 0.6,
                borderRadius: "8px",
              }}
            >
              <InfoCircleOutlined
                style={{ opacity: 0.6, fontSize: "16px", marginTop: "2px" }}
              />
            </Tooltip>
          </div>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        // footer={[
        //   <Button
        //     key="submit"
        //     type="primary"
        //     onClick={handleSubmit}
        //     className="submitLable"
        //   >
        //     Save
        //   </Button>,
        // ]}
        footer={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "20px auto",
            alignItems: "flex-start",
            // width: "75%",
            gap: "10px",
            color: "white",
          }}
        >
          <strong style={{ fontSize: "14px", letterSpacing: "0.5px" }}>
            Receiver Address:
          </strong>
          <div className="recAdd1">
            <span style={{ width: "85%", fontSize: "15px" }}>
              {data.address}
            </span>
            <FontAwesomeIcon
              className="copyicon"
              onClick={() => copyToClipboard(data.address)}
              icon={faCopy}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "20px auto",
            alignItems: "flex-start",
            // width: "75%",
            gap: "10px",
            color: "white",
          }}
        >
          <strong style={{ fontSize: "14px", letterSpacing: "0.5px" }}>
            Add Label:{" "}
          </strong>
          <input
            type="text"
            value={labels[index] ? labels[index] : ""}
            style={{
              borderRadius: "8px",
              padding: "10px",
              color: "white",
              width: "100%",
              border: "1px solid white",
              background: "transparent",
              fontSize: "17px",
              // margin: "0px 10px",
            }}
            onChange={handleInputChange}
          />
          {errorMessage && (
            <p
              style={{
                color: "red",
                fontWeight: "600",
                margin: "-5px 20px",
                fontSize: "13px",
              }}
            >
              {errorMessage}
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            // width: "75%",
            margin: "30px auto 20px",
          }}
        >
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            className="submitLable"
          >
            Save
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AddLabel;
