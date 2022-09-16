const apiBaseConfig = require('../apiBase_config');

module.exports = {
    API:{
        GetEsoaBalance: {
            Name: "GetEsoaBalanceBody", 
            GetOptions: (svcNum, numMon) => {
                return {
                    'method': 'GET',
                    'url': `${apiBaseConfig.BaseUrl}amdocs/api/sendeSOA/${svcNum}/${numMon}`,
                    'headers': {
                        'X-Pldt-Auth-Token': apiBaseConfig.AuthToken,
                        'Cookie': apiBaseConfig.Cookie
                    }
                }
            },
        }
  }
}