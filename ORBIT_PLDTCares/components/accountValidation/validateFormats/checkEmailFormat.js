"use strict";
const componentName = require('../../../configurations/component_config');
module.exports = {

    metadata: () => {
        return {
            name: componentName.ValidateEmailFormat,
            properties: {
				email: {
                    type: "string",
                    required: true
                },                
                accountNumber: {
                    type: "string",
                    required: false
                },
                serviceNumber: {
                    type: "string",
                    required: false
                } 
            },
            supportedActions: ['validemailformat', 'invalidemailformat','failure']
        };
    },
invoke: (conversation, done) => {
    const globalProp = require('../../../helpers/globalProperties');
    const instance = require("../../../helpers/logger");
    const _logger = instance.logger(globalProp.Logger.Category.ValidateEmailFormat);
    const logger = _logger.getLogger();
    const _emailLog = instance.logger(globalProp.Logger.Category.Mailer);        
    const emailLog = _emailLog.getLogger();

    function logError(result, resultCode){
        const strResult = JSON.stringify(result);
        emailLog.addContext("apierrorcode", strResult);
        emailLog.addContext("apierrormsg", resultCode);
        const message = globalProp.Email.EmailFormat("Validation of Email Format", resultCode, strResult, svcNumber);

        logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`);
        emailLog.error(message);
    }

    let transition = '';
    var emaillocal = conversation.properties().email;
    var serviceNumber = conversation.properties().serviceNumber;
    var accountnumberlocal =  conversation.properties().accountnumber;
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    logger.addContext("serviceNumber", serviceNumber);
    emailLog.addContext("subject", globalProp.Email.Subjects.EmailFormat);
    emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
    emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.EmailValidation);
    emailLog.addContext("usertelephonenumber", serviceNumber);

    logger.info(`-------------------------------------------------------------------------------------------------------------`);
    logger.info(`- [START] Validate Email Format                                                                             -`);
    logger.info(`-------------------------------------------------------------------------------------------------------------`);    
		
                    if(regex.test(emaillocal)) 
                     {
                        conversation.transition('validemailformat');
                        console.log ('valid email', emaillocal);
                        //done();
                        transition = 'validemailformat';
                        logger.debug('valid email', emaillocal);
                     }
                     else
                     {
                        conversation.transition('invalidemailformat');
                        console.log ('invalid', emaillocal);
                        //done();
                        transition = 'invalidemailformat';
                        logger.debug('invalid email', emaillocal);
                     }
                // }
                logger.info(`-------------------------------------------------------------------------------------------------------------`)
                logger.info(`- [END] Validate Email Format                                                                               -`)
                logger.info(`-------------------------------------------------------------------------------------------------------------`)
        
                _logger.shutdown();
                //conversation.keepTurn(keepTurn);
                conversation.transition(transition);
                done();         
   }
  
};