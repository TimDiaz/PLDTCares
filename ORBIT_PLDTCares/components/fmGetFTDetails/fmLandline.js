"use strict";

const componentName = require('../../configurations/component_config');
module.exports = {
    metadata: () => ({
        name: componentName.FMgetFTDetails.FMLandline,
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
        supportedActions: ['withLandline','withoutLandline','failure']
    }),

    invoke: (conversation, done) => {
        const request = require('request');
        const Logic = require('../../businesslogics/fmGetFTDetails_logic').Logic;
        const globalProp = require('../../helpers/globalProperties');
        const instance = require("../../helpers/logger");
        const _logger = instance.logger(globalProp.Logger.Category.FMGetFTDetail.FMLandline);
        const logger = _logger.getLogger();
        const _emailLog = instance.logger(globalProp.Logger.Category.Mailer);        
        const emailLog = _emailLog.getLogger();

        let transition = 'failure';

        var accountNumber = conversation.properties().accountNumber;
        const serviceNumber = conversation.properties().serviceNumber;
        var optionType = "12"

        logger.addContext("serviceNumber", serviceNumber);
        emailLog.addContext("subject", globalProp.Email.Subjects.FMgetFTDetails.FMLandline);
        emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
        emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.FMgetFTDetails.FMLandline);
        emailLog.addContext("usertelephonenumber", serviceNumber);
        emailLog.addContext("useraccountnumber", accountNumber);

        const logic = new Logic(logger, emailLog, globalProp);

        logger.info(`-------------------------------------------------------------------------------------------------------------`)
        logger.info(`- [START] FM Get FT Details - FM Landline                                                                   -`)
        logger.info(`-------------------------------------------------------------------------------------------------------------`)

        const requestBody = JSON.stringify({
            "optionType": optionType,
            "serviceId": accountNumber
        });
        logger.debug(`Setting up the request body: ${requestBody}`);
        
        const options = globalProp.FMGetFTDetails.API.PostOptions(requestBody);
        logger.debug(`Setting up the post option: ${JSON.stringify(options)}`);

        logger.info(`Starting to invoke the request.`)  
        request(options, function (error, response) {
            if (error)
            {
                transition = logic.EmailLogError(error, error.code, serviceNumber).Transition;  
            }
            else {
                if(response.statusCode > 200){
                    transition = logic.EmailLogError(response.body, response.statusCode, serviceNumber).Transition;  
                }
                else{  
                    var respBody = response.body;
                    var JSONRes  = JSON.parse(respBody);

                    logger.debug(`[Response Body] ${respBody}`);
                    logger.debug(`[Service Type] ${JSONRes.result.SERVICE_TYPE}`)
                    logger.debug(`[Account Number] ${accountNumber}`)

                    const result = logic.FMInternet(JSONRes.result.SERVICE_TYPE);
                    transition = result.Transition;

                    result.Variables.forEach(element => {
                        conversation.variable(element.name, element.value);
                        logger.info(`[Variable] Name: ${element.name} - Value ${element.value}`);
                    });
                }
            }

            logger.info(`[Transition] ${transition}`);
            logger.info(`-------------------------------------------------------------------------------------------------------------`)
            logger.info(`- [END] FM Get FT Details - FM Landline                                                                     -`)
            logger.info(`-------------------------------------------------------------------------------------------------------------`)

            _logger.shutdown();
            _emailLog.shutdown();

            conversation.transition(transition);
            done();
        });
      }
  };