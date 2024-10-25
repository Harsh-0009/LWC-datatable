public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContact() {
       
      List<Contact> contacts = [SELECT Id, Name, Email, Phone FROM Contact Limit 3 ];

        return contacts;
    }
}