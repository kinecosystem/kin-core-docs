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
1. That accounts gets fees, funded by a funding service.
1. The user activates the account for sending and receiving KIN.
1. That account gets KIN, funded by a KIN faucet service.

### Backend Services

For development and testing purposes, the Kin ecosystem test network provides the required funding services:

1. [Fee token faucet service](fee-faucet.md): Funds new account with the base reserve native token, used for transactions fees.
1. [KIN faucet service](kin-faucet.md): Funds accounts with KIN.

### Example

We'll use the [Android SDK](android.md) as an example.
Please see [iOS](ios.md) page as well for an alternative implementation.

```java
// Create a new `KinClient` with two arguments: an android `Context` and a `ServiceProvider`.
//
// A `ServiceProvider` provides details of how to access the Stellar horizon end point.
// The example below creates a `ServiceProvider` that will be used to connect to the main (production) Stellar
// network
ServiceProvider horizonProvider =
    new ServiceProvider("https://horizon-kik.kininfrastructure.com", ServiceProvider.NETWORK_ID_MAIN);
KinClient kinClient = new KinClient(context, horizonProvider);

// Create a KIN account.
KinAccount account;
try {
    if (!kinClient.hasAccount()) {
        account = kinClient.addAccount();
    }
} catch (CreateAccountException e) {
    e.printStackTrace();
}

// Calling `getAccount` with the existing account index, will retrieve the account stored on the device.
if (kinClient.hasAccount()) {
    account = kinClient.getAccount(0);
}

// A first step before an account can be used, is to create the account on Stellar blockchain,
// by a different entity (Server side) that has an account on Stellar network.
//
// The second step is to activate this account on the client side, using `activate` method.
// The account will not be able to receive or send KIN before activation.
Request<Void> activationRequest = account.activate()
activationRequest.run(new ResultCallback<Void>() {
    @Override
    public void onResult(Void result) {
        Log.d("example", "Account is activated");
    }

    @Override
    public void onError(Exception e) {
        e.printStackTrace();
    }
});

// Your account can be identified via it's public address.
// To retrieve the account public address use:
account.getPublicAddress();

// To retrieve the balance of your account in KIN call the `getBalance` method:
Request<Balance> balanceRequest = account.getBalance();
balanceRequest.run(new ResultCallback<Balance>() {

    @Override
    public void onResult(Balance result) {
        Log.d("example", "The balance is: " + result.value(2));
    }

    @Override
        public void onError(Exception e) {
            e.printStackTrace();
        }
});

// To transfer KIN to another account, you need the public address of the account you want
// to transfer the KIN to.
//
// The following code will transfer 20 KIN to account "GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO".
String toAddress = "GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO";
BigDecimal amountInKin = new BigDecimal("20");

transactionRequest = account.sendTransaction(toAddress, amountInKin);
transactionRequest.run(new ResultCallback<TransactionId>() {

    @Override
        public void onResult(TransactionId result) {
            Log.d("example", "The transaction id: " + result.toString());
        }

        @Override
        public void onError(Exception e) {
            e.printStackTrace();
        }
});

// Ongoing payments in KIN, from or to an account, can be observed
// by adding payment listener using `BlockchainEvents`:
ListenerRegistration listenerRegistration = account.blockchainEvents()
            .addPaymentListener(new EventListener<PaymentInfo>() {
                @Override
                public void onEvent(PaymentInfo payment) {
                    Log.d("example", String
                        .format("payment event, to = %s, from = %s, amount = %s", payment.sourcePublicKey(),
                            payment.destinationPublicKey(), payment.amount().toPlainString());
                }
            });
```
