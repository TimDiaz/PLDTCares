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
    CaseCreation: "casecreation.DEV",
    ChatAdCaseCreate: "chatadcasecreate.DEV",
    CheckWaitTime: "checkwaittime.DEV",
    FollowUpCase: "followupcase.DEV",
    FollowUpDate: "followupdate.DEV",
    PaymentDate: "paymentdate.DEV"
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
//     ValidateServiceNumberFormat: "validateServiceNumberFormat.PROD",
//     CaseCreation: "casecreation.PROD",
//     ChatAdCaseCreate: "chatadcasecreate.PROD",
//     CheckWaitTime: "checkwaittime.PROD",
//     FollowUpCase: "followupcase.PROD",
//     FollowUpDate: "followupdate.PROD",
//     PaymentDate: "paymentdate.PROD"
// }
//******************************************************************************************************************************//
// [END] PRODUCTION CONFIGURATION                                                                                               //
//******************************************************************************************************************************//

module.exports = config;