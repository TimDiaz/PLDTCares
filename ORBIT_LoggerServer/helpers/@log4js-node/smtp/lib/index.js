'use strict';

const mailer = require('nodemailer');
const os = require('os');
const request = require('request');

function insertBcpLogging(apUrl, apiName, apiErrorCode, apiErrorMsg, aaccNumber, telNumber, emailResp){
  var options = {
      'method': 'POST',
      'url': apUrl,
      'headers': {
          'Content-Type': 'application/json'
          },
      body: JSON.stringify({
              "apiname": apiName,
              "apierrorcode":  apiErrorCode,
              "apierrormsg": apiErrorMsg,
              "usertel": telNumber,
              "useracntnum": aaccNumber,
              "emailresp": emailResp
          })

      };

  request(options, function (error, response) {
      if (error) {
          console.log("error on bcp api: " + error);
      }else{
          console.log("successful on bcp api: " + response.body);
      }   
  });
}

function getTransportOptions(config) {
  let options = {};
  if (config.SMTP) {
    options = config.SMTP;
  } else if (config.transport) {
    options = config.transport.options || {};
    options.transport = config.transport.plugin || 'smtp';
  }
  return options;
}

/**
 * SMTP Appender. Sends logging events using SMTP protocol.
 * It can either send an email on each event or group several
 * logging events gathered during specified interval.
 *
 * @param _config appender configuration data
 *    config.sendInterval time between log emails (in seconds), if 0
 *    then every event sends an email
 *    config.shutdownTimeout time to give up remaining emails (in seconds; defaults to 5).
 * @param _layout a function that takes a logevent and returns a string (defaults to basicLayout).
 */
function smtpAppender(config, layout, subjectLayout) {
  if (!config.attachment) {
    config.attachment = {};
  }

  config.attachment.enable = !!config.attachment.enable;
  config.attachment.message = config.attachment.message || 'See logs as attachment';
  config.attachment.filename = config.attachment.filename || 'default.log';

  const sendInterval = config.sendInterval * 1000 || 0;
  const shutdownTimeout = ('shutdownTimeout' in config ? config.shutdownTimeout : 5) * 1000;
  const transport = mailer.createTransport(getTransportOptions(config));
  transport.on('error', (error) => {
    console.error('log4js.smtpAppender - Error happened', error); // eslint-disable-line no-console
  });
  const logEventBuffer = [];

  let unsentCount = 0;
  let sendTimer;

  function sendBuffer() {
    if (logEventBuffer.length > 0) {
      const firstEvent = logEventBuffer[0];
      
      let body = '';
      const count = logEventBuffer.length;
      while (logEventBuffer.length > 0) {
        body += `${layout(logEventBuffer.shift(), config.timezoneOffset)}\n`;
      }

      const msg = {
        to: config.recipients,
        subject: (config.subject || firstEvent.context.subject) || subjectLayout(firstEvent),
        headers: { Hostname: os.hostname() },
        cc: config.cc,
        bcc: config.bcc,
      };

      if (config.attachment.enable === true) {
        msg[config.html ? 'html' : 'text'] = config.attachment.message;
        msg.attachments = [
          {
            filename: config.attachment.filename,
            contentType: 'text/x-log',
            content: body
          }
        ];
      } else {
        msg[config.html ? 'html' : 'text'] = body;
      }

      if (config.sender) {
        msg.from = config.sender;
      }

      const apiurl = firstEvent.context.apiurl || "";
      const apiname = firstEvent.context.apiname || "";
      const apierrorcode = firstEvent.context.apierrorcode || "";
      const apierrormsg = firstEvent.context.apierrormsg || "";
      const usertelephonenumber = firstEvent.context.usertelephonenumber || "";
      const useraccountnumber= firstEvent.context.useraccountnumber || "";

      transport.sendMail(msg).then((t) => { 
        insertBcpLogging(apiurl, apiname, apierrorcode, apierrormsg, useraccountnumber, usertelephonenumber, t); //save to db on then
        transport.close();
        unsentCount -= count;
      }).catch((e) => {
        insertBcpLogging(apiurl, apiname, apierrorcode, apierrormsg, useraccountnumber, usertelephonenumber, e); //save to db one catch
        transport.close();
        unsentCount -= count;
      });
    }
  }

  function scheduleSend() {
    if (!sendTimer) {
      sendTimer = setTimeout(() => {
        sendTimer = null;
        sendBuffer();
      }, sendInterval);
    }
  }

  function shutdown(cb) {
    if (sendTimer) {
      clearTimeout(sendTimer);
    }

    sendBuffer();

    let timeout = shutdownTimeout;
    (function checkDone() {
      if (unsentCount > 0 && timeout >= 0) {
        timeout -= 100;
        setTimeout(checkDone, 100);
      } else {
        cb();
      }
    }());
  }

  const appender = (loggingEvent) => {
    unsentCount += 1;
    logEventBuffer.push(loggingEvent);
    if (sendInterval > 0) {
      scheduleSend();
    } else {
      sendBuffer();
    }
  };

  appender.shutdown = shutdown;

  return appender;
}

function configure(config, layouts) {
  const subjectLayout = layouts.messagePassThroughLayout;
  let layout = layouts.basicLayout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return smtpAppender(config, layout, subjectLayout);
}

module.exports.configure = configure;
