---
id: onboarding
title: Onboarding
---

## Flow

Onboarding a user involves the following steps:

1. The user (client) creates an account.
2. That account gets funded with native network asset (XLM) for fees, using a funding service.
3. The user activates the account for sending and receiving KIN.
4. (Optional) That account funded with KIN, using a KIN faucet service.

## Backend Services

For development and testing purposes, the Kin ecosystem test network provides the required funding services:

1. [Fee token faucet service](fee-faucet.md): Funds new account with the base reserve native token, used for transactions fees.
1. [KIN faucet service](kin-faucet.md): Funds accounts with KIN.

## Example

We'll use the [Android SDK](android.md) as an example.
Please see [iOS](ios.md) page as well for an alternative implementation.  

Please note, This example uses blocking synchronous call (asynchronous calls exists as well) and error handling is omitted for brevity, for a complete asynchronous example see [OnBoarding class](https://github.com/kinecosystem/kin-core-android/blob/dev/sample/src/main/java/kin/core/sample/OnBoarding.java).

```java
// Create a new `KinClient`with two arguments:
// an android `Context`and a `ServiceProvider`.
//
// A `ServiceProvider` provides details of how to access the Stellar horizon end point. The example below creates a `ServiceProvider` for connecting to the kin testnet network.
ServiceProvider horizonProvider =
    new ServiceProvider("https://horizon-kik.kininfrastructure.com", ServiceProvider.NETWORK_ID_TEST);
KinClient kinClient = new KinClient(context, horizonProvider);

// 1. The user (client) creates an account.
KinAccount account;
try {
    if (!kinClient.hasAccount()) {
        account = kinClient.addAccount();
    } else {
        account = kinClient.getAccount(0);
    }
} catch (CreateAccountException e) {
    e.printStackTrace();
}

// 2. That accounts gets fees, funded by a funding service.
okHttpClient.newCall(new okhttp3.Request.Builder()
    .url("http://friendbot-kik.kininfrastructure.com/?addr=" + account.getPublicAddress())
    .get()
    .build()
)
    .execute(); //handling error

// 3. The user activates the account for sending and receiving KIN.
try {
    account.activateSync();
} catch (OperationFailedException e) {
    e.printStackTrace();
}

// 4. That account gets KIN, funded by a KIN faucet service.
try {
    okHttpClient.newCall(new okhttp3.Request.Builder()
        .url("http://159.65.84.173:5000/fund?account=" + account.getPublicAddress() + "&amount=1000")
        .get()
        .build()
    )
        .execute();
} catch (IOException e) {
    e.printStackTrace();
}

//now the account is funded with kin and ready for sending and receiving kin
```
