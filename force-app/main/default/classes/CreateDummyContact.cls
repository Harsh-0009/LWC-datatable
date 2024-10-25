/*public with sharing class CreateDummyContact {
    @AuraEnabled
    public static Contact createContact(Id accountId){

        Contact dummyContact = new Contact(
            Salutation = 'Mr.',
            FirstName='Divya',
            LastName = 'Singh',
            AccountId = accountId
        );

        insert dummyContact;
        return dummyContact;
    
}
}  */

public with sharing class CreateDummyContact {
    @AuraEnabled
    public static Map<String, String> createContact(Id accountId) {
        Map<String, String> result = new Map<String, String>();
        List<Contact> existingContacts = [SELECT Id FROM Contact WHERE AccountId = :accountId];
        
        if (existingContacts.size() > 0) {
            result.put('message', 'On this account, a Contact is already associated. Click here to view the existing contact.');
        } else {
            Contact newContact = new Contact(LastName = 'Dummy Contact', AccountId = accountId);
            insert newContact;
            result.put('contactId', newContact.Id);
        }
        return result;
    }
}
