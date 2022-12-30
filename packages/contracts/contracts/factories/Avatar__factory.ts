/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Avatar, AvatarInterface } from "../Avatar";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
    ],
    name: "setTokenURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405260016007553480156200001657600080fd5b506040518060400160405280600681526020016520bb30ba30b960d11b8152506040518060400160405280600681526020016520ab20aa20a960d11b8152508181816000908162000068919062000127565b50600162000077828262000127565b5050505050620001f3565b634e487b7160e01b600052604160045260246000fd5b600181811c90821680620000ad57607f821691505b602082108103620000ce57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200012257600081815260208120601f850160051c81016020861015620000fd5750805b601f850160051c820191505b818110156200011e5782815560010162000109565b5050505b505050565b81516001600160401b0381111562000143576200014362000082565b6200015b8162000154845462000098565b84620000d4565b602080601f8311600181146200019357600084156200017a5750858301515b600019600386901b1c1916600185901b1785556200011e565b600085815260208120601f198616915b82811015620001c457888601518255948401946001909101908401620001a3565b5085821015620001e35787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6117d080620002036000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c80636352211e11610097578063a22cb46511610066578063a22cb46514610212578063b88d4fde14610225578063c87b56dd14610238578063e985e9c51461024b57600080fd5b80636352211e146101d15780636a627842146101e457806370a08231146101f757806395d89b411461020a57600080fd5b8063162094c4116100d3578063162094c41461018257806318160ddd1461019557806323b872dd146101ab57806342842e0e146101be57600080fd5b806301ffc9a71461010557806306fdde031461012d578063081812fc14610142578063095ea7b31461016d575b600080fd5b610118610113366004611188565b61025e565b60405190151581526020015b60405180910390f35b6101356102b0565b60405161012491906111f5565b610155610150366004611208565b610342565b6040516001600160a01b039091168152602001610124565b61018061017b36600461123d565b610369565b005b6101806101903660046112f3565b610483565b61019d6104e8565b604051908152602001610124565b6101806101b936600461134e565b6104fe565b6101806101cc36600461134e565b61052f565b6101556101df366004611208565b61054a565b61019d6101f236600461138a565b6105aa565b61019d61020536600461138a565b6105dc565b610135610662565b6101806102203660046113a5565b610671565b6101806102333660046113e1565b61067c565b610135610246366004611208565b6106b3565b61011861025936600461145d565b6107c3565b60006001600160e01b031982166380ac58cd60e01b148061028f57506001600160e01b03198216635b5e139f60e01b145b806102aa57506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060600080546102bf90611490565b80601f01602080910402602001604051908101604052809291908181526020018280546102eb90611490565b80156103385780601f1061030d57610100808354040283529160200191610338565b820191906000526020600020905b81548152906001019060200180831161031b57829003601f168201915b5050505050905090565b600061034d826107f1565b506000908152600460205260409020546001600160a01b031690565b60006103748261054a565b9050806001600160a01b0316836001600160a01b0316036103e65760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b0382161480610402575061040281336107c3565b6104745760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c00000060648201526084016103dd565b61047e8383610853565b505050565b61048e335b836108c1565b6104da5760405162461bcd60e51b815260206004820181905260248201527f43616c6c6572206973206e6f74206f776e6572206e6f7220617070726f76656460448201526064016103dd565b6104e4828261091f565b5050565b600060016007546104f991906114e0565b905090565b61050833826108c1565b6105245760405162461bcd60e51b81526004016103dd906114f3565b61047e8383836109b2565b61047e8383836040518060200160405280600081525061067c565b6000818152600260205260408120546001600160a01b0316806102aa5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016103dd565b60006105b882600754610b23565b600780549060006105c883611540565b919050555060016007546102aa91906114e0565b60006001600160a01b0382166106465760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b60648201526084016103dd565b506001600160a01b031660009081526003602052604090205490565b6060600180546102bf90611490565b6104e4338383610b3d565b61068533610488565b6106a15760405162461bcd60e51b81526004016103dd906114f3565b6106ad84848484610c0b565b50505050565b60606106be826107f1565b600082815260066020526040812080546106d790611490565b80601f016020809104026020016040519081016040528092919081815260200182805461070390611490565b80156107505780601f1061072557610100808354040283529160200191610750565b820191906000526020600020905b81548152906001019060200180831161073357829003601f168201915b50505050509050600061076e60408051602081019091526000815290565b90508051600003610780575092915050565b8151156107b257808260405160200161079a929190611559565b60405160208183030381529060405292505050919050565b6107bb84610c3e565b949350505050565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6000818152600260205260409020546001600160a01b03166108505760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b60448201526064016103dd565b50565b600081815260046020526040902080546001600160a01b0319166001600160a01b03841690811790915581906108888261054a565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000806108cd8361054a565b9050806001600160a01b0316846001600160a01b031614806108f457506108f481856107c3565b806107bb5750836001600160a01b031661090d84610342565b6001600160a01b031614949350505050565b6000828152600260205260409020546001600160a01b031661099a5760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b60648201526084016103dd565b600082815260066020526040902061047e82826115d6565b826001600160a01b03166109c58261054a565b6001600160a01b0316146109eb5760405162461bcd60e51b81526004016103dd90611696565b6001600160a01b038216610a4d5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016103dd565b610a5a8383836001610cb2565b826001600160a01b0316610a6d8261054a565b6001600160a01b031614610a935760405162461bcd60e51b81526004016103dd90611696565b600081815260046020908152604080832080546001600160a01b03199081169091556001600160a01b0387811680865260038552838620805460001901905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6104e4828260405180602001604052806000815250610d3a565b816001600160a01b0316836001600160a01b031603610b9e5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016103dd565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b610c168484846109b2565b610c2284848484610d6d565b6106ad5760405162461bcd60e51b81526004016103dd906116db565b6060610c49826107f1565b6000610c6060408051602081019091526000815290565b90506000815111610c805760405180602001604052806000815250610cab565b80610c8a84610e6e565b604051602001610c9b929190611559565b6040516020818303038152906040525b9392505050565b60018111156106ad576001600160a01b03841615610cf8576001600160a01b03841660009081526003602052604081208054839290610cf29084906114e0565b90915550505b6001600160a01b038316156106ad576001600160a01b03831660009081526003602052604081208054839290610d2f90849061172d565b909155505050505050565b610d448383610f01565b610d516000848484610d6d565b61047e5760405162461bcd60e51b81526004016103dd906116db565b60006001600160a01b0384163b15610e6357604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610db1903390899088908890600401611740565b6020604051808303816000875af1925050508015610dec575060408051601f3d908101601f19168201909252610de99181019061177d565b60015b610e49573d808015610e1a576040519150601f19603f3d011682016040523d82523d6000602084013e610e1f565b606091505b508051600003610e415760405162461bcd60e51b81526004016103dd906116db565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506107bb565b506001949350505050565b60606000610e7b8361109a565b600101905060008167ffffffffffffffff811115610e9b57610e9b611267565b6040519080825280601f01601f191660200182016040528015610ec5576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a8504945084610ecf57509392505050565b6001600160a01b038216610f575760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016103dd565b6000818152600260205260409020546001600160a01b031615610fbc5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016103dd565b610fca600083836001610cb2565b6000818152600260205260409020546001600160a01b03161561102f5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016103dd565b6001600160a01b038216600081815260036020908152604080832080546001019055848352600290915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b83106110d95772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310611105576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc10000831061112357662386f26fc10000830492506010015b6305f5e100831061113b576305f5e100830492506008015b612710831061114f57612710830492506004015b60648310611161576064830492506002015b600a83106102aa5760010192915050565b6001600160e01b03198116811461085057600080fd5b60006020828403121561119a57600080fd5b8135610cab81611172565b60005b838110156111c05781810151838201526020016111a8565b50506000910152565b600081518084526111e18160208601602086016111a5565b601f01601f19169290920160200192915050565b602081526000610cab60208301846111c9565b60006020828403121561121a57600080fd5b5035919050565b80356001600160a01b038116811461123857600080fd5b919050565b6000806040838503121561125057600080fd5b61125983611221565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff8084111561129857611298611267565b604051601f8501601f19908116603f011681019082821181831017156112c0576112c0611267565b816040528093508581528686860111156112d957600080fd5b858560208301376000602087830101525050509392505050565b6000806040838503121561130657600080fd5b82359150602083013567ffffffffffffffff81111561132457600080fd5b8301601f8101851361133557600080fd5b6113448582356020840161127d565b9150509250929050565b60008060006060848603121561136357600080fd5b61136c84611221565b925061137a60208501611221565b9150604084013590509250925092565b60006020828403121561139c57600080fd5b610cab82611221565b600080604083850312156113b857600080fd5b6113c183611221565b9150602083013580151581146113d657600080fd5b809150509250929050565b600080600080608085870312156113f757600080fd5b61140085611221565b935061140e60208601611221565b925060408501359150606085013567ffffffffffffffff81111561143157600080fd5b8501601f8101871361144257600080fd5b6114518782356020840161127d565b91505092959194509250565b6000806040838503121561147057600080fd5b61147983611221565b915061148760208401611221565b90509250929050565b600181811c908216806114a457607f821691505b6020821081036114c457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b818103818111156102aa576102aa6114ca565b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b600060018201611552576115526114ca565b5060010190565b6000835161156b8184602088016111a5565b83519083019061157f8183602088016111a5565b01949350505050565b601f82111561047e57600081815260208120601f850160051c810160208610156115af5750805b601f850160051c820191505b818110156115ce578281556001016115bb565b505050505050565b815167ffffffffffffffff8111156115f0576115f0611267565b611604816115fe8454611490565b84611588565b602080601f83116001811461163957600084156116215750858301515b600019600386901b1c1916600185901b1785556115ce565b600085815260208120601f198616915b8281101561166857888601518255948401946001909101908401611649565b50858210156116865787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b808201808211156102aa576102aa6114ca565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611773908301846111c9565b9695505050505050565b60006020828403121561178f57600080fd5b8151610cab8161117256fea2646970667358221220f3b5e2f0920649cebaac9aec725b93db09af99889ad0fe5822ead392654492e464736f6c63430008110033";

type AvatarConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AvatarConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Avatar__factory extends ContractFactory {
  constructor(...args: AvatarConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Avatar> {
    return super.deploy(overrides || {}) as Promise<Avatar>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Avatar {
    return super.attach(address) as Avatar;
  }
  override connect(signer: Signer): Avatar__factory {
    return super.connect(signer) as Avatar__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AvatarInterface {
    return new utils.Interface(_abi) as AvatarInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Avatar {
    return new Contract(address, _abi, signerOrProvider) as Avatar;
  }
}
