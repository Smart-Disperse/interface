import React, { useEffect, useState } from "react";
import { FloatButton, Tooltip } from "antd";
import "./crosschainnav.css";
import { FaShare, FaUser } from "react-icons/fa";
import { MdNewLabel } from "react-icons/md";
import { DiGoogleAnalytics } from "react-icons/di";
import { TbArrowBigRightLineFilled } from "react-icons/tb";

const CrosschainNav = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);

      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <>
      <FloatButton.Group
        shape={isMobile ? "square" : "circle"}
        className="crossnav"
      >
        {isMobile ? (
          <>
            <FloatButton
              icon={<MdNewLabel />}
              description="Manage Labels"
              href="/all-user-lists"
              className="button"
            />
            <FloatButton
              icon={<DiGoogleAnalytics />}
              description="Spent Analysis"
              href="/cross-analysis"
              className="button"
            />
            <FloatButton
              icon={<TbArrowBigRightLineFilled />}
              description="Same Chain"
              href="/same-chain"
              className="button"
            />
          </>
        ) : (
          <>
            <Tooltip
              title={
                <span style={{ color: "white", fontSize: "14px" }}>
                  Manage Labels
                </span>
              }
              arrow={false}
              placement="left"
              innerWidth="200px"
              color="linear-gradient(160deg, rgba(24, 26, 83, 1) 47%, rgba(46, 13, 90, 1) 100%)"
              overlayInnerStyle={{
                opacity: 1,
                borderRadius: "8px",
                border: "1px solid white",
                padding: "8px",
              }}
            >
              <FloatButton
                icon={<MdNewLabel />}
                href="/all-user-lists"
                className="button"
              />
            </Tooltip>
            <Tooltip
              title={
                <span style={{ color: "white", fontSize: "14px" }}>
                  Spent Analysis
                </span>
              }
              placement="left"
              arrow={false}
              color="linear-gradient(160deg, rgba(24, 26, 83, 1) 47%, rgba(46, 13, 90, 1) 100%)"
              overlayInnerStyle={{
                opacity: 1,
                borderRadius: "8px",
                border: "1px solid white",
                padding: "8px",
              }}
            >
              <FloatButton
                icon={<DiGoogleAnalytics />}
                href="/cross-analysis"
                className="button"
              />
            </Tooltip>
            <Tooltip
              title={
                <span style={{ color: "white", fontSize: "14px" }}>
                  Same Chain
                </span>
              }
              arrow={false}
              placement="left"
              color="linear-gradient(160deg, rgba(24, 26, 83, 1) 47%, rgba(46, 13, 90, 1) 100%)"
              overlayInnerStyle={{
                opacity: 1,
                borderRadius: "8px",
                border: "1px solid white",
                padding: "8px",
              }}
            >
              <FloatButton
                icon={<TbArrowBigRightLineFilled />}
                href="/same-chain"
                className="button"
              />
            </Tooltip>
          </>
        )}
      </FloatButton.Group>
    </>
  );
};
export default CrosschainNav;
