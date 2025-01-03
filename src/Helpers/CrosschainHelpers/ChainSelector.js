import Base from "antd/es/typography/Base";
import { baseSepolia } from "viem/chains";

// all chains
const allchains = {
  //   11155111: {
  //     chainName: "Sepolia",
  //     destinationChains: {
  //       OptimismSepolia: {
  //         chainSelector: "5224473277236331295",
  //         tokens: {
  //           USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  //         },
  //         receiverAddress: "0x06125C0a106Cd2aBEC11Ca1Dc28804790A91325C",
  //         iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
  //       },
  //       BaseSepolia: {
  //         chainSelector: "10344971235874465080",
  //         tokens: {
  //           USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  //         },
  //         receiverAddress: "0xc8b9945C14996501212f289f57009e4e73ebD7a5",
  //         iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
  //       },
  //       ArbitrumSepolia: {
  //         chainSelector: "3478487238524512106",
  //         tokens: {
  //           USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  //         },
  //         receiverAddress: "0x49Ecf740b68473191569a2308Bf34a3F56CE5923",
  //         iconUrl:
  //     "https://gateway.lighthouse.storage/ipfs/QmVbtAexzRc2ReSWWyw2Ft7wwkKzsagqnfz3PNfxwM9NMM",
  //       },
  //       Amoy: {
  //         chainSelector: "16281711391670634445",
  //         tokens: {
  //           USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  //         },
  //         receiverAddress: "0xB886ec515BB2BEf33508561804C144BA785b876c",
  //         iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/QmUjiVLiprjXMPceS7r51XNGu277meEkhtWhvH59D2XhzR",
  //       },
  //     },
  //     chainSelector: "16015286601757825753",
  //   },

  //   11155420: {
  //     chainName: "OptimismSepolia",
  //     destinationChains: {
  //       sepolia: {
  //         chainSelector: "16015286601757825753",
  //         tokens: {
  //           USDC: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
  //         },
  //         receiverAddress: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
  //         iconUrl:
  //     "https://gateway.lighthouse.storage/ipfs/QmYAbLYRm3DCx261ko8ERjhCgWwf57jAWkxbNcibx8haBi",
  //       },
  //       BaseSepolia: {
  //         chainSelector: "10344971235874465080",
  //         tokens: {
  //           USDC: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
  //         },
  //         receiverAddress: "0xc8b9945C14996501212f289f57009e4e73ebD7a5",
  //         iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
  //       },
  //       ArbitrumSepolia: {
  //         chainSelector: "3478487238524512106",
  //         tokens: {
  //           USDC: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
  //         },
  //         receiverAddress: "0x49Ecf740b68473191569a2308Bf34a3F56CE5923",
  //         iconUrl:
  //     "https://gateway.lighthouse.storage/ipfs/QmVbtAexzRc2ReSWWyw2Ft7wwkKzsagqnfz3PNfxwM9NMM",
  //       },
  //       Amoy: {
  //         chainSelector: "16281711391670634445",
  //         tokens: {
  //           USDC: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
  //         },
  //         receiverAddress: "0xB886ec515BB2BEf33508561804C144BA785b876c",
  //         iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/QmUjiVLiprjXMPceS7r51XNGu277meEkhtWhvH59D2XhzR",
  //       },
  //     },
  //     chainSelector: "5224473277236331295",
  //   },

  //   84532: {
  //     chainName: "BaseSepolia",
  //     destinationChains: {
  //       Sepolia: {
  //         chainSelector: "16015286601757825753",
  //         tokens: {
  //           USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  //         },
  //         receiverAddress: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
  //         iconUrl:
  //     "https://gateway.lighthouse.storage/ipfs/QmYAbLYRm3DCx261ko8ERjhCgWwf57jAWkxbNcibx8haBi",
  //       },
  //       OptimismSepolia: {
  //         chainSelector: "5224473277236331295",
  //         tokens: {
  //           USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  //         },
  //         receiverAddress: "0x06125C0a106Cd2aBEC11Ca1Dc28804790A91325C",
  //         iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",

  //       },
  //       ArbitrumSepolia: {
  //         chainSelector: "3478487238524512106",
  //         tokens: {
  //           USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  //         },
  //         receiverAddress: "0x49Ecf740b68473191569a2308Bf34a3F56CE5923",
  //         iconUrl:
  //     "https://gateway.lighthouse.storage/ipfs/QmVbtAexzRc2ReSWWyw2Ft7wwkKzsagqnfz3PNfxwM9NMM",
  //       },
  //     },
  // logourl:"",
  // chainSelector: "10344971235874465080",
  //   },

  //   421614: {
  //     chainName: "ArbitrumSepolia",
  //     destinationChains: {
  //       sepolia: {
  //         chainSelector: "16015286601757825753",
  //         tokens: {
  //           USDC: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  //         },
  //         receiverAddress: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
  //         iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/Qmef99zfw3Wgz6E6c3hN1mypsorGDd4DdcJc6MsvWDdnAD",
  //       },
  //       OptimismSepolia: {
  //         chainSelector: "5224473277236331295",
  //         tokens: {
  //           USDC: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  //         },
  //         receiverAddress: "0x06125C0a106Cd2aBEC11Ca1Dc28804790A91325C",
  //         iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
  //       },
  //       BaseSepolia: {
  //         chainSelector: "10344971235874465080",
  //         tokens: {
  //           USDC: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  //         },
  //         receiverAddress: "0xc8b9945C14996501212f289f57009e4e73ebD7a5",
  //         iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
  //       },
  //     },
  //     chainSelector: "3478487238524512106",
  //   },

  //   80002: {
  //     chainName: "Amoy",
  //     destinationChains: {
  //       sepolia: {
  //         chainSelector: "16015286601757825753",
  //         tokens: {
  //           USDC: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
  //         },
  //         receiverAddress: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
  //         iconUrl:
  //     "https://gateway.lighthouse.storage/ipfs/QmYAbLYRm3DCx261ko8ERjhCgWwf57jAWkxbNcibx8haBi",
  //       },
  //       OptimismSepolia: {
  //         chainSelector: "5224473277236331295",
  //         tokens: {
  //           USDC: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
  //         },
  //         receiverAddress: "0x06125C0a106Cd2aBEC11Ca1Dc28804790A91325C",
  //         iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
  //       },
  //     },
  //     chainSelector: "16281711391670634445",
  //   },
  // 901: {
  //   chainName: "OPChainA",
  //   destinationChains: {
  //     OPChainB: {
  //       chainID: 902,
  //       // chainSelector: "",
  //       tokens: {
  //         WETH: "0x4200000000000000000000000000000000000024",
  //         ETH: "ETH",
  //       },
  //       // receiverAddress: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
  //       iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
  //     }
  //   },
  //   chainSelector: "16281711391670634445",
  // },
  // 902: {
  //   chainName: "OPChainB",
  //   destinationChains: {
  //     OPChainA: {
  //       chainID: 901,
  //       // chainSelector: "",
  //       tokens: {
  //         WETH: "0x4200000000000000000000000000000000000024",
  //         ETH: "ETH",
  //       },
  //       // receiverAddress: "0x568ABafeCaB14144D63357D694d9c3155F6e8b3b",
  //       iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
  //     }
  //   },
  //   chainSelector: "16281711391670634445",
  // },



  // 10: {
  //   chainName: "optimism",
  //   chainId: "10",
  //   destinationChains: {
  //     Base: {
  //       chainId: "8453",
  //       tokens: {
  //         SuperChainWETH: "0x4200000000000000000000000000000000000024",
  //         ETH: "ETH",
  //       },
  //       receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
  //       iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
  //     },
  //     Zora: {
  //       chainId: "7777777",
  //       tokens: {
  //         SuperChainWETH: "0x4200000000000000000000000000000000000024",
  //         ETH: "ETH",
  //       },
  //       receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
  //       iconUrl: "https://zora.co/favicon.ico",
  //     },
  //   },
  // },

  // 8453: {
  //   chainName: "Base",
  //   chainId: "8453",
  //   destinationChains: {
  //     optimism: {
  //       chainId: "10",
  //       tokens: {
  //         SuperChainWETH: "0x4200000000000000000000000000000000000024",
  //         ETH: "ETH",
  //       },
  //       receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
  //       iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
  //     },
  //     Zora: {
  //       chainId: "7777777",
  //       tokens: {
  //         SuperChainWETH: "0x4200000000000000000000000000000000000024",
  //         ETH: "ETH",
  //       },
  //       receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
  //       iconUrl: "https://zora.co/favicon.ico",
  //     },
  //   },
  // },

  // 7777777: {
  //   chainName: "Zora",
  //   chainId: "7777777",
  //   destinationChains: {
  //     Base: {
  //       chainId: "8453",
  //       tokens: {
  //         SuperChainWETH: "0x4200000000000000000000000000000000000024",
  //         ETH: "ETH",
  //       },
  //       receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
  //       iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
  //     },
  //     optimism: {
  //       chainId: "10",
  //       tokens: {
  //         SuperChainWETH: "0x4200000000000000000000000000000000000024",
  //         ETH: "ETH",
  //       },
  //       receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
  //       iconUrl:
  //         "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
  //     },
  //   },
  // },

  11155420: {
    chainName: "optimismSepolia",
    chainId: "11155420",
    destinationChains: {
      baseSepolia: {
        chainId: "84532",
        tokens: {
          SuperChainWETH: "0x4200000000000000000000000000000000000024",
          ETH: "ETH",
        },
        receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
        iconUrl:
          "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
      },
      modeSepolia: {
        chainId: "919",
        tokens: {
          SuperChainWETH: "0x4200000000000000000000000000000000000024",
          ETH: "ETH",
        },
        receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
        iconUrl: "https://zora.co/favicon.ico",
      },
    },
  },

  84532: {
    chainName: "baseSepolia",
    chainId: "84532",
    destinationChains: {
      optimismSepolia: {
        chainId: "11155420",
        tokens: {
          SuperChainWETH: "0x4200000000000000000000000000000000000024",
          ETH: "ETH",
        },
        receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
        iconUrl:
          "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
      },
      modeSepolia: {
        chainId: "919",
        tokens: {
          SuperChainWETH: "0x4200000000000000000000000000000000000024",
          ETH: "ETH",
        },
        receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
        iconUrl: "https://zora.co/favicon.ico",
      },
    },
  },

  919: {
    chainName: "modeSepolia",
    chainId: "919",
    destinationChains: {
      baseSepolia: {
        chainId: "84532",
        tokens: {
          SuperChainWETH: "0x4200000000000000000000000000000000000024",
          ETH: "ETH",
        },
        receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
        iconUrl:
          "https://gateway.lighthouse.storage/ipfs/Qmbkmfi3tUYA1a4cxmGQqhnLzim3RV9QqjpeN77eouLdyu",
      },
      optimismSepolia: {
        chainId: "11155420",
        tokens: {
          SuperChainWETH: "0x4200000000000000000000000000000000000024",
          ETH: "ETH",
        },
        receiverAddress: "0x45C5381B349400959900ec235527a946fcc435D4",
        iconUrl:
          "https://gateway.lighthouse.storage/ipfs/QmZ98kd2LkSySUCydJAjBQzaEpt6aLJYT4WSgahVb9aQJU",
      },
    },
  },
};

export default allchains;
