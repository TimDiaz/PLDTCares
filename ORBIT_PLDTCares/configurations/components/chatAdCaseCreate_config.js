// const apiBaseConfig = require('../apiBase_config');

module.exports = {
    API:{
        ChatAdToken: {
            Name: "ChatAdCaseCreateToken", 
            PostOptions: (form) => {
                return {
                    'method': 'POST',
                    'url': 'https://cs113.salesforce.com/services/oauth2/token', // `${apiBaseConfig.BaseUrl}pldthome/api/serviceability/number/serviceable`
                    'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': 'BrowserId=jcVbrq-ZEeqouVkQxnpvMg' //apiBaseConfig.Cookie
                    },
                    form: form
                }
            },
        },
        ChatAdCaseCreate: {
            Name: "ChatAdCaseCreateBody",
            PostOptions: (authBearer, body) => {
                return {
                    'method': 'POST',
                    'url': 'https://cs113.salesforce.com/services/data/v49.0/sobjects/Case', // `${apiBaseConfig.BaseUrl}pldthome/api/serviceability/number/serviceable`
                    'headers': {
                        'Authorization': authBearer,
                        'Content-Type': 'application/json',
                        'Cookie': 'BrowserId=ZqvYw6VWEeqHszXxYFuXmA' //apiBaseConfig.Cookie
                    },
                    body: body
                }
            },

        }
    },
}