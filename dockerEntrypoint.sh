#!/bin/bash

cd eth
truffle compile
truffle migrate --reset --network demo
cd ../ && yarn start