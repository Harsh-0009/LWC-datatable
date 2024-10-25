import { LightningElement, track } from 'lwc';
import createOpportunity from '@salesforce/apex/CreatingOppRecord.createOpportunity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class OpportunityCreator extends LightningElement {
    @track oppName = '';
    @track amount = 0;
    @track closeDate = '';
    @track stage = '';
    @track accountName = '';
    @track type = '';
 
    // Stage and Type options (can be dynamically fetched if needed)
    stageOptions = [
        { label: 'Prospecting', value: 'Prospecting' },
        { label: 'Qualification', value: 'Qualification' },
        { label: 'Negotiation', value: 'Negotiation' }
    ];
 
    typeOptions = [
        { label: 'New Customer', value: 'New Customer' },
        { label: 'Existing Customer', value: 'Existing Customer' }
    ];
 
    // Handlers for input fields
    handleOppNameChange(event) {
        this.oppName = event.target.value;
    }
 
    handleAmountChange(event) {
        this.amount = event.target.value;
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
 
    // Handler for Create Opportunity button
    createOpportunityHandler() {
        // Call the Apex method to create the opportunity
        createOpportunity({
            name: this.oppName,
            amountStr: String(this.amount),   // Convert amount to string
            closeDateStr: this.closeDate,     // Ensure closeDate is in yyyy-MM-dd format
            stage: this.stage,
            accountName: this.accountName,
            type: this.type
        })
        .then(result => {
            // Success toast
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: result,
                variant: 'success'
            }));
        })
        .catch(error => {
            // Error toast
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error creating Opportunity',
                message: error.body.message,
                variant: 'error'
            }));
        });
    }
}