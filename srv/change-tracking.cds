using BuyerPortal.ust.db.transaction as my from '../db/Schema';
using from '@cap-js/change-tracking';
using sap.changelog as myy;


annotate my.Request_Header  with @changelog: [
    NAME1,
    modifiedAt
] {
    Request_Description @changelog;
    
};

annotate my.Request_Item  with @changelog: [
    NAME1,
    modifiedAt
] {
    Material @changelog;
    Material_Description @changelog;
    PurOrg @changelog;
    Plant @changelog;
    
};

annotate my.Request_Header with @title: 'CustomerMaster';

annotate sap.changelog.aspect @(UI.Facets: [{
    $Type : 'UI.ReferenceFacet',
    ID    : 'ChangeHistoryFacet',
    Label : '{i18n>ChangeHistory}',
    Target: 'changes/@UI.PresentationVariant',
    ![@UI.PartOfPreview]
}]);


service ChangeTrackingService {
    entity ChangeLog as projection on myy.ChangeLog; 

}


