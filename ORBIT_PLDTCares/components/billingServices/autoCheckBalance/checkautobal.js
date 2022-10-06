"use strict";

const componentName = require('../../../configurations/component_config');
module.exports = {
  metadata: () => ({
    name: componentName.BillingServices.Autobal,
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
    supportedActions: ['valid', 'invalid', 'failure', 'fuseDown']
  }),
  invoke: (conversation, done) => {
    const request = require('request');
    const globalProp = require('../../../helpers/globalProperties');
    var instance = require("../../../helpers/logger");
    var _logger = instance.logger(globalProp.Logger.Category.BillingServices.Autobal);
    var logger = _logger.getLogger();
    var _emailLog = instance.logger(globalProp.Logger.Category.Mailer);
    var emailLog = _emailLog.getLogger();

    function logError(result, resultCode) {
      const strResult = JSON.stringify(result);
      emailLog.addContext("apierrorcode", strResult);
      emailLog.addContext("apierrormsg", resultCode);
      const message = globalProp.Email.EmailFormat(globalProp.BillingServices.Autobal.API.CheckBalance.Name, resultCode, strResult, svcNum);

      logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`)
      emailLog.error(message);
    }

    function HasInvalidServiceStatus(responseBody, servicestatus) {
      return (responseBody.serviceProfiles.find(e => e.serviceStatus === servicestatus) !== undefined)
    }

    let transition = '';

    const svcNum = conversation.properties().serviceNumber;
    const acctNum = conversation.properties().accountNumber;

    logger.addContext("serviceNumber", svcNum);
    emailLog.addContext("subject", globalProp.Email.Subjects.BillingServices.Autobal);
    emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
    emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.BillingServices.Autobal);
    emailLog.addContext("usertelephonenumber", svcNum);
    emailLog.addContext("useraccountnumber", acctNum);

    logger.info(`-------------------------------------------------------------------------------------------------------------`);
    logger.info(`- [START] Check Auto Balance                                                                                -`);
    logger.info(`-------------------------------------------------------------------------------------------------------------`);

    var options = globalProp.BillingServices.Autobal.API.CheckBalance.GetOptions(svcNum);
    logger.debug(`Setting up the post option for API Token: ${JSON.stringify(options)}`);
    request(options, function (errorFuse, responseFused) {
      if (errorFuse) {
        transition = 'fuseDown'; //500 return
        logError(errorFuse, errorFuse.code);
        conversation.variable('statementDate', "-");
      }
      else {
        var fuseResponseBody;
        if (typeof (responseFused.body) === "string")
          fuseResponseBody = JSON.parse(responseFused.body);
        else
          fuseResponseBody = responseFused.body;

        if (fuseResponseBody.errorMessage !== null)
          throw fuseResponseBody.errorMessage;
        //fuseResponseError = responseFused.errorMessage;

        logger.info("Fuse Response Body: ", JSON.stringify(fuseResponseBody));
        logger.info("Fuse API Error: ", fuseResponseBody.errorMessage);

        if (responseFused.statusCode == 200) {
          var parsedBalanceProfile = fuseResponseBody.balanceProfile;

          logger.info("parsed balanceProfile: ", JSON.stringify(parsedBalanceProfile));
          var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

          var concatStatementDate = new Date(parsedBalanceProfile.statementDate.substr(0, 9));
          var statementDateMonth = months[concatStatementDate.getMonth()];
          var statementDateDay = concatStatementDate.getDate();
          var statementDateYear = concatStatementDate.getFullYear();
          logger.info("Statement Date: ", statementDateMonth + " " + statementDateDay + ", " + statementDateYear);

          var parsedcustomerProfile = fuseResponseBody.customerProfile;
          var emailAdd = parsedcustomerProfile[0].emailAddress;
          var duedate1 = parsedcustomerProfile[0].dueDate;
          logger.info("Parsed Due Date", duedate1);
          var concatDueDate = new Date(duedate1);
          var dueDateMonth = months[concatDueDate.getMonth()];
          var dueDateDay = concatDueDate.getDate();
          var dueDateYear = concatDueDate.getFullYear();
          logger.info("Due Date: ", dueDateMonth + " " + dueDateDay + ", " + dueDateYear);

          if (emailAdd != null) {
            var firstLet = emailAdd.substr(0, 1);
            var atPos = emailAdd.search("@");
            var toMask = emailAdd.substr(1, atPos - 1);
            var maskLength = toMask.length;
            var afterAt = emailAdd.substr(atPos);
            var mask = "*";
            var formattedEmail = firstLet + mask.repeat(maskLength) + afterAt;
          } else {
            var formattedEmail = "null";
          }

          conversation.variable('DueDates', dueDateMonth + " " + dueDateDay + ", " + dueDateYear);
          logger.info('DueDates', dueDateMonth + " " + dueDateDay + ", " + dueDateYear);
          conversation.variable('statementDate', statementDateMonth + " " + statementDateDay + ", " + statementDateYear);
          conversation.variable('balEmailAdd', formattedEmail);
          transition = 'valid';

          if (HasInvalidServiceStatus(fuseResponseBody, 'Suspended')) {
            //conversation.transition('failed');
            conversation.variable('serviceStatus', 'Suspended');
            transition = 'failure';
            logger.info('serviceStatus condition: ', 'Suspended');

          }
          else if (HasInvalidServiceStatus(fuseResponseBody, 'Barred')) {
            //conversation.transition('failed');
            conversation.variable('serviceStatus', 'Barred');
            transition = 'failure';
            logger.info('serviceStatus condition: ', 'Barred');
          }
          else {
            // conversation.transition('passed');
            conversation.variable('serviceStatus', 'passed');
            transition = 'valid';
            logger.info('serviceStatus condition: ', 'Active');

          }
        }
        else {
          if (responseFused.statusCode == 404) {
            transition = 'fuseDown';
            conversation.variable('statementDate', "-");
          }
          else {
            transition = 'fuseDown'; //500 return
            conversation.variable('statementDate', "-");
            logError(responseFused, responseFused.statusCode);
          }
        }
      }
      logger.info(`[Transition]: ${transition}`);
      logger.info(`-------------------------------------------------------------------------------------------------------------`);
      logger.info(`- [END] Auto Check Balance                                                                                      -`);
      logger.info(`-------------------------------------------------------------------------------------------------------------`);
      _logger.shutdown();
      _emailLog.shutdown();
  
      conversation.transition(transition);
    });

    
    // done();
  }

};