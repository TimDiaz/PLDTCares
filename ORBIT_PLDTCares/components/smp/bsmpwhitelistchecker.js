"use strict";
const componentName = require('../../configurations/component_config');
module.exports = {
    metadata: function metadata() {
        return {
            name: componentName.BSMPWhiteList,
            properties: {
                Mobile: {
                    type: "string",
                    required: false
                },
                accountNumber: {
                    type: "string",
                    required: false
                },
                sysDate: {
                    type: "string",
                    required: false
                },
            },
            supportedActions: ['inlist', 'notinlist', 'failure']
        };
    },
    invoke: (conversation, done) => {
        const globalProp = require('../../helpers/globalProperties');
        const instance = require("../../helpers/logger");
        const _logger = instance.logger(globalProp.Logger.Category.BSMP.BSMPWhitelistChecker);
        const logger = _logger.getLogger();

        let transition = "failure";

        var telNumber = conversation.properties().Mobile;
        var accNumber = conversation.properties().accountNumber;
        var smpStartTs = conversation.properties().sysDate;

        const jsonData = require('../../data/serviceNumbersWhitelist.json');
        var whitelistedTelNumber = jsonData['whitelist'];
        // 0322383464 fibr
        // 0325206016 dsl
        logger.addContext("serviceNumber", telNumber);

        logger.info(`-------------------------------------------------------------------------------------------------------------`)
        logger.info(`- [START] SMP Whitelisting Checker                                                                          -`)
        logger.info(`-------------------------------------------------------------------------------------------------------------`)
        logger.info(`Service Number: [${telNumber}]`);

        try {
            var checkList = whitelistedTelNumber.includes(telNumber);
            console.log("inarray result: " + checkList);
            if (checkList) {
                transition = 'inlist';
                logger.debug('inlist');
            } else {
                logger.debug('notinlist');
                transition = 'notinlist';
            }
        } catch (err) {
            console.error('Error caught: ', err);
            logger.debug('Error caught: ', err);
            transition = 'failure';
        }

        logger.info(`-------------------------------------------------------------------------------------------------------------`)
        logger.info(`- [END] SMP Whitelisting Checker                                                                            -`)
        logger.info(`-------------------------------------------------------------------------------------------------------------`)

        _logger.shutdown();
        //conversation.keepTurn(keepTurn);
        conversation.transition(transition);
        logger.debug(transition);
        //done();    
    }

};



