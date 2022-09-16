//******************************************************************************************************************************//
// [START] DEVELOPMENT CONFIGURATION                                                                                            //
// NOTE: Uncomment this for development deployment                                                                              //
//******************************************************************************************************************************//
const config = {
    AccountValidation: "accountValidation.DEV",
    TSEligibility: "tseligibility.DEV",
    NumberServiceabilityPARAM: "numberServiceabilityPARAM.DEV",
    ValidateAccountNumberFormat: "validateaccountnumberformat.DEV",
    ValidateServiceNumberFormat: "validateServiceNumberFormat.DEV",
    BillingServices: {
        Autobal: "autobal.DEV",
        Autoesoa: "autoesoa.DEV"
    },
    FMgetFTDetails:  { 
        CheckSType: "checkStype.DEV",
        FMInternet: "fmInternet.DEV",
        FMLandline: "fmLandline.DEV"
    }
}
//******************************************************************************************************************************//
// [END] DEVELOPMENT CONFIGURATION                                                                                              //
//******************************************************************************************************************************//

//******************************************************************************************************************************//
// [START] PRODUCTION CONFIGURATION                                                                                             //
// NOTE: Uncomment this for production deployment                                                                               //
//******************************************************************************************************************************//
// const config = {
//     AccountValidation: "accountValidation.PROD",
//     TSEligibility: "tseligibility.PROD",
//     NumberServiceabilityPARAM: "numberServiceabilityPARAM.PROD",
//     ValidateAccountNumberFormat: "validateaccountnumberformat.PROD",
//     ValidateServiceNumberFormat: "validateServiceNumberFormat.PROD"
// }
//******************************************************************************************************************************//
// [END] PRODUCTION CONFIGURATION                                                                                               //
//******************************************************************************************************************************//

module.exports = config;