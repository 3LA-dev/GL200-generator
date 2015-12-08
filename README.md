# GL200-generator
Frame creator GL200 in NodeJs.

This script is limited to generate five General Posotion Report:
- GTGEO
- GTSPD
- GTRTL
- GTPNL
- GTSOS

## Starter
Clone this repository
´´´
git clone https://github.com/3LA-dev/GL200-generator.git
cd GL200-generator
´´´
Install modules required and run script
´´´
npm install
node index.js
´´´
## Run options
This script by default will connect to a TCP socket in local host on port 8090 but you can change options
´´´
node index.js -h 127.0.0.1 -p 8080
node index.js -h 192.1.1.10
node index.js -p 8080
´´´