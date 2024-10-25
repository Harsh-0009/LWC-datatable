import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getLatestAccount from '@salesforce/apex/QuickContactCreating.getLatestAccount';
import checkAccountContacts from '@salesforce/apex/QuickContactCreating.checkAccountContacts';
 
export default class CreateContactButton extends NavigationMixin(LightningElement) {
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track isLoading = false;
    @track latestAccountId;
 
    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }
 
    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }
 
    handleEmailChange(event) {
this.email = event.target.value;
    }
 
    handleCreateContact() {
        if (!this.firstName || !this.lastName) {
            this.showToast('Error', 'First Name and Last Name are required', 'error');
            return;
        }
 
        this.isLoading = true;
        getLatestAccount()
            .then(account => {
                this.latestAccountId = account.Id;
                return checkAccountContacts({ accountId: account.Id });
            })
            .then(hasContacts => {
                const accountIdToUse = hasContacts ? null : this.latestAccountId;
                return this.createContact(accountIdToUse);
            })
            .catch(error => {
                this.isLoading = false;
                this.showToast('Error', error.body.message, 'error');
            });
    }
 
    createContact(accountId) {
        const fields = {
            'LastName': this.lastName,
            'FirstName': this.firstName,
'Email': this.email
        };
 
        if (accountId) {
            fields.AccountId = accountId;
        }
 
        const recordInput = { apiName: 'Contact', fields };
 
        return createRecord(recordInput)
            .then(contact => {
                this.isLoading = false;
 
                // Navigate to the contact record page
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
recordId: contact.id,
                        objectApiName: 'Contact',
                        actionName: 'view',
                    },
                });
 
                // Show appropriate toast message
                if (accountId) {
                    this.showToast(
                        'Success',
`Contact created and associated with the account. View the contact here: contact.id}" target="_blank">Contact</a>`,
                        'success'
                    );
                }
            })
            .catch(error => {
                this.isLoading = false;
                this.showToast('Error', error.body.message, 'error');
            });
    }
 
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
            html: true // This allows HTML content in toast message
        });
        this.dispatchEvent(event);
    }
}