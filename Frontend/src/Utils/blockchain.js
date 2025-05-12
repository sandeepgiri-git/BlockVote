import { ethers } from "ethers";
import factoryABI from "../contracts/ElectionFactory.json";
import electionABI from "../contracts/Election.json";

// Replace with your deployed factory address
const FACTORY_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

export const getProvider = () => new ethers.BrowserProvider(window.ethereum);
export const getSigner = async () => (await getProvider()).getSigner();
export const getFactoryContract = async () =>
  new ethers.Contract(FACTORY_ADDRESS, factoryABI.abi, await getSigner());

export const getElectionContract = async (address) =>
  new ethers.Contract(address, electionABI.abi, await getSigner());
