# [PolyPay](https://github.com/Miss-Faith/polypay)
#### By [Faith Mwangi](https://github.com/miss-faith)
### Description
A web3 application that allows for Matic payments. Intergrate to your online stores or cash collection platforms to allow clients to intergrate with their wallets and send matic payments


## Site
[PolyPay]() - Pending deployment
### Setup Requirements


##Developer
## Prerequisites
**Initializing npm**

```bash
$npm init -y
```
**Installing and initializing hardhat**

```bash
$npm install --save-dev hardhat
```
```bash

$npx hardhat
```

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

In the contracts folder, delete greeter.sol/lock.sol, update deploy.js file with current code. In the test folder, delete test files/greeter.sol/lock.sol). Create and update sol files under contracts and js files in scripts.

Install the dotenv file that will hold your alchemy key and private key
```bash
$npx install -D dotenv
```

To start node and allow for deployment, run:
```bash
$npx hardhat node
```
Leave the node running and open a new terminal. To deploy on localhost network, run:
```bash
$npx hardhat run scripts/deploy.js --network localhost
```

To deploy on a test network, run:
```bash
$npx hardhat run scripts/deploy.js --network mumbai
```

To create your own react front-end with tailwind run the following code
```bash
$npx create-next-app -e with-tailwindcss
```
```bash
$cd appname
```
Install ethers
```bash
$npm install ethers react-toastify
```
Install dom
```bash
$npm install -S react-router-dom
```
To start the dom, run:
```bash
$npm run dev //development mode
$npm run build 
$npm run start //runs build app in production mode
```

**Cloning**
Fork the repository and Git clone to your local machine. Access the file and run the program on the code editor, ubuntu, mac or windows terminal.

```bash
$git clone https://github.com/user-name/polypay/
$cd polypay
```

Install npm dependencies and run app

## Technology Used
### Frameworks
* Solidity
* React
* Javascript
* Chainlink
* Alchemy

## Future Developments
Update chainlink to fetch usd/matic payments and make payments using the current rates.


## Development
### Want to contribute? Great!
To fix a bug or enhance an existing module, follow these steps:
* Fork the repo
* Create a new branch ('git checkout -b improve-feature')
* Make the appropriate changes in the files
* Add changes to reflect the changes made
* Commit your changes ('git commit -am 'Improve feature')
* Push to the branch ('git push origin improve-feature')
* Create a Pull Request
### Bug / Feature Request
If you find a bug/error, kindly open an issue [here](https://github.com/miss-faith/polypay/issues/new)
Include your search query and the expected result.

If you'd like to request a new function, feel free to do so by opening an issue [here](https://github.com/miss-faith/polypay/issues/new)
Include sample queries and their corresponding results.
## To-Do
Future update to include a data base that stores information accessible when the application is closed and re-opened
## Contact information
[Faith Mwangi](https://github.com/miss-faith)

[Email](faithmissw@gmail.com)
## License
MIT License
Copyright (c) 2022 **Faith Mwangi**
