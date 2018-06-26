# Android

## Add Kin Core SDK to your project

Add this to your module's `build.gradle` file.

```gradle
repositories {
    ...
    maven {
        url 'https://jitpack.io'
    }
}
...
dependencies {
    ...

    compile "com.github.kinecosystem:kin-core-android:<latest release>"
}
```

For latest release version go to [https://github.com/kinecosystem/kin-core-android/releases](https://github.com/kinecosystem/kin-core-android/releases).

The main repository is at [github.com/kinecosystem/kin-core-android](https://github.com/kinecosystem/kin-core-android).

## Get Started

### Connecting to a service provider

Create a new `KinClient` with two arguments: an android `Context` and a `ServiceProvider`, optional third parameter is `storeKey` which can be used to create a multiple accounts data set, each different `storeKey` will have a separate data, an example use-case - store multiple users accounts separately.

A `ServiceProvider` provides details of how to access the Stellar horizon end point.
The example below creates a `ServiceProvider` that will be used to connect to the kin test network:

```java
ServiceProvider horizonProvider =  
    new ServiceProvider("https://horizon-kik.kininfrastructure.com", ServiceProvider.NETWORK_ID_TEST);
KinClient kinClient = new KinClient(context, horizonProvider, "user1");
```

### Creating and retrieving a KIN account

The first time you use `KinClient` you need to create a new account, 
the details of the created account will be securely stored on the device.
Multiple accounts can be created using `addAccount`.

```java
KinAccount account;
try {
    if (!kinClient.hasAccount()) {
        account = kinClient.addAccount();
    }
} catch (CreateAccountException e) {
    e.printStackTrace();
}
```

Calling `getAccount` with the existing account index, will retrieve the account stored on the device.

```java
if (kinClient.hasAccount()) {
    account = kinClient.getAccount(0);
}
```

You can delete your account from the device using `deleteAccount`, 
but beware! you will lose all your existing KIN if you do this.

```java
kinClient.deleteAccount(int index);
```

## Onboarding

Before an account can be used on the configured network, it must be funded with the native network asset,
This step must be performed by a service, see [Fee token faucet service](fee-faucet.md).

The second step is to activate this account on the client side, using `activate` method. The account will not be able to receive or send KIN before activation.

```java
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
```

For more details see [Onboarding](onboarding.md), also take a look at Sample App [OnBoarding](https://github.com/kinecosystem/kin-core-android/blob/dev/sample/src/main/java/kin/core/sample/OnBoarding.java) class for a complete example.

## Account Information

### Public Address

Your account can be identified via it's public address. To retrieve the account public address use:

```java
account.getPublicAddress();
```

### Query Account Status

Current account status on the blockchain can be queried using `getStatus` method,
status will be one of the following 3 options:

* `AccountStatus.NOT_CREATED` - Account is not created (funded with native asset) on the network.
* `AccountStatus.NOT_ACTIVATED` - Account was created but not activated yet, the account cannot send or receive KIN yet.
* `AccountStatus.ACTIVATED` - Account was created and activated, account can send and receive KIN.

```java
Request<Integer> statusRequest = account.getStatus();
statusRequest.run(new ResultCallback<Integer>() {
    @Override
    public void onResult(Integer result) {
        switch (result) {
            case AccountStatus.ACTIVATED:
                //you're good to go!!!
                break;
            case AccountStatus.NOT_ACTIVATED:
                //activate account using account.activate() for sending/receiving KIN
                break;
            case AccountStatus.NOT_CREATED:
                //first create an account on the blockchain, second activate the account using account.activate()
                break;
        }
    }

    @Override
    public void onError(Exception e) {

    }
});
```

### Retrieving Balance

To retrieve the balance of your account in KIN call the `getBalance` method: 

```java
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
```

## Transactions

### Transferring KIN to another account

To transfer KIN to another account, you need the public address of the account you want to transfer the KIN to.

The following code will transfer 20 KIN to account "GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO".

```java
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
```

#### Memo

Arbitrary data can be added to a transfer operation using the memo parameter,
the memo can contain a utf-8 string up to 28 bytes in length. A typical usage is to include an order number that a service can use to verify payment.

```java
String memo = "arbitrary data";
transactionRequest = account.sendTransaction(toAddress, amountInKin, memo);
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
```

## Account Listeners

### Listening to payments

Ongoing payments in KIN, from or to an account, can be observed,
by adding payment listener using `BlockchainEvents`:

```java
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

### Listening to balance changes

Account balance changes, can be observed by adding balance listener using `BlockchainEvents`:

```java
ListenerRegistration listenerRegistration = account.blockchainEvents()
            .addBalanceListener(new EventListener<Balance>() {
                @Override
                public void onEvent(Balance balance) {
                    Log.d("example", "balance event, new balance is = " + balance.value().toPlainString());
                }
            });
```

### Listening to account creation

Account creation on the blockchain network, can be observed, by adding create account listener using `BlockchainEvents`:

```java
ListenerRegistration listenerRegistration = account.blockchainEvents()
            .addAccountCreationListener(new EventListener<Void>() {
                @Override
                public void onEvent(Void result) {
                    Log.d("example", "Account has created.);
                }
            });
```

For unregister any listener use `listenerRegistration.remove()` method.

## Sync vs Async

Asynchronous requests are supported by our `Request` object. The `request.run()` method will perform the requests sequentially on a single background thread and notify success/failure using `ResultCallback` on the android main thread.
In addition, `cancel(boolean)` method can be used to safely cancel requests and detach callbacks.

A synchronous version (with the 'Sync' suffix) of these methods is also provided, as SDK requests performs network IO operations, make sure you call them in a background thread.

```java
try {
    Balance balance = account.getBalanceSync();
} catch (OperationFailedException e) {
   // something went wrong - check the exception message
}

try {
    TransactionId transactionId = account.sendTransactionSync(toAddress, amountInKin);
} catch (OperationFailedException e){
    // something else went wrong - check the exception message
}
```

## Error Handling

`kin-core` wraps errors with exceptions, synchronous methods can throw exceptions and asynchronous requests has `onError(Exception e)` callback.

### Common Errors

`AccountNotFoundException` - Account is not created (funded with native asset) on the network.  
`AccountNotActivatedException` - Account was created but not activated yet, the account cannot send or receive KIN yet.  
`InsufficientKinException` - Account has not enough kin funds to perform the transaction.

## Sample Application

![Sample App](../.github/android_sample_app_screenshot.png)

Sample app covers the entire functionality of `kin-core`, and serves as a detailed example on how to use the library.  
Sample app source code can be found [here](https://github.com/kinecosystem/kin-core-android/tree/dev/sample/).

## Building from Source

Clone the repo:

```bash
$ git clone https://github.com/kinecosystem/kin-core-android.git
```

Next, initialize and update git submodules:

```bash
$ git submodule init && git submodule update
```

Now you can build the library using gradle, or open the project using Android Studio.

### Tests

Both Unit tests and instrumentation tests are provided, Android tests include integration tests that run on a remote test network, these tests are marked as `@LargeTest`, because they are time consuming, and depends on the network.

### Running Tests

For running both unit tests and instrumentation tests and generating a code coverage report using Jacoco, use `jacocoTestReport` task
```bash
$ ./gradlew jacocoTestReport
```

Running tests without integration tests

```bash
$ ./gradlew jacocoTestReport  -Pandroid.testInstrumentationRunnerArguments.notClass=kin.core.KinAccountIntegrationTest
```

Generated report can be found at:  
`kin-core/build/reports/jacoco/jacocoTestReport/html/index.html`.
