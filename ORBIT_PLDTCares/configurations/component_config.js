const baseConfig = require('./base_config');
const config = {
    AccountValidation: `accountValidation.${baseConfig.EnvironmentSwitch}`,
    TSEligibility: `tseligibility.${baseConfig.EnvironmentSwitch}`,
    NumberServiceabilityPARAM: `numberServiceabilityPARAM.${baseConfig.EnvironmentSwitch}`,
    NumberServiceabilityRegion: `numberServiceabilityRegion.${baseConfig.EnvironmentSwitch}`,
    NumberServiceabilityTechnology: `numberServiceabilityTechnology.${baseConfig.EnvironmentSwitch}`,
    ValidateAccountNumberFormat: `validateaccountnumberformat.${baseConfig.EnvironmentSwitch}`,
    ValidateServiceNumberFormat: `validateServiceNumberFormat.${baseConfig.EnvironmentSwitch}`,
    ValidateServiceRequestNumberFormat: `validateServiceRequestNumberFormat.${baseConfig.EnvironmentSwitch}`,
    CaseCreation: `casecreation.${baseConfig.EnvironmentSwitch}`,
    ChatAdCaseCreate: `chatadcasecreate.${baseConfig.EnvironmentSwitch}`,
    CheckWaitTime: `checkwaittime.${baseConfig.EnvironmentSwitch}`,
    FollowUpCase: `followupcase.${baseConfig.EnvironmentSwitch}`,
    FollowUpDate: `followupdate.${baseConfig.EnvironmentSwitch}`,
    PaymentDate: `paymentdate.${baseConfig.EnvironmentSwitch}`,
    ValidateEmailFormat: `validateEmailFormat.${baseConfig.EnvironmentSwitch}`,
    ValidateMobileFormat: `validateMobileFormat.${baseConfig.EnvironmentSwitch}`,
    TicketCreation: `ticketCreation.${baseConfig.EnvironmentSwitch}`,
    TicketCreationFT: `ticketCreationFT.${baseConfig.EnvironmentSwitch}`,
    TicketCreationProm: `ticketProm.${baseConfig.EnvironmentSwitch}`,
    BSMPWhiteList: `BSMPWhitelistChecker.${baseConfig.EnvironmentSwitch}`,
    BSMPChecker: `BSMPChecker.${baseConfig.EnvironmentSwitch}`,
    BillingServices: {
        Autobal: `autobal.${baseConfig.EnvironmentSwitch}`,
        Autoesoa: `autoesoa.${baseConfig.EnvironmentSwitch}`,
        AccounetBalance: `accountbalance.${baseConfig.EnvironmentSwitch}`,
    },
    FMgetFTDetails:  { 
        CheckSType: `checkStype.${baseConfig.EnvironmentSwitch}`,
        FMInternet: `fmInternet.${baseConfig.EnvironmentSwitch}`,
        FMLandline: `fmLandline.${baseConfig.EnvironmentSwitch}`
    }
}

module.exports = config;