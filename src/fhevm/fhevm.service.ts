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

    const contractAddress = '0x8Fdb26641d14a80FCCBE87BF455338Dd9C539a50'

    console.log(instance)

    const wallet = ethers.Wallet.fromPhrase("adapt mosquito move limb mobile illegal tree voyage juice mosquito burger raise father hope layer")

    const provider = new ethers.JsonRpcProvider("http://localhost:8545")

    const runner = wallet.connect(provider)
    
    const contract = new ethers.Contract(
        contractAddress,
        EncryptedERC20.abi,
        runner
      );

    //   console.log('Minting 100')
    //   const transaction = await contract.mint(10000);
    //   const t1 = await transaction.wait();

    //   console.log(t1?.status)

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


    //   console.log('Decrypting bob balance')
    //   const balanceHandleBob = await contract.balanceOf(wallet.address);

    //   const bobKeypair = instance.generateKeypair()

    //   const eip712b = instance.createEIP712(bobKeypair.publicKey, contractAddress);
    //   const signatureBob = await wallet.signTypedData(
    //     eip712b.domain,
    //     { Reencrypt: eip712b.types.Reencrypt },
    //     eip712b.message,
    //   );

    //   const balanceBob = await instance.reencrypt(
    //     balanceHandleBob,
    //     bobKeypair.privateKey,
    //     bobKeypair.publicKey,
    //     signatureBob.replace("0x", ""),
    //     contractAddress,
    //     '0xfCefe53c7012a075b8a711df391100d9c431c468',
    //   );

    //   console.log(balanceBob)
    }

    // const input = instance.createEncryptedInput("0x4e142887e3Dc6e414a9b260a1034D20C9B4Eb11F", "0xa5e1defb98EFe38EBb2D958CEe052410247F4c80")
    
    // input.add4(2)
    // const count = input.encrypt()

    // console.log(count.handles[0])
    // console.log(count.inputProof)

    // const tx = await contract["add(bytes32,bytes)"](
    //     count.handles[0],
    //     count.inputProof,
    //   );
    //   const t2 = await tx.wait();

    //   console.log(t2.transactionHash)



//    const x = await contract.add(count.handles[0], count.inputProof, 
//     {
//     gasLimit: 5000000,
//    })

//    console.log(x.hash)

//    const tx = await provider.getTransactionReceipt("0xcb88d56bcd1f179f6c09ab537b79ba2edb32174b6844c95b2fb42f50221a1820")

//    console.log(tx)

    //contract.transfer("0xfCefe53c7012a075b8a711df391100d9c431c468", inputs[0], data)


    }
