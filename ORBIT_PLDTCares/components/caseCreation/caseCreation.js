"use strict";

const componentName = require('../../configurations/component_config');
module.exports = {
    metadata: () => ({
        name: componentName.CaseCreation,
        properties: {
            accountNumber: {
                type: "string",
                required: true
            },
            
            serviceNumber: {
                type: "string",
                required: true
            },
            NeType: {
                type: "string",
            },
            message: {
                type: "string",

            },
            customerCity: {
                type: "string",

            },
            firstName: {
                type: "string",

            },
            lastName: {
                type: "string",

            },
            userId: {
                type: "string",
            },
            skillName: {
                type: "string",
                required: true
            },
            subMenu: {
                type: "string",
                required: true
            },
            email: {
                type: "string",
            },
            RecordTypeId: {
                type: "string",
            },
            OwnerId: {
                type: "string",
            },
            Subject: {
                type: "string",
            },
        },
        supportedActions: ['valid','invalid','failure']
    }),
    invoke: (conversation, done) => 
    {
        const accNumber = conversation.properties().accountNumber;
        const svcNumber = conversation.properties().serviceNumber;
        const desc = conversation.properties().message;
        const city = conversation.properties().customerCity;
        const fName = conversation.properties().firstName;
        const lName = conversation.properties().lastName;
        const sMenu = conversation.properties().subMenu;
        const fbId = conversation.request().message.channelConversation.userId;
        const sName = conversation.properties().skillName;
        const recordTypeid = conversation.properties().RecordTypeId;
        const subj = conversation.properties().Subject;
        const channelType = conversation.request().message.channelConversation.channelType;
        const trimmeddesc = desc.replace("By providing us your information, you are allowing us to access your records and process your request.", " ");

        const request = require('request');
        const globalProp = require('../../helpers/globalProperties');
        const instance = require("../../helpers/logger");
        const _logger = instance.logger(globalProp.Logger.Category.CaseCreation.CaseCreation);
        const logger = _logger.getLogger();
        const _emailLog = instance.logger(globalProp.Logger.Category.Mailer);        
        const emailLog = _emailLog.getLogger();

        function logError(result, resultCode){
            const strResult = JSON.stringify(result);
            emailLog.addContext("apierrorcode", strResult);
            emailLog.addContext("apierrormsg", resultCode);
            const message = globalProp.Email.EmailFormat(globalProp.CaseCreation.API.Token.Name, resultCode, strResult, svcNumber);

            logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`);
            emailLog.error(message);
        }

        let transition = '';

        logger.addContext("serviceNumber", svcNumber);
        emailLog.addContext("subject", globalProp.Email.Subjects.CaseCreation.CaseCreation);
        emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
        emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.CaseCreation.CaseCreation);
        emailLog.addContext("usertelephonenumber", svcNumber);
        emailLog.addContext("useraccountnumber", accNumber);

        logger.info(`-------------------------------------------------------------------------------------------------------------`);
        logger.info(`- [START] Case Creation                                                                                     -`);
        logger.info(`-------------------------------------------------------------------------------------------------------------`);
                
        const requestForm = {
            'grant_type': 'password',
            'client_id': '3MVG9Po2PmyYruunIZR7z32Xb6OjYmP20KzxAmsKiRsY5FzXdjH9ItJPz_B6FPlv960i9bYRWZv2_K3FWhYiI',
            'client_secret': '75AEBC8492B1D346F45CD5D5E1E94248A2CD0FF8DA1B3B042F39DD901351241A',
            'username': 'cemsa@pldt.com.ph.cembuat',
            'password': 'C3M!mpL3m3nt@t!0nF0rTh3W!nWXYk1VdD1RJXlfbvxu1Z8vsW7'
        }
        var tokenOptions = globalProp.CaseCreation.API.Token.PostOptions(requestForm);
        logger.debug(`Setting up the post option for API Token: ${JSON.stringify(tokenOptions)}`);
        
        
        logger.info(`Starting to invoke the request for API Token.`);
        
        request(tokenOptions, function (error, result) {
            logger.info(`Invoking request successful.`);
            if (error) {
                logError(error, error.code);
                transition = 'failure';
            }else{
                if(result.statusCode > 200){
                    logError(result, result.statusCode);
                }else{                
                    logger.info(`Request Token success with Response Code: [${result.statusCode}]`);
                    var parsedToken = JSON.parse(result.body)['access_token'];
                    var fullName = fName + " " + lName;
                    var rawToken = parsedToken.toString();
                    var token = rawToken.replace(/"([^"]+(?="))"/g, '$1');
                    logger.info(`Final Token: ${token}`);
                    const authBearer = "Authorization : Bearer " + token;

                    const requestBody = JSON.stringify({
                        'Description': trimmeddesc+',Fb Name: '+fullName +',fbid: '+fbId+',Channel Type: '+channelType,
                        'Type':sName,
                        'Status':'Open - Unassigned',
                        'Origin':'Facebook',
                        'RecordTypeId': recordTypeid,
                        'Subject': subj,
                        'PLDT_Case_Sub_Type__c': sMenu,
                        'Customer_City__c': city
                    });
                    
                    var options = globalProp.CaseCreation.API.CaseCreate.PostOptions(authBearer, requestBody);
                    logger.debug(`Setting up the post option: ${JSON.stringify(options)}`);
            
                    logger.info(`Starting to invoke the request.`);
                    request(options, function (errorMsg, response) {
                        const instance = require("../../helpers/logger");
                        const _logger = instance.logger(globalProp.Logger.Category.CaseCreation.CaseCreation);
                        const logger = _logger.getLogger();
                        logger.addContext("serviceNumber", svcNumber);
                        if (errorMsg){
                            logger.error(errorMsg);
                        }else{
                            if(response.statusCode > 200){
                                logError(response, response.statusCode);
                            }else {                                
                                logger.info(`Invoking request successful.`);
                                logger.debug(`Request success with Status Code: [${response.statusCode}]`);
                                if(response.statusCode == 201){
                                    logger.info(`Successful Case Creation: ${response.body}`);
                                    transition = 'valid';
                                }else{ 
                                    logger.debug(`Case creation response Error: ${response.body}`);
                                    transition = 'failure';
                                }
                            }
                        }                        
                    });
                }
            }
            logger.info(`[Transition]: ${transition}`);
            logger.info(`-------------------------------------------------------------------------------------------------------------`);
            logger.info(`- [END] Case Creation                                                                                       -`);
            logger.info(`-------------------------------------------------------------------------------------------------------------`);

            _logger.shutdown();
            _emailLog.shutdown();
        
            conversation.transition(transition);
            done();
        });
     }
            
};
    