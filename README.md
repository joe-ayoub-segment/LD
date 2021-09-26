Written By: Joe Ayoub   
Last Updated: 26/09/21   

## Contents
- Summary
- Instructions
- Settings

### Summary:

This Node.js script demonstrates how user profile details could be migrated from one system to another with the aid of the launchDarkly Feature Flag service. 

A feature flag is used to specify which users should be migrated and which should not. The selection criteria are based on user attributes in Launch Darkly. 

For demonstration purposes the source user profiles are stored in a pipe delimited CSV file, however in a more real world scenario this data could be read in from a database. Also, for demonstration purposes a user profile is considered migrated after the user profile has been loaded into Segment using a Segment identify() API call. This API call could be replaced by an API call to any other service. 

### Instructions:

#### 1. Install Node and NPM

[See instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

#### 2. Clone the repo and install dependencies

Clone this repo, then open a terminal in the LaunchDarkly_Migration_App folder. Run the following commands in order: 
```
npm init --yes
```

```
npm install fs
```

```
npm install launchdarkly-node-server-sdk
```

```
npm install csv-parse   
```

```
npm install analytics-node 
```
#### 3. Run the migration script

Run the following terminal command: 
```
node index.js
```

### Project files: 

There are 2 project files. 

- index.js
- data/data_to_import.csv

#### 1. index.js script file

This file contains a script that does the following when executed: 

1. Loads the user data from the data/data_to_import.csv file
2. For each data row, check if the user is eligible for migration. This is done via a LaunchDarkly feature flag check
3. If the user is eligible for migration, trigger a Segment identify() call to load the user's profile data into Segment. 
4. The following logs get written to standard output

#### 2. data/data_to_import.csv data file

This file contains rows of user profile data, including the user's key (unique ID), user's name and other user attributes. 

<img src='https://user-images.githubusercontent.com/45374896/82040857-26043d80-969f-11ea-8001-7aa2910ea7ad.png' width="550">
