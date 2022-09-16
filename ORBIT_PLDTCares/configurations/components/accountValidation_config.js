const baseConfig = require('../base_config');

module.exports = {
    API:{
        Validate: {     
            Name: "AccountValidation",   
            PostOptions: (body) => {
                return {
                    'method': 'POST',
                    'url': `${baseConfig.BaseUrl}amdocs/api/account/validate`,
                    'headers': {
                        'Content-Type': 'application/json',
                        'X-Pldt-Auth-Token': baseConfig.AuthToken,
                        'Cookie': baseConfig.Cookie
                    },                
                    body: body
                }
            }            
        }
    }
}