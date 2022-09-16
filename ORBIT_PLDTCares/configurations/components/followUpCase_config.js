// const apiBaseConfig = require('../apiBase_config');

module.exports = {
    API:{
        Token: {
            Name: "FollowUpCaseToken", 
            PostOptions: (form) => {
                return {
                    'method': 'POST',
                    'url': 'https://d7f000000zntyuaq--cembuat.sandbox.my.salesforce.com/services/oauth2/token', // `${apiBaseConfig.BaseUrl}pldthome/api/serviceability/number/serviceable`
                    'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': 'BrowserId=0j2qkLkkEeuCpWlqoQQsiQ; BrowserId_sec=0j2qkLkkEeuCpWlqoQQsiQ; CookieConsentPolicy=0:0' //apiBaseConfig.Cookie
                    },
                    form: form
                }
            },
        },
        CaseCreate: {
            Name: "FollowUpCaseBody",
            PostOptions: (authBearer, body) => {
                return {
                    'method': 'POST',
                    'url': 'https://d7f000000zntyuaq--cembuat.sandbox.my.salesforce.com/services/data/v53.0/sobjects/Case', // `${apiBaseConfig.BaseUrl}pldthome/api/serviceability/number/serviceable`
                    'headers': {
                        'Authorization': authBearer,
                        'Content-Type': 'application/json',
                        'Cookie': 'BrowserId=FvkqxQMYEe2P-E_vN5gJcw; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1' //apiBaseConfig.Cookie
                    },
                    body: body
                }
            },

        }
    },
}