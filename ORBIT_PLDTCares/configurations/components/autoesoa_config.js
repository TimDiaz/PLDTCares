const baseConfig = require('../base_config');

module.exports = {
    API:{
        GetEsoaBalance: {
            Name: "GetEsoaBalanceBody", 
            GetOptions: (svcNum, numMon) => {
                return {
                    'method': 'GET',
                    'url': `${baseConfig.BaseUrl}amdocs/api/sendeSOA/${svcNum}/${numMon}`,
                    'headers': {
                        'X-Pldt-Auth-Token': baseConfig.AuthToken,
                        'Cookie': baseConfig.Cookie
                    }
                }
            },
        }
  }
}