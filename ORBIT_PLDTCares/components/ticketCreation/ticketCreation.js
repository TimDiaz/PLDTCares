"use strict";
const componentName = require('../../configurations/component_config');
module.exports = {

    metadata: () => ({
            name: componentName.TicketCreation,
             properties: {
				description: {
                    type: "string",
                    required: true
                },
                empeId: {
                    type: "string",
                    required: true
                },
  				faultType: {
                    type: "string",
                    required: true
                },
                priority: {
                    type: "string",
                    required: true
                },
  				promCause: {
                    type: "string",
                    required: true
                },
                reportedBy: {
                    type: "string",
                    required: true
                },
  				serviceNumber: {
                    type: "string",
                    required: true
                }
            }, 
            supportedActions: ['SUCCESS','FAILURE','500']
    }),

    invoke: (conversation, done) => {
        const request = require('request');
        const globalProp = require('../../helpers/globalProperties');
        const instance = require("../../helpers/logger");
        const _logger = instance.logger(globalProp.Logger.Category.TicketCreation.TicketCreation);
        const logger = _logger.getLogger();
        const _emailLog = instance.logger(globalProp.Logger.Category.Mailer);        
        const emailLog = _emailLog.getLogger();

        function logError(result, resultCode){
            const strResult = JSON.stringify(result);
            emailLog.addContext("apierrorcode", strResult);
            emailLog.addContext("apierrormsg", resultCode);
            const message = globalProp.Email.EmailFormat(globalProp.TicketCreation.API.Validate.Name, resultCode, strResult, serviceNumber);

            logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`)
            emailLog.error(message);
        }

        function UpdateCreateFT(aaccNumberinit, telNumberinit, smpStartTsinit, ticketnumber, reportedBy, responseBody){
            var data1 = { 
                            "AccountNumber" : aaccNumberinit, 
                            "TelephoneNumber": telNumberinit, 
                            "smpTS": smpStartTsinit, 
                            "TicketNumberCreateFT": ticketnumber,
                            "ReportedBY": reportedBy,
                            "ResponseBody": responseBody
                        };
            var options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data1),
            };
            
            fetch('https://chatbot171.pldthome.com:7744/updateCreaeteFT', options );
        }
        
        let transition = 'failure';

        var description = conversation.properties().description;
        var empeId = conversation.properties().empeId;
        var faultType = conversation.properties().faultType;
        var priority = conversation.properties().priority;
        var promCause = conversation.properties().promCause;
        var reportedBy = conversation.properties().reportedBy;
        var serviceNumber = conversation.properties().serviceNumber;
       // var accntNumber = conversation.properties().accntNum;

        logger.addContext("serviceNumber", serviceNumber);
        emailLog.addContext("subject", globalProp.Email.Subjects.TicketCreation.TicketCreation);
        emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
        emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.TicketCreation.TicketCreation);
        emailLog.addContext("usertelephonenumber", serviceNumber);
        emailLog.addContext("useraccountnumber", '');

        logger.info(`-------------------------------------------------------------------------------------------------------------`)
        logger.info(`- [START] Ticket Creation                                                                                   -`)
        logger.info(`-------------------------------------------------------------------------------------------------------------`)

        const requestBody = JSON.stringify({
            "description": description,
            "empeId": empeId,
            "faultType": faultType,
            "priority": priority,
            "promCause": promCause,
            "reportedBy": reportedBy,
            "telephoneNumber": serviceNumber
        });

        logger.debug(`Setting up the request body: ${requestBody}`);

        const options = globalProp.TicketCreation.API.Validate.PostOptions(requestBody);
        logger.debug(`Setting up the post option: ${JSON.stringify(options)}`);

        logger.info(`Starting to invoke the request.`)

        request(options, function (error, response) {
            if (error){                
                if (error.statusCode === 500)
                {
                    transition = '500';
                }
                else {
                    transition = 'FAILURE';
                }
                logError(error, error.code);
            }
            else{
                var result = response;
                var createRes = result.body;
                logger.debug(createRes);

                var JSONRes = createRes;
                if (result.statusCode > 200){      
                    if (result.statusCode === 406)
                    {
                        if (JSONRes.spiel)
                        {
                            console.log('Spiel is not null');
                            logger.debug('Speil is not null');
                            conversation.variable('spielMsg', JSONRes.spiel);
                            transition = 'FAILURE';  
                        }
                        else
                        {
                            console.log('Spiel is null');
                            logger.debug('Speil is null');
                            conversation.variable('spielMsg', JSONRes.message);
                            transition = 'FAILURE';
                        }
                    }
                    else if (result.statusCode === 500)
                    {
                        transition = '500';
                    }
                    else {
                        transition = 'FAILURE';
                    }
                    logError(response.body, response.statusCode);
                }
                else{
                    console.log("spielMsg reply to Chat= " , JSONRes.spiel); //OMH logger of success spiel    
                    conversation.variable('spielMsg', JSONRes.spiel);    
                    conversation.variable('ticketNumber', JSONRes.ticketNumber);          
                    transition = 'SUCCESS';
                }
            }
            logger.info(`[Transition]: ${transition}`);
            logger.info(`-------------------------------------------------------------------------------------------------------------`)
            logger.info(`- [END] Ticket Creation                                                                                     -`)
            logger.info(`-------------------------------------------------------------------------------------------------------------`)

            _logger.shutdown();
            _emailLog.shutdown();            
            conversation.transition(transition);
            //done();
        });
    }
};