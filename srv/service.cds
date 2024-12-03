using { BuyerPortal.ust.db.transaction as my } from '../db/Schema';

service Myservice @(path:'Myservice' ){

    entity Request_Header @(odata.draft.enabled: true) as projection on my.Request_Header
    actions{
        @Common.SideEffects #ReactonApprovalSubmission: {
             SourceEntities: ['in'],                  // Entity or association triggering the side effect
            TargetProperties: ['in/Status/code']            // Property to refresh
        }
        action sendforapproval(); 
    };
    
    
}