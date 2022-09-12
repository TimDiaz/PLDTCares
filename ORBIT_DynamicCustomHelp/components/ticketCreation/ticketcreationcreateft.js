"use strict";

const fetch = require('node-fetch');
var nodemailer = require('nodemailer');
var moment = require('moment-timezone');
var request = require('request');

function insertbcploggingdata(apierrorcodeinit, apierrormsginit, aaccNumberinit, telNumberinit, emailrespinit){

    var options = {
        'method': 'POST',
        'url': 'https://chatbot171.pldthome.com:7745/bcplogginginsert',
        'headers': {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify({
                "apiname": "PLDT-ticketcreationcreateft",
                "apierrorcode":  apierrorcodeinit,
                "apierrormsg": apierrormsginit,
                "usertel": telNumberinit,
                "useracntnum": aaccNumberinit,
                "emailresp": emailrespinit
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

function sendEmail(message, errorCode, accountNumber, serviceNumber){
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'ndphchatbot@gmail.com',
            pass: 'nwqiqdpeezxtdatx',
        }
    });
    
    transporter.sendMail({
        from: 'ndphchatbot@gmail.com',
        to: 't-tsdiaz@supplier.smart.com.ph, t-masanchez@supplier.smart.com.ph, t-jpvalete@supplier.smart.com.ph',
        subject: '[API Error] PLDT Fault Ticket PROD - ticket creation create ft',
        text: 'Status Code: ' + errorCode +             
            ' Account Number: ' + accountNumber +   
            ' Telephone Number: ' + serviceNumber +
            ' API: FaultTicketProd ' +  
            ' Datetime: ' + moment.tz(Date.now(), 'Asia/Manila').format('MM-DD-YYYY hh:mm A') + 
            ' Error: ' + message
    }).then((t) => { 
        console.log("then response " + t);
        insertbcploggingdata(errorCode, message, accountNumber, serviceNumber, t); //save to db on then
    }).catch((e) => {
        console.log("catch response " + e);
        insertbcploggingdata(errorCode, message, accountNumber, serviceNumber, e); //save to db on catch
    });
    
}


function UpdateCreateFT(aaccNumberinit, telNumberinit, smpStartTsinit, ticketnumber, reportedBy, responseBody){
    var data1 = { 
                    "AccountNumber" : aaccNumberinit, 
                    "TelephoneNumber": telNumberinit, 
                    "smpTS": smpStartTsinit, 
                    "TicketNumberCreateFT": ticketnumber,
                    "ReportedBY": reportedBy,
                    "ResponseBody": responseBody
                };
    var options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data1),
    };
    
    fetch('https://chatbot171.pldthome.com:7744/updateCreaeteFT', options );
}

