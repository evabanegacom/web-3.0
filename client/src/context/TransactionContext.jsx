import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
  return transactionContract;
}

export const TransactionProvider = ({ children }) => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [ transactionCount, setTransactionCount ] = useState(localStorage.getItem('transactionCount') || 0);
  const [formData, setFormData] = useState({
    amount: '',
    addressTo: '',
    keyword: '',
    message: '',
  });

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIscurrent = async () => {
    try {
      if(!ethereum) return alert('please install Metamask');
  
      const accounts = await ethereum.request({ method: 'eth_accounts'})
  
      if(accounts.length){
        setCurrentAccount(accounts[0])
      }else{
        console.log('no accounts found')
      }
  
      console.log(accounts)
    }
      
    catch (error) {
      console.log(error)
      throw new Error('no ehtereum object')
  }
}

const sendTransaction = async () => {
  try {
    if(!ethereum) return alert('please install Metamask');

    const { addressTo, amount, keyword, message } = formData;
    const transactionContract = getEthereumContract();
    const parsedAmount = ethers.utils.parseEther(amount);
    //const parsedKeyword = ethers.utils.parseBytes32String(keyword);

    await ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: currentAccount,
        to: addressTo,
        gas: '0x5208', // 2100 gwei
        value: parsedAmount._hex,
      }]
    })

    const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, keyword, message);

    
    setIsLoading(true)
    console.log(`Loading - ${transactionHash.hash}`)
    await transactionHash.wait()
    setIsLoading(false)
    console.log(`Success - ${transactionHash.hash}`)
    
    const transactionCount = await transactionContract.getTransactionCount();
    
    setTransactionCount(transactionCount.toNumber());

  } catch (error) {
    console.log(error)
    throw new Error('no ehtereum object')
  }
}

  useEffect(() => {
   checkIfWalletIscurrent()
  }, [])

  const connectWallet = async () => {
    try {
      if(!ethereum) return alert('please install Metamask');

      const accounts = await ethereum.request({ method: 'eth_requestAccounts'})

      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)

      throw new Error('no ehtereum object')
    }
      
  }
  
    return  <TransactionContext.Provider value={{ 
    connectWallet: connectWallet, 
    currentAccount: currentAccount,
    formData: formData,
    transactions: transactions,
    setFormData: setFormData,
    handleChange: handleChange,
    sendTransaction: sendTransaction
    }}>
                {children}
            </TransactionContext.Provider>
}
