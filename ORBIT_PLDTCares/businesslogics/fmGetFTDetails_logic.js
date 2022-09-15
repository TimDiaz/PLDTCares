class FMGetFTDetails_BussinessLogic {
    constructor(log, elog, prop) {
        this.logger = log;
        this.emailLog = elog;
        this.globalProp = prop
    }

    EmailLogError(result, resultCode, serviceNumber) {
        const strResult = JSON.stringify(result);
        this.emailLog.addContext("apierrorcode", strResult);
        this.emailLog.addContext("apierrormsg", resultCode);
        const message = this.globalProp.Email.EmailFormat(this.globalProp.FMGetFTDetails.API.Name, resultCode, strResult, serviceNumber);

        this.logger.error(`[ERROR CODE: ${resultCode}] ${strResult}`)
        this.emailLog.error(message);
        return { Transition: 'failure' };
    }

    CheckSType(serviceType){
        let conversation = {
            Variables: [{name: 'serviceType', value: serviceType}],
            Transition: ''
        };
        let prop = this.globalProp.FMGetFTDetails.ConnectionType;

        if (serviceType.includes(prop.POTSADSL) || (serviceType.includes(prop.ADSL) && serviceType.includes(prop.POTS)) || serviceType.includes(prop.ADSLPOTS)){
            conversation.Transition = 'withBoth';
        }        
        else if (serviceType.includes(prop.ADSL)){
            //Fix Internet Only
            conversation.Transition = 'internetOnly';
        }
        else if (serviceType.includes(prop.POTS)){
            //Fix landline Only
            conversation.Transition = 'landlineOnly';
        }                    
        else{
            conversation.Transition = 'failure';
        }
        return conversation;
    }

    FMInternet(serviceType){
        let conversation = {
            Variables: [{name: 'serviceType', value: serviceType}],
            Transition: ''
        };
        let prop = this.globalProp.FMGetFTDetails.ConnectionType;

        if (serviceType.includes(prop.POTSADSL) || (serviceType.includes(prop.ADSL) && serviceType.includes(prop.POTS)) || serviceType.includes(prop.ADSLPOTS) || serviceType.includes(prop.ADSL)){
            conversation.Transition = 'withInternet';
        }
        else{
            conversation.Transition = 'withoutInternet';
        }
        return conversation;
    }

    FMLandline(serviceType){
        let conversation = {
            Variables: [{name: 'serviceType', value: serviceType}],
            Transition: ''
        };
        let prop = this.globalProp.FMGetFTDetails.ConnectionType;

        if(serviceType.includes(prop.POTSADSL) || (serviceType.includes(prop.ADSL) && serviceType.includes(prop.POTS)) || serviceType.includes(prop.ADSLPOTS) || serviceType.includes(prop.POTS)){
            conversation.Transition = 'withLandline';
        }
        else{
            conversation.Transition = 'withoutLandline';
        }
        return conversation;
    }
}
module.exports = {
    Logic: FMGetFTDetails_BussinessLogic
}