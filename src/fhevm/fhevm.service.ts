import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as EncryptedERC20 from '../contracts/EncryptedERC20.json';
import * as Zama from '../contracts/Zama.json';
const { createInstance } = require("fhevmjs");

//import { clientKeyDecryptor, createInstance as createFhevmInstance, getCiphertextCallParams } from "fhevmjs";
@Injectable()
export class FhevmService {

    //EncryptedERC20 contract: 0x8Fdb26641d14a80FCCBE87BF455338Dd9C539a50
    //Zama: 0x4e142887e3Dc6e414a9b260a1034D20C9B4Eb11F

   async testFhevm() {
    const instance = await createInstance({
        chainId: 8009,
        networkUrl: "http://localhost:8545",
        gatewayUrl: "http://localhost:7077"
    })

    const contractAddress = '0xa3f4D50ebfea1237316b4377F0fff4831F2D1c46'

    const wallet = ethers.Wallet.fromPhrase("adapt mosquito move limb mobile illegal tree voyage juice mosquito burger raise father hope layer")

    const provider = new ethers.JsonRpcProvider("http://localhost:8545")

    const runner = wallet.connect(provider)
    
    const contract = new ethers.Contract(
        contractAddress,
        EncryptedERC20.abi,
        runner
      );

      await this.mintAlice(contract)

      await this.checkAliceBalance(wallet, contract, contractAddress, instance)

      await this.encryptedTransferToBob(wallet, contract, contractAddress, instance)

      await this.checkAliceBalance(wallet, contract, contractAddress, instance)

    }

    async mintAlice(contract) {
        console.log('Minting 100')
        const transaction = await contract.mint(10000);
        const t1 = await transaction.wait();
  
        console.log(t1?.status)
    }

    async encryptedTransferToBob(wallet, contract, contractAddress, instance) {
        console.log('Encrypting transfer')
        const input = instance.createEncryptedInput(contractAddress, wallet.address);
        input.add64(1337);
        const encryptedTransferAmount = input.encrypt();
        const tx = await contract["transfer(address,bytes32,bytes)"](
          '0xfCefe53c7012a075b8a711df391100d9c431c468',
          encryptedTransferAmount.handles[0],
          encryptedTransferAmount.inputProof,
        );
        const t2 = await tx.wait();
  
        console.log(t2?.status)
  
  
    }

    async checkAliceBalance(wallet, contract, contractAddress, instance) {
        console.log('Decrypting balance')
        console.log(wallet.address)
        const balanceHandleAlice = await contract.balanceOf(wallet.address);
  
        const newKeypair = instance.generateKeypair()
  
        const eip712 = instance.createEIP712(newKeypair.publicKey, contractAddress);
        const signatureAlice = await wallet.signTypedData(
          eip712.domain,
          { Reencrypt: eip712.types.Reencrypt },
          eip712.message,
        );
  
        const balanceAlice = await instance.reencrypt(
          balanceHandleAlice,
          newKeypair.privateKey,
          newKeypair.publicKey,
          signatureAlice.replace("0x", ""),
          contractAddress,
          wallet.address,
        );
  
        console.log(balanceAlice)
        console.log(typeof balanceAlice)
    }
}
