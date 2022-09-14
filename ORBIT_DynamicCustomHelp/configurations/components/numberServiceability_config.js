const apiBaseConfig = require('../apiBase_config');

module.exports = {
    API:{
        Serviceable: {
            Name: "NumberServiceability", 
            PostOptions: (body) => {
                return {
                    'method': 'POST',
                    'url': `${apiBaseConfig.BaseUrl}pldthome/api/serviceability/number/serviceable`,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Cookie': apiBaseConfig.Cookie
                    },                
                    body: body
                }
            },
            Token: "MDg0OWY2YzAtYjcwZS00ZjQxLTlmMzgtODBjZWRmMjc2MTI2",
            Consumer: "CHATBOT",
        }
    },        
}