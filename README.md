# Smart-Disperse

Smart-Disperse is a cross-chain token dispersal solution that enables the seamless transfer of tokens between different chains using a user-friendly interface.

---

## Table of Contents

1. [Overview](#overview)   
2. [Setup](#setup)  
   - [Setting Up the Interface](#setting-up-the-interface)  
3. [Additional Information](#additional-information)  

---

## Overview

This project consists of a single component:

1. **Interface**: A front-end interface for interacting with the Smart-Disperse functionality.

---

## Setup

### Cloning the Repository

Start by cloning the interface repository:

```bash
git clone https://github.com/Smart-Disperse/interface
```

---

### Setting Up the Interface

1. **Install Dependencies**:  
   Navigate to the `interface` directory and run:

   ```bash
   yarn install
   ```

2. **Run Supersim with Testnet Forks**:  
   Run the following command in the terminal:

   ```bash
   supersim fork --network=sepolia --chains=op,base,mode --interop.autorelay
   ```

3. **Set RPC URLs in Metamask**:  
   Add the following RPC URLs in your Metamask wallet:

   - **Optimism Sepolia** (Chain 11155420):  
     - **RPC URL**: `https://superchain.smartdisperse.xyz/op`

   - **Base Sepolia** (Chain 84532):  
     - **RPC URL**: `https://superchain.smartdisperse.xyz/base`

   - **Mode Testnet** (Chain 919):  
     - **RPC URL**: `https://superchain.smartdisperse.xyz/mode`
       
4. **Run the Interface**:  
   Start the development server:

   ```bash
   yarn run dev
   ```

---

## Additional Information
 
- The interface provides all functionalities for token dispersal and cross-chain operations.  
- Test functionalities thoroughly to ensure smooth operation.  

---

Feel free to contribute or raise issues in the repository! 😊
