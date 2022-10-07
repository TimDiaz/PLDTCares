"use strict";

const componentName = require('../../../configurations/component_config');
module.exports = {
  metadata: () => ({
    name: componentName.BillingServices.AccounetBalance,
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

    // #region Setup Properties  
    const svcNum = conversation.properties().serviceNumber;
    const acctNum = conversation.properties().accountNumber;
    // #endregion

    // #region Imports
    const request = require('request');
    const moment = require('moment');
    const globalProp = require('../../../helpers/globalProperties');
    const emailSender = require('../../../helpers/emailsender');
    var instance = require("../../../helpers/logger");
    // #endregion

    // #region Initialization
    var _logger = instance.logger(globalProp.Logger.Category.BillingServices.Autobal);
    var logger = _logger.getLogger();

    logger.sendEmail = ((result, resultCode) => {
      const strResult = JSON.stringify(result);
      const message = globalProp.Email.EmailFormat(globalProp.BillingServices.Autobal.API.GetAccountBalance.Name, resultCode, strResult, svcNumber);
      logger.error(`[ERROR]: ${strResult}`);
      emailSender(globalProp.Email.Subjects.BillingServices.Autobal, message, globalProp.Logger.BCPLogging.AppNames.BillingServices.Autobal, strResult, resultCode, accNumber, svcNumber)
    })

    logger.start = (() => {
      logger.info(`-------------------------------------------------------------------------------------------------------------`);
      logger.info(`- [START] Check Auto Balance                                                                                -`);
      logger.info(`-------------------------------------------------------------------------------------------------------------`);
    });

    logger.end = (() => {
      logger.info(`[Transition]: ${transition}`);
      logger.info(`-------------------------------------------------------------------------------------------------------------`);
      logger.info(`- [END] Auto Check Balance                                                                                  -`);
      logger.info(`-------------------------------------------------------------------------------------------------------------`);

      _logger.shutdown();

      conversation.transition(transition);
      done();
    });

    function HasInvalidServiceStatus(responseBody, servicestatus) {
      return (responseBody.serviceProfiles.find(e => e.serviceStatus === servicestatus) !== undefined)
    }

    let transition = '';

    logger.addContext("serviceNumber", svcNum);
    // #endregion

    logger.start();

    var AcctNumOptions = globalProp.BillingServices.Autobal.API.GetAccountBalance.GetOptions(acctNum);
    logger.debug(`Setting up the post option for API Token: ${JSON.stringify(AcctNumOptions)}`);

    logger.info(`Starting to invoke the request for API Token.`);
    request(AcctNumOptions, function (error, response) {
      if (error) {
        transition = 'fuseDown';
        logger.sendEmail(error, error.code);
        logger.end();
      }
      else {
        var responseBody;
        if (typeof (response.body) === "string")
          responseBody = JSON.parse(response.body);
        else
          responseBody = response.body;

        logger.info("parsed mobility body :", response.body);
        logger.info("Mobility Error: ", error);
        if (response.statusCode > 200) {
          if (responseBody.errorMessage != "2") {
            transition = 'fuseDown';
            logger.sendEmail(responseBody, response.statusCode);
            logger.end();
          }
        }
        else {
          try {
            logger.info("[Kenan Service] Get Account Balanace Body: ", responseBody);
            logger.info("[Kenan Service] Get Account Balanace Message: ", responseBody.Message);

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
              // conversation.variable('dueDate', dueDateMonth + "/" + dueDateDay + "/" + dueDateYear);
              var parseDueDate2 = Date.parse(parsedDueDate);
              var duedate2 = moment(parseDueDate2);
              //logger.info('DUE DATE: ', duedate2.format("MMMM DD, YYYY"));

              var options = globalProp.BillingServices.Autobal.API.CheckBalance.GetOptions(svcNum);
              logger.debug(`Setting up the post option for API Token: ${JSON.stringify(options)}`);
              request(options, function (errorFuse, responseFused) {
                logger.info("Autobalance Response:", responseFused.body);
                if (errorFuse) {
                  transition = 'fuseDown'; //500 return
                  logger.sendEmail(errorFuse, errorFuse.code);
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
                      logger.sendEmail(responseFused.body, responseFused.statusCode);
                    }
                  }
                }
                logger.end();
              });
            }
            else
              throw responseBody.Message;
          }
          catch (e) {
            transition = 'fuseDown';
            logger.sendEmail(response.body, response.statusCode);
            logger.end();
          }
        }
      }
    });
  }
};