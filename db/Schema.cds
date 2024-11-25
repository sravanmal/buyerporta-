using { cuid , managed , Currency} from '@sap/cds/common';


namespace BuyerPortal.ust.db;

context transaction {

    //request header entity

    entity Request_Header : cuid ,  managed{

        PR_Number : String(10);                                                              // PR number
        Status : Association to Status;                                                      // Status Code
        PRType : String;                                                                     // PR type       
        _Items : Composition of many Request_Item on _Items._Header = $self;                 // items 
        Request_Description : String;                                                        // Request Description
        _Comments : Composition of many Comments on _Comments._headercomment = $self;        // comments
        Request_No : Integer;                                                             // Request No

    }

    // request items entity 

    entity Request_Item : cuid , managed {

        PR_Item_Number : String(10);                // PR number
        Material : String;                          // Material 
        Material_Description : String;              // Material Description
        PurOrg : String;                            // PurOrg
        Plant  : String;                            // Plant
        Status : String;                            // Status 
        Quantity : Integer;                         // Quantity
        UoM : String;                               // Unit of Mass (uom)
        Price : Decimal;                            // Price 
        Currency: Currency;                         // currency
        Req_Item_No : Integer;                       // Request Item Number 
        _Header : Association to Request_Header;

    }

    // status entity 

    entity Status {
        
    key ID : Integer;                               // ID 
        code : String;                              // Status Code        
    }

    // Comments entity 

    entity Comments : cuid , managed {
        _headercomment : Association to Request_Header;
        text : String                               // Text   
    }
}
