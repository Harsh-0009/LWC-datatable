
public with sharing class QuickContactCreating {
    @AuraEnabled(cacheable=true)
    public static Account getLatestAccount() {
        return [SELECT Id, Name FROM Account ORDER BY CreatedDate DESC LIMIT 1];
    }
 
    @AuraEnabled
    public static Boolean checkAccountContacts(Id accountId) {
        Integer contactCount = [SELECT Count() FROM Contact WHERE AccountId = :accountId];
        return contactCount > 0;
    }
}