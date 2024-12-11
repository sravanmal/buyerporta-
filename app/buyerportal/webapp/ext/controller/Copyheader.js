sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        _oncopyheader: function(oEvent) {


            MessageToast.show("Custom handler invoked.");

            var oTable = oEvent.getObject();
            const id = oTable.ID;

            



        }
    };
});
