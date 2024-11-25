const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { Request_Header, Request_Item } = this.entities;

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
      req.data.Request_No = highestRequestNo + 1; // Increment and assign
    }
  });

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


  })
});
