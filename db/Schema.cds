using { cuid , managed , Currency} from '@sap/cds/common';


namespace BuyerPortal.ust.db;

context transaction {

    //request header entity

    entity Request_Header : cuid ,  managed{

        PR_Number : String(10);                                                              // PR number
        Status : Association to Status;                                                      // Status Code
        PRType : String;                                                                     // PR type       
        _Items : Composition of many Request_Item on _Items._Header = $self;                 // items 
        Request_Description : String;                                                        //  .Request Description
        _Comments : Composition of many Comments on _Comments._headercomment = $self;        // comments
        Request_No : String(10);                                                             // Request No
        _attachments : Composition of many media on _attachments._HeaderAttachments = $self

    }

    // request items entity 

    entity Request_Item : cuid , managed {

        PR_Item_Number : String(10);                // PR number
        Material : String;                          // .Material 
        Material_Description : String;              // Material Description
        PurOrg : String;                            // .PurOrg
        Plant  : String;                            // .Plant
        Status : String;                            // Status 
        Quantity : Integer;                         // Quantity
        UoM : String;                               // Unit of Mass (uom)
        Price : Decimal;                            // Price 
        Currency: Currency;                         // currency
        Req_Item_No : String(10);                       // Request Item Number 
        _Header : Association to Request_Header;

    }

    // status entity 

    entity Status {
        
        key code : String enum {
            
            InApproval = 'A';
            Ordered    = 'O';
            Rejected   = 'R';
            Saved      = 'S'; 
            Open       = 'OP' 

        } default 'Open';                              // Status Code        
    }

    // Comments entity 

    entity Comments : cuid , managed {
        _headercomment : Association to Request_Header;
        text : String                               // Text   
    }


    // media 
    entity media : cuid, managed {
    @Core.ContentDisposition.Filename: fileName
    @Core.ContentDisposition.Type: 'inline'
    @Core.MediaType: MediaType
    _HeaderAttachments : Association to Request_Header; 
    content: LargeBinary;
    fileName : String;
    @Core.IsMediaType: true
    MediaType : String;
    size: Integer;
    url: String;
}
}
