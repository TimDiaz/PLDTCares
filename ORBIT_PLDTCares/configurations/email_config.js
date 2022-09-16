const moment = require('moment-timezone');
const loggerConfig = require('./logger_config');

module.exports = {
    Subjects: {
        AccountValidation: '[API Error] Account Validation DEV - Subscriber Checking',
        AccountEligibility: '[API Error] Account Eligibility DEV - Existing Ticket Checking',
        EmailFormat: '[Component Error] Email Validation Dev',
        NumberServiceability: {NumServiceabilityParam:'[API Error] NumberServiceability DEV - VIP checking',
                                    NumServiceabilityRegion:'[API Error] NumberServiceability DEV - Region checking',
                                    NumServiceabilityTechnology:'[API Error] NumberServiceability DEV - Technology checking'},
        TicketCreation: {TicketCreation:'[API Error] PLDT Fault Ticket DEV - Ticket Creation',
                         CreateFT:'[API Error] PLDT Fault Ticket DEV - Ticket Creation Create FT',
                         TicketProm:'[API Error] PLDT Fault Ticket DEV - Ticket Prom'}, 
        BSMP: { BSMPWhitelistChecker: '[Component Error] PLDT BSMP - Whitelist Checker', 
                BSMPChecker: '[Component Error] PLDT BSMP - Checker'}
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