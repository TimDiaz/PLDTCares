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
    const moment = require('moment');
    const globalProp = require('../../../helpers/globalProperties');
    const instance = require("../../../helpers/logger");
    const _logger = instance.logger(globalProp.Logger.Category.BillingServices.Autobal);
    const logger = _logger.getLogger();
    const _emailLog = instance.logger(globalProp.Logger.Category.Mailer);
    const emailLog = _emailLog.getLogger();

    function logError(result, resultCode) {
      const strResult = JSON.stringify(result);
      emailLog.addContext("apierrorcode", strResult);
      emailLog.addContext("apierrormsg", resultCode);
      const message = globalProp.Email.EmailFormat(globalProp.BillingServices.Autobal.API.GetAccountBalance, resultCode, strResult, svcNum);

      logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`)
      emailLog.error(message);
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
    logger.info(`- [START] Check Auto Balance                                                                                    -`);
    logger.info(`-------------------------------------------------------------------------------------------------------------`);


    var AcctNumOptions = globalProp.BillingServices.Autobal.API.GetAccountBalance.GetOptions(acctNum);
    logger.debug(`Setting up the post option for API Token: ${JSON.stringify(AcctNumOptions)}`);


    logger.info(`Starting to invoke the request for API Token.`);
    request(AcctNumOptions, function (error, response) {
      if (error) {
        transition = 'fuseDown';
        logError(error, error.code);
      }
      else {
        logger.info("parsed mobility body :", response.body);
        logger.info("Mobility Error: ", error);
        if (response.statusCode > 200) {
          transition = 'fuseDown';
          logError(response, response.statusCode);
        }
        else {
          try {
            logger.info("[Kenan Service] Get Account Balanace Body: ", response.body);
            logger.info("[Kenan Service] Get Account Balanace Message: ", responseBody.Message);

            var responseBody;
            if (typeof (response.body) === "string")
              responseBody = JSON.parse(response.body);
            else
              responseBody = response.body;

            if (responseBody.Code === "0" && responseBody.Message === "Successful") {
              var parsedPaymentAmount = responseBody.PaymentAmount;
              var floatPaymentAmount = parseFloat(parsedPaymentAmount);
              conversation.variable('totalPayment', floatPaymentAmount.toFixed(2));

              var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

              var parsedPaymentDate = responseBody.PaymentDate;
              var payDateFormatted = new Date(parsedPaymentDate);
              var payDateMonth = months[payDateFormatted.getMonth()];
              var payDateDay = payDateFormatted.getDate();
              var payDateYear = payDateFormatted.getFullYear();
              conversation.variable('paymentdate', payDateMonth + " " + payDateDay + ", " + payDateYear);

              var parsedPreviousBalance = responseBody.PreviousBalance;
              var floatPreviousBalance = parseFloat(parsedPreviousBalance);
              conversation.variable('prevBalanceDueAmt', floatPreviousBalance.toFixed(2));

              var parsedCurrentCharges = responseBody.CurrentCharges;
              var floatCurrentCharges = parseFloat(parsedCurrentCharges);
              conversation.variable('currentcharges', floatCurrentCharges.toFixed(2));

              var parsedCurrentBalance = responseBody.CurrentBalance;
              var floatCurrentBalance = parseFloat(parsedCurrentBalance);
              conversation.variable('currentBalance', floatCurrentBalance.toFixed(2));

              var parsedDueDate = responseBody.DueDate;
              var dueDateFormatted = new Date(parsedDueDate);
              var dueDateMonth = String(dueDateFormatted.getMonth() + 1).padStart(2, '0');
              var dueDateDay = dueDateFormatted.getDate();
              var dueDateYear = dueDateFormatted.getFullYear();
              conversation.variable('dueDate', dueDateMonth + "/" + dueDateDay + "/" + dueDateYear);;
              conversation.variable('dueDate', dueDateMonth + "/" + dueDateDay + "/" + dueDateYear);
              var parseDueDate2 = Date.parse(parsedDueDate);
              var duedate2 = moment(parseDueDate2);
              logger.info(duedate2.format("MMMM DD, YYYY"));

              var options = globalProp.BillingServices.Autobal.API.CheckBalance.GetOptions(svcNum);
              logger.debug(`Setting up the post option for API Token: ${JSON.stringify(options)}`);
              request(options, function (errorFuse, responseFused) {
                instance = require("../../../helpers/logger");
                _logger = instance.logger(globalProp.Logger.Category.BillingServices.Autobal);
                logger = _logger.getLogger();
                logger.addContext("serviceNumber", svcNum);

                if (errorFuse) {
                  transition = 'fuseDown'; //500 return
                  logError(errorFuse, errorFuse.code);
                  conversation.variable('statementDate', "-");
                }
                else {
                  var fuseResponseBody;
                  if (typeof (response.body) === "string")
                    fuseResponseBody = JSON.parse(responseFuse.body);
                  else
                    fuseResponseBody = responseFuse.body;

                  if(fuseResponseBody.errorMessage !== null)
                    throw fuseResponseBody.errorMessage;

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
                    conversation.variable('statementDate', statementDateMonth + " " + statementDateDay + ", " + statementDateYear);
                    conversation.variable('balEmailAdd', formattedEmail);
                    transition = 'valid';

                    if (fuseResponseBody.serviceProfiles.includes('Suspended')) {
                      //conversation.transition('failed');
                      conversation.variable('serviceStatus', 'Suspended');
                      transition = 'failure';
                      logger.info('serviceStatus condition: ', 'Suspended');
                    }
                    else if (fuseResponseBody.serviceProfiles.includes('Barred')) {
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

              });
            }
            else
              throw responseBody.Message;
          }
          catch (e) {
            transition = 'fuseDown';
            logError(response, response.statusCode);
          }
        }
      }
      _logger.shutdown();
      _emailLog.shutdown();

      conversation.transition(transition);
      done();
    });
  }

};