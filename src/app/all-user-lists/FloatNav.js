import React, { useEffect, useState } from "react";
import { FloatButton, Tooltip } from "antd";
import "./floatnav.css";
import { IoArrowRedoSharp } from "react-icons/io5";
import { TbArrowBigRightLineFilled } from "react-icons/tb";

const FloatNav = () => {
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
              icon={<TbArrowBigRightLineFilled />}
              description="Same Chain"
              href="/same-chain"
              className="button"
            />
            <FloatButton
              icon={<IoArrowRedoSharp />}
              description="Cross Chain"
              href="/cross-chain"
              className="button"
            />
            
          </>
        ) : (
          <>
            <Tooltip
              title={
                <span style={{ color: "white", fontSize: "14px" }}>
                  Same Chain
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
                icon={<TbArrowBigRightLineFilled />}
                href="/same-chain"
                className="button"
              />
            </Tooltip>

            <Tooltip
              title={
                <span style={{ color: "white", fontSize: "14px" }}>
                  Cross Chain
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
                icon={<IoArrowRedoSharp />}
                href="/cross-chain"
                className="button"
              />
            </Tooltip>
          </>
        )}
      </FloatButton.Group>
    </>
  );
};
export default FloatNav;
