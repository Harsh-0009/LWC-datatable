///Hello

public with sharing class OppFetchandUpdate {
 
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities() {
        try {
            return [
                SELECT Id, Name, Account.Name, Account.Phone, StageName, Type, Amount, CloseDate
                FROM Opportunity ORDER BY CreatedDate DESC
                LIMIT 200
            ];
        } catch (Exception e) {
            System.debug('Error fetching opportunities: ' + e.getMessage());
            return null;
        }
    }
 
    @AuraEnabled
    public static void updateOpportunities(List<Opportunity> opps){
        update opps;
        
    }
    
    // @AuraEnabled
    // public static void updateOpportunities(List<Opportunity> opportunities) {
    //     try {
    //         update opportunities;
    //         System.debug('Opportunities updated successfully.');
    //     } catch (DmlException e) {
    //         throw new AuraHandledException('Error updating opportunities: ' + e.getMessage());
    //     }

        @AuraEnabled(cacheable=true)
    public static Opportunity fetchOpportunityDetail(Id opportunityId) {

        return [SELECT Id, Name, Amount, StageName, CloseDate, Type, Account.Name
                FROM Opportunity
                WHERE Id = :opportunityId];
    }
    } 
       