module.exports = {

    metadata: function metadata() {
        return {
            "name": "ticketcreationcreateft",
             "properties": {
				"description": {
                    "type": "string",
                    "required": true
                },
                "empeId": {
                    "type": "string",
                    "required": true
                },
  				"faultType": {
                    "type": "string",
                    "required": true
                },
                "priority": {
                    "type": "string",
                    "required": true
                },
  				"promCause": {
                    "type": "string",
                    "required": true
                },
                "reportedBy": {
                    "type": "string",
                    "required": true
                },
  				"serviceNumber": {
                    "type": "string",
                    "required": true
                },
                "promSubType": {
                    "type": "string",
                    "required": true
                },
                "promWorgName": {
                    "type": "string",
                    "required": true
                },
                "promCategory": {
                    "type": "string",
                    "required": true
                },
                "promSubCategory": {
                    "type": "string",
                    "required": true
                },
                "sysDate": {
                    "type": "string",
                    "required": true
                },
                "accntNum": {
                    "type": "string",
                    "required": true
                }
             }, 
                supportedActions: ['SUCCESS','FAILURE','500']
        };
    },

    invoke: (conversation, done) => {
        var description = conversation.properties().description;
        var empeId = conversation.properties().empeId;
        var faultType = conversation.properties().faultType;
        var priority = conversation.properties().priority;
        var promCause = conversation.properties().promCause;
        var reportedBy = conversation.properties().reportedBy;
        var serviceNumber = conversation.properties().serviceNumber;
        var promSubType = conversation.properties().promSubType;
        var promWorgName = conversation.properties().promWorgName;
        var promCategory = conversation.properties().promCategory;  
        var promSubCategory = conversation.properties().promSubCategory;
        var sysDate = conversation.properties().sysDate;
        var accntNumber = conversation.properties().accntNum;
        
       
        var options = {
            'method': 'POST',
            'url': 'https://www.pldt.com.ph/mobility/askpldt-api/customers/tickets',
            'headers': {
                'Content-Type': 'application/json',
                'Cookie': 'incap_ses_961_2106196=1OPaFwYnzycga/DhGylWDelo82IAAAAAtRDTZWSpdpXqHgM1P7aAyA==; BIGipServerMobileITPool=2048859658.16415.0000'
            },
            body: JSON.stringify({
                "description": description.toString(),
                "empeId": empeId.toString(),
                "faultType": faultType.toString(),
                "priority": priority.toString(),
                "promCause": promCause.toString(),
                "reportedBy": reportedBy.toString(),
                "telephoneNumber": serviceNumber.toString(),
                "promSubType": promSubType.toString(),
                "promWorgName": promWorgName.toString(),
                "promCategory": promCategory.toString(),
                "promSubCategory": promSubCategory.toString()
            })
            //maxAttempts: 3,   //try 3 times
            //retryDelay: 40000, //40 seconds
            //retryStrategy: request.RetryStrategies.HTTPOrNetworkError
        };
        request(options, function (error, response) {
            if (error) {                
                const errorreplaced = JSON.stringify(error).replace('http://', '');

                if (error.statusCode === 500 || error.statusCode === 404)
                {
                    console.log("response error raw 500 || 404",JSON.stringify(error));
                    UpdateCreateFT(accntNumber, serviceNumber, sysDate, "ERROR500", reportedBy, errorreplaced);
                    conversation.transition('500');
                    done();        
                }
                else{
                    //  conversation.reply({ text: 'OOPS, Error Happened! Contact Administrator.'});
                    console.log("response error raw else on 500 || 404",JSON.stringify(error));
                    UpdateCreateFT(accntNumber, serviceNumber, sysDate, "FAILURE", reportedBy, errorreplaced);
                    conversation.transition('FAILURE');
                    done();
                }
                
                sendEmail(errorreplaced, error.code, accntNumber, serviceNumber)
            }
            else{
                var result = response;
                var createRes = JSON.parse(result.body);
                const responseStr = JSON.stringify(createRes).replace('http://', '');   

                if (result.statusCode > 200){        
                    if (result.statusCode === 406)
                    {
                        console.log("Stringify createRes data 406 " + JSON.stringify(createRes));
                        var spiel406 = JSON.stringify(createRes.spiel).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                        var msg406 = JSON.stringify(createRes.message).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                        // console.log("Stringify createRes data ticketnumber 406: " + JSON.stringify(createRes.ticketNumber).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,''));
                        // var tcktNum = JSON.stringify(createRes.ticketNumber).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                        console.log("Stringify createRes data 406 testing2 pipe " + JSON.stringify(createRes) + " | " + spiel406 + " | " + msg406);
                        // console.log(createRes);

                        if (createRes.spiel)
                        {
                            // var spiel406 = JSON.stringify(createRes.spiel).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                            UpdateCreateFT(accntNumber, serviceNumber, sysDate, "ERROR406", reportedBy, responseStr);
                            console.log('Spiel is not null: ' + spiel406);
                            conversation.variable('spielMsg', spiel406);
                            conversation.transition('FAILURE');
                            done();                           
                        }
                        else
                        {
                            // var msg406 = JSON.stringify(createRes.message).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                            UpdateCreateFT(accntNumber, serviceNumber, sysDate, "ERROR406", reportedBy, responseStr);
                            console.log('Spiel is null: ' + msg406);
                            conversation.variable('spielMsg', msg406);
                            conversation.transition('FAILURE');
                            done();
                        }                        
                        done();
                    }    
                    else if (result.statusCode === 500 || result.statusCode === 404)
                    {
                        console.log("response error raw 500 || 404",JSON.stringify(result));
                        UpdateCreateFT(accntNumber, serviceNumber, sysDate, "ERROR500", reportedBy, responseStr);
                        conversation.transition('500');
                        done();        
                    }
                    else{
                        //  conversation.reply({ text: 'OOPS, Error Happened! Contact Administrator.'});
                        console.log("response error raw else on 500 || 404",JSON.stringify(result));
                        UpdateCreateFT(accntNumber, serviceNumber, sysDate, "FAILURE", reportedBy, responseStr);
                        conversation.transition('FAILURE');
                        done();
                    }
                    
                    sendEmail(responseStr, result.statusCode, accntNumber, serviceNumber)
                }
                else{
                    console.log("Stringify createRes data: " + JSON.stringify(createRes));
                    console.log("Stringify createRes data ticketnumber: " + JSON.stringify(createRes.ticketNumber).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,''));
                    var tcktNum = JSON.stringify(createRes.ticketNumber).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                    var spiel200 = JSON.stringify(createRes.spiel).replace(/[&\/\\#,+()$~%.'":*?<>{}]+/g,'');
                    
                    
                    if(tcktNum == null){
                        var tcktNumData = JSON.stringify(result);
                        UpdateCreateFT(accntNumber, serviceNumber, sysDate, tcktNumData, reportedBy, responseStr);
                    }else{
                        var tcktNumData = tcktNum;
                        UpdateCreateFT(accntNumber, serviceNumber, sysDate, tcktNumData, reportedBy, responseStr);
                    }

                    console.log("raw result FLY = " , result);
                    // var JSONRes = JSON.parse(createRes);
                    console.log("spielMsg reply to Chat FLY= " , spiel200); //OMH logger of success spiel
                    conversation.variable('spielMsg', spiel200);
                    conversation.variable('ticketNumber', tcktNum);
                    conversation.transition('SUCCESS');
                }
            }
        });            
    }
};