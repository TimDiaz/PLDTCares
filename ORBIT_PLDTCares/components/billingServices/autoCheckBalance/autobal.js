"use strict";

const componentName = require('../../../configurations/component_config');
module.exports = {
    metadata: () => ({
        name: componentName.Autobal,
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
        const svcNum = conversation.properties().serviceNumber;
        const acctNum = conversation.properties().accountNumber; 

        const request = require('request');
        const moment = require('moment');
        const globalProp = require('../../../helpers/globalProperties');
        const instance = require("../../../helpers/logger");
        const _logger = instance.logger(globalProp.Logger.Category.Autobal);
        const logger = _logger.getLogger();
        const _emailLog = instance.logger(globalProp.Logger.Category.Mailer);        
        const emailLog = _emailLog.getLogger();

        function logError(result, resultCode){
            const strResult = JSON.stringify(result);
            emailLog.addContext("apierrorcode", strResult);
            emailLog.addContext("apierrormsg", resultCode);
            const message = globalProp.Email.EmailFormat(globalProp.Autobal.API.GetAccountBalance, resultCode, strResult, serviceNumber);

            logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`)
            emailLog.error(message);
        }

        let transition = '';

        logger.addContext("serviceNumber", svcNum);
        emailLog.addContext("subject", globalProp.Email.Subjects.Autobal);
        emailLog.addContext("apiUrl", globalProp.Logger.BCPLogging.URL);
        emailLog.addContext("apiname", globalProp.Logger.BCPLogging.AppNames.Autobal.Autobal);
        emailLog.addContext("usertelephonenumber", svcNum);
        emailLog.addContext("useraccountnumber", acctNum);

        logger.info(`-------------------------------------------------------------------------------------------------------------`);
        logger.info(`- [START] Check Auto Balance                                                                                    -`);
        logger.info(`-------------------------------------------------------------------------------------------------------------`);
                

        var AcctNumOptions = globalProp.Autobal.API.GetAccountBalance.GetOptions(acctNum);
        logger.debug(`Setting up the post option for API Token: ${JSON.stringify(AcctNumOptions)}`);
        
        
        logger.info(`Starting to invoke the request for API Token.`);
        request(AcctNumOptions, function (error, response) {

            logger.info("parsed mobility body :", response.body);
            logger.info("Mobility Error: ", error);
            if (response.statusCode == 200) {
      
              var parsedPaymentAmount = JSON.parse(response.body)['PaymentAmount'];
              var floatPaymentAmount = parseFloat(parsedPaymentAmount);
              conversation.variable('totalPayment', floatPaymentAmount.toFixed(2));
      
              var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
              var parsedPaymentDate = JSON.parse(response.body)['PaymentDate'];
              var payDateFormatted = new Date(parsedPaymentDate);
              var payDateMonth = months[payDateFormatted.getMonth()];
              var payDateDay = payDateFormatted.getDate();
              var payDateYear = payDateFormatted.getFullYear();
              conversation.variable('paymentdate', payDateMonth + " " + payDateDay + ", " + payDateYear);
      
              var parsedPreviousBalance = JSON.parse(response.body)['PreviousBalance'];
              var floatPreviousBalance = parseFloat(parsedPreviousBalance);
              conversation.variable('prevBalanceDueAmt', floatPreviousBalance.toFixed(2));
      
              var parsedCurrentCharges = JSON.parse(response.body)['CurrentCharges'];
              var floatCurrentCharges = parseFloat(parsedCurrentCharges);
              conversation.variable('currentcharges', floatCurrentCharges.toFixed(2));
      
              var parsedCurrentBalance = JSON.parse(response.body)['CurrentBalance'];
              var floatCurrentBalance = parseFloat(parsedCurrentBalance);
              conversation.variable('currentBalance', floatCurrentBalance.toFixed(2));
      
              var parsedDueDate = JSON.parse(response.body)['DueDate'];
              var dueDateFormatted = new Date(parsedDueDate);
              var dueDateMonth = String(dueDateFormatted.getMonth()+1).padStart(2, '0');
              var dueDateDay = dueDateFormatted.getDate();
              var dueDateYear = dueDateFormatted.getFullYear();
              conversation.variable('dueDate', dueDateMonth + "/" + dueDateDay + "/" + dueDateYear);;
              conversation.variable('dueDate', dueDateMonth + "/" + dueDateDay + "/" + dueDateYear);
              var parseDueDate2 = Date.parse(parsedDueDate);
              var duedate2 = moment(parseDueDate2);
              logger.info(duedate2.format("MMMM DD, YYYY"));
              //conversation.variable(duedate2.format("MMMM DD, YYYY"))
              //console.log(duedate.format("MMMM DD, YYYY"));
      
      
      
              //FUSE API
      
              var options = globalProp.Autobal.API.CheckBalance.GetOptions(svcNum);
              logger.debug(`Setting up the post option for API Token: ${JSON.stringify(options)}`);
          request(options, function (error, response) {
      
            if (error) {
              transition = 'fuseDown'; //500 return
              logError(error, error.code);
              conversation.variable('statementDate', "-");
            }
            
            else
            {        
            logger.info(response.body);
            var parsedresult = JSON.parse(JSON.stringify(response.body));
            logger.info("parsed body: ", parsedresult.body);
            logger.info("Fuse API Error: ", error);
            // console.log("show error from request ", error);
            if (response.statusCode == 200) {
                logger.info("Successful auto bal", response.body, options.body);
              var parsedBalanceProfile = JSON.parse(response.body)['balanceProfile'];
      
              logger.info("parsed balanceProfile: ", parsedBalanceProfile);
              var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
              var concatStatementDate = new Date(parsedBalanceProfile.statementDate.substr(0, 9));
              var statementDateMonth = months[concatStatementDate.getMonth()];
              var statementDateDay = concatStatementDate.getDate();
              var statementDateYear = concatStatementDate.getFullYear();
              logger.info("Statement Date: ", statementDateMonth + " " + statementDateDay + ", " + statementDateYear);
      
      
              var parsedcustomerProfile = JSON.parse(response.body)['customerProfile'];
              var emailAdd = parsedcustomerProfile[0].emailAddress;
              var duedate1 = parsedcustomerProfile[0].dueDate;
              logger.info("Parsed Due Date",duedate1);
              var concatDueDate = new Date(duedate1);
              var dueDateMonth = months[concatDueDate.getMonth()];
              var dueDateDay = concatDueDate.getDate();
              var dueDateYear = concatDueDate.getFullYear();
              logger.info("Due Date: ", dueDateMonth + " " + dueDateDay + ", " + dueDateYear);
              
      
              if  (emailAdd != null)
              {
                var firstLet = emailAdd.substr(0, 1);
                var atPos = emailAdd.search("@");
                var toMask = emailAdd.substr(1, atPos - 1);
                var maskLength = toMask.length;
                var afterAt = emailAdd.substr(atPos);
                var mask = "*";
                var formattedEmail = firstLet + mask.repeat(maskLength) + afterAt;
              }else{
                var formattedEmail = "null";
              }
      
              conversation.variable('DueDates', dueDateMonth + " " + dueDateDay + ", " + dueDateYear);
              conversation.variable('statementDate', statementDateMonth + " " + statementDateDay + ", " + statementDateYear);
              conversation.variable('balEmailAdd', formattedEmail);
              //UNDER TREATMENT
              var parsedServiceProfile = JSON.parse(response.body)['serviceProfiles'];
              logger.info("pasrsedServiceProfile: ", parsedServiceProfile);
              var parsedServiceStatus = parsedServiceProfile.serviceStatus;
              logger.info("serviceStatus Value: ", parsedServiceStatus);
              var parsedServiceStatus1 = JSON.parse(JSON.stringify(response.body))['serviceStatus'];
              logger.info("serviceStatus1 Value: ", parsedServiceStatus1);
              conversation.transition('valid');        
             
              if  (response.body.includes('Suspended'))
              {
                //conversation.transition('failed');
                conversation.variable('serviceStatus', 'Suspended');
                transition = 'failure';
                logger.info('serviceStatus condition: ', 'Suspended');
              }
              else if  (response.body.includes('Barred')) 
               { 
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
            else if (response.statusCode == 406) {
              transition = 'fuseDown';
              conversation.variable('statementDate', "-");
            }
            else if (response.statusCode == 200) {
              transition = 'valid';
              conversation.variable('statementDate', "-");
            }
            else if (response.statusCode == 500) {
              transition = 'fuseDown';
              conversation.variable('statementDate', "-");
            }
            else if (response.statusCode == 504) {
              transition = 'fuseDown';
              conversation.variable('statementDate', "-");
            }
            else if (response.statusCode == 503) {
              conversation.transition('fuseDown');
              conversation.variable('statementDate', "-");
            }
            else if (response.statusCode == 404) {
                transition = 'fuseDown';
              conversation.variable('statementDate', "-");
            }
            else {
              transition = 'fuseDown'; //500 return
              conversation.variable('statementDate', "-");
            }
          }
          logger.info(`[Transition]: ${transition}`);
          logger.info(`-------------------------------------------------------------------------------------------------------------`);
          logger.info(`- [END] Auto Check Balance                                                                                      -`);
          logger.info(`-------------------------------------------------------------------------------------------------------------`);   
                
        });
      }
          else {
            transition = 'fuseDown';
      }
      _logger.shutdown();
      _emailLog.shutdown();
  
      conversation.transition(transition);
      done();
         });
     }
            
};