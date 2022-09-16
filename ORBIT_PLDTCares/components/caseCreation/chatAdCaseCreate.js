"use strict";

const componentName = require('../../configurations/component_config');
module.exports = {
    metadata: () => ({
        name: componentName.ChatAdCaseCreate,
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
            ChatAdId: {
                type: "string",
            },
            OwnerId: {
                type: "string",
            },
            Subject: {
                type: "string",
            },
            fbChatAdId: {
                type: "string",
            },
            caseOrigin: {
                type: "string",
            },
            streetAddress: {
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
        const uId = conversation.properties().userId;
        const lemail = conversation.properties().email;
        const sName = conversation.properties().skillName;
        const recordTypeid = conversation.properties().RecordTypeId;
        const chatAdId = conversation.properties().ChatAdId;
        const ownerid = conversation.properties().OwnerId;
        const subj = conversation.properties().Subject;
        const channelType = conversation.request().message.channelConversation.channelType;
        const fbChatAdId = conversation.properties().fbChatAdId;
        const caseOrigin = conversation.properties().caseOrigin;
        const streetAddress = conversation.properties().streetAddress;

        const request = require('request');
        const globalProp = require('../../helpers/globalProperties');
        const instance = require("../../helpers/logger");
        const _logger = instance.logger(globalProp.Logger.Category.CaseCreation.ChatAdCaseCreate);
        const logger = _logger.getLogger();
        const _emailLog = instance.logger(globalProp.Logger.Category.Mailer);        
        const emailLog = _emailLog.getLogger();

        function logError(result, resultCode){
            const strResult = JSON.stringify(result);
            emailLog.addContext("apierrorcode", strResult);
            emailLog.addContext("apierrormsg", resultCode);
            const message = globalProp.Email.EmailFormat(globalProp.ChatAdCaseCreate.API.ChatAdToken.Name, resultCode, strResult, svcNumber);

            logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`);
            emailLog.error(message);
        }

        let transition = '';

        logger.addContext("serviceNumber", svcNumber);
        emailLog.addContext("subject", globalProp.Email.Subjects.CaseCreation.ChatAdCaseCreate);
        emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
        emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.CaseCreation.ChatAdCaseCreate);
        emailLog.addContext("usertelephonenumber", svcNumber);
        emailLog.addContext("useraccountnumber", accNumber);

        logger.info(`-------------------------------------------------------------------------------------------------------------`);
        logger.info(`- [START] Chat AD Case Create                                                                               -`);
        logger.info(`-------------------------------------------------------------------------------------------------------------`);

        const obj = {
            "accountNumber": accNumber, 
            "serviceNumber": svcNumber, 
            "message": desc, 
            "customerCity": city,
            "firstName": fName,
            "lastName": lName,
            "userId": uId,
            "skillName": sName,
            "subMenu": sMenu,
            "email": lemail,
            "RecordTypeId": recordTypeid,
            "ChatAdId":chatAdId,
            "OwnerId": ownerid,
            "Subject": subj,
            "fbChatAdId": fbChatAdId,
            "caseOrigin": caseOrigin,
            "fbID": fbId,
            "streetAddress": streetAddress                
        };
        const ChatADIDDetails = JSON.stringify(obj);
        logger.info(`data: ${ChatADIDDetails}`);

        const requestForm = {
            'grant_type': 'password',
            'client_id': '3MVG9pcaEGrGRoTJDdjdj5oKEFWyh48yIre125qba0yzhMRPCowd1Tq5O_i1cFcIEgN0GOZ46iruHeWRsumi9',
            'client_secret': 'C15FF3AC2B5E648A50402A9560F23C89EEE56258CDF8184C118F706A2DDEE183',
            'username': 'timothy.diaz@nttdata.com.chatv2',
            'password': 'P@THw0rd@123456'
        }
        var tokenOptions = globalProp.ChatAdCaseCreate.API.ChatAdToken.PostOptions(requestForm);
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
                }else {                
                    logger.info(`Request Token success with Response Code: [${result.statusCode}]`);
                    var parsedToken = JSON.parse(result.body)['access_token'];
                    var rawToken = parsedToken.toString();
                    var token = rawToken.replace(/"([^"]+(?="))"/g, '$1');
                    logger.info(`Final Token: ${token}`);
                    const authBearer = "Authorization : Bearer " + token;

                    const requestBody = JSON.stringify({
                        'Description': desc,
                        'Type':sName,
                        'Status':'Open - Unassigned',
                        'Origin':'FB Chat Ad',
                        'RecordTypeId': recordTypeid,
                        'Subject': subj,
                        'PLDT_Case_Sub_Type__c': sMenu,
                        'Customer_City__c': city,
                        "Chat_Ad_ID__c": fbChatAdId
                    });
                    
                    var options = globalProp.ChatAdCaseCreate.API.ChatAdCaseCreate.PostOptions(authBearer, requestBody);
                    logger.debug(`Setting up the post option: ${JSON.stringify(options)}`);
            
                    logger.info(`Starting to invoke the request.`);
                    request(options, function (errorMsg, response) {
                        const instance = require("../../helpers/logger");
                        const _logger = instance.logger(globalProp.Logger.Category.CaseCreation.ChatAdCaseCreate);
                        const logger = _logger.getLogger();
                        logger.addContext("serviceNumber", svcNumber);
                        if (errorMsg){
                            logger.error(errorMsg);
                        }else{
                            if(response.statusCode > 201){
                                logError(response, response.statusCode);
                            } else{                            
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
            logger.info(`- [END] Chat AD Case Create                                                                                 -`);
            logger.info(`-------------------------------------------------------------------------------------------------------------`);
            _logger.shutdown();
            _emailLog.shutdown();

            conversation.transition(transition);
            done();
        });
     } 
};
    