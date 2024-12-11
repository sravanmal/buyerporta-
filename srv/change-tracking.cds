using BuyerPortal.ust.db.transaction as my from '../db/Schema';
using from '@cap-js/change-tracking';
using sap.changelog as myy;


annotate my.Request_Header with @changelog: [author, timestamp]
{
    Request_Description @changelog @Common.Label: 'Request Description';
    
};



annotate my.Request_Item with @changelog: [author, timestamp]
{
    Material @changelog;
    Material_Description @changelog;
    PurOrg @changelog;
    Plant @changelog;
    
};

annotate my.Request_Header with @title: 'Header';
annotate my.Request_Item with @title: 'Items';

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


