@isTest
public class OppFetchandUpdateTestClass {
 
    @testSetup
    static void setupTestData() {
       
        List<Opportunity> opportunities = new List<Opportunity>();
        for (Integer i = 0; i < 5; i++) {
            opportunities.add(new Opportunity(
                Name = 'Test Opportunity ' + i,
                StageName = 'Prospecting',
                CloseDate = Date.today().addDays(30),
                Amount = 10000 * (i + 1),
                Type = 'New Customer'
            ));
        }
        insert opportunities;
    }
 
    @isTest
    static void testGetOpportunities() {
        Test.startTest();
     
        List<Opportunity> oppList = OppFetchandUpdate.getOpportunities();

        Test.stopTest();
        
      
        System.assertNotEquals(null, oppList, 'getOpportunities returned null');
        System.assert(oppList.size() > 0, 'getOpportunities did not return any records');
        System.assertEquals(5, oppList.size(), 'Expected 5 opportunities, but got ' + oppList.size());
    }
 
  
}