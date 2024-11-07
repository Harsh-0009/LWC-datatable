public with sharing class CreateOpportunityRecord {
    
   
 
        @AuraEnabled
        public static String createOpportunity(String name, Decimal amount, Date closeDate, String stage, String accountName, String type) {
            try {
              
                Account account = [SELECT Id FROM Account WHERE Name = :accountName];
     
                Opportunity newOpp = new Opportunity(
                    Name = name,
                    Amount = amount,
                    CloseDate = closeDate,
                    StageName = stage,
                    AccountId = account.Id,
                    Type = type
                );
     
                insert newOpp;
                return 'Opportunity created successfully with Id: ' + newOpp.Id;
     
            } catch (Exception e) {
                throw new AuraHandledException('Error creating Opportunity: ' + e.getMessage());
            }
        }
    }
    
