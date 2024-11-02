// opportunityDataTable.js
import { LightningElement, track, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OppFetchandUpdate.getLatestOpportunities';
import saveOpportunity from '@salesforce/apex/OppFetchandUpdate.saveOpportunity';
import { refreshApex } from '@salesforce/apex';
 
export default class OpportunityDataTable extends LightningElement {
    @track opportunityData = [];
    @track showEditModal = false;
    @track currentOpportunity = {}; // Used for editing or creating opportunities
    @track showDetailsModal = false; // For showing opportunity details
 
    // Define columns for the datatable
    columns = [
        {
            label: 'Opportunity Name',
            fieldName: 'Name',
            type: 'url',
            typeAttributes: { label: { fieldName: 'Name' }, target: '_self' }
        },
        { label: 'Stage', fieldName: 'StageName' },
        { label: 'Amount', fieldName: 'Amount', editable: true },
        { label: 'Account Name', fieldName: 'Account.Name' }
    ];
 
    // Get latest 100 opportunities
    @wire(getOpportunities)
    wiredOpportunities({ error, data }) {
        if (data) {
            this.opportunityData = data;
        } else if (error) {
            console.error(error);
        }
    }
 
    // Handle clicking on opportunity row to show details
    handleRowClick(event) {
        const selectedOpportunity = event.detail.row;
        this.currentOpportunity = { ...selectedOpportunity }; // Copy selected opportunity
        this.showDetailsModal = true; // Show details modal
    }
 
    // Handle saving the opportunity
    handleSave() {
        saveOpportunity({ opportunity: this.currentOpportunity })
            .then(() => {
                this.showEditModal = false; // Close modal after saving
                return refreshApex(this.wiredOpportunities); // Refresh the data table
            })
            .catch(error => {
                console.error('Error saving opportunity:', error);
            });
    }
 
    // Handle new opportunity creation
    handleNewOpportunity() {
        this.currentOpportunity = { Id: null, Name: '', StageName: '', Amount: null, Account: { Name: '' } }; // Reset fields
        this.showEditModal = true; // Show modal for new opportunity
    }
 
    // Close modal
    handleCloseModal() {
        this.showEditModal = false;
        this.showDetailsModal = false; // Also close details modal
    }
}