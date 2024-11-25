using Myservice as service from '../../srv/service';

annotate service.Request_Header with @(
    // selection fields 
    UI.SelectionFields:[

        Request_No,
        PR_Number,
        Status.code,
        PRType,

     ],

     // line items (request header)

     UI.LineItem:[

        {
            $Type : 'UI.DataField',
            Value : Request_No,
            Label: 'Request Number'
        },

        {
            $Type : 'UI.DataField',
            Value : ID,
            Label: 'ID'
        },

        {
            $Type : 'UI.DataField',
            Value : PR_Number,
            Label: 'PR_Number'
        },

        {
            $Type : 'UI.DataField',
            Value : PRType,
            Label: 'PR Type'
        },

        {
            $Type : 'UI.DataField',
            Value : Request_Description,
            Label: 'Request Description'
        },

        {
            $Type : 'UI.DataField',
            Value : Status.code,
            Label: 'Status Code'
        },

     ],

     // Header info 

     UI.HeaderInfo:{
        TypeName: 'Request Header',
        TypeNamePlural: 'Request Header',
        Title: {Value : Request_No},
        Description: {Value : Request_Description}
    },

    // facets 

    UI.Facets:[
        {
            $Type : 'UI.CollectionFacet',
            Label: 'General Information',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    Label: 'Details',
                    Target : '@UI.Identification'
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label: 'Configuration Details',
                    Target : '@UI.FieldGroup#Spiderman'
                },
            ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label: 'PO Items',
            Target : '_Items/@UI.LineItem',
        },
    ],

    // identification facet 

     UI.Identification:[
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID'
        },
        {
            $Type : 'UI.DataField',
            Value : PR_Number,
             Label : 'PR Number'
        },
        {
            $Type : 'UI.DataField',
            Value : PRType,
             Label : 'PRType'
        },
    ],

    // Reference Facet

     UI.FieldGroup #Spiderman: {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : Status.code,
                 Label : 'Status'
            },
            {
                $Type : 'UI.DataField',
                Value : createdBy,
                Label : 'Created By'
            },
        ],
    }
);


annotate service.Request_Item with @(

    // Line Items ( Request Items)

    UI.LineItem:[
        {
            $Type : 'UI.DataField',
            Value : PR_Item_Number,
            Label : 'PR Item Number'
        },

        {
            $Type : 'UI.DataField',
            Value : Req_Item_No,
            Label : 'Request Item Number'
        },

        {
            $Type : 'UI.DataField',
            Value : Plant,
            Label : 'Plant'
        },

        {
            $Type : 'UI.DataField',
            Value : Material,
            Label : 'Material'
        },

        {
            $Type : 'UI.DataField',
            Value : Material_Description,
            Label : 'Material Description'
        },

        {
            $Type : 'UI.DataField',
            Value : PurOrg,
            Label : 'purOrg'
        },

        
    ],

    // Header info

    UI.HeaderInfo:{
        TypeName : 'Request Items',
        TypeNamePlural: 'Request Items',
        Title : {Value: PR_Item_Number},
        Description: {Value: Status}
    },

    // facet 

     UI.Facets:[
        {
            $Type : 'UI.CollectionFacet',
            Label: 'General Information',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    Label: 'Plant Details',
                    Target : '@UI.Identification'
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label: 'Pricing and Quantity Details',
                    Target : '@UI.FieldGroup#Spiderman'
                },
            ],
        }
    ],

    // identification facet

    UI.Identification:[
        {
            $Type : 'UI.DataField',
            Value : Plant,
            Label : 'Plant'
        },
        {
            $Type : 'UI.DataField',
            Value : PurOrg,
            Label : 'PurOrg'
        },
        {
            $Type : 'UI.DataField',
            Value : Material,
            Label : 'Material'
        },
    ],

    // reference facet 

    UI.FieldGroup #Spiderman: {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : Quantity,
                Label : 'Quantity'
            },
            {
                $Type : 'UI.DataField',
                Value : Price,
                Label : 'Price'
            },
            {
               $Type : 'UI.DataField',
                Value : UoM,
                Label : 'Unit of Mass'
            },
            {
                $Type : 'UI.DataField',
                Value : Currency_code,
                Label : 'Currency'
            }
        ],
    }

);

// refreshing the page when deleted 
annotate service.Request_Header @(Common.SideEffects #ReactonItemDeletion: {
    SourceEntities  : [_Items],   // The source entity being modified (deleted in this case)
    TargetEntities  : ['_Items'], // The target collection/table to be refreshed (the list of bookings)
    TargetProperties: []  // This can be left empty or specify relevant properties if needed
});

