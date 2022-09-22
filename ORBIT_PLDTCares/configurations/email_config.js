const moment = require('moment-timezone');
const baseConfig = require('./base_config');

module.exports = {
    Subjects: {
        AccountValidation: `[API Error] Account Validation ${baseConfig.Environment} - Subscriber Checking`,
        AccountEligibility: `[API Error] Account Eligibility ${baseConfig.Environment} - Existing Ticket Checking`,
        BillingServices:{
            Autobal: `[API Error] Check Auto Balance ${baseConfig.Environment} - Balance Checking`,
            Autoesoa: `[API Error] Check Auto Esoa ${baseConfig.Environment} - Bill Request Checking`
        },
        FMgetFTDetails: {
            CheckSType: `[API Error] FmGetFtDetails ${baseConfig.Environment} - NE Type Checking`,
            FMInternet: `[API Error] FmGetFtDetails ${baseConfig.Environment} - NE Type Checking`,
            FMLandline: `[API Error] FmGetFtDetails ${baseConfig.Environment} - NE Type Checking`,
        },
        TicketCreation: {
            TicketCreation:`[API Error] PLDT Fault Ticket ${baseConfig.Environment} - Ticket Creation`,
            CreateFT:`[API Error] PLDT Fault Ticket ${baseConfig.Environment} - Ticket Creation Create FT`,
            TicketProm:`[API Error] PLDT Fault Ticket ${baseConfig.Environment} - Ticket Prom`}, 
        BSMP: { 
            BSMPWhitelistChecker: `[Component Error] PLDT BSMP ${baseConfig.Environment} - Whitelist Checker`, 
            BSMPChecker: `[Component Error] PLDT BSMP ${baseConfig.Environment} - Checker`},
        CaseCreation: {
            CaseCreation: `[API Error] CaseCreation ${baseConfig.Environment} - Case Creation`,
            ChatAdCaseCreate: `[API Error] ChatAdCaseCreate ${baseConfig.Environment} - Chat AD Case Creation`,
            CheckWaitTime: `[API Error] CheckWaitTime ${baseConfig.Environment} - Live agent wait time checking`,
            FollowUpCase: `[API Error] FollowUpCase ${baseConfig.Environment} - Case Creation for Tech`,
            FollowUpDate: `[API Error] FollowUpDate ${baseConfig.Environment} - Date validation`,
            PaymentDate: `[API Error] PaymentDate ${baseConfig.Environment} - Payment Date validation`},
        NumberServiceability: {
            Region: `[API Error] NumberServiceability  ${baseConfig.Environment} - Region Checking`,
            Param: `[API Error] NumberServiceability  ${baseConfig.Environment} - Param Checking`,
            Technology: `[API Error] NumberServiceability  ${baseConfig.Environment} - Technology Checking`,
        }    
    },
    EmailFormat: (apiName, code, message, serviceNumber) => {
        const dateTimeNow = moment.tz(Date.now(), `Asia/Manila`).format(`MM-DD-YYYY hh:mm A`);
        return `Status Code: ${code} 
                Telephone Number: ${serviceNumber} 
                API: ${apiName} 
                Datetime: ${dateTimeNow} 
                Error: ${message}`;
    }
}