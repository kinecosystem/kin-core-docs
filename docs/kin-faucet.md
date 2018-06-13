---
id: kin-faucet
sidebar_label: KIN Faucet Service
title: KIN Faucet Service
---

This service funds accounts with KIN, for free. It is only available on the test network.
Funding costs real world money, and digital services joining the Kin Ecosystem
need to fund their users with KIN and XLM on their own.

The main repository is at [github.com/kinecosystem/stellar-faucet](https://github.com/kinecosystem/stellar-faucet).

This page focuses on executing actions against the services.
Additional backend development information is provided in the repository.

## Actions

### Fund Account

Funds an account according to given account address and KIN amount.

```
HTTP GET /fund?account=<account address>&amount=<kin amount to fund>
```

```json
{
  "succsseful": true/false
  "error": null
}
```

Possible alternative `"error"` values are:

- Account does not exist
- No KIN trustline established
- Invalid address
- Amount parameter missing
- Account parameter missing
- Invalid amount
- Unexcpected error: exception message

### Health Check

Checks the status of the service. In most cases the returned HTTP status code is enough.
Nevertheless, the services replies with verbose information.

```
# request
HTTP GET /status

# response
HTTP 200
```

```json
{
  "address": "GBDUPSZP4APH3PNFIMYMTHIGCQQ2GKTPRBDTPCORALYRYJZJ35O2LOBL",
  "network": "CUSTOM",
  "channels": {
    "all": 8,
    "free": 8
  },
  "horizon": {
    "online": true,
    "uri": "https://horizon-testnet.stellar.org",
    "error": null
  },
  "kin_asset": {
    "issuer": "GCKG5WGBIJP74UDNRIRDFGENNIH5Y3KBI5IHREFAJKV4MQXLELT7EX6V",
    "code": "KIN"
  }
}
```

Or in case of an error:

```json
{ "error": "unexpected error: exception message" }
```
