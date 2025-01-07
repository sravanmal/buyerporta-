using { BuyerPortal.ust.db.transaction as my } from '../db/Schema';

service Myservice @(path:'Myservice' , requires: 'authenticated-user'){

    entity Request_Header @(odata.draft.enabled: true , restrict: [
                        { grant: ['READ'], to: 'Viewer' },
                        { grant: ['WRITE'], to: 'Admin' }
                        ]) as projection on my.Request_Header
    actions{
        action sendforapproval(); 
        action copyheader() returns {
            ID: UUID;
        };
    };
    
    
}