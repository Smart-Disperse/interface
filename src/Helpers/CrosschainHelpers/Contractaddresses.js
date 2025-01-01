import SmartDisperseCrossChain from "@/artifacts/crosschain/MultipleDestinationABI.json";
import SmartDisperseCrossChainLatest from "@/artifacts/crosschain/SmartDisperseCrossChain.json";



const crossContracts = {
  11155420: {
    address: "0x45C5381B349400959900ec235527a946fcc435D4",
    description: "SMART_DISPERSE_ADDRESS_TEST_OP",
    "block-explorer": "optimism-sepolia.blockscout.com",
    Abi: SmartDisperseCrossChainLatest,
    chainDisplayName: "OP Sepolia",
    chainName: "optimismSepolia",
    APIURL: "https://api.studio.thegraph.com/query/76606/opsepolia-multichain/version/latest"
  },
  84532: {
    address: "0x45C5381B349400959900ec235527a946fcc435D4",
    description: "SMART_DISPERSE_ADDRESS_TEST_BASE",
    "block-explorer": "optimism-sepolia.blockscout.com",
    Abi: SmartDisperseCrossChainLatest,
    chainDisplayName: "Base Sepolia",
    chainName: "baseSepolia",
    APIURL: "https://api.studio.thegraph.com/query/76606/opsepolia-multichain/version/latest"
  },
  919: {
    address: "0x45C5381B349400959900ec235527a946fcc435D4",
    description: "SMART_DISPERSE_ADDRESS_TEST_ZORA",
    "block-explorer": "optimism-sepolia.blockscout.com",
    Abi: SmartDisperseCrossChainLatest,
    chainDisplayName: "Mode Sepolia",
    chainName: "modeSepolia",
    APIURL: "https://api.studio.thegraph.com/query/76606/opsepolia-multichain/version/latest"
  },
  // 11155111: {
  //   address: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
  //   description: "SMART_DISPERSE_ADDRESS_TEST_ETHEREUM_SEPOLIA",
  //   "block-explorer": "sepolia.etherscan.io",
  //   Abi: SmartDisperseCrossChainLatest,
  //   chainDisplayName: "sepolia",
  //   APIURL: "https://api.studio.thegraph.com/query/76606/sepolia-multiplechain/version/latest"
  // },
  // 11155420: {
  //   address: "0x45C5381B349400959900ec235527a946fcc435D4",
  //   description: "SMART_DISPERSE_ADDRESS_TEST_OP_SEPOLIA",
  //   "block-explorer": "optimism-sepolia.blockscout.com",
  //   Abi: SmartDisperseCrossChainLatest,
  //   chainDisplayName: "Optimism Sepolia",
  //   chainName: "opSepolia",
  //   APIURL: "https://api.studio.thegraph.com/query/76606/opsepolia-multichain/version/latest"
  // },
  // 84532: {
  //   address: "0x45C5381B349400959900ec235527a946fcc435D4",
  //   description: "SMART_DISPERSE_ADDRESS_TEST_BASE_SEPOLIA",
  //   "block-explorer": "base-sepolia.blockscout.com",
  //   Abi: SmartDisperseCrossChainLatest,
  //   chainDisplayName: "Base Sepolia",
  //   chainName: "baseSepolia",
  //   APIURL: "https://api.studio.thegraph.com/query/76606/basesepolia-multichain/version/latest"
  // },
  // 421614: {
  //   address: "0x49Ecf740b68473191569a2308Bf34a3F56CE5923",
  //   description: "SMART_DISPERSE_ADDRESS_TEST_ARBITRUM_SEPOLIA",
  //   "block-explorer": "https://sepolia.arbiscan.io",
  //   Abi: SmartDisperseCrossChainLatest,
  //   chainDisplayName: "Arbitrum Sepolia",
  //   chainName: "arbSepolia",
  //   APIURL: "https://api.studio.thegraph.com/query/76606/arbsepolia-multichain/version/latest"
  // },
  // 80002: {
  //   address: "0xB886ec515BB2BEf33508561804C144BA785b876c",
  //   description: "SMART_DISPERSE_ADDRESS_TEST_POLYGON_AMOY",
  //   "block-explorer": "https://amoy.polygonscan.com",
  //   Abi: SmartDisperseCrossChainLatest,
  //   chainDisplayName: "Polygon Amoy",
  //   chainName: "amoy",
  //   APIURL: "https://api.studio.thegraph.com/query/76606/amoy-multichain/version/latest"
  // },
  // 919: {
  //   address: "0x45C5381B349400959900ec235527a946fcc435D4",
  //   description: "SMART_DISPERSE_ADDRESS_TEST_MODE",
  //   "block-explorer": "sepolia.explorer.mode.network",
  //   Abi: SmartDisperseCrossChainLatest,
  //   chainName: "modeTestnet",
  //   chainDisplayName: "Mode Testnet",
  // },
  // 901: {
  //   address: "0x4629d4bFE3A503852faFd9e7b1c82b0283a195dD",//need to change every time
  //   description: "SMART_DISPERSE_ADDRESS_SUPERSIM_1",
  //   "block-explorer": "optimism-testnet.etherscan.io",
  //   Abi: SmartDisperseCrossChainLatest,
  //   chainDisplayName: "OPChainA",
  //   chainName: "OPChainA",
  // },
  // 902: {
  //   address: "0x4629d4bFE3A503852faFd9e7b1c82b0283a195dD",//need to change every time
  //   description: "SMART_DISPERSE_ADDRESS_SUPERSIM_2",
  //   "block-explorer": "optimism-testnet.etherscan.io",
  //   Abi: SmartDisperseCrossChainLatest,
  //   chainDisplayName: "OPChainB",
  //   chainName: "OPChainB",
  // }
};

export default crossContracts;
