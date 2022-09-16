"use strict";

const { NumberServiceability } = require("../helpers/globalProperties");
const { TicketCreation } = require("./component_config");

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
        EmailValidation: "orbit_dev-emailvalidation",
        MobileValidation: "orbit_dev-mobilevalidation",
        NumberServiceability:{
            Param: "orbit_dev-numberserviceability-Param",
            Region: "orbit_dev-numberserviceability-Region",
            Technology: "orbit_dev-numberserviceability-Techonology"
        },
        AccountEligibility: { 
            TSEligibility: "orbit_dev-accounteligibility-TSEligibility"
        },
        TicketCreation:{
           TicketCreation: "orbit_dev-ticketCreation",
           TicketCreationCreateFt: "orbit_dev-ticketcreationft",
           TicketProm: "orbit_dev-ticketProm" 
        },
        BSMP:{
            BSMPWhitelistChecker: "orbit_dev-bsmpwhitelistchecker",
            BSMPChecker: "orbit_dev-bsmpchecker"
         },
        BillingServices:{
            Autobal: "orbit_dev-autobal-Autobal",
            Autoesoa: "orbit_dev-autoesoa-Autoesoa"
        },
        FMgetFTDetails: {
            CheckSType: 'orbit_dev-fmgetftdetails-CheckSType',
            FMInternet: 'orbit_dev-fmgetftdetails-FMInternet',
            FMLandline: 'orbit_dev-fmgetftdetails-FMLandline'
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
<<<<<<< HEAD
        NumberServiceabilityParam: 'NumberServiceabilityParam',
<<<<<<< HEAD
        FMGetFTDetail: {
            CheckStype: 'FMGetFTDetail_CheckStype',
            FMInternet: 'FMGetFTDetail_FMInternet',
            FMLandline: 'FMGetFTDetail_FMLandline',
=======
        BillingServices: {
            Autobal: "Autobalance",
            Autoesoa: "AutoESOA"
>>>>>>> Billing-Services
        }
=======
        ValidateEmailFormat: 'ValidateEmailFormat',
        ValidateMobileFormat: 'ValidateMobileFormat',
        NumberServiceability: {NumberServiceabilityParam:'NumberServiceabilityParam',NumberServiceabilityRegion:'NumberServiceabilityRegion',NumberServiceabilityTechnology:'NumberServiceabilityTechnology'},
        TicketCreation: {TicketCreation:'TicketCreation',ticketcreationcreateft:'ticketcreationcreateft',ticketProm:'ticketProm'},
        BSMP: {BSMPWhitelistChecker:'BSMPWhitelistChecker',BSMPChecker:'BSMPChecker'}
>>>>>>> ReportaProblemCares
    }
}