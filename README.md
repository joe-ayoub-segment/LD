Written By: Joe Ayoub   
Last Updated: 26/09/21   

## Contents
- Summary
- Discussion
- Instructions
- Project Files
- Settings
- Launch Darkly Project and feature flag settings

### Summary:

This Node.js script demonstrates how user profile details could be migrated from one system to another with the aid of the launchDarkly Feature Flag service. 

A feature flag is used to specify which users should be migrated and which should not. The selection criteria are based on user attributes in Launch Darkly. 

For demonstration purposes the source user profiles are stored in a pipe delimited CSV file, however in a more real world scenario this data could be read in from a database. Also, for demonstration purposes a user profile is considered migrated after the user profile has been loaded into Segment using a Segment identify() API call. This API call could be replaced by an API call to any other service. 

### Discussion:

The 'service' I decided to use as the Destination service for migration is called 'Segment'. [Segment](https://www.segment.com) is a Customer Data Platform which is capable of accepting user profile data and user analytics data, and can forward this data on to hundreds of different Marketing and Analytics tools. 

I was able to create a mechanism to control which users get migrated from a flat file to Segment using a Feature Flag that looks at the user's attributes in LaunchDarkly. However this script has no way of knowing or checking if a user has already been migrated, so executing the script twice would result in the user being 'migrated' twice. If I had more time I'd look into fixing this issue. 

Users can be migrated a single cohort at a time, with the cohort selection criteria being controled via a Feature Flag. Selecting a new cohort of users for migration is as simple as updating the eligible-for-migration Feature Flag selection criteria, then rerunning the script. 

In the example below only users who have a CustomerClass = Trial will be migrated. 

<img src='https://user-images.githubusercontent.com/45374896/134810924-d749bb70-98e3-4b85-aa06-0ab349a7251a.png' width="500">

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

#### 4. Output

The script will output logs indicating which users were migrated and which were not migrated

<img src='https://user-images.githubusercontent.com/45374896/134811207-12c99238-3dc8-4d2c-8088-a2e7b96ba55c.png' width="900">

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

<img src='https://user-images.githubusercontent.com/45374896/134810047-92818338-9a10-44e3-8b40-9d20b9ca3bbc.png' width="900">

### Settings:

All settings are stored in the index.js file. 

The following are LaunchDarkly related settings, and relate to the LaunchDarkly project and Feature Flag being checked

<img src='https://user-images.githubusercontent.com/45374896/134810164-30ad759e-cf65-44a4-a6db-1cae851ae241.png' width="900">

The following are Segment related settings. The write_key setting indicates the location in Segment where the user profile data will be sent to. 

<img src='https://user-images.githubusercontent.com/45374896/134810272-71d2c017-c524-477f-8813-e5eec3a9d7ce.png' width="900">

### Launch Darkly Project and feature flag details: 

Here's a screenshot of the LaunchDarkly project: 
<img src='https://user-images.githubusercontent.com/45374896/134810323-9ac18113-0ee1-4eab-88ab-adb1c4aa7926.png' width="900">

Here's a screenshot of the user profiles loaded into LaunchDarkly

<img src='https://user-images.githubusercontent.com/45374896/134810432-44c11b27-ac76-45c0-85a2-e9383ac12926.png' width="900">

Here's a screenshot of the feature flag rules for the eligible-for-migration flag. 

<img src='https://user-images.githubusercontent.com/45374896/134810480-e777a633-8ef6-42d2-838e-6fb64522939e.png' width="900">

### Segment project details:

When a user is migrated, an API call is sent to Segment which loads the user's profile into Segment. 

Here's a screenshot of the API call being received by Segment. 

<img src='https://user-images.githubusercontent.com/45374896/134810548-0705fb45-e714-4b62-8f5b-a593716a0465.png' width="900">

Here's a screenshot of the user's profile in Segment's user profile engine

<img src='https://user-images.githubusercontent.com/45374896/134810695-f7de558f-8bb0-4c6a-8669-d2f77b8cc0e2.png' width="900">

