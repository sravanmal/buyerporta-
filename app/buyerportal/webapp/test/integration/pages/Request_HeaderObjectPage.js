sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'sravan.ust.buyerportal',
            componentId: 'Request_HeaderObjectPage',
            contextPath: '/Request_Header'
        },
        CustomPageDefinitions
    );
});