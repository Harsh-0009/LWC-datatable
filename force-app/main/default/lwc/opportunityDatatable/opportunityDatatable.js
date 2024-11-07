//Trying pulling request
import { LightningElement, wire, track } from "lwc";
import getOpportunities from "@salesforce/apex/OppFetchandUpdate.getOpportunities";
import updateOpportunity from "@salesforce/apex/OppFetchandUpdate.updateOpportunity";
import createOpportunity from "@salesforce/apex/CreatingOppRecord.createOpportunity";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class OpportunityDatatable extends LightningElement {
  @track opportunities;
  @track error;
  @track isEditModalOpen = false;
  @track isCreateModalOpen = false;
  @track selectedOpportunity = {};
  @track oppName = "";
  @track amount = 0;
  @track closeDate = "";
  @track stage = "";
  @track accountName = "";
  @track type = "";

  columns = [
    {
      label: "Opportunity Name",
      fieldName: "Name",
      type: "button",
      typeAttributes: { label: { fieldName: "Name" }, variant: "base" }
    },
    { label: "Stage", fieldName: "StageName" },
    { label: "Close Date", fieldName: "CloseDate", type: "date" },
    { label: "Type", fieldName: "Type", type: "text" },
    {
      label: "Amount",
      fieldName: "Amount",
      type: "currency",
      cellAttributes: { alignment: "left" }
    },
    { label: "Account Name", fieldName: "AccountName" }
  ];

  stageOptions = [
    { label: "Prospecting", value: "Prospecting" },
    { label: "Qualification", value: "Qualification" },
    { label: "Negotiation", value: "Negotiation" },
    { label: "Closed Won", value: "Closed Won" },
    { label: "Closed Lost", value: "Closed Lost" }
  ];
  typeOptions = [
    { label: "New Customer", value: "New Customer" },
    {
      label: "Existing Customer - Upgrade",
      value: "Existing Customer - Upgrade"
    },
    {
      label: "Existing Customer - Replacement",
      value: "Existing Customer - Replacement"
    },
    { label: "Partner Referral", value: "Partner Referral" }
  ];

  @wire(getOpportunities)
  wiredGetOpportunities(result) {
    this.wiredOpportunities = result;
    if (result.data) {
      this.opportunities = result.data.map((opportunity) => ({
        Id: opportunity.Id,
        Name: opportunity.Name,
        StageName: opportunity.StageName,
        Amount: opportunity.Amount,
        CloseDate: opportunity.CloseDate,
        Type: opportunity.Type,
        AccountName: opportunity.Account?.Name
      }));
      this.error = undefined;
    } else if (result.error) {
      this.error = result.error;
      this.opportunities = undefined;
    }
  }

  handleRowAction(event) {
    const row = event.detail.row;
    this.selectedOpportunity = { ...row };
    this.isEditModalOpen = true;
  }

  openCreateModal() {
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
    this.resetFields();
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  handleFieldChange(event) {
    const field = event.target.name;
    const value = event.target.value;

    if (field === "Amount") {
      const regex = /^[0-9]*$/;
      if (!regex.test(value)) {
        this.showToast("Error", "Amount can only contain numbers", "error");
        return;
      }
    }
    this.selectedOpportunity[field] = value;
  }

  saveOpportunity() {
    updateOpportunity({ updatedOpportunity: this.selectedOpportunity })
      .then(() => {
        this.showToast(
          "Success",
          "Opportunity updated successfully",
          "success"
        );
        this.closeEditModal();
        return refreshApex(this.wiredOpportunities);
      })
      .catch((error) => {
        this.showToast("Error", "Error updating opportunity", "error");
        console.error(error);
      });
  }

  handleOppNameChange(event) {
    this.oppName = event.target.value;
  }
  handleAmountChange(event) {
    const amountValue = event.target.value;

    const digitPattern = /^\d*$/;

    if(digitPattern.test(amountValue)){
        this.amount = amountValue;
    }
    else {
        this.showToast("Error", "Amount can only contain numbers", "error");
        event.target.value = this.amount;
    }
    
    // const value = event.target.value;
    // const regex = /^[0-9]*$/;
    // if (!regex.test(value)) {
    //   this.showToast("Error", "Amount can only contain numbers", "error");
    //   return;
    // }
    // this.amount = event.target.value;
  }
  handleCloseDateChange(event) {
    this.closeDate = event.target.value;
  }
  handleStageChange(event) {
    this.stage = event.target.value;
  }
  handleAccountNameChange(event) {
    this.accountName = event.target.value;
  }
  handleTypeChange(event) {
    this.type = event.target.value;
  }

  createOpportunityHandler() {
    if (
      !this.oppName ||
      !this.amount ||
      !this.closeDate ||
      !this.stage ||
      !this.accountName ||
      !this.type
    ) {
      this.showToast("Error", "Please fill all required fields.", "error");
      return;
    }

    createOpportunity({
      name: this.oppName,
      amount: parseFloat(this.amount),
      closeDate: this.closeDate,
      stage: this.stage,
      accountName: this.accountName,
      type: this.type
    })
      .then((result) => {
        this.showToast(
          "Success",
          "Opportunity created successfully",
          "success"
        );
        this.closeCreateModal();
        return refreshApex(this.wiredOpportunities);
      })
      .catch((error) => {
        this.showToast(
          "Error creating Opportunity",
          error.body.message,
          "error"
        );
        console.error(error);
      });
  }

  // Toast Utility
  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title,
      message,
      variant
    });
    this.dispatchEvent(event);
  }

  // Reset Fields after Creation
  resetFields() {
    this.oppName = "";
    this.amount = 0;
    this.closeDate = "";
    this.stage = "";
    this.accountName = "";
    this.type = "";
  }
}
