import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createContact from '@salesforce/apex/CreateDummyContact.createContact';
 
export default class AccountContactQuickAction extends LightningElement {
    @api recordId; // Account Id
 
    handleQuickAction() {
        createContact({ accountId: this.recordId })
            .then(result => {
                const contactId = result.contactId;
                if (result.message) {
                    this.showToast('Info', result.message, 'info');
                } else {
                    this.navigateToContact(contactId);
                }
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }
 
    navigateToContact(contactId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: contactId,
                objectApiName: 'Contact',
                actionName: 'view'
            }
        });
    }
 
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
}
 


