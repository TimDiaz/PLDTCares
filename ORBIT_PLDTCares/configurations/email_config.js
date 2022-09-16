const moment = require('moment-timezone');
const loggerConfig = require('./logger_config');

module.exports = {
    Subjects: {
        AccountValidation: '[API Error] Account Validation PROD - Subscriber Checking',
        AccountEligibility: '[API Error] Account Eligibility PROD - Existing Ticket Checking',
        NumberServiceabilityParam: '[API Error] NumberServiceability PROD - VIP checking',
        BillingServices:{
            Autobal: '[API Error] Check Auto Balance PROD - Balance Checking',
            Autoesoa: '[API Error] Check Auto Esoa PROD - Bill Request Checking'
        },
        FMgetFTDetails: {
            CheckSType: '[API Error] FmGetFtDetails PROD - NE Type Checking',
            FMInternet: '[API Error] FmGetFtDetails PROD - NE Type Checking',
            FMLandline: '[API Error] FmGetFtDetails PROD - NE Type Checking',
        },
        TicketCreation: {
            TicketCreation:'[API Error] PLDT Fault Ticket DEV - Ticket Creation',
            CreateFT:'[API Error] PLDT Fault Ticket DEV - Ticket Creation Create FT',
            TicketProm:'[API Error] PLDT Fault Ticket DEV - Ticket Prom'}, 
        BSMP: { 
            BSMPWhitelistChecker: '[Component Error] PLDT BSMP - Whitelist Checker', 
            BSMPChecker: '[Component Error] PLDT BSMP - Checker'},
        CaseCreation: {
            CaseCreation: '[API Error] CaseCreation PROD - Case Creation',
            ChatAdCaseCreate: '[API Error] ChatAdCaseCreate PROD - Chat AD Case Creation',
            CheckWaitTime: '[API Error] CheckWaitTime PROD - Live agent wait time checking',
            FollowUpCase: '[API Error] FollowUpCase PROD - Case Creation for Tech',
            FollowUpDate: '[API Error] FollowUpDate PROD - Date validation',
            PaymentDate: '[API Error] PaymentDate PROD - Payment Date validation'},
    },
    EmailFormat: (apiName, code, message, serviceNumber) => {
        const dateTimeNow = moment.tz(Date.now(), 'Asia/Manila').format('MM-DD-YYYY hh:mm A');
        return `Status Code: ${code} 
                Telephone Number: ${serviceNumber} 
                API: ${apiName} 
                Datetime: ${dateTimeNow} 
                Error: ${message}`;
    }
}