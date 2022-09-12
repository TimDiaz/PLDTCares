"use strict";

var nodemailer = require('nodemailer');
var moment = require('moment-timezone');


function insertbcploggingdata(apierrorcodeinit, apierrormsginit, aaccNumberinit, telNumberinit, emailrespinit){

    var options = {
        'method': 'POST',
        'url': 'https://chatbot171.pldthome.com:7745/bcplogginginsert',
        'headers': {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify({
                "apiname": "PLDT-ticketProm",
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
        subject: '[API Error] PLDT Fault Ticket PROD - ticket prom',
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


module.exports = {

    metadata: function metadata() {
        return {
            "name": "ticketProm",
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
                    "required": false
                },
                "promWorgName": {
                    "type": "string",
                    "required": false
                },
                "promCategory": {
                    "type": "string",
                    "required": false
                },
                "promSubCategory": {
                    "type": "string",
                    "required": false
                }
            }, 
            supportedActions: ['SUCCESS','FAILURE','500']
        };
    },

    invoke: (conversation, done) => {
		var mobileSdk = conversation.mobileSdk;
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
        var accntNumber = conversation.properties().accntNum;

        var requestbody = JSON.parse(JSON.stringify({
                        

        }));
        
        var request = require('request');
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

        };
        request(options, function (error, response) {
            if (error)
            {
                if (error.statusCode === 500)
                {
                    conversation.transition('500');
                    done();
                }
                else {
                    //  conversation.reply({ text: 'OOPS, Error Happened! Contact Administrator.'});
                    conversation.transition('FAILURE');
                    done();
                }
                const errorreplaced = JSON.stringify(error).replace('http://', '');
                sendEmail(errorreplaced, error.code, accntNumber, serviceNumber)
            }
            else
            {
                var createRes = response.body;
                var JSONRes = JSON.parse(createRes);

                if (response.statusCode > 200){              
                    if (response.statusCode === 406)
                    {
                        if (JSONRes.spiel)
                        {
                            console.log('Spiel is not null');
                            conversation.variable('spielMsg', JSONRes.spiel);
                            conversation.transition('FAILURE');   
                            done();                
                        }
                        else
                        {
                            console.log('Spiel is null');
                            conversation.variable('spielMsg', JSONRes.message);
                            conversation.transition('FAILURE');  
                            done();    
                        }           
                    }
                    else if (error.statusCode === 500)
                    {
                        conversation.transition('500');
                        done();
                    }
                    else {
                        //  conversation.reply({ text: 'OOPS, Error Happened! Contact Administrator.'});
                        conversation.transition('FAILURE');
                        done();
                    }
                    const errorreplaced = JSON.stringify(JSONRes).replace('http://', '');
                    sendEmail(errorreplaced, response.statusCode, accntNumber, serviceNumber)
                }
                else{
                    conversation.variable('spielMsg', JSONRes.spiel);
                    conversation.variable('ticketNumber', JSONRes.ticketNumber);                
                    conversation.transition('SUCCESS');
                    done();
                }
            }
        });
    }
};