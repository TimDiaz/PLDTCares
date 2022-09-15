module.exports = {
    API:{
        GetEsoaBalance: {
            Name: "GetEsoaBalanceBody", 
            GetOptions: (svcNum, numMon) => {
                return {
                    'method': 'GET',
                    'url': 'https://www.pldt.com.ph/mobility/dev/amdocs/api/sendeSOA/'+svcNum+'/'+numMon,
                    'headers': {
                        'X-Pldt-Auth-Token': 'AH5PMt52GhW33gv1zdwuum2X591vTyD637WmFwVZupTpXR4ZG8tKB6QoFGGj65AaYEKpfKrT9nGYeKxtKadp7GM',
                        'Authorization': 'Bearer {{token}}',
                        'Cookie': 'incap_ses_968_2106196=EJcQdtzGzzx0DBXtHQdvDZuVYmAAAAAAZw/dNqItujGpUgOeTcOfFw==; BIGipServerMobileITPool=2048859658.16415.0000'
                            }
                }
            },
        }
  }
}