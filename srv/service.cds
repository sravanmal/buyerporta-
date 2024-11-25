using { BuyerPortal.ust.db.transaction as my } from '../db/Schema';

service Myservice @(path:'Myservice' ){

    entity Request_Header @(odata.draft.enabled: true) as projection on my.Request_Header;
    
}