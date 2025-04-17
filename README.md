# Web3 Express Server Suite

This repository contains three independent **Web3 Express Server** projects that interact with Ethereum smart contracts deployed on the **Sepolia** test network. Each project exposes a set of RESTful APIs for interacting with a specific smart contract via Web3.js, with Swagger UI support for easy exploration.

## Projects Overview

### 📁 `web3-express-server-PoE_v5`

APIs for **Proof of Existence v5** — basic document notarization and verification on the blockchain.

### 📁 `web3-express-server-PoE_v9`

APIs for **Proof of Existence v9** — extended version with additional endpoints for cancellation, history tracking, and verification of document hashes.

### 📁 `web3-express-server-MDN`

APIs for **Monitoring Data Notarization** — designed to notarize real-time monitoring data in time slot with automatic timestamps and verifiable hash records.

---

## 🔧 Setup Instructions

Each project can be run independently. Follow these steps for each one:

### 1. Navigate to the project folder

```bash
cd web3-express-server-PoE_v5   # or web3-express-server-PoE_v9 / web3-express-server-MDN
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

In the root of the selected project folder, create a `.env` file and populate it with the following configuration:

```env
PUBLIC_KEY=<YOUR-PUBLIC-KEY>
PRIVATE_KEY=<YOUR-PRIVATE-KEY>
BLOCKCHAIN_URL="https://ethereum-sepolia-rpc.publicnode.com"
SMARTCONTRACTADDRESS=<SMART-CONTRACT-ADDRESS>
CHAINID=11155111
PORT=3000
```

> 📌 **Note:** Use the appropriate contract address depending on the project you're running (see below).

### 4. Start the server

```bash
npm start
```

---

## 🌐 Swagger API Documentation

Once the server is running, you can access the API documentation via Swagger UI at:

```
http://localhost:<PORT>/api-docs
```

Replace `<PORT>` with the port number defined in your `.env` file.

---

## 📜 Deployed Smart Contract Addresses (Sepolia)

| Project                            | Smart Contract Address                       |
| ---------------------------------- | -------------------------------------------- |
| PoE v5                             | `0xa4fede92DD5c7290720f8e5f154780C4ba093fE0` |
| PoE v9                             | `0xd2b4be223d92788706284f7f097fa883eef64977` |
| Monitoring Data Notarization (MDN) | `0xc3704D07b1F3E09De8226F6596abb98B4dA7ed44` |

---

## 📂 Folder Structure

Each project folder contains:

- `ProofOfExistenceAPI.js` / `MonitoringDataNotarizationAPI.js` — Main entry point (Express server)
- `build/contracts/` — Compiled contract ABI and metadata
- `poeAPI_utils.js` / `mdnAPI_utils.js` — Utility functions for smart contract interaction
- `swagger.json` — Swagger API schema for Swagger UI
- `.env` — Environment variables (must be created by the user)

---

## Postman Collection

A Postman collection file is available: `PoE-MDN-APIs.postman_collection.json`.  
It contains all the API calls for the three services (`PoE_v5`, `PoE_v9`, and `MDN`) and is ready to be used for testing and development purposes.

---

## 🧱 Requirements

- Node.js (v20 or higher recommended)
- npm (v10 or higher)
- Valid public/private key pair for signing transactions
- Sepolia testnet ETH (for gas fees)

---

## 💬 Support

For any questions or support, feel free to open an issue or contact the maintainer.

---

## 📘 License

This project is licensed under the MIT License.

---

## Security Notice

⚠️ Please use the API servers conscientiously.  
These servers require the use of a private wallet key, and therefore should be deployed and used in secure and protected environments only.  
Avoid exposing your `.env` file or using unsecured servers in production environments.
