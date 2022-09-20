"use strict";

const componentName = require('../../configurations/component_config');
module.exports = {

    metadata: () => ({
        name: componentName.CheckWaitTime,
        properties: {
            serviceNumber: {
                type: "string",
                required: true
            },
            deploymentid: {
                type: "string",
            },
            buttonid: {
                type: "string",
            },
        },
        supportedActions: ['agentAvail', 'directToAgent', 'directToCase', 'failure']
    }),
    invoke: (conversation, done) => 
    {
        const request = require('request');
        const globalProp = require('../../helpers/globalProperties');
        const instance = require("../../helpers/logger");
        const _logger = instance.logger(globalProp.Logger.Category.CaseCreation.CheckWaitTime);
        const logger = _logger.getLogger();
        const _emailLog = instance.logger(globalProp.Logger.Category.Mailer);        
        const emailLog = _emailLog.getLogger();

        function logError(result, resultCode){
            const strResult = JSON.stringify(result);
            emailLog.addContext("apierrorcode", strResult);
            emailLog.addContext("apierrormsg", resultCode);
            const message = globalProp.Email.EmailFormat(globalProp.CheckWaitTime.API.WaitTime.Name, resultCode, strResult, svcNumber);

            logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`);
            emailLog.error(message);
        }

        let transition = '';

        const serviceNumber = conversation.properties().serviceNumber;
        const deploymentid = conversation.properties().deploymentid;
        const buttonid = conversation.properties().buttonid;
        const orgId = "00D0T0000000ce2";

        logger.addContext("serviceNumber", serviceNumber);
        emailLog.addContext("subject", globalProp.Email.Subjects.CaseCreation.CheckWaitTime);
        emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
        emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.CaseCreation.CheckWaitTime);
        emailLog.addContext("usertelephonenumber", serviceNumber);

        logger.info(`-------------------------------------------------------------------------------------------------------------`);
        logger.info(`- [START] Check Wait Time                                                                                   -`);
        logger.info(`-------------------------------------------------------------------------------------------------------------`);
        
        var options = globalProp.CheckWaitTime.API.WaitTime.PostOptions(orgId, deploymentid, buttonid);
        logger.debug(`Setting up the post option: ${JSON.stringify(options)}`);
        
        logger.info(`Starting to invoke the request for API Token.`);
        request(options, function (error, response) {
            if (error) {
                conversation.variable('waitTime', "undefined");
                conversation.variable('waitTimeSec', 0);
                conversation.variable('LiveAgent_queue', queueName);
                logError(error, error.code);
                transition = 'failure';
            }
            else {
                if(response.statusCode > 200){
                    logError(response, response.statusCode);
                }else{                
                    //SAMPLE PARSE replace with mapped return Payload {}{}
                    var res = JSON.parse(response.body);
                    logger.info(`API Response: ${JSON.stringify(res)}`);
                    var waitTime = JSON.stringify(res.messages[0].message.results[0].estimatedWaitTime);

                    // var waitTime = 5; // seconds
                    // var waitTime = 120; // for testing with queue
                    // var waitTime = 1500; // for testing with queue
                    // var waitTime = 1860; // for testing more than 30mins
                    // var waitTime = 2400; // for testing more than 40mins
                    var minuteWaitTime = Math.round((waitTime) / (60));
                    logger.info(`wait time: ${waitTime}`);
                    // - Variable declaration Layer

                    // start if condition for livechat ids VLreports
                    if (deploymentid == '5722v000000gloF' && buttonid == '5732v000000gn4p') {
                        var queueName = "PLDT_Tech_Live_Chat Button";
                    }else if (deploymentid == '5722v000000gloE' && buttonid == '5732v000000gn4o') {
                        var queueName = "PLDT_NonTech_Live_Chat Button";
                    }else if (deploymentid == '5722u000000XZAR' && buttonid == '5732u0000008OIU') {
                        var queueName = "PLDT_FollowUp_Live_Chat Button";
                    }else if (deploymentid == '5722u000000XZAW' && buttonid == '5732u0000008OIZ') {
                        var queueName = "PLDT_Reconnection_Live_Chat Button";
                    }else if (deploymentid == '5722u0000008OJN' && buttonid == '5732u000000CaSe') {
                        var queueName = "PLDT_VIP_Live_Chat Button";
                    }else{
                        var queueName = "PLDT_Default_Live_Chat Button";
                    }
                    // end for livechat ids VLreports

                    if(waitTime == null || waitTime == NaN || waitTime == 'undefined')
                    {
                        conversation.variable('waitTime', "undefined");
                        conversation.variable('waitTimeSec', 0);
                        conversation.variable('LiveAgent_queue', queueName);
                        logger.error(`no wait time: ${error}`);
                        transition = 'failure';
                    }else{
                        if ((waitTime >= 1 && waitTime <= 59) || (waitTime <= 0)) {
                            conversation.variable('waitTime', minuteWaitTime);
                            conversation.variable('waitTimeSec', waitTime);
                            conversation.variable('LiveAgent_queue', queueName);
                            logger.info(`Transition ZeroMinute agentAvail`);
                            transition = 'agentAvail';
                        }else{
                            if (minuteWaitTime >= 31) {
                                conversation.variable('waitTime', minuteWaitTime);
                                conversation.variable('waitTimeSec', waitTime);
                                conversation.variable('LiveAgent_queue', queueName);
                                conversation.variable('waitTimeRange', 'morethanthirty');
                                logger.info(`queuePosition greater than max threshold: ${waitTime}`);
                                transition = 'directToCase';
                            }else{
                                conversation.variable('waitTime', minuteWaitTime);
                                conversation.variable('waitTimeSec', waitTime);
                                conversation.variable('LiveAgent_queue', queueName);
                                logger.info(`queuePosition lower than max threshold: ${waitTime}`);
                                transition ='directToAgent';
                            }
                        }
                    }
                }
            }
            logger.info(`[Transition]: ${transition}`);
            logger.info(`-------------------------------------------------------------------------------------------------------------`);
            logger.info(`- [END] Check Wait Time                                                                                     -`);
            logger.info(`-------------------------------------------------------------------------------------------------------------`);

            _logger.shutdown();
            _emailLog.shutdown();

            conversation.transition(transition);
            done();
        });
    }
};
