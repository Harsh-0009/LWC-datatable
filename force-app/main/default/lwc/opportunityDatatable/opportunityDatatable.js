import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOpportunities from '@salesforce/apex/OppFetchandUpdate.getOpportunities';
import updateOpportunities from '@salesforce/apex/OppFetchandUpdate.updateOpportunities';
import createOpportunity from '@salesforce/apex/CreatingOppRecord.createOpportunity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
 
export default class OpportunityDataTable extends NavigationMixin(LightningElement) {
    @track draftValues = [];
    @track opportunities; // Opportunities ko track karo
    @track columns = [
        { label: 'Opportunity Name', fieldName: 'Name', type: 'text', sortable: false , editable: true },
        { label: 'Account Name', fieldName: 'AccountName', type: 'text', editable: false },
        { label: 'Phone', fieldName: 'AccountPhone', type: 'phone', editable: true },
        { label: 'Stage', fieldName: 'StageName', type: 'text', editable: true },
        { label: 'Type', fieldName: 'Type', type: 'text' },
        { label: 'Total Amount ', fieldName: 'Amount', type: 'currency', editable: true },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date', editable: true },
        {
            type: 'button',
            typeAttributes: {
                label: 'View',
                name: 'view_record',
                title: 'Click to View Record',
                variant: 'base'
            }
        }
    ];
 
    @wire(getOpportunities)
    wiredOpportunities({ error, data }) {
        if (data) {
            console.log('Opportunities:',data);
            
            this.opportunities = data.map(opp => ({
                ...opp,
                AccountName: opp.Account ? opp.Account.Name : 'No Account',
                AccountPhone: opp.Account ? opp.Account.Phone : 'No Phone'
            }));

            console.log('Opp after adding Acc details:', this.opportunities);
        } else if (error) {
            this.opportunities = [];
            console.error('Error while data ret:', error);
        }
    }
 
    handleRowAction(event) {
        const row = event.detail.row;
        console.log('Row clik', row)
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                objectApiName: 'Opportunity',
                actionName: 'view'
            }
        });
    }
    
    //  handleOpportunityClick(event){
    //     const oppId = event.target.dataset.id;
    //     console.log('Opportunity Id',oppId)
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__recordPage',
    //         attributes: {
    //             recordId: oppId,
    //           objectApiName: 'Opportunity',
    //             actionName: 'view'
    //         }
    //     });
    //  }

    handleSave(event) {
        const updatedFields = event.detail.draftValues; // getting the draft values

        console.log('Draft val',updatedFields)
        const recordsToUpdate = updatedFields.map(draft => {
            const record = { Id: draft.Id }; // cnfrm the record Id  included
            if(draft.Name) record.Name= draft.Name;
            if (draft.AccountPhone) record.AccountPhone = draft.AccountPhone; // Adding editable fields only
            if (draft.StageName) record.StageName = draft.StageName;
            if (draft.Amount) record.Amount = draft.Amount;
            if(draft.CloseDate) record.CloseDate = draft.CloseDate;
            if(draft.AccountName) record.AccountName = draft.AccountName;
            return record; // Return the record to update
        });

        console.log('Record update', recordsToUpdate);
 
        updateOpportunities({ opportunities: recordsToUpdate }) // Calling the Apex and update records
            .then(() => {
        console.log('Record updated');
       
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Opportunities updated successfully!',
                        variant: 'success',
                    })
                );
                this.draftValues = []; // draft values ko empy
                return refreshApex(this.wiredOpportunities); // Refresh the wire  updated data ke liye 
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
                console.error('Error updating records:', error);
            });
    }

    @track isModalOpen = false;
    @track oppName = '';
    @track amount = 0;
    @track closeDate = '';
    @track stage = '';
    @track accountName = '';
    @track type = '';
   // @track isFormVisible = false;
    wiredOpportunities;
 
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

    /*
@wire(getOpportunities)
    wiredOpportunities(result){
        this.wiredOpportunities = result;
    }*/
 
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

    refreshPage(event) {
        window.location.reload();
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
       .then(result=>{
            return refreshApex(this.opportunities);
         })
        
         setTimeout(()=> {
            this.refreshPage();
        }, 1500)

        .then(result => {
            // Show success toast
            console.log('Opp created successfully', result);
            this.showToast('Success', result, 'success');
 
            //  fields ko Reset after creation
            this.resetFields();


            this.closeModal();

            

         
        })
        .catch(error => {

            // Showing error 
            console.log('Opp  not created successfully', error);
            this.showToast('Error creating Opportunity', error.body.message, 'error');
        });
        // .then(result=>{
        //     return refreshApex(this.opportunities);
        //  })
    //    setTimeout(()=> {
    //         this.refreshPage();
    //     }, 1500)
    }
    
 
    // Utility method toast messages ke liye
    showToast(title, message, variant) {
        console.log('toast msg', {title,message,variant} );
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        }));
      //  this.isFormVisible = false;
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