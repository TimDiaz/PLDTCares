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
        }
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