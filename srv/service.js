const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { Request_Header, Request_Item, media } = this.entities;
  const { uuid } = cds.utils

  // Request_No auto-numbering for Request_Header 
  this.before('CREATE', 'Request_Header', async (req) => {
    const DEFAULT_START = 1000000000; // Starting value for Request_No

    // Fetch the highest existing Request_No
    const existingRecords = await SELECT.columns('Request_No')
      .from(Request_Header)
      .orderBy`Request_No desc`
      .limit(1);

    if (existingRecords.length === 0) {
      req.data.Request_No = DEFAULT_START; // Assign default start value if no records exist
    } else {
      const highestRequestNo = existingRecords[0].Request_No;
      req.data.Request_No = Number(highestRequestNo) + 1; // Increment and assign
    }
  });

  // updating the req_item_no when user delete any record 
  this.after('DELETE', 'Request_Item.drafts', async req => {

    // Step 1: Select all remaining items after the deletion
    var existingItems = await SELECT.from(Request_Item.drafts);
    console.log(existingItems)

    // Step 2: Renumber the remaining items
    let baseNumber = 10;

    // Loop through the existing items and update their Req_Item_No
    for (let item of existingItems) {
      item.Req_Item_No = baseNumber;

      // Step 3: Update each item in the drafts table
      await UPDATE(Request_Item.drafts)
        .set({ Req_Item_No: item.Req_Item_No })  // Update the Req_Item_No field
        .where({ ID: item.ID });  // Use the item's ID to identify it for updating

      const updateitems = await SELECT.from(Request_Item.drafts);
      console.log(updateitems);

      baseNumber += 10;  // Increment baseNumber for the next item
    }

    // Optionally, log the updated data to verify
    console.log('Items renumbered successfully');
  });



  // Request_No auto-numbering for Request_Items_no
  this.before('NEW', 'Request_Item.drafts', async req => {

    const DEFAULT_START = 10;

    // Check existing items for the same header
    const existingItems = await SELECT.columns('Req_Item_No')
      .from(Request_Item.drafts)
      .orderBy`Req_Item_No desc`
      .limit(1);

    // if no items present . items should start with 10 

    if (existingItems.length === 0) {
      req.data.Req_Item_No = DEFAULT_START;

      // if items present . items should increase with 10 
    } else {
      const highestReqItemNo = Math.max(...existingItems.map(item => item.Req_Item_No));
      req.data.Req_Item_No = highestReqItemNo + 10;
    }

  });


  // update url 

  this.after('NEW', 'media.drafts', async (req) => {
    console.log('Create called')
    // var sPath = await 
    var sPath = req.url;
    var id = req.ID;
    const url = `${sPath}(ID=${id},IsActiveEntity=false)/content`


    await UPDATE(media.drafts)
      .set({ url: url })  // Update the Req_Item_No field
      .where({ ID: id });  // Use the item's ID to identify it for updating


  });


  // status code logic


  this.after('CREATE', 'Request_Header', async (req) => {
    var item = req;
    var status_code = req.Status_code
    console.log(status_code)

    if (status_code = "open") {
      await UPDATE(Request_Header)
        .set({ Status_code: 'Saved' })  // Update the Req_Item_No field
        .where({ ID: item.ID });  // Use the item's ID to identify it for updating

      const updateitems = await SELECT.from(Request_Header).where({ ID: item.ID });;
      console.log(updateitems);

    }
  });


  // send for approval action button 

  this.on('sendforapproval', async (req) => {


    console.log(req.params[0].ID)

    await UPDATE(Request_Header)
      .set({ Status_code: 'InApproval' })  // Update the Req_Item_No field
      .where({ ID: req.params[0].ID });  // Use the item's ID to identify it for updating

    const updateitems = await SELECT.from(Request_Header).where({ ID: req.params[0].ID });;
    console.log(updateitems);


    

  });

  // copy header 

  this.on('copyheader', async (req) => {

    // getting the id from the request 
    console.log(req.params[0].ID);

    // generating the uuid for the new record 
    let ID = uuid()

    // getting the whole data with the help of id 

    const copieddata = await SELECT.from( `BuyerPortal_ust_db_transaction_Request_Header`)
      .columns(
        `PR_Number`,
        `PRType`,
        `Request_Description`,
        `Status_code`)
    .where({ ID: req.params[0].ID });

    // adding the generated id to the copied data so that we can join items and header
        copieddata[0].ID = ID;

    // select statement for items data 
      const copieddata_Items = await SELECT.from(Request_Item)
      .columns(
        `PR_Item_Number`,
        `Material`,
        `Material_Description`,
        `PurOrg`, 
        `Plant`,
        `Status`,
        `Quantity`,
      ).where({ _Header_ID: req.params[0].ID });

      if (Object.keys(copieddata_Items).length != 0) {
        // adding the generated id to the copieddata_Items so that we can join items and header
        copieddata_Items[0]._Header_ID = ID;
        // added header data composition entries 
       copieddata[0]._Items = copieddata_Items;
        }

    
    // select statement for media data 
    const copieddata_media = await SELECT.from(media)
    .columns(
      `content`,
      `fileName`,
      `MediaType`,
      `size`,
      `url`,
    ).where({ _HeaderAttachments_ID: req.params[0].ID });

    if (Object.keys(copieddata_media).length != 0) {
    // adding the generated id to the copieddata_Items so that we can join media and header
    copieddata_media[0]._HeaderAttachments_ID = ID;
    // added header data composition entries 
    copieddata[0]._attachments = copieddata_media;
    }


    // create the same data with new req_no 
    await this.create(Request_Header).entries(copieddata);
    return {
      ID
    }

  });


  // getting materialset and plantset data
 
  const product_api = await cds.connect.to('OP_API_PRODUCT_SRV_0001');
    const  { MaterialSet , PlantSet}  = this.entities;
 
    this.on("READ",MaterialSet,async (req)=>{
        req.query.where("Product <> ''");
        req.query.SELECT.count = false;
        return await product_api.run(req.query);
    });
 
    this.on("READ",PlantSet,async (req)=>{
      req.query.where("Product <> ''");
      req.query.SELECT.count = false;
      return await product_api.run(req.query);
  });


});
