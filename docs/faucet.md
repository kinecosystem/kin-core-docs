# Faucet Service
This service can be used to fund accounts with KIN  
The main repository is at [github.com/kinecosystem/stellar-faucet](https://github.com/kinecosystem/stellar-faucet)

For users to use KIN inside your digital service, they will need to receive a grant of KIN, and you can use this service to give it to them.

# Set up the faucet service  
## Prerequisites


* Edit the 'seeds.txt' file with the seeds and channels you wish to use.  
  The main seed is mandatory since all of the funded KIN will be sent from this account.  
  Channel seeds are optional and are used to improve the handling of high number of requests at the same time.
```
main seed  
channel seed 2  
channel seed 3  
channel seed 4  
channel seed 5  
.  
.  
.
```  
* Edit the docker-compose.yaml file and update the "SEEDS_NUMBER" variable  
  You can also configure the rest of the variables if you wish to use a custom network.  
```
SEEDS_NUMBER - The number of seeds you are using

# By defualt, these are all configured to the public stellar testnet
# You dont need to change them unless you are using a different network

HORIZON_ENDPOINT - The url of the horizon instance you are using
NETWORK_PASSPHRASE - The passphrase of the horizon instance you are using
KIN_ISSUER - The address of the KIN issuer
```

## Run locally
1. Install [docker and docker-compose](https://docs.docker.com/install/)
2. Inside this project's folder, run the command
```bash
$ sudo docker-compose up
```
The faucet will run on localhost:5000

## Deploy to a remote machine
(The remote machine needs to run Ubuntu 16+)  
1. Install [ansible](http://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)  
2. Install the [angstwad.docker_ubuntu](https://github.com/angstwad/docker.ubuntu) role:
```bash
$ ansible-galaxy install angstwad.docker_ubuntu -p playbook/roles/
```
3. Edit the 'hosts' file inside ```playbook/inventory``` and add the IP of the remote machine
4. Run the playbook:
```bash
$ ansible-playbook -i playbook/inventory/ playbook/main.yml
```
The faucet will run on <ip\>:5000

# Endpoints  
Success will return http code 200  
Expected errors will return http code 400  
Unexpected errors will return http code 500

**GET '/status'**  
```
{
'address': 'GBDUPSZP4APH3PNFIMYMTHIGCQQ2GKTPRBDTPCORALYRYJZJ35O2LOBL',
'network': 'CUSTOM',
'channels': 
    {
    'all': 8, 
    'free': 8
    },
'horizon': 
    {
    'online': true,
    'uri': 'https://horizon-testnet.stellar.org',
    'error': null
    },
'kin_asset': 
	{
    'issuer': 'GCKG5WGBIJP74UDNRIRDFGENNIH5Y3KBI5IHREFAJKV4MQXLELT7EX6V',
    'code': 'KIN'
    }
}

OR

{
"error": 'unexpected error: exception message'
}  

```

**GET '/fund?account=\<account\>&amount=\<amount\>'**
```
{
'succsseful': true/false
'error': null/'Account does not exist'/'No KIN trustline established'/
         'Invalid address'/'Amount parameter missing'/'Account parameter missing'/'Invalid amount'/
         'unexcpected error: exception message'
}
```

