import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers } from "ethers";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [ens, setENS] = useState("");
  const [address, setAddress] = useState("");
  const web3ModalRef = useRef();

  const setENSOrAddress = async (address, web3Provider) => {
    const _ens = await web3Provider.lookupAddress(address);
    if (_ens) {
      setAddress(address);
      setENS(_ens);
    } else {
      setAddress(address);
    }
  };

  const getProvider = async () => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    await setENSOrAddress(address, web3Provider);
  };

  const connectWallet = async () => {
    try {
      await getProvider();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet connected</div>;
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name='description' content='ENS-Dapp' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Here is your address and ENS (if you have so):
          </h1>
          <div className={styles.description}>
            Address: {address ? address : "nothing here"}
          </div>
          <div className={styles.description}>ENS: {ens ? ens : "nope"}</div>
          {renderButton()}
        </div>
        <div className={styles.container}>
          <img className={styles.image} src='./learnweb3punks.png' />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by IamGalexing
      </footer>
    </div>
  );
}
