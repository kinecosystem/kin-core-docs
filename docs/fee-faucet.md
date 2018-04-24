# Fee Faucet Service

This service funds accounts with the native token for free, required for paying transaction fees.
It is only available on the test network.
Funding costs real world money, and digital services joining the Kin Ecosystem
need to fund their users with KIN and XLM on their own.

This page focuses on executing actions against this service.

## Actions

### Fund Account

Funds an account according to given account address and KIN amount.

In most causes on the HTTP result status code is enough.
Nevertheless, the service provides verbose information.
If you're curious, please see [the following Stellar documentation](https://www.stellar.org/developers/horizon/reference/tutorials/follow-received-payments.html#funding-your-account)
for further details.

```
HTTP GET http://friendbot-kik.kininfrastructure.com/addr=<account address>

HTTP 200 OK
```

```json
{
  "_links": {
    "transaction": {
      "href": "http://horizon-kik.kininfrastructure.com/transactions/16964b5cc3847c82cd208221b6273231799e587ce42a4faf2e228fc0a255e39e"
    }
  },
  "hash": "16964b5cc3847c82cd208221b6273231799e587ce42a4faf2e228fc0a255e39e",
  "ledger": 625321,
  "envelope_xdr": "AAAAAHpJi8NPAZLYlI4D+XNqk8Szjd7pJ4CI+BQepVxziqZgAAAAZAAJfdsAAAAGAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAA+3kKq4/b9si6q9UTnch5Tp2/A0WwHjtgckSnovHcjTsAAAAABfXhAAAAAAAAAAABc4qmYAAAAEC/jmTRNgKTO0qvT7DQIa9zUHWhvos2l08X4ib7evT7safhtQ9rQPw5jCV5AVtig7ivEvsvpYAEKjN2PZUzQYkB",
  "result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAA=",
  "result_meta_xdr": "AAAAAAAAAAEAAAACAAAAAAAJiqkAAAAAAAAAAPt5CquP2/bIuqvVE53IeU6dvwNFsB47YHJEp6Lx3I07AAAAAAX14QAACYqpAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAQAJiqkAAAAAAAAAAHpJi8NPAZLYlI4D+XNqk8Szjd7pJ4CI+BQepVxziqZgAAAJGEKG26gACX3bAAAABgAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAA"
}
```

