"use strict";

const componentName = require('../../configurations/component_config');
module.exports = {
    metadata: () => ({
        name: componentName.FollowUpDate,
        properties: {
            serviceNumber: {
                type: "string",
                required: true
            },
            requestDate: {
                type: "date",
                required: true
            },
        },
        supportedActions: ['validDate', 'invalidDate', 'invalidFutureDate', 'failure', 'InvalidDateFormat']
    }),
    invoke: (conversation, done) => {
        const moment = require('moment');
        const serviceNumber = conversation.properties().serviceNumber;
        const userDate = conversation.properties().requestDate;

        const globalProp = require('../../helpers/globalProperties');
        const instance = require("../../helpers/logger");
        const _logger = instance.logger(globalProp.Logger.Category.FollowUpDate);
        const logger = _logger.getLogger();
        const _emailLog = instance.logger(globalProp.Logger.Category.Mailer);        
        const emailLog = _emailLog.getLogger();

        function logError(result, resultCode){
            const strResult = JSON.stringify(result);
            emailLog.addContext("apierrorcode", strResult);
            emailLog.addContext("apierrormsg", resultCode);
            const message = globalProp.Email.EmailFormat("No API", resultCode, strResult, svcNumber);

            logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`);
            emailLog.error(message);
        }

        let transition = '';

        logger.addContext("serviceNumber", serviceNumber);
        emailLog.addContext("subject", globalProp.Email.Subjects.FollowUpDate);
        emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
        emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.CaseCreation.FollowupDate);
        emailLog.addContext("usertelephonenumber", serviceNumber);

        logger.info(`-------------------------------------------------------------------------------------------------------------`);
        logger.info(`- [START] Follow Up Date                                                                                    -`);
        logger.info(`-------------------------------------------------------------------------------------------------------------`);

        var validDate = moment(userDate, "mm/dd/yyyy").isValid();
        var date2 = new Date(userDate);
        logger.info(`date 2 : ${date2}`);
        var date1 = new Date();
        var givenDate = new Date(userDate);

        function appendLeadingZeroes(n) {
            if (n <= 9) {
                return "0" + n;
            }
            return n
        }

        let formatted_date = appendLeadingZeroes(date1.getMonth() + 1) + "/" + appendLeadingZeroes(date1.getDate()) + "/" + date1.getFullYear();
        let formatted_userDate = appendLeadingZeroes(date2.getMonth() + 1) + "/" + appendLeadingZeroes(date2.getDate()) + "/" + date2.getFullYear();
        logger.info(`formatted_date : ${formatted_date}`);
        logger.info(`formatted_userDate : ${formatted_userDate}`);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        logger.info(`Difference in days: ${diffDays}`);
        var CurrentDate = new Date();
        
        //User input Date is not older that 3 days of todays date
        if (moment(userDate, 'MM/DD/YYYY', true).isValid()) {
            if (givenDate <= CurrentDate) {
                conversation.keepTurn(true);
                logger.debug(`Valid Date Format! ${givenDate} is less than or equal to ${CurrentDate}`);
                transition = 'validDate';
            }

            else if(givenDate > CurrentDate)  {
                conversation.keepTurn(true);
                logger.debug(`Invalid date futuristic`);
                transition = 'invalidDate';
            }
            else{
                conversation.keepTurn(true);
                logger.debug(`Invalid date futuristic`);
                transition = 'invalidDate';
            }
        }
        else {
            conversation.keepTurn(true);
            logger.debug(`Invalid Date more than 3 days of current date`);
            transition = 'invalidDate';
        }
        logger.info(`[Transition]: ${transition}`);
        logger.info(`-------------------------------------------------------------------------------------------------------------`);
        logger.info(`- [END] Follow Up Date                                                                                      -`);
        logger.info(`-------------------------------------------------------------------------------------------------------------`);

        _logger.shutdown();
        _emailLog.shutdown();

        conversation.transition(transition);
        done();
    }
};


