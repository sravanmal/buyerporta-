sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'sravan/ust/buyerportal/test/integration/FirstJourney',
		'sravan/ust/buyerportal/test/integration/pages/Request_HeaderList',
		'sravan/ust/buyerportal/test/integration/pages/Request_HeaderObjectPage',
		'sravan/ust/buyerportal/test/integration/pages/Request_ItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, Request_HeaderList, Request_HeaderObjectPage, Request_ItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('sravan/ust/buyerportal') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheRequest_HeaderList: Request_HeaderList,
					onTheRequest_HeaderObjectPage: Request_HeaderObjectPage,
					onTheRequest_ItemObjectPage: Request_ItemObjectPage
                }
            },
            opaJourney.run
        );
    }
);