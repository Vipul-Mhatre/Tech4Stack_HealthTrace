import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import abi from '../Fake.json'
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        provider: null,
        signer: null,
        contract: null,
    });

    const [isloggedin, setIsloggedIn] = useState(false);
    const [address, setAddress] = useState(null);
    const connectWallet = async () => {
        // const contractAddress = "0x349807b7F2110d4b478A36428eA97789943E372c"; //Goerli
        const contractAddress = "0x13D66C01f5a8c7E776e72D848e72c5e8171F4a09";   //Ganache

        const contractABI = abi.abi;
        try {
            const { ethereum } = window;
            if (ethereum) {
                const account = await ethereum.request({
                    method: "eth_requestAccounts",
                });
                window.ethereum.on("chainChanged", () => {
                    window.location.reload();
                });

                window.ethereum.on("accountsChanged", () => {
                    window.location.reload();
                });
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );
                setAddress(account[0]);
                setState({ provider, signer, contract });
            } else {
                alert('Please install and log in to Metamask wallet to initiate the transaction.');
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("An error occurred while connecting to the wallet. Please try again.");
        }
    }

    return (
        <AuthContext.Provider value={{ address, state, connectWallet, isloggedin, setIsloggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
};