sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    var Module = { 
        _oncopyheader: function(oEvent) {


            MessageToast.show("Custom handler invoked.");
            var that = this;
            var oRouter = that.getRouting();
            // getting the selected data 

            var oTable = oEvent.getObject();
            // getting the id from the data
            const id = oTable.ID;

            // getting the datamodel to generating the link for post call
            var oDataModel = that.getBindingContext().getModel()

            // link 
            const url = oDataModel.sServiceUrl + oEvent.sPath + '/copyheader';

            // post call for action button copyheader
            $.ajax({
                url: url,
                async: false,
                type: "POST",
                dataType: "json",
                headers : {
                    'X-CSRF-Token' : oDataModel.getHttpHeaders()["X-CSRF-Token"]
                },
                contentType: "application/json",
                success: function (data) {
                    
                    MessageToast.show("header copied");
                    const ID = data.ID
                    

                    // refreshing the model 
                    that.getModel().refresh();


                    that.getRouting().navigateToRoute("Request_HeaderObjectPage", {
                        key: "ID=" + ID + ",IsActiveEntity=true", // Pass the new ID as a parameter to the route 
                     });

                     // After navigation, update the variable
                    var oUIModel = that.getModel("ui"); // Assuming 'ui' is the model name
                    if (oUIModel) {
                        oUIModel.setProperty("/isEditable", true);
                       
                    } else {
                        MessageToast.error("UI Model not found.");
                    }
                    
                    // refreshing the model 
                    that.getModel().refresh();
                    Module._afternav(that);


                },
                error: function (error) {
                    // Handle the error scenario
                    MessageToast.error("Failed to add comment: " + error);
                },complete: function(xhr, status) {
            } 
        });
        },

        _afternav : function(that){
            debugger

        }
}
    

    return Module;



});
