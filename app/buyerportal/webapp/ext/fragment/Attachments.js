sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    var Module = { 
        // before upload starts
        onBeforeUploadStarts: function(oEvent) {
            var that = this ;
            MessageToast.show("Custom handler invoked.");
            const oUploadSetTable = this.byId("table-uploadSet");
            var oFileUploader = this.byId("fileUploader");
            var oDataModel = that.getBindingContext().getModel()
            const sPath = oDataModel.sServiceUrl + that.getBindingContext().sPath.slice(1, that.getBindingContext().sPath.length) + "/_attachments";
            var item = oEvent.getParameter("item")
			    Module._createEntity(item , that , sPath)
				.then((id ) => {
					Module._uploadContent(item, id , oUploadSetTable , sPath);
                    
				})
				.catch((err) => {
					console.log(err);
				})
        },
        // after upload completed
        onUploadCompleted: function(oEvent) {
            // const oUploadSetTable = this.byId("table-uploadSet");
            // oUploadSetTable.getItems("items")
            // const oBinding = oUploadSetTable.getBinding("items");
            // oBinding.refresh();

            var that = this;
            that.refresh();

        },

        // previewing the file 
        openPreview: function(oEvent) {
			const id = oEvent.getSource().getBindingContext().getProperty("ID");
            var that = this;

            var oDataModel = that.getBindingContext().getModel()
            const sPath = oDataModel.sServiceUrl + that.getBindingContext().sPath.slice(1, that.getBindingContext().sPath.length) + "/_attachments";
            const sFileUrl = `${sPath}(ID=${id},IsActiveEntity=true)/content`;

            if (sFileUrl) {
                fetch(sFileUrl)
                    .then(response => response.blob())
                    .then(blob => {
                        const fileURL = URL.createObjectURL(blob);
                        
                        // Create an iframe preview dialog with the Blob URL
                        var oDialog = new sap.m.Dialog({
                            title: "File Preview",
                            contentWidth: "80%",
                            contentHeight: "100%",
                            resizable: true,
                            draggable: true,
                            content: new sap.ui.core.HTML({
                                content: `<iframe src="${fileURL}" width="100%" height="1000%" style="border: none;"></iframe>`
                            }),
                            endButton: new sap.m.Button({
                                text: "Close",
                                press: function() {
                                    oDialog.close();
                                    URL.revokeObjectURL(fileURL);  // Clean up the URL
                                }
                            })
                        });
        
                        // Open the dialog
                        oDialog.open();
                    })
                    .catch(error => {
                        console.error("Error fetching the file content:", error);
                    });
            } else {
                console.error("File URL not found for preview.");
            }
		},

        // post call
         _createEntity: function (item , that , sPath) {
            var data = {
                MediaType: item.getMediaType(),
                fileName: item.getFileName(),
                size: item.getFileObject().size
            };

            var settings = {
                url: sPath,
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                data: JSON.stringify(data)
            }

        return new Promise((resolve, reject) => {
            $.ajax(settings)
                .done((results, textStatus, request) => {
                    resolve(results.ID);
                })
                .fail((err) => {
                    reject(err);
                })
        })				
    },
    // put call
    _uploadContent: function (item, id , oUploadSetTable , sPath) {
        console.log(sPath);
        const url = `${sPath}(ID=${id},IsActiveEntity=false)/content`;
        var file = item._oFileObject;

                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        var fileContent = event.target.result;
                        var byteArray = new Uint8Array(fileContent);
                        console.log(byteArray);
                        fetch(url, {
                            method: 'PUT',
                            body: fileContent
                        })
                        .then(function(putResponse) {
                            if (!putResponse.ok) {
                                throw new Error("PUT request failed.");
                            }
                            MessageToast.show("File uploaded and data updated successfully.");
                            

                        })
                        .catch(function(error) {
                            console.error("Error in upload sequence:", error);
                        });

                    };
                    reader.readAsArrayBuffer(file);
                };
    },
    // on download button clicked 
    onDownloadFiles : function(oEvent){

        const oContexts = this.byId("table-uploadSet").getSelectedContexts();
        if (oContexts && oContexts.length) {
            oContexts.forEach((oContext) => Module.manualDownload(oContext));
        }


    },

    // manually downloading the file function
    manualDownload: function(context) {
        // Assuming `context.url` is the URL of the file

        const id = oEvent.getSource().getBindingContext().getProperty("ID");
        var that = this;

        var oDataModel = that.getBindingContext().getModel()
        const sPath = oDataModel.sServiceUrl + that.getBindingContext().sPath.slice(1, that.getBindingContext().sPath.length) + "/_attachments";
        const sFileUrl = `${sPath}(ID=${id},IsActiveEntity=true)/content`;
        const filename = context.getProperty("fileName") || 'downloadedFile';
    
        // Create a temporary anchor element
        const anchor = document.createElement('a');
        anchor.href = sFileUrl;
        anchor.download = filename;
        
        // Append anchor to the body, trigger download, then remove it
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    },


    // Table row selection handler
		onSelectionChange: function(oEvent) {	


            const oTable = oEvent.getSource();
            const aSelectedItems = oTable?.getSelectedContexts();
			const oDownloadBtn = this.byId("downloadSelectedButton");
			const oEditUrlBtn = this.byId("editUrlButton");
			const oRenameBtn = this.byId("renameButton");
			const oRemoveDocumentBtn = this.byId("removeDocumentButton");

			if (aSelectedItems.length > 0) {
				oDownloadBtn.setEnabled(true);
			} else {
				oDownloadBtn.setEnabled(false);
			}
			if (aSelectedItems.length === 1){
				oEditUrlBtn.setEnabled(true);
				oRenameBtn.setEnabled(true);
				oRemoveDocumentBtn.setEnabled(true);
			} else {
				oRenameBtn.setEnabled(false);
				oEditUrlBtn.setEnabled(false);
				oRemoveDocumentBtn.setEnabled(false);
			}
    },

    // delete 
    onRemoveButtonPress : function(oContext){

        var that = this;
        const id = oContext.getProperty("ID");
        var oDataModel = that.getBindingContext().getModel()
        const sPath = oDataModel.sServiceUrl + that.getBindingContext().sPath.slice(1, that.getBindingContext().sPath.length) + "/_attachments";
        const sFileUrl = `${sPath}(ID=${id},IsActiveEntity=true)`;
        const oContexts = this.byId("table-uploadSet").getSelectedContexts();
        console.log(oContexts);
        if (oContexts && oContexts.length) {
            oContexts.forEach((oContext) => 
            {
    
                fetch(sFileUrl, {
                    method: 'DELETE',
                }).then((response)=>{
                    if(!response.ok){
                        throw new Error("Delete request failed.");
                    }
                    const oUploadSetTable = this.byId("table-uploadSet");
                    const oBinding = oUploadSetTable.getBinding("items");
                    oBinding.refresh();
                })
            })
        }
       


    }	
    }

    return Module;
});
