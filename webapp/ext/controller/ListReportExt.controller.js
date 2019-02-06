sap.ui.controller("sos.uploadimage.ext.controller.ListReportExt", {
	onInit: function () {
		var oSmartTable = this.byId("listReport");
		oSmartTable.setEnableAutoBinding(true);
		oSmartTable.setShowTablePersonalisation(false);
		oSmartTable.getCustomToolbar().setVisible(false);
		var oPage = this.getView().byId("page");
		oPage.getTitle().setVisible(false);
		oPage.getHeader().setVisible(false);
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleName: "sos.uploadimage.i18n.i18n"
		});
		this.getView().setModel(i18nModel, "i18next");
		this.oBundle = this.getView().getModel("i18next").getResourceBundle();
	},
	handleValueChange: function (oEvent) {
		// MessageToast.show("Press 'Upload File' to upload file '" +
		// 						oEvent.getParameter("newValue") + "'");
		this.getView().setBusy(true);
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
	handleUploadComplete: function (oEvent) {
		var sResponse = oEvent.getParameter("response");
		this.getView().setBusy(false);
		if (sResponse) {
			var sMsg = "";
			var sStatus = oEvent.getParameter("status");
			if (sStatus.toString() === "201") {
				sMsg = this.oBundle.getText("uploadSuccess", [oEvent.getParameter("fileName")]);
				oEvent.getSource().setValue("");
				this.getView().byId("listReport").rebindTable();
			} else {
				sMsg = this.oBundle.getText("uploadError", [oEvent.getParameter("fileName")]);
				oEvent.getSource().setValue("");
			}
			sap.m.MessageToast.show(sMsg);
		}
	},
	handleUploadAbort: function (oEvent) {
		this.getView().setBusy(false);
		sap.m.MessageToast.show(this.oBundle.getText("uploadAborted"));
	}
});