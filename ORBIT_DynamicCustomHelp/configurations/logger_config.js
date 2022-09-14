"use strict";

//******************************************************************************************************************************//
// [START] DEVELOPMENT CONFIGURATION                                                                                            //
// NOTE: Uncomment this for development deployment                                                                              //
//******************************************************************************************************************************//
const hostName = 'staging.chatbot171.pldthome.com';
const wssLogger = {
    Protocol: 'wss',
    URL: hostName,
    Port: 5000
};

const bcpLogging = {
    URL: `https://${hostName}:7745/bcplogginginsert`,
    AppNames: {
        AccountValidation: "orbit_dev-accountvalidation",
        NumberServiceability:{
            Param: "orbit_dev-numberserviceability-Param",
            Region: "orbit_dev-numberserviceability-Region",
            Technology: "orbit_dev-numberserviceability-Techonology"
        },
        AccountEligibility: { 
            TSEligibility: "orbit_dev-accounteligibility-TSEligibility"
        },
        CaseCreation:{
            CaseCreation: "orbit_dev-casecreation-CaseCreation",
            ChatAdCaseCreate: "orbit_dev-casecreation-ChatAdCaseCreate",
            CheckWaitTime: "orbit_dev-casecreation-CheckWaitTime",
            FollowupCase: "orbit_dev-casecreation-FollowupCase",
            FollowupDate: "orbit_dev-casecreation-FollowupDate",
            PaymentDate: "orbit_dev-casecreation-PaymentDate"
        }
    },
}
//******************************************************************************************************************************//
// [END] DEVELOPMENT CONFIGURATION                                                                                              //
//******************************************************************************************************************************//

//******************************************************************************************************************************//
// [START] PRODUCTION CONFIGURATION                                                                                             //
// NOTE: Uncomment this for production deployment                                                                               //
//******************************************************************************************************************************//
// const hostName = 'chatbot171.pldthome.com';
// const wssLogger = {
//     Protocol: 'wss',
//     URL: hostName,
//     Port: 5000
// };

// const bcpLogging = {
//     URL: 'https://${hostName}:7745/bcplogginginsert',
//     AppNames: {
//         AccountValidation: "orbit_prod-accountvalidation",
//         NumberServiceability:{
//             Param: "orbit_prod-numberserviceability-Param",
//             Region: "orbit_prod-numberserviceability-Region",
//             Technology: "orbit_prod-numberserviceability-Techonology"
//         },
//         AccountEligibility: { 
//             TSEligibility: "orbit_dev-accounteligibility-TSEligibility"
//         },
//         CaseCreation:{
//             CaseCreation: "orbit_dev-casecreation-CaseCreation",
//             ChatAdCaseCreate: "orbit_dev-casecreation-ChatAdCaseCreate",
//             CheckWaitTime: "orbit_dev-casecreation-CheckWaitTime",
//             FollowupCase: "orbit_dev-casecreation-FollowupCase",
//             FollowupDate: "orbit_dev-casecreation-FollowupDate",
//             PaymentDate: "orbit_dev-casecreation-PaymentDate"
//         }
//     },
// }
//******************************************************************************************************************************//
// [END] PRODUCTION CONFIGURATION                                                                                               //
//******************************************************************************************************************************//

module.exports = {     
    WSSLogger: wssLogger,
    BCPLogging: bcpLogging,
    Layout: {
        type: "pattern",
        pattern: "[%x{dateTime}] [%p] [%c] %m",
        tokens: {
            dateTime: function(logEvent) {
                return moment.tz(Date.now(), 'Asia/Manila').format('MM-DD-YYYY hh:mm:ss.SSS A');
            },
        }
    },
    Category: {
        Default: 'default',
        Mailer: 'mailer',
        AccountValidation: 'AccountValidation',
        AccountEligibility: 'AccountEligibility',
        ValidateAccountNumberFormat: 'ValidateAccountNumberFormat',
        ValidateServiceNumberFormat: 'ValidateServiceNumberFormat',
        NumberServiceabilityParam: 'NumberServiceabilityParam',
        CaseCreation: {CaseCreation: 'CaseCreation', ChatAdCaseCreate: 'ChatAdCaseCreate', CheckWaitTime: 'CheckWaitTime', FollowUpCase: 'FollowUpCase', FollowUpDate: 'FollowUpDate', PaymentDate: 'PaymentDate'},
    }
}