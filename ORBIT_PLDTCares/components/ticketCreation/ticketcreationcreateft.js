"use strict";
const componentName = require('../../configurations/component_config');
module.exports = {

    metadata: function metadata() {
        return {
            name: componentName.TicketCreationFT,
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
                },
                promSubType: {
                    type: "string",
                    required: true
                },
                promWorgName: {
                    type: "string",
                    required: true
                },
                promCategory: {
                    type: "string",
                    required: true
                },
                promSubCategory: {
                    type: "string",
                    required: true
                },
                sysDate: {
                    type: "string",
                    required: true
                },
                accntNum: {
                    type: "string",
                    required: true
                }
             }, 
                supportedActions: ['SUCCESS','FAILURE','500']
        };
    },

    invoke: (conversation, done) => {
        const fetch = require('node-fetch');
        const request = require('request');
        const globalProp = require('../../helpers/globalProperties');
        const instance = require("../../helpers/logger");
        const _logger = instance.logger(globalProp.Logger.Category.TicketCreation.ticketcreationcreateft);
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
            var options = globalProp.TicketCreation.API.UpdateCreateFt.PostOptions({ 
                "AccountNumber" : aaccNumberinit, 
                "TelephoneNumber": telNumberinit, 
                "smpTS": smpStartTsinit, 
                "TicketNumberCreateFT": ticketnumber,
                "ReportedBY": reportedBy,
                "ResponseBody": responseBody
            });            
            fetch(globalProp.TicketCreation.API.UpdateCreateFt.URL, options );
        }

        let transition = 'failure';

        var description = conversation.properties().description;
        var empeId = conversation.properties().empeId;
        var faultType = conversation.properties().faultType;
        var priority = conversation.properties().priority;
        var promCause = conversation.properties().promCause;
        var reportedBy = conversation.properties().reportedBy;
        var serviceNumber = conversation.properties().serviceNumber;
        var promSubType = conversation.properties().promSubType;
        var promWorgName = conversation.properties().promWorgName;
        var promCategory = conversation.properties().promCategory;  
        var promSubCategory = conversation.properties().promSubCategory;
        var sysDate = conversation.properties().sysDate;
        var accntNumber = conversation.properties().accntNum;
        
        logger.addContext("serviceNumber", serviceNumber);
        emailLog.addContext("subject", globalProp.Email.Subjects.TicketCreation.CreateFT);
        emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
        emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.TicketCreation.TicketCreationCreateFt);
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
                "telephoneNumber": serviceNumber,
                "promSubType": promSubType,
                "promWorgName": promWorgName,
                "promCategory": promCategory,
                "promSubCategory": promSubCategory
            });

        logger.debug(`Setting up the request body: ${requestBody}`);

        const options = globalProp.TicketCreation.API.Validate.PostOptions(requestBody);
        logger.debug(`Setting up the post option: ${JSON.stringify(options)}`);

        logger.info(`Starting to invoke the request.`)

        request(options, function (error, response) {
            if (error) {                
                logError(error, error.code);
            }
            else{
                var result = response;
                var createRes = JSON.parse(result.body);
                const responseStr = JSON.stringify(createRes).replace('http://', '');   

                if (result.statusCode > 200){        
                    if (result.statusCode === 406)
                    {
                        console.log("Stringify createRes data 406 " + JSON.stringify(createRes));
                        logger.debug("Stringify createRes data 406 " + JSON.stringify(createRes));
                        var spiel406 = JSON.stringify(createRes.spiel).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                        var msg406 = JSON.stringify(createRes.message).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                        // console.log("Stringify createRes data ticketnumber 406: " + JSON.stringify(createRes.ticketNumber).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,''));
                        // var tcktNum = JSON.stringify(createRes.ticketNumber).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                        console.log("Stringify createRes data 406 testing2 pipe " + JSON.stringify(createRes) + " | " + spiel406 + " | " + msg406);
                        logger.debug("Stringify createRes data 406 testing2 pipe " + JSON.stringify(createRes) + " | " + spiel406 + " | " + msg406);
                        // console.log(createRes);

                        if (createRes.spiel)
                        {
                            // var spiel406 = JSON.stringify(createRes.spiel).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                            UpdateCreateFT(accntNumber, serviceNumber, sysDate, "ERROR406", reportedBy, responseStr);
                            console.log('Spiel is not null: ' + spiel406);
                            logger.debug('Spiel is not null: ' + spiel406);
                            conversation.variable('spielMsg', spiel406);
                            //conversation.transition('FAILURE');
                            //done();   
                            transition = 'FAILURE';                        
                        }
                        else
                        {
                            // var msg406 = JSON.stringify(createRes.message).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                            UpdateCreateFT(accntNumber, serviceNumber, sysDate, "ERROR406", reportedBy, responseStr);
                            console.log('Spiel is not null: ' + spiel406);
                            logger.debug('Spiel is not null: ' + spiel406);
                            conversation.variable('spielMsg', msg406);
                            //conversation.transition('FAILURE');
                            //done();
                            transition = 'FAILURE';
                        }                        
                        //done();
                    }    
                    else if (result.statusCode === 500 || result.statusCode === 404)
                    {
                        console.log("response error raw 500 || 404",JSON.stringify(result));
                        logger.debug("response error raw 500 || 404",JSON.stringify(result));
                        UpdateCreateFT(accntNumber, serviceNumber, sysDate, "ERROR500", reportedBy, responseStr);
                        //conversation.transition('500');
                        //done();        
                        transition = '500';
                    }
                    else{
                        //  conversation.reply({ text: 'OOPS, Error Happened! Contact Administrator.'});
                        console.log("response error raw else on 500 || 404",JSON.stringify(result));
                        logger.debug("response error raw else on 500 || 404",JSON.stringify(result));
                        UpdateCreateFT(accntNumber, serviceNumber, sysDate, "FAILURE", reportedBy, responseStr);
                        //conversation.transition('FAILURE');
                        //done();
                        transition = 'FAILURE';
                    }
                    logError(result, result.statusCode);
                   // sendEmail(responseStr, result.statusCode, accntNumber, serviceNumber)
                }
                else{
                    console.log("Stringify createRes data: " + JSON.stringify(createRes));
                    console.log("Stringify createRes data ticketnumber: " + JSON.stringify(createRes.ticketNumber).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,''));
                    logger.debug("Stringify createRes data ticketnumber: " + JSON.stringify(createRes.ticketNumber).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,''));
                    var tcktNum = JSON.stringify(createRes.ticketNumber).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                    var spiel200 = JSON.stringify(createRes.spiel).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                    
                    
                    if(tcktNum == null){
                        var tcktNumData = JSON.stringify(result);
                        UpdateCreateFT(accntNumber, serviceNumber, sysDate, tcktNumData, reportedBy, responseStr);
                    }else{
                        var tcktNumData = tcktNum;
                        UpdateCreateFT(accntNumber, serviceNumber, sysDate, tcktNumData, reportedBy, responseStr);
                    }

                    console.log("raw result FLY = " , result);
                    logger.debug("raw result FLY = " , result);
                    // var JSONRes = JSON.parse(createRes);
                    console.log("spielMsg reply to Chat FLY= " , spiel200); //OMH logger of success spiel
                    logger.debug("spielMsg reply to Chat FLY= " , spiel200);
                    conversation.variable('spielMsg', spiel200);
                    conversation.variable('ticketNumber', tcktNum);
                    //conversation.transition('SUCCESS');
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
        });            
    }
};