import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import SimpleStorageContract from './contracts/SimpleStorage.json';

const SimpleStorage = () => {
    const [storageValue, setStorageValue] = useState("0");
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const init = async () => {
            const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SimpleStorageContract.networks[networkId];
            const instance = new web3.eth.Contract(
                SimpleStorageContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            setWeb3(web3);
            setAccounts(accounts);
            setContract(instance);
        };
        init();
    }, []);

    const handleSet = async () => {
        const gas = await contract.methods.set(42).estimateGas({ from: accounts[0] });
        const gasPrice = await web3.eth.getGasPrice();

        await contract.methods.set(42).send({ 
            from: accounts[0],
            gas: gas,
            gasPrice: gasPrice
        });

        const response = await contract.methods.get().call();
        console.log("Stored value from contract:", response); // Debug log
        setStorageValue(response.toString());
    };

    return (
        <div>
            <h1>Simple Storage</h1>
            <button onClick={handleSet}>Set Value</button>
            <p>The stored value is: {storageValue}</p>
        </div>
    );
};

export default SimpleStorage;