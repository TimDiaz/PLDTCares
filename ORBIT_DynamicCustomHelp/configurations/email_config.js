const moment = require('moment-timezone');
const loggerConfig = require('./logger_config');

module.exports = {
    Subjects: {
        AccountValidation: '[API Error] Account Validation PROD - Subscriber Checking',
        AccountEligibility: '[API Error] Account Eligibility PROD - Existing Ticket Checking',
        NumberServiceabilityParam: '[API Error] NumberServiceability PROD - VIP checking',
        CaseCreation: {CaseCreation: '[API Error] CaseCreation PROD - Case Creation',
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