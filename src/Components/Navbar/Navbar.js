"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import navStyle from "../NewHomePage/navbar/navbar.module.css";
import smartlogo from "../../Assets/logo.png";
import ConnectButtonCustom from "../ConnectButton/ConnectButtonCustom";
import Image from "next/image";
import { useTheme } from "next-themes";
import Cookies from "universal-cookie";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { usePathname } from "next/navigation";
import { createSign } from "@/Utils/UserSignatureAPIAuthentication";
import NavLinks from "../Navlinks";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { RiCloseFill } from "react-icons/ri";

function Navbar() {
  const { isConnected, address } = useAccount();
  const cookie = new Cookies();
  const [isMainnet, setIsMainnet] = useState(true);
  const { signMessageAsync } = useSignMessage();
  const path = usePathname();
  const chainId = useChainId();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isHome = path === "/";
  const isMilestone = path === "/milestone";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 1024);

      const handleResize = () => {
        setIsMobile(window.innerWidth < 1024);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    const handleAuth = async () => {
      if (address && !isHome) {
        const jwtToken = cookie.get("jwt_token");

        if (jwtToken === undefined || jwtToken === null) {
          const message =
            "Sign this message to add labels to the address for easier access. This signature is for security purposes, ensuring that your labels are securely linked to your address and not accessible by others.";
          const signature = await signMessageAsync({ message });
          createSign(address, signature, message);
        }
      }
    };

    if (isConnected) {
      handleAuth();
    }
  }, [isConnected]);

  return (
    <div className={navStyle.navMainDash}>
      <div className={navStyle.navFixed2}>
        <div className={navStyle.navSub}>
          <div className={navStyle.left}>
            <Link href="/">
              <Image
                className={navStyle.logo}
                src={smartlogo}
                alt="not foundd"
              />
            </Link>

            {!isMobile ? <NavLinks /> : <></>}
          </div>

          <div className={navStyle.right}>
            {isHome || isMilestone ? (
              <></>
            ) : (
              <div className={navStyle.connectwalletbuttondiv}>
                <ConnectButtonCustom isMainnet={isMainnet} />
              </div>
            )}

            {isMobile ? (
              <button className={navStyle.hambutton} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <RiCloseFill /> : <HiOutlineMenuAlt2 />}
              </button>
            ) : (
              <></>
            )}
          </div>
          {isOpen ? <NavLinks /> : <></>}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
