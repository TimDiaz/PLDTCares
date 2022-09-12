const apiBaseConfig = require('../apiBase_config');

module.exports = {
    API:{
        Validate: {     
            Name: "TicketCreation",   
            PostOptions: (body) => {
                return {
                    'method': 'POST',
                    'url': `${apiBaseConfig.BaseUrl}askpldt-api/customers/tickets`,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Cookie': apiBaseConfig.Cookie
                    },                
                    body: body
                }
            }            
        }
    }
}