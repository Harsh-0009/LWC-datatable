import { LightningElement, track } from 'lwc';
import createOpportunity from '@salesforce/apex/CreatingOppRecord.createOpportunity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class OpportunityCreator extends LightningElement {
    @track isModalOpen = false;
    @track oppName = '';
    @track amount = 0;
    @track closeDate = '';
    @track stage = '';
    @track accountName = '';
    @track type = '';
    @track isFormVisible = false;
 
    // drop down value
    stageOptions = [
        { label: 'Prospecting', value: 'Prospecting' },
        { label: 'Qualification', value: 'Qualification' },
        { label: 'Negotiation', value: 'Negotiation' },
        { label: 'Closed Won', value: 'Closed Won' },
        { label: 'Closed Lost', value: 'Closed Lost' }
    ];
 
    typeOptions = [
        { label: 'New Customer', value: 'New Customer' },
        { label: 'Existing Customer - Upgrade', value: 'Existing Customer - Upgrade' },
        { label: 'Existing Customer - Replacement', value: 'Existing Customer - Replacement' },
        { label: 'Partner Referral', value: 'Partner Referral' }
    ];
 
    // value change ke liye input derhe
    handleOppNameChange(event) {
        this.oppName = event.target.value;
        console.log('Opp Name',this.oppName);
    }
 
    handleAmountChange(event) {
        this.amount = event.target.value;
        console.log('Opp Amount',this.amount);
    }
 
    handleCloseDateChange(event) {
        this.closeDate = event.target.value;
        console.log('Opp Close Date',this.closeDate);
    }
 
    handleStageChange(event) {
        this.stage = event.target.value;
        console.log('Opp Stage Name',this.stage);
    }
 
    handleAccountNameChange(event) {
        this.accountName = event.target.value;
        console.log('Opp Account Name',this.accountName);
    }
 
    handleTypeChange(event) {
        this.type = event.target.value;
        console.log('Opp Type Name',this.type);
    }
   /* handleNewButtonClick(){
        this.isFormVisible = true;
        console.log('Button clicke',this.isFormVisible);
    }*/
    openModal(){
        this.isModalOpen = true;
    }
    closeModal(){
        this.isModalOpen = false;
    }
    // ishe  Opportunity create kr rahe
    createOpportunityHandler() {
        // validationn
        if (!this.oppName || !this.amount || !this.closeDate || !this.stage || !this.accountName || !this.type) {
            this.showToast('Error', 'Please fill all required fields.', 'error');
            return;
        }
 
        // Calling Apex   Opportunity create karne ke liye
        createOpportunity({
            name: this.oppName,
            amount: parseFloat(this.amount),   
            closeDate: this.closeDate,          
            stage: this.stage,
            accountName: this.accountName,
            type: this.type
        })
        .then(result => {
            // Show success toast
            console.log('Opp created successfully', result);
            this.showToast('Success', result, 'success');
 
            //  fields ko Reset after creation
            this.resetFields();
        })
        .catch(error => {

            // Showing error 
            console.log('Opp  not created successfully', error);
            this.showToast('Error creating Opportunity', error.body.message, 'error');
        });
    }
 
    // Utility method toast messages ke liye
    showToast(title, message, variant) {
        console.log('toast msg', {title,message,variant} );
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        }));
        this.isFormVisible = false;
    }
 
    // field ko reset ke rha e
    resetFields() {
        console.log('Resrt form fields')
        this.oppName = '';
        this.amount = 0;
        this.closeDate = '';
        this.stage = '';
        this.accountName = '';
        this.type = '';
    }
}