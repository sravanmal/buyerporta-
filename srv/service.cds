using { BuyerPortal.ust.db.transaction as my } from '../db/Schema';

service Myservice @(path:'Myservice' ){

    entity Request_Header @(odata.draft.enabled: true ) as projection on my.Request_Header
    actions{
        action sendforapproval(); 
        action copyheader() returns {
            ID: UUID;
        };
    };

    entity MaterialSet as projection on my.material;
    entity PlantSet as projection on my.plant;
    
    
}