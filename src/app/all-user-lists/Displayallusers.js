"use client";
import Footer from "@/Components/Footer/Footer";
import React, { useEffect, useState } from "react";
import displayuser from "./displayallusers.module.css";
import Image from "next/image";
import img3 from "../../Assets/img3-bg.webp";
import img4 from "@/Assets/img4-bg.webp";
import { useAccount } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPenToSquare,
  faCheck,
  faTrash,
  faXmark,
  faArrowLeft,
  faArrowRight,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import loader from "../../Assets/dataloading.webp";
import notfound from "../../Assets/oops.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import SkeletonLoader from "@/Components/skeletons/managelabel";
import AddLabel from "./Addlabel";

//
const dummyUsersData = [
  {
    name: "Alice Smith",
    address: "0x1234567890123456789012345678901234567890",
  },
  {
    name: "Bob Johnson",
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  },
  {
    name: "Charlie Brown",
    address: "0x9876543210987654321098765432109876543210",
  },
];
//

function Displayallusers() {
  // const [usersData, setUsersData] = useState([]);

  //
  const [labels, setLabels] = useState(dummyUsersData.map((user) => user.name));
  const [usersData, setUsersData] = useState(dummyUsersData);
  //
  const [editUserIndex, setEditUserIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(true); // State for tracking loading

  const fetchUserDetails = async () => {
    try {
      const result = await fetch(`api/all-user-data?address=${address}`);
      const response = await result.json();

      const userData = response.result;

      setIsLoading(false);
      setUsersData(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (address) {
      fetchUserDetails();
    }
  }, [address]);

  const handleEdit = (index) => {
    setEditUserIndex(index);
    setEditName(usersData[index].name);
    setEditAddress(usersData[index].address);
  };

  const handleAbortedit = () => {
    setEditUserIndex(null);
    setEditName("");
    setEditAddress("");
  };

  // const handleUpdate = async (index) => {
  //   try {
  //     const result = await fetch(`api/all-user-data?address=${address}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: editName,
  //         address: editAddress,
  //       }),
  //     });

  //     if (result.ok) {
  //       toast.success("Name updated successfully");
  //       const updatedUsersData = [...usersData];
  //       updatedUsersData[index] = {
  //         ...updatedUsersData[index],
  //         name: editName,
  //         address: editAddress,
  //       };
  //       setUsersData(updatedUsersData);
  //       // Clear edit state
  //       setEditUserIndex(null);
  //       setEditName("");
  //       setEditAddress("");
  //       fetchUserDetails();
  //     } else {
  //       console.error("Error updating user:", result.statusText);
  //       toast.error("Failed to update data");
  //     }
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     toast.error("An error occurred while updating data");
  //   }
  // };

  const handleUpdate = (index, address) => {
    const updatedUsersData = [...usersData];
    updatedUsersData[index] = {
      ...updatedUsersData[index],
      name: labels[index],
    };
    setUsersData(updatedUsersData);
  };

  // const handleDelete = async (index) => {
  //   try {
  //     const addressToDelete = usersData[index].address;
  //     const result = await fetch(`api/all-user-data?address=${address}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ address: addressToDelete }),
  //     });
  //     if (result.ok) {
  //       toast.success("Name deleted successfully");
  //       const updatedUsersData = [...usersData];
  //       updatedUsersData.splice(index, 1);
  //       setUsersData(updatedUsersData);
  //     } else {
  //       console.error("Failed to delete data");
  //       toast.error("Failed to delete data");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //     toast.error("An error occurred while deleting data");
  //   }
  // };

  const handleDelete = (index) => {
    const updatedUsersData = [...usersData];
    updatedUsersData.splice(index, 1);
    setUsersData(updatedUsersData);

    const updatedLabels = [...labels];
    updatedLabels.splice(index, 1);
    setLabels(updatedLabels);
  };

  const setLabelValues = (index, value) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = value;
    setLabels(updatedLabels);
  };

  return (
    <div className={displayuser.maindivofdashboard}>
      <div className={displayuser.titledivdashboard}>
        <div className={displayuser.imagesinthis}></div>
        <h1 className={displayuser.heading}>Customize Your Connections</h1>
        <h3 className={displayuser.content}>
          Edit and Delete Entries in a Snap for Effortless Data Management!"
        </h3>
      </div>

      <div className={displayuser.maindivforalloptiondashboard}>
        {address ? (
          isLoading ? (
            <div>
              {/* <Image src={loader.src} alt="none" width={100} height={100} /> */}
              <SkeletonLoader />
            </div>
          ) : (
            <div className={displayuser.parentDivofTable}>
              {/* <div className={displayuser.tableWrapper}>
                <table>
                  <thead>
                    <tr className={displayuser.sticky}>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usersData && usersData.length > 0 ? (
                      usersData.map((user, index) => (
                        <tr key={index}>
                          <td> {user.name} </td>

                          <td>{user.address}</td>

                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "14px",
                              }}
                            >
                              <AddLabel
                                labels={editName}
                                setLabelValues={setEditName}
                                onAddLabel={handleUpdate}
                                index={index}
                                data={usersData}
                              />
                              <button
                                className={displayuser.displaydeletebutton}
                                onClick={() => handleDelete(index)}
                              >
                                <FontAwesomeIcon
                                  className={displayuser.deleteicon}
                                  icon={faTrash}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" style={{height: "270px"}}>
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div> */}

              <div className={displayuser.tableWrapper}>
                <table>
                  <thead>
                    <tr className={displayuser.sticky}>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usersData && usersData.length > 0 ? (
                      usersData.map((user, index) => (
                        <tr key={index}>
                          <td>{user.name}</td>

                          <td>{user.address}</td>

                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0px",
                              }}
                            >
                              <AddLabel
                                labels={labels}
                                setLabelValues={setLabelValues}
                                onAddLabel={handleUpdate}
                                index={index}
                                data={user}
                              />
                              <button
                                className={displayuser.displaydeletebutton}
                                onClick={() => handleDelete(index)}
                              >
                                <FontAwesomeIcon
                                  className={displayuser.deleteicon}
                                  icon={faTrash}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ height: "270px" }}>
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div style={{ fontSize: "18px", fontWeight: "500" }}>
            <h2>Please connect your wallet</h2>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Displayallusers;
