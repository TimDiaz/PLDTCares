"use strict";

const componentName = require('../../../configurations/component_config');
module.exports = {

    metadata: () => {
        return {
            name: componentName.ValidateMobileFormat,
            properties: {
				mobile: {
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
            supportedActions: ['validmobileformat', 'invalidmobileformat','failure']
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
        const message = globalProp.Email.EmailFormat("Validation of Mobile Format", resultCode, strResult, svcNumber);

        logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`);
        emailLog.error(message);
    }
	let transition = '';	
    var mobile = conversation.properties().mobile;
    var accountnumber =  conversation.properties().accountnumber;
    var serviceNumber = conversation.properties().serviceNumber;
    var regex = /^[0-9]{1,11}(,[0-9]{0,2})?$/;

    logger.addContext("serviceNumber", serviceNumber);
    emailLog.addContext("subject", globalProp.Email.Subjects.EmailFormat);
    emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
    emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.MobileValidation);
    emailLog.addContext("usertelephonenumber", serviceNumber);

    logger.info(`-------------------------------------------------------------------------------------------------------------`);
    logger.info(`- [START] Validate Mobile Format                                                                             -`);
    logger.info(`-------------------------------------------------------------------------------------------------------------`);              

            console.log(conversation.properties().mobile);   
            console.log("mobile and account number: "+ mobile + accountnumber);  
            function validateMobile(mobile) 
            {
                if(!regex.test(mobile)) 
                {
                    return false;
                } 
                 else 
                
                 {
                    return true;
                 }
             }
            
           
            if( !validateMobile(mobile)) 
            {
                //conversation.transition('invalidmobileformat');
                console.log ('invalid mobile', mobile);
                //done();
                transition = 'invalidmobileformat';
                logger.debug('invalid mobile', mobile);
            }  

            else
            {
                if (mobile.length == 11)
                {
                    //conversation.transition('validmobileformat');
                    console.log ('valid mobile', mobile);
                    //done();
                    transition = 'validmobileformat';
                    logger.debug('valid mobile', mobile);
    
                }
                else
                {

                    //conversation.transition('invalidmobileformat');
                    console.log ('invalid mobile', mobile);
                    //done();
                    transition = 'invalidmobileformat';
                    logger.debug('invalid mobile', mobile);
                }
            }
            
            
            logger.info(`-------------------------------------------------------------------------------------------------------------`)
            logger.info(`- [END] Validate Mobile Format                                                                              -`)
            logger.info(`-------------------------------------------------------------------------------------------------------------`)
    
            _logger.shutdown();
            //conversation.keepTurn(keepTurn);
            conversation.transition(transition);
            done();         
    }
   
};