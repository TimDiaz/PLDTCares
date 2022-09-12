"use strict";

const componentName = require('../../../configurations/component_config');
module.exports = {
    metadata: () => ({
        name: componentName.ValidateAccountNumberFormat, //"checkacctnumberformat",
        properties: {
            accountNumber: {
                type: "string",
                required: true
            },
            serviceNumber: {
                type: "string",
                required: true
            }
        },
        supportedActions: ['validacctformat', 'invalidacctformat', 'failure']
    }),

    invoke: (conversation, done) => {
        const globalProp = require('../../../helpers/globalProperties');
        const instance = require("../../../helpers/logger");
        const _logger = instance.logger(globalProp.Logger.Category.ValidateAccountNumberFormat);
        const logger = _logger.getLogger();

        let keepTurn = true;
        let transition = "invalidacctformat";

        var acctNumber = conversation.properties().accountNumber;
        var servNumber = conversation.properties().serviceNumber;
        logger.addContext("serviceNumber", servNumber)

        logger.info(`-------------------------------------------------------------------------------------------------------------`)
        logger.info(`- [START] Validate Account Number Format                                                                    -`)
        logger.info(`-------------------------------------------------------------------------------------------------------------`)
        logger.info(`Account Number: [${acctNumber}]`);

        var resChkStr = acctNumber.match(globalProp.ValidateAccountNumberFormat.Regex.AccountNumberFormat);
        if (resChkStr === null) {
            logger.info(`[Valid] Account Number is numeric`);
            if (acctNumber.length !== 10) {
                logger.warn(`[Invalid] Account Number is lessthan or greaterthan 10.`);
                transition = 'invalidacctformat';
            }
            else {
                logger.info(`[Valid] Account Number lenght is 10.`);
                transition = 'validacctformat';
            }
        }
        else if (resChkStr.length > 0) {
            logger.info(`[Invalid] Account Number is alphanumeric`);
            transition = 'invalidacctformat';
        }

        logger.info(`-------------------------------------------------------------------------------------------------------------`)
        logger.info(`- [END] Validate Account Number Format                                                                      -`)
        logger.info(`-------------------------------------------------------------------------------------------------------------`)

        _logger.shutdown();
        conversation.keepTurn(keepTurn);
        conversation.transition(transition);
        done();
    }

};