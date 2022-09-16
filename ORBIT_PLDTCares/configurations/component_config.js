//******************************************************************************************************************************//
// [START] DEVELOPMENT CONFIGURATION                                                                                            //
// NOTE: Uncomment this for development deployment                                                                              //
//******************************************************************************************************************************//
const config = {
    AccountValidation: "accountValidation.DEV",
    TSEligibility: "tseligibility.DEV",
    NumberServiceabilityPARAM: "numberServiceabilityPARAM.DEV",
    NumberServiceabilityRegion: "numberServiceabilityRegion.DEV",
    NumberServiceabilityTechnology: "numberServiceabilityTechnology.DEV",
    ValidateAccountNumberFormat: "validateaccountnumberformat.DEV",
    ValidateServiceNumberFormat: "validateServiceNumberFormat.DEV",
    ValidateEmailFormat: "validateEmailFormat.DEV",
    ValidateMobileFormat: "validateMobileFormat.DEV",
    TicketCreation: "ticketCreation.DEV",
    TicketCreationFT: "ticketCreationFT.DEV",
    TicketCreationProm: "ticketProm.DEV",
    BSMPWhiteList: "BSMPWhitelistChecker.DEV"
,
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
    // AccountValidation: "accountValidation.PROD",
    // TSEligibility: "tseligibility.PROD",
    // NumberServiceabilityPARAM: "numberServiceabilityPARAM.PROD",
    // NumberServiceabilityRegion: "numberServiceabilityRegion.PROD",
    // NumberServiceabilityTechnology: "numberServiceabilityTechnology.PROD",
    // ValidateAccountNumberFormat: "validateaccountnumberformat.PROD",
    // ValidateServiceNumberFormat: "validateServiceNumberFormat.PROD",
    // TicketCreation: "ticketCreation.PROD",
    // TicketCreationFT: "ticketCreationFT.PROD",
    // TicketCreationProm: "ticketProm.PROD"

// }
//******************************************************************************************************************************//
// [END] PRODUCTION CONFIGURATION                                                                                               //
//******************************************************************************************************************************//

module.exports = config;