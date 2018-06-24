# iOS

This library is responsible for creating a new Kin account and managing balance and transactions in Kin.

The main repository is at [github.com/kinecosystem/kin-core-ios](https://github.com/kinecosystem/kin-core-ios).

## Installation

### CocoaPods

Add the following to your `Podfile`.

```
pod 'KinSDK'
```

### Sub-project

1. Clone this repo (as a submodule or in a different directory, it's up to you).

```
git clone --recursive https://github.com/kinfoundation/kin-core-ios
```

2. Drag `KinSDK.xcodeproj` as a subproject.
3. In your main `.xcodeproj` file, select the desired target(s).
4. Go to **Build Phases**, expand Target Dependencies, and add `KinSDK`.
5. In Swift, `import KinSDK` and you are good to go! (We haven't yet tested Objective-C.)

This is how we did the Sample App - you might look at the setup for a concrete example.

## Getting Started

### Connecting to the Network

Create an instance of `KinClient`, providing the URL of the network entry-point, and the ID of the network.

```swift
let url = URL(string: "https://horizon-kik.kininfrastructure.com")
let kinClient = try? KinClient(with: url!, networkId: .mainNet)
```

### Creating and retrieving instances of `KinAccount`

On first use, an account must be created to send and receive KIN.  Account details are stored in the Keychain.  Multiple accounts may be created.

```swift
let account = try kinClient.accounts.first ?? kinClient.addAccount()
```

To retrieve a specific account:


```swift
let account = kinClient.accounts[1]
```

An account may be deleted.  **WARNING:** deleting an account will prevent access to any KIN the account holds.  Deleting an account does **not** prevent the account from receiving additional KIN.

```swift
kinClient.deleteAccount(at: 0)
```

## Onboarding

Before an account can be used on the configured network, it must be funded with the native network currency.
This step must be performed by a service, such as the [Native Asset Faucet Service](fee-faucet.md).

For a complete example of this process, take a look at <a href="https://github.com/kinecosystem/kin-core-ios/blob/9bc5a15dc5bd56c262f17927f8bd10c163b94db3/KinSampleApp/KinSampleApp/KinSampleViewController.swift#L141">`KinSampleViewController.swift`</a>.

#### Activation

Before an account can receive KIN, it must be activated.

```swift
account.activate(completion: { txHash, error in
    if error == nil {
        // report success
    }
})
```

## Account Information

#### Public Address

```swift
let publicAddress = account.publicAddress
```

The account's address on the network.  This is the identifier used to specify the destination for a payment, or to request account creation from a service.

#### Account Status

```swift
account.status(completion: { status, error in
    if let status == status {
        switch status {
        case notCreated: break
        case notActivated: break
        case activated: break
        }
    }
})
```

#### Retrieving KIN Balance

```swift
account.balance(completion: { balance, error in
    if let balance == balance {
      ...
    }
})
```

## Transactions

To send KIN to another account, the account's public address is required.

```swift
account.sendTransaction(to "GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO",
                        kin: 123,
                        memo: "payment for donuts",
                        completion: { txHash, errors
                          if let txHash = txHash {
                            // payment succeeded
                          }
                        })
```

The `memo` field can contain a utf-8 string up to 28 bytes in length.  A typical usage is to include an order# that a service can use to verify payment.

## Account Watchers

#### Payments

Payments involving the account may be observed using `watchPayments(cursor: )`.

```swift
let linkBag = LinkBag()
let watch: PaymentWatch

watch = account.watchPayments(cursor: nil)
watch.emitter
  .on(next: {
    print($0)
  })
  .add(to: linkBag)
```

#### Balance

Changes to the account's balance may be observed using `watchBalance(_ :)`.

```swift
let linkBag = LinkBag()
let watch: BalanceWatch

watch = try! account.watchBalance(nil)
watch.emitter
  .on(next: {
    print($0)
  })
  .add(to: linkBag)
```

#### Account Creation

As part of preparing an account for use, it must be created on the network.  The creation event may be observed using `watchCreation()`.

```swift
try! account.watchCreation()
  .finally {
    print("account created")
  }
```

## Completion Handlers vs Promises

For operations which communicate with the network, the SDK offers two forms of each method:

1. invokes a completion handler
2. returns a promise

The promise returned is a minimal implementation, provided by `KinUtil`.  It supports invoking a handler on success, on failure and on completion (whether the operation succeeded or failed).

## Sample Application

For a more detailed example on how to use the library please take a look at our <a href="https://github.com/kinecosystem/kin-core-ios/tree/master/KinSampleApp">Sample App</a>.

## Testing

Running unit tests for network operations requires a local Stellar network, of which, proper setup is beyond the scope of this document.  Unit tests for the keystore may be run on any system.
