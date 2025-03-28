import React, { useEffect, useRef, useState } from "react";
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
  const inputRef = useRef(null);

  useEffect(() => {
    if (isModalVisible && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isModalVisible]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000); // Reset the copy status after 2 seconds
        toast.success("Receiver Address Copied Successfully!");
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
        title="Assign a label to receiver's address"
        placement="bottom"
        color="white"
        overlayInnerStyle={{
          borderRadius: "8px",
          fontWeight: "600",
          color: "#8d38fb",
        }}
      >
        <Button
          type="common"
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
              title="You can add a label from here to identify the receiver."
              placement="top"
              color="#ffffff"
              overlayInnerStyle={{
                marginTop: "15px",
                marginLeft: "40px",
                color: "#8d37fb",

                borderRadius: "8px",
                fontWeight: "600",
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
            <span
              style={{
                width: "85%",
                fontSize: "15px",
                textOverflow: "ellipsis",
                opacity: "0.5",
              }}
            >
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
            ref={inputRef}
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
            <span>Save</span>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AddLabel;
