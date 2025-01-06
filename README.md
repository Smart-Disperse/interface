# Smart-Disperse

Smart-Disperse is a cross-chain token dispersal solution that enables the seamless transfer of tokens between different chains using a user-friendly interface.

---

## Table of Contents

1. [Overview](#overview)  
2. [Prerequisites](#prerequisites)  
3. [Setup](#setup)  
   - [Setting Up the Interface](#setting-up-the-interface)  
4. [Additional Information](#additional-information)  

---

## Overview

This project consists of a single component:

1. **Interface**: A front-end interface for interacting with the Smart-Disperse functionality.

---

## Prerequisites

Ensure the following are installed on your system:

- [Foundry](https://book.getfoundry.sh/getting-started/installation)  
- [Supersim](https://supersim.pages.dev/)
  
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

   - **Optimism Sepolia** (Chain 9545):  
     - **RPC URL**: `http://127.0.0.1:9545`

   - **Base Sepolia** (Chain 9546):  
     - **RPC URL**: `http://127.0.0.1:9546`

   - **Mode Testnet** (Chain 9547):  
     - **RPC URL**: `http://127.0.0.1:9547`

4. **Run the Interface**:  
   Start the development server:

   ```bash
   yarn run dev
   ```

---

## Additional Information

- Keep the terminal running the Supersim node active at all times.  
- The interface provides all functionalities for token dispersal and cross-chain operations.  
- Test functionalities thoroughly to ensure smooth operation.  

---

Feel free to contribute or raise issues in the repository! 😊
```
