# Getting Started

A service (e.g. a mobile app) that adds support for the KIN cryptocurrency needs to do a few things:

1. Onboarding users:
    1. Deploy oboarding backend services, responsible for account creation.
    1. Integrate client SDK so users could create a KIN account.
1. Day-to-day:
    1. Deploy KIN API backend service, responsible for day-to-day actions e.g. emitting transactions, fetching account balance, etc.

## KIN on Stellar

KIN is a token on the Stellar network, also called a "Stellar asset".
Transactions involving KIN are transmitted on the Stellar network,
with fees paid in Stellar native asset, also called XLM or "Stellar Lumens".

The Kin Ecosystem provides a test network for development and testing purposes.
The test network comes "batteries-included" with all services required for building KIN applications at no-cost,
most importantly free funding services.

Note these services are not available on a production network
i.e. "main net". Funding costs real world money, and digital services joining the Kin Ecosystem
need to fund their users with KIN and XLM on their own.

## Stellar Network

Stellar is a blockchain network, whose main advantages are:

1. Fast block times
1. Predictable fees
1. Low network congestion

These properties provides KIN the ability to scale far beyond the performance of current blockchain leaders
such as Bitcoin and Ethereum.

However, even on Stellar executing simple actions is not a very friendly process. This is the case with all blockchains:

1. Creating an account requires generating and storing a cryptographic seed in a secure manner.
1. Sending transactions is complex for non-crypto-savvy people, involving signing, encoding, and emitting objects on the network.
1. Account funding and fee management requires non-trivial monitoring.
1. Working with tokens i.e. non-native cryptocurrency requires extra work.

As mentioned, our SDKs attempt to handle and abstract all of the above (and more) from app and backend developers,
allowing them to focus on what's important - their product.

Please see [Stellar's development guide](https://www.stellar.org/developers/guides/) for more information on Stellar internals.
Note that this knowledge is not required for you to start working with KIN on the blockchain.

## Onboarding

### Flow

Onboarding a user involves the following steps:

1. The user (client) creates an account.
1. That accounts gets funded by a funding service.
1. The user activates the account for sending and receiving KIN.

### Backend Services

For development and testing purposes, the Kin ecosystem test network provides the required funding services:

1. [Fee token faucet service](fee-faucet.md): Funds new account with the base reserve native token, used for transactions fees.
1. [KIN faucet service](kin-faucet.md): Funds accounts with KIN.

### Client Integration

Please see [Android](android.md), [iOS](ios.md), and [Python](python.md) pages on client integration.
