const apiBaseConfig = require('../configurations/apiBase_config');
const loggerConfig = require('../configurations/logger_config');
const emailConfig = require('../configurations/email_config');
const accountValidationConfig = require('../configurations/components/accountValidation_config');
const accountEligibilityConfig = require('../configurations/components/tsEligibility_config');
const numberServiceabilityConfig = require('../configurations/components/numberServiceability_config');
const validateAccountNumberFormatConfig = require('../configurations/components/validateAccountNumberFormat_config');
const validateServiceNumberFormatConfig = require('../configurations/components/validateServiceNumberFormat_config');
const caseCreationConfig = require('../configurations/components/caseCreation_config');
const checkWaitTimeConfig = require('../configurations/components/checkWaitTime_config');
const followUpCaseConfig = require('../configurations/components/followUpCase_config');
const ChatAdCaseCreateConfig = require('../configurations/components/chatAdCaseCreate_config');

module.exports = {    
    APIBaseOption: apiBaseConfig,
    Logger: loggerConfig,
    Email:emailConfig,
    AccountValidation: accountValidationConfig,
    AccountEligibility: accountEligibilityConfig,
    NumberServiceability: numberServiceabilityConfig,
    ValidateAccountNumberFormat: validateAccountNumberFormatConfig,
    ValidateServiceNumberFormat: validateServiceNumberFormatConfig,
    CaseCreation: caseCreationConfig,
    CheckWaitTime: checkWaitTimeConfig,
    FollowUpCase: followUpCaseConfig,
    ChatAdCaseCreate: ChatAdCaseCreateConfig
};