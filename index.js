var LaunchDarkly = require('launchdarkly-node-server-sdk');
var Analytics = require('analytics-node');
var parse = require('csv-parse');
var fs = require('fs');


// START CONFIGURATION

// Segment SDK settings
const SegmentSettings = {

  // File deliimiter
  delimiter: '|',

  // Locaton of file containing details of user accounts to be migrated
  file:'data/data_to_import.csv',
  
  // Segment wrteKey
  write_key:'XBuOtFhR6M1BN0D1eaiss9xN1kzxKH1v',

  // Segment event batch size
  batch_size: 1

};


// LD SDK settings
const LDSettings = {

  // Set sdkKey to your LaunchDarkly SDK key.
  sdkKey : "sdk-16b8e5c9-73aa-42bb-955b-4d87a54ce68f",
 
  // LD feature flag which determins if a user is eligible for migration
  eligible_for_migration : "eligible-for-migration", 

}

// END CONFIGURATION

// START INITIALIZATION 

// Initialize Segment SDK
var segmentClient = new Analytics(SegmentSettings.write_key, {
  flushAt: SegmentSettings.batch_size
});

// Initialize LaunchDarkly SDK
const ldClient = LaunchDarkly.init(LDSettings.sdkKey);

// END INITIALIZATION


// Wait for LD to initialize before doing anything
ldClient.waitForInitialization().then(function() {

  var rowCount = 0;

  // Iterate over every row in the CSV user data file
  // Check if user is eligiible for migration
  fs.createReadStream(SegmentSettings.file)
    .pipe(parse({
      delimiter: SegmentSettings.delimiter,
      relax: true
    }))
    .on('data', function (csvrow) {
      
      if (rowCount > 0) {
        
        // Create an LD user object from the CSV row
        let user = {
          key: csvrow[0] ? csvrow[0].trim() : undefined,
          name: csvrow[1] ? csvrow[1].trim() : undefined,
          custom: {
            customerClass : csvrow[2] ? csvrow[2].trim() : undefined,
            numUsers : csvrow[3] ? Number(csvrow[3]) : undefined,
            isActiveLast30d : csvrow[4] ? Boolean(csvrow[4].trim()) : undefined,
            hasUsedfeatureX : csvrow[5] ? Boolean(csvrow[5].trim()) : undefined,
            hasUsedfeatureY : csvrow[6] ? Boolean(csvrow[6].trim()) : undefined,
            hasUsedfeatureZ : csvrow[7] ? Boolean(csvrow[7].trim()) : undefined,
          }
        };

        // If user is eligible for migration then migrate them
        ldClient.variation(LDSettings.eligible_for_migration, user, false, function(err, flagValue){
          if(flagValue) 
            migrateUser(user); 
          else 
            console.log(`user ${user.key} with name ${user.name} not elibile for migration`);      
        });
        ldClient.flush();
        
      }
      rowCount++;
    })
    .on('end', function () {
      ldClient.flush(function() {
        ldClient.close()
      });
    });

}).catch(function(error) {
  console.log("SDK failed to initialize: " + error);
  process.exit(1);
});

// Upload the user profile to Segment
function migrateUser(user) {
  
  segmentClient.identify({
    userId:user.key,
    traits: { ...user.custom, name:user.name }
  });

  segmentClient.flush();

  console.log(`user ${user.key} with name ${user.name} migrated`);  

}
