//******************************************************************************************************************************//
// [START] DEVELOPMENT CONFIGURATION                                                                                            //
// NOTE: Uncomment this for development deployment                                                                              //
//******************************************************************************************************************************//
const config = {
    AccountValidation: "accountValidation.DEV",
    TSEligibility: "tseligibility.DEV",
    NumberServiceabilityPARAM: "numberServiceabilityPARAM.DEV",
    NumberServiceabilityRegion: "numberServiceabilityRegion.DEV",
    ValidateAccountNumberFormat: "validateaccountnumberformat.DEV",
    ValidateServiceNumberFormat: "validateServiceNumberFormat.DEV",
    TicketCreation: "ticketCreation.DEV",
    TicketCreationFT: "ticketCreationFT.DEV",
    TicketCreationProm: "ticketProm.DEV"

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