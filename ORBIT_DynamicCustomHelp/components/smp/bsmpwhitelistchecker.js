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

        const request = require('request');
        const globalProp = require('../../helpers/globalProperties');
        const instance = require("../../helpers/logger");
        const _logger = instance.logger(globalProp.Logger.Category.BSMP.BSMPWhitelistChecker);
        const logger = _logger.getLogger();
        const _emailLog = instance.logger(globalProp.Logger.Category.Mailer);        
        const emailLog = _emailLog.getLogger();
        

        function logError(result, resultCode){
            const strResult = JSON.stringify(result);
            emailLog.addContext("apierrorcode", strResult);
            emailLog.addContext("apierrormsg", resultCode);
            const message = globalProp.Email.EmailFormat('BSMP WhiteList Checker Component', resultCode, strResult, serviceNumber);

            logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`)
            emailLog.error(message);
        }
        //let keepTurn = true;
        let transition = "failure";

         var telNumber = conversation.properties().Mobile; 
         var accNumber = conversation.properties().accountNumber;
         var smpStartTs = conversation.properties().sysDate;
        const jsonData = require('./serviceNumbersWhitelist.json');
        var whitelistedTelNumber = jsonData['whitelist']; 
        // 0322383464 fibr
        // 0325206016 dsl
        logger.addContext("serviceNumber", telNumber);
        emailLog.addContext("subject", globalProp.Email.Subjects.BSMP.BSMPWhitelistChecker);
        emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
        emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.BSMP.BSMPWhitelistChecker);
        emailLog.addContext("usertelephonenumber", telNumber);
        emailLog.addContext("useraccountnumber", '');

        logger.info(`-------------------------------------------------------------------------------------------------------------`)
        logger.info(`- [START] SMP Whitelisting Checker                                                                          -`)
        logger.info(`-------------------------------------------------------------------------------------------------------------`)
        logger.info(`Service Number: [${telNumber}]`);

        try {
            var checkList = whitelistedTelNumber.includes(telNumber);
            console.log("inarray result: " + checkList);
            if(checkList){
                //conversation.transition('inlist');
                transition = 'inlist';
                logger.debug('inlist');
                //done();
            }else{
                //conversation.transition('notinlist');
                logger.debug('notinlist');
                transition = 'notinlist';
                //done();
            }
        } catch (err) {
            console.error('Error caught: ', err);
            //conversation.transition('failure');
            logger.debug('Error caught: ', err);
            transition = 'failure';
            //done();
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



