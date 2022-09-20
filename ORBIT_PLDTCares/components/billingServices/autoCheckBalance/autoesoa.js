"use strict";

const componentName = require('../../../configurations/component_config');
module.exports = {
  metadata: () => ({
    name: componentName.BillingServices.Autoesoa,
    properties: {
      serviceNumber: {
        type: "string",
        required: true
      },
      monthBill: {
        type: "string",
        required: true
      }
    },
    supportedActions: ['success', 'invalid', 'failed', 'invalidparam', 'invalidBillingDate', 'InvalidEmail']
  }),
  invoke: (conversation, done) => {
    const request = require('request');
    const globalProp = require('../../../helpers/globalProperties');
    const instance = require("../../../helpers/logger");
    const _logger = instance.logger(globalProp.Logger.Category.BillingServices.Autoesoa);
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

    var svcNum = conversation.properties().serviceNumber;
    var month = conversation.properties().monthBill;

    logger.addContext("serviceNumber", svcNum);
    emailLog.addContext("subject", globalProp.Email.Subjects.BillingServices.Autoesoa);
    emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
    emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.BillingServices.Autoesoa);
    emailLog.addContext("usertelephonenumber", svcNum);
    // emailLog.addContext("useraccountnumber", acctNum);

    logger.info(`-------------------------------------------------------------------------------------------------------------`);
    logger.info(`- [START] Check Auto ESOA                                                                                    -`);
    logger.info(`-------------------------------------------------------------------------------------------------------------`);

    if (month == 'Current Month') {
      //var a = new Date();
      var numMon = 1;
    }
    else if (month == 'Last 3 Months') {
      //var b = new Date();
      var numMon = 3;
    }

    var options = globalProp.BillingServices.Autoesoa.API.GetEsoaBalance.GetOptions(svcNum, numMon);
    logger.debug(`Setting up the post option for API Token: ${JSON.stringify(options)}`);

    request(options, function (error, response) {
      logger.info(response.body);
      if (error) {
        logError(error, error.code);

        transition = 'failed';
      }
      else {
        if (response.statusCode == 200) {
          transition = 'success';
        } //auto bal get email end
        else{
          if (response.statusCode == 400) {
            transition = 'failed';
          }
          else if (response.statusCode == 402) {
            transition = 'invalidparam';
          }
          else if (response.statusCode == 403) {
            transition = 'InvalidEmail';
          }
          else if (response.statusCode == 404) {
            transition = 'invalidBillingDate';
          }
          else {
            transition = 'failed'; //500 return
          }
        }
      }
      logger.info(`[Transition]: ${transition}`);
      logger.info(`-------------------------------------------------------------------------------------------------------------`);
      logger.info(`- [END] Check Auto ESOA                                                                                       -`);
      logger.info(`-------------------------------------------------------------------------------------------------------------`);

      _logger.shutdown();
      _emailLog.shutdown();

      conversation.transition(transition);
      done();
    }) // .catch here)

  }

};