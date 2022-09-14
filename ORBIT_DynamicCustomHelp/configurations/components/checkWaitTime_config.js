// const apiBaseConfig = require('../apiBase_config');

module.exports = {
    API:{
        WaitTime: {
            Name: "CheckWaitTime", 
            PostOptions: (orgId, deploymentId, buttonId) => {
                return {
                    'method': 'GET',
                    'url': `https://d.la2-c1cs-hnd.salesforceliveagent.com/chat/rest/Visitor/Availability?org_id=${orgId}&deployment_id=${deploymentId}&Availability.ids=${buttonId}&Availability.needEstimatedWaitTime=1`, // `${apiBaseConfig.BaseUrl}pldthome/api/serviceability/number/serviceable`
                    'headers': {
                        'X-LIVEAGENT-API-VERSION': '34',
                        'Cookie': 'X-Salesforce-CHAT=!eF3gfwR5AOhWbYhvXaWnnx/Wbhtpsw5ceBKbCOrsRzjnWxyYBCox61p0fxSoIhyAWKDRgQ6K84GEphc=' //apiBaseConfig.Cookie
                    }
                }
            },
        }
    },
}