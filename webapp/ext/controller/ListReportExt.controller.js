sap.ui.controller("sos.uploadimage.ext.controller.ListReportExt", {
	onInit: function () {
		var oSmartTable = this.byId("listReport");
		oSmartTable.setEnableAutoBinding(true);
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleName: "sos.uploadimage.i18n.i18n"
		});
		this.getView().setModel(i18nModel, "i18next");
		this.oBundle = this.getView().getModel("i18next").getResourceBundle();
	},
	handleValueChange: function (oEvent) {
		this.getView().setBusy(true);
		var oSource = oEvent.getSource();
		if (oSource.getBindingContext().getProperty("CatalogSKU")) {
			oSource.setUploadUrl(oSource.getModel().sServiceUrl +
				oSource.getModel().createKey("/ZCDS_C_SKUIMAGE", {
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
			if (sStatus.toString() === "201" || sStatus.toString() === "202") {
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
	},
	
	handleFileSize:function (oEvent) {
		//this.getView().getModel(["i18next]").
		
		var allMessage =  this.getView().getModel("i18next").getResourceBundle().getText("fileSize",[oEvent.getParameter("fileName")]);
		sap.m.MessageBox.show(allMessage, {
			icon: sap.m.MessageBox.Icon.ERROR, // default sap-icon://message-success
			title:  this.getView().getModel("i18next").getResourceBundle().getText("sizeError"), // default
			actions: sap.m.MessageBox.Action.OK, // default
			onClose: null, // default
			styleClass: "", // default
			initialFocus: null, // default
			textDirection: sap.ui.core.TextDirection.Inherit // default
		});
	},
	
	handleTypeMismatch: function(oEvent) {
		
		var allMessage =  this.getView().getModel("i18next").getResourceBundle().getText("fileType",[oEvent.getParameter("fileName")]);
		sap.m.MessageBox.show(allMessage, {
			icon: sap.m.MessageBox.Icon.ERROR, // default sap-icon://message-success
			title:  this.getView().getModel("i18next").getResourceBundle().getText("typeError"), // default
			actions: sap.m.MessageBox.Action.OK, // default
			onClose: null, // default
			styleClass: "", // default
			initialFocus: null, // default
			textDirection: sap.ui.core.TextDirection.Inherit // default
		});

	
	}
});