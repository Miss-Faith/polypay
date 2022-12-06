import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";

import ReactDOM from 'react-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';

import Head from "next/head";

// Import abi
import abi from "../utils/PayPortal.json";

export default function Home() {

  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0x3B2ac81EAeCFD4b5BC0a6c3b22013f58FF4d8936";

  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  /*
   * Just a state variable we use to store our user's public wallet.
   */
  const [currentAccount, setCurrentAccount] = useState("");

  const [message, setMessage] = useState("");

  const [name, setName] = useState("");

  const[amount, setAmount] = useState()

  /*
   * All state property to store all payments
   */
  const [allPay, setAllPay] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        toast.success("Wallet is Connected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.warn("Make sure you have MetaMask Connected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error("Make sure you have MetaMask Connected", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        toast.warn("Make sure you have MetaMask Connected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyPay = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const payPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await payPortalContract.getTotalPay();
        console.log("Retrieved total payment count...", count.toNumber());

        /*
         * Execute the actual payment from your smart contract
         */
        const payTxn = await payPortalContract.buyPay(
          message ? message : handleOnMessageChange,
          name ? name : handleOnMessageChange,
          ethers.utils.parseEther("0.00001"),
          {
            gasLimit: 300000,
          }
        );
        console.log("Mining...", payTxn.hash);

        toast.info("Sending payment...", {
          position: "top-left",
          autoClose: 18050,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        await payTxn.wait();

        console.log("Mined -- ", payTxn.hash);

        count = await payPortalContract.getTotalPay();

        console.log("Retrieved total payment count...", count.toNumber());

        setMessage("");
        setName("");

        toast.success("Success Payment Done!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  /*
   * Create a method that gets all payments from your contract
   */
  const getAllPay = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const payPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         * Call the getAllPay method from your Smart Contract
         */
        const pays = await payPortalContract.getAllPay();

        /*
         * We only need address, timestamp, name, and message in our UI so let's
         * pick those out
         */
        const payCleaned = pays.map((pay) => {
          return {
            address: pay.giver,
            timestamp: new Date(pay.timestamp * 1000),
            message: pay.message,
            name: pay.name,
          };
        });

        /*
         * Store our data in React State
         */
        setAllPay(payCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    let payPortalContract;
    getAllPay();
    checkIfWalletIsConnected();

    const onNewPay = (from, timestamp, message, name) => {
      console.log("NewPay", from, timestamp, message, name);
      setAllPay((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
          name: name,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      payPortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      payPortalContract.on("NewPay", onNewPay);
    }

    return () => {
      if (payPortalContract) {
        payPortalContract.off("NewPay", onNewPay);
      }
    };
  }, []);

  const handleOnMessageChange = (event) => {
    const { value } = event.target;
    setMessage(value);
  };
  const handleOnNameChange = (event) => {
    const { value } = event.target;
    setName(value);
  };
  const handleOnAmountChange = (event) => {
    const { value } = event.target.value.replace(/\+|-/ig, '');
    setAmount(value);
  };
  return (

    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Poly Payments</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-6">
          Make Payment
        </h1>
        {/*
         * If there is currentAccount render this form, else render a button to connect wallet
         */}

        {currentAccount ? (
          <div className="w-full max-w-xs sticky top-3 z-50 ">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Title
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Title"
                  onChange={handleOnNameChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="message"
                >
                  Description
                </label>

                <textarea
                  className="form-textarea mt-1 block w-full shadow appearance-none py-2 px-3 border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="Description"
                  id="message"
                  onChange={handleOnMessageChange}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="amount"
                >
                  Amount
                </label>

                <input
                  className="form-textarea mt-1 block w-full shadow appearance-none py-2 px-3 border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="Amount"
                  id="amount"
                  type="number"
                  onChange={handleOnAmountChange}
                  required
                ></input>
              </div>

              <div className="flex items-left justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={buyPay}
                >
                  Make Payment
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full mt-3"
            onClick={connectWallet}
          >
            Connect Your Wallet
          </button>
        )}

        {allPay.map((pay, index) => {
          return (
            <div className="border-l-2 mt-10" key={index}>
              <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-blue-800 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
                {/* <!-- Dot Following the Left Vertical Line --> */}
                <div className="w-5 h-5 bg-blue-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

                {/* <!-- Line that connecting the box with the vertical line --> */}
                <div className="w-10 h-1 bg-green-300 absolute -left-10 z-0"></div>

                {/* <!-- Content that showing in the box --> */}
                <div className="flex-auto">
                  <h1 className="text-md">Title/Name: {pay.name}</h1>
                  <h1 className="text-md">Description: {pay.message}</h1>
                  <h1 className="text-md">Amount: {pay.amount}</h1>
                  <h3>Address: {pay.address}</h3>
                  <h1 className="text-md font-bold">
                    TimeStamp: {pay.timestamp.toString()}
                  </h1>
                </div>
              </div>
            </div>
          );
        })}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}