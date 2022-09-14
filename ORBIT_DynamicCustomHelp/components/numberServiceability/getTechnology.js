"use strict";
const componentName = require('../../configurations/component_config');

module.exports = {

    metadata: function metadata() {
        return {
            "name": "getTechnology",
            "properties": {
    			"serviceNumber": {
                    "type": "string",
                    "required": true
                }
            },
            supportedActions: ['dslAcct','fibrAcct','failure','blank']
        };
    },

    invoke: (conversation, done) => {
		var serviceNumber = conversation.properties().serviceNumber;
        var areacode = "";
        var telephone = "";

		//var location = conversation.properties().location;
	    console.log("info from bot:"+serviceNumber)
        if (serviceNumber.length == 9 ) {
            var areacode = serviceNumber.substring(2,0);
            var telephone = serviceNumber.substring(2);
        }
        else {
            if (serviceNumber.substring(3,0) == '028') {
                var areacode = serviceNumber.substring(2,0);
                var telephone = serviceNumber.substring(2);
            }
            
           else if (serviceNumber.substring(3,0) == '034') { // start here  ---> capture 034
            var areacode = serviceNumber.substring(3,0);
            var telephone = serviceNumber.substring(3);

            console.log("3rd argument areacode: ", areacode, "telephone number: ", telephone);
            }
            else {
                var areacode = serviceNumber.substring(3,0);
                var telephone = serviceNumber.substring(3);
            }
        }

        var request = require('request');
            var options = {
            'method': 'POST',
            'url': 'https://www.pldt.com.ph/mobility/pldthome/api/serviceability/number/serviceable',
            'headers': {
                'Content-Type': 'application/json',
                'Cookie': 'incap_ses_961_2106196=XTAxBlulCkK9cK3dGylWDTm+8GIAAAAAIobtweYojLuJtnuDh/1x2g==; BIGipServerMobileITPool=2048859658.16415.0000'
            },
            body: JSON.stringify({
                "AREACODE": areacode,
                "TELEPHONE": telephone,
                "CONSUMER": "CHATBOT",
                "TOKEN": "YjQ5NzQyNWItNmE4NC00YzZlLThlM2UtYmU4OGNjZjc2YmQy"
            })

            };
            request(options, function (error, response) {
            if (error)
            {
                var statCode = error.statusCode;
                console.log("error: " + JSON.stringify(error));
                console.log("error code: " + statCode);
                const erroremailmsg = JSON.stringify(error);
                const errorreplaced = erroremailmsg.replace('http://', '');
                var accountNumber = "no data";

                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    auth: {
                      user: 'ndphchatbot@gmail.com',
                      pass: 'nwqiqdpeezxtdatx',
                    }
                  });
            
                if(error.statusCode != undefined){
                    transporter.sendMail({
                        from: 'ndphchatbot@gmail.com',
                        to: 'AllCCareEnablingServices@smart.com.ph, t-tsdiaz@supplier.smart.com.ph, FCDavid@smart.com.ph, avcansanay@smart.com.ph, t-acalero@supplier.smart.com.ph, t-jpvalete@supplier.smart.com.ph',
                        subject: '[API Error] NumberServiceability PROD - VIP checking',
                        text: 'Status Code: ' + statCode +                
                        ' Telephone Number: ' + serviceNumber +
                        ' API: NumberServiceability ' +  
                        ' Datetime: ' + moment.tz(Date.now(), 'Asia/Manila').format('MM-DD-YYYY hh:mm A') + 
                        ' Error: ' + errorreplaced
                    }).then((t) => { 
                        console.log("then response " + t);
                        insertbcploggingdata(statCode, erroremailmsg, accountNumber, serviceNumber, t); //save to db on then
                    }).catch((e) => {
                        console.log("then response " + e);
                        insertbcploggingdata(statCode, erroremailmsg, accountNumber, serviceNumber, e); //save to db one catch
                    });
                    transporter.close();
                }

                if (statCode == 504 || statCode == 406 || statCode == 500 || statCode == 404 || statCode == 408 || statCode == 400){
                    console.log("error code inside func error if: " + error.statusCode);
                    conversation.variable('errorCode',statCode);
                    conversation.transition('failure');
                    console.log("done transition failure in if");
                    done();
                }else{
                    console.log(" getTechnology, error inside func error else: " + error, "telnum : " + serviceNumber);
                    conversation.transition('failure');
                }
            }
            else
            {
                var responseBody = response.body;
                var JSONRes  = JSON.parse(responseBody);
                var pkgfttx = "FTTX";
                var pkgftth = "FTTH";
                var pkgfiber = "FIBER";
                var pkgfibr = "FIBR";
                var pkgdsl = "DSL";
                var pkgvdsl = "VDSL";
                var pkgngn = "NGN";
                var pkglegacy = "LEGACY";
            

                var currentTech = JSONRes.CURRENTTECHNOLOGY.toUpperCase();
                console.log(currentTech);
                if (currentTech == pkgfttx){
                    conversation.variable('neType', pkgfttx);
                    conversation.transition('fibrAcct');
                    done();
                }

                else if (currentTech == pkgfiber)
                {
                    conversation.variable('neType', pkgfiber);
                    conversation.transition('fibrAcct');
                    done();
                }

                else if (currentTech == pkgfibr)
                {
                    conversation.variable('neType', pkgfibr);
                    conversation.transition('fibrAcct');
                    done();
                }

                else if (currentTech == pkgftth)
                {
                    conversation.variable('neType', pkgftth);
                    conversation.transition('fibrAcct');
                    done();
                }

                else if (currentTech == pkgdsl)
                {
                    conversation.variable('neType', pkgdsl);
                    conversation.transition('dslAcct');
                    done();
                }

                else if (currentTech == pkgvdsl)
                {
                    conversation.variable('neType', pkgvdsl);
                    conversation.transition('dslAcct');
                    done();
                }

                else if (currentTech == pkgngn)
                {
                    conversation.variable('neType', pkgngn);
                    conversation.transition('dslAcct');
                    done();
                }

                else if (currentTech == pkglegacy)
                {
                    conversation.variable('neType', pkglegacy);    
                    conversation.transition('dslAcct');
                    done();
                }
                else if (JSONRes.EXCEPTIONMSG == "100|TELEPHONE NUMBER DOES NOT EXIST") {
                    console.log("getTechnology telephone number does not exist service number:" + serviceNumber, "currentTech : "+ currentTech);
                    conversation.transition('blank');
                    done();
                }
                else if (JSONRes.EXCEPTIONMSG !== "100|TELEPHONE NUMBER DOES NOT EXIST") {
                    conversation.transition('blank');
                    console.log("getTechnology - number CLARITY ERROR. Server was unable to process request." + serviceNumber , "currentTech : "+ currentTech);
                    done();
                }
                else {
                    conversation.variable('neType', "NULL NE TYPE");  
                    conversation.transition('blank');
                    console.log("getTechnology component ,blank argument service number:" + serviceNumber, "currentTech: "+ currentTech);
                    done();
                }
            }
        });
    }
};