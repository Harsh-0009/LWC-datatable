/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@IsTest
public class OppFetchandUpdateTestClass {
 
    @TestSetup
    static void setupTestData() {
        // Test data create karna
        Account testAccount = new Account(
            Name = 'X Account',
            AccountNumber = '1234567890',
            Website = 'www.testwebsite.com',
            Industry = 'Energy',
            AccountSource = 'Advertisement',
            AnnualRevenue = 1000000,
            Phone = '1234567890'
        );
        insert testAccount;
 
        List<Opportunity> opportunities = new List<Opportunity>();
 
        // 3 demo opp 
        for(Integer i=0; i<3; i++) {
            opportunities.add(new Opportunity(
                Name = 'Y Opportunity ' + i,
                AccountId = testAccount.Id,
                StageName = 'Prospecting',
CloseDate = Date.today().addDays(9),
                Amount = 1000 * (i + 1),
                Type = 'New Business'
            ));
        }
        insert opportunities;
    }
 
    @IsTest
    static void testGetOpportunities() {
        // Test method for getOpportunities()
        
        // Cacheable=true hai, isliye pehle static method ko test karenge
        Test.startTest();
        List<Opportunity> result = OppFetchandUpdate.getOpportunities();
        Test.stopTest();
        
        // Assert karna ki result null nahi hai aur 20 se zyada nahi ho
        System.assertNotEquals(null, result, 'Opportunities fetch failed.');
        System.assert(result.size() <= 10, 'Too many opportunities fetched.');
    }
 
    @IsTest
    static void testUpdateOpportunities() {
        // Test method  updateOpportunities() ke liye
 
        // Test data fetch karna
        List<Opportunity> opportunities = [
            SELECT Id, Name, StageName, Amount FROM Opportunity LIMIT 1
        ];
 
        // Update fields ko modify karna
        opportunities[0].StageName = 'Closed Won';
        opportunities[0].Amount = 5000;
 
        Test.startTest();
        OppFetchandUpdate.updateOpportunities(opportunities);
        Test.stopTest();
 
        // Verify karna ki update successful tha
        Opportunity updatedOpportunity = [SELECT Id, StageName, Amount FROM Opportunity WHERE Id = :opportunities[0].Id];
        System.assertEquals('Closed Won', updatedOpportunity.StageName, 'StageName update failed.');
        System.assertEquals(5000, updatedOpportunity.Amount, 'Amount update failed.');
    }
}