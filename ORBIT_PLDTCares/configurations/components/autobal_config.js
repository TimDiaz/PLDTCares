// const apiBaseConfig = require('../apiBase_config');

module.exports = {
    API:{
        GetAccountBalance: {
            Name: "GetAccountBalanceBody", 
            GetOptions: (acctNum) => {
                return {
                    'method': 'GET',
                    'url': 'https://www.pldt.com.ph/mobility/pldthome/api/smartbridge/PLDTKenan/PLDTKenanService.svc/rest/GetAccountBalance/' + acctNum + '/0',
                    'headers': {
                        'X-Pldt-Auth-Token': 'RiHdHENVs9wA9G10oNj04pz56lJOblywY2o0wCjRmJO3/J2OS4uBvhFQXYjqO/cKuJbbsZrAOvyxwBI8MNcRipdbt/bVKMVWnQnStE9SfD9uNiLrfthEAKy/t4SpaTe9Qqcy5PZPKJeE/5i4Kz7//paTHDOAe/kf1OPbQHupnL3WPDUBisNFSPQwunZf7+4vfuauUko1oBmJep0GOYA00A==',
                        'X-Pldt-Client-Id': '12046',
                        'Authorization': 'Bearer {{token}}',
                        'Cookie': 'incap_ses_968_2106196=k+LkZ+luin6U5YkMHgdvDRCSfmAAAAAAKN0i1QCVImxn/VGiR25H+g==; ASP.NET_SessionId=u2q1wt0ohrtsjciqm3lpvi5t; BIGipServerFuse_api_pool_8080=3893700618.36895.0000; BIGipServerMobileITPool=2048859658.16415.0000; NSC_Q_WT_QMEUjVIXTC*8097=ffffffff09734f3545525d5f4f58455e445a4a422991'
                                      }
                }
            },
        },
        CheckBalance: {
            Name: "CheckBalanceBody",
            GetOptions: (svcNum) => {
                return {
                    'method': 'GET',
                    'url': 'https://www.pldt.com.ph/mobility/dev/amdocs/api/autocheckbalance/' + svcNum,
                    'headers': {
                        'X-Pldt-Auth-Token': 'AH5PMt52GhW33gv1zdwuum2X591vTyD637WmFwVZupTpXR4ZG8tKB6QoFGGj65AaYEKpfKrT9nGYeKxtKadp7GM',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer {{token}}',
                        'Cookie': 'incap_ses_963_2106196=4HHrAjVi83ltQWx3qUNdDVhjXWAAAAAA9V6atZBaMfgjcW7qtJs2Gg==; BIGipServerMobileITPool=2048859658.16415.0000'
                          }
                }
            },
        }
    }
}