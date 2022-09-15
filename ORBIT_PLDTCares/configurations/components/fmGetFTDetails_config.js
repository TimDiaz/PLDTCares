const apiBaseConfig = require('../apiBase_config');

module.exports = {
    API:{  
        Name: "FMGetFTDetail",   
        PostOptions: (body) => {
            return {
                'method': 'POST',
                'url': `${apiBaseConfig.BaseUrl}amdocs/api/clarity/fmGetFtDetails`,
                'headers': {
                    'Content-Type': 'application/json',
                    'X-Pldt-Auth-Token': apiBaseConfig.AuthToken,
                    'Cookie': apiBaseConfig.Cookie
                },                
                body: body
            }
        }          
    },
    ConnectionType: {
        POTSADSL: 'POTS POSTPAID|ADSL',
        ADSLPOTS: 'ADSL|POTS POSTPAID',
        ADSL: 'ADSL',
        POTS: 'POTS POSTPAID'
    }
}