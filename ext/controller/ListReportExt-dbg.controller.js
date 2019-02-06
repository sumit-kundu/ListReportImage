sap.ui.controller("sos.uploadimage.ext.controller.ListReportExt", {

	onClickActionZCDS_C_SOS_SKUIMAGE1: function (oEvent) {},
	onInit: function() {
		this.byId("listReport").setEnableAutoBinding(true);
		this.byId("listReport").setShowTablePersonalisation(false);
	},
	handleValueChange: function (oEvent) {
		// MessageToast.show("Press 'Upload File' to upload file '" +
		// 						oEvent.getParameter("newValue") + "'");
		var oSource = oEvent.getSource();
		if (oSource.getBindingContext().getProperty("CatalogSKU")) {
			oSource.setUploadUrl(oSource.getModel().sServiceUrl +
				oSource.getModel().createKey("/ZCDS_C_SOS_SKUIMAGE", {
					CatalogSKU: oSource.getBindingContext().getProperty("CatalogSKU")
				}) + "/to_SOSImage");

		}
		oSource.getModel().refreshSecurityToken();
		oSource.addHeaderParameter(
			new sap.ui.unified.FileUploaderParameter({
				name: "x-csrf-token",
				value: oSource.getModel().getHeaders()["x-csrf-token"]
			}));
	},
	handleUploadPress: function (oEvent) {
		var oFileUploader = this.byId("fileUploader");
		if (!oFileUploader.getValue()) {
			// MessageToast.show("Choose a file first");
			return;
		}
		oFileUploader.upload();
	},
	handleUploadComplete: function (oEvent) {
		var sResponse = oEvent.getParameter("response");
		if (sResponse) {
			var sMsg = "";
			// var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
			var sStatus = oEvent.getParameter("status");
			if (sStatus == "201") {
				sMsg = "\n" + "File" + oEvent.getParameter("fileName") + "uploaded successfully";
				oEvent.getSource().setValue("");
				var oSource = oEvent.getSource();
				this.getView().byId("listReport").rebindTable();
				// var oTable = this.getView().byId("listReport").getTable();
				// oSource.getModel().refresh(true);
				// oTable.getBinding("items").refresh();
				// var oModel = oTable.getBinding("items").getModel();
				// var oContext = oModel.getContext(oSource.getBindingContext().getPath());
				// oTable.setBindingContext(oContext);
			} else {
				sMsg = "Return Code: " + sStatus + "\n" + "File" + oEvent.getParameter("fileName") + "(Upload Error)";
				oEvent.getSource().setValue("");
			}

			sap.m.MessageToast.show(sMsg);
		}
	}
});