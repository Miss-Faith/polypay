import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import { ExternalProvider } from "@ethersproject/providers";
import "react-toastify/dist/ReactToastify.css";

import ReactDOM from 'react-dom';
// import axios from 'axios';
// import swal from 'sweetalert';
// import { useHistory } from 'react-router-dom';

declare global {
  interface Window {
    ethereum?: any;
  }
}

import Head from "next/head";

// Import abi
import abi from "../utils/PayPortal.json";

export default function Home() {
  

  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0x66b650a380c282EC0243BC7B118c1D38C818F37F";

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

  // const [amount, setAmount] = useState<number | undefined>(0.00001);
  const [payamount, setAmount] = useState("");
  const [price, setPrice] = useState<number | undefined>(1);
  // const [arr, setArr] = useState<any[]>([])


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

        /*
         * Execute the actual payment from your smart contract
         */
        const payTxn = await payPortalContract.buyPay(
          message ? message : handleOnMessageChange,
          name ? name : handleOnMessageChange,
          payamount ? payamount: ethers.utils.parseEther("0.00001"),
          
          // {
          //     gasLimit: 300000,
          // },
          price ? price :  "1",

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

        let count = await payPortalContract.getTotalPay();
        console.log("Retrieved total payment count...", count.toNumber());

        setMessage("");
        setName("");
        setAmount("");        

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
      toast.error(`${"Ethereum object doesn't exist!"}`, {
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
        const payCleaned = pays.map((pay: { giver: any; timestamp: number; message: any; name: any; price: string; payamount: string; }) => {
          return {
            address: pay.giver,
            timestamp: new Date(pay.timestamp * 1000),
            message: pay.message,
            name: pay.name,
            price: parseInt(pay.price),
            payamount: parseInt(pay.payamount)
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
    let payPortalContract: ethers.Contract;
    getAllPay();
    checkIfWalletIsConnected();

    const onNewPay = (from: any, timestamp: number, message: any, name: any, price: string, payamount: string) => {
      console.log("NewPay", from, timestamp, message, name);
      setAllPay((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
          name: name,
          price: parseInt(price),
          payamount: parseInt(payamount),
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

  const handleOnMessageChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setMessage(value);
  };
  const handleOnNameChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setName(value);
  };
  const handleOnAmountChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target.value.replace(/\+|-/ig, '').replace("E", "");
    setAmount(value);
  };
  
  return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-violet-800">
        <Head>
          <title>PolyPay</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <br/>
          <h6 className="text-5xl font-bold text-black-500 mb-6">
            Pay With Matic
          </h6>
          {/*
     * If there is currentAccount render this form, else render a button to connect wallet
     */}

          {currentAccount ? (
            <div className="w-full max-w-xs sticky top-3 z-50 ">
              <form className="bg-violet-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label
                    className="block text-black-900 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Title
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black-900 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Title"
                    onChange={handleOnNameChange}
                    required />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-black-900 text-sm font-bold mb-2"
                    htmlFor="message"
                  >
                    Description
                  </label>

                  <textarea
                    className="form-textarea mt-1 block w-full shadow appearance-none py-2 px-3 border rounded text-black-900 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Description"
                    id="message"
                    onChange={handleOnMessageChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-black-900 text-sm font-bold mb-2"
                    htmlFor="amount"
                  >
                    Amount
                  </label>

                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black-900 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="number"
                    placeholder="Amount"
                    onChange={handleOnAmountChange}
                    required />
                </div>

                <div className="flex items-left justify-between">
                  <button
                    className="mx-auto bg-violet-600 hover:bg-violet-800 text-center text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
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
              className="mx-auto bg-violet-600 hover:bg-violet-900 text-white font-bold py-2 px-3 rounded-full mt-3"
              onClick={connectWallet}
            >
              Connect Your Wallet
            </button>
          )}

          
          {allPay.map((pay, index) => {
            return (
              <div className="border-l-2 mt-10" key={index}>
                <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-violet-900 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
                  {/* <!-- Dot Following the Left Vertical Line --> */}
                  <div className="w-5 h-5 bg-violet-900 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

                  {/* <!-- Line that connecting the box with the vertical line --> */}
                  <div className="w-10 h-1 bg-violet-500 absolute -left-10 z-0"></div>

                  {/* <!-- Content that showing in the box --> */}
                  <div className="flex-auto">
                    <h1 className="text-md">Name: {pay['name']}</h1>
                    <h1 className="text-md">Description: {pay['message']}</h1>
                    <h1 className="text-md">Amount: {pay['payamount']} Wei - Polygon Mumbai</h1>
                    <h1 className="text-md">LatestPrice: {pay['price']}</h1>
                    <h3>Address: {pay['address']}</h3>
                    <h1 className="text-md font-bold">
                      TimeStamp: {pay['timestamp'].toString()}
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
          pauseOnHover />
      </div>
  );
}