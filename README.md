# Smart-Disperse

Smart-Disperse is a cross-chain token dispersal solution that enables the seamless transfer of tokens between different chains using custom interoperability contracts and a user-friendly interface.

---

## Table of Contents

1. [Overview](#overview)  
2. [Prerequisites](#prerequisites)  
3. [Setup](#setup)  
   - [Setting Up Interop Contracts](#setting-up-interop-contracts)  
   - [Setting Up the Interface](#setting-up-the-interface)  
4. [Testing and Using the Application](#testing-and-using-the-application)  
5. [Additional Information](#additional-information)  

---

## Overview

This project consists of two components:

1. **Interop Contracts**: Smart contracts enabling cross-chain operations.  
2. **Interface**: A front-end interface for interacting with the Smart-Disperse contracts.

---

## Prerequisites

Ensure the following are installed on your system:

- [Foundry](https://book.getfoundry.sh/getting-started/installation)  
- [Supersim](https://supersim-docs-link-here) (Replace this with the correct documentation link for Supersim.)

---

## Setup

### Cloning the Repositories

Start by cloning both repositories:

```bash
git clone https://github.com/Smart-Disperse/Interop-contracts
git clone https://github.com/Smart-Disperse/interface
```

---

### Setting Up Interop Contracts

1. **Install Foundry and Supersim**:  
   - Follow the respective documentation to install Foundry and Supersim.

2. **Install Dependencies**:  
   Navigate to the `Interop-contracts` directory and run:  

   ```bash
   forge install
   ```

3. **Run Supersim**:  
   Open a new terminal, navigate to the project directory, and run:

   ```bash
   supersim --interop.autorelay
   ```

4. **Set Environment Variables**:  
   - Copy `.env-example` to `.env`.  
   - Modify the `.env` file with your configurations.

   Source the environment variables:

   ```bash
   source .env
   ```

5. **Deploy the Contracts**:  
   Deploy contracts to the respective chains:

   ```bash
   forge script script/deploy.s.sol --sig "deploy(string)" "OP1" --broadcast
   forge script script/deploy.s.sol --sig "deploy(string)" "OP2" --broadcast
   ```

   Copy the contract addresses generated during deployment and save them for later use. Do **not** close the terminal running the Supersim node.

---

### Setting Up the Interface

1. **Install Dependencies**:  
   Navigate to the `interface` directory and run:

   ```bash
   npm install
   ```

2. **Update Contract Addresses**:  
   Open `src/Helpers/CrosschainHelpers/Contractaddresses.js` and verify the addresses for chains `901` and `902`. Update the addresses if necessary.

3. **Run the Interface**:  
   Start the development server:

   ```bash
   npm run dev
   ```

4. **Set RPC URLs in Metamask**:  
   Add the following RPC URLs in your Metamask wallet:

   - Chain 901:  
     - **RPC URL**: `http://127.0.0.1:9545`  
     - **Chain ID**: `901`

   - Chain 902:  
     - **RPC URL**: `http://127.0.0.1:9546`  
     - **Chain ID**: `902`

---

## Testing and Using the Application

1. **WETH Token Setup**:  
   Import WETH into Metamask using the following address:  

   ```text
   0x4200000000000000000000000000000000000024
   ```

2. **Token Transfer Across Chains**:  
   When ETH is transferred cross-chain, WETH will be sent to the recipient on the destination chain.

3. **Mint WETH**:  
   To mint WETH to a specific address, set the private key of the desired address in your `.env` file and run:

   ```bash
   forge script script/MintWeth.s.sol --sig "mintWeth(string)" "OP1" --broadcast
   ```

   Replace `"OP1"` with `"OP2"` based on the target chain.

---

## Additional Information

- Keep the terminal running the Supersim node active at all times.  
- The interface provides all functionalities for token dispersal and cross-chain operations.  
- Test functionalities thoroughly to ensure smooth operation.  

---

Feel free to contribute or raise issues in the respective repositories! 😊
