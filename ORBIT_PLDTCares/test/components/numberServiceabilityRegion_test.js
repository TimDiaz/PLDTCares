"use strict";

const component = require('../../components/numberServiceability/getRegion');
const testing = require('@oracle/bots-node-sdk/testing');
const customComponent = require('../helpers/invokeCustomComponent');

let param_notexist = testing.MockRequest(
    //message payload
    {},
    //properties
    {
        "serviceNumber": "00230872789"
    }
)
let param_exist = testing.MockRequest(
    //message payload
    {},
    //properties
    {
        "accountNumber": "0023087278",
        "serviceNumber": "0344320027"
    }
)

async function Run() {
     await customComponent.invoke("numberServiceabilityRegion", param_notexist, component);
    //await customComponent.invoke("numberServiceabilityRegion", param_exist, component);
};

Run();