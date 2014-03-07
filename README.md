messaging-application
=====================

Messaging Application

Messaging Application is a very basic web app that is intended to store and organized
blocks of text in a database which can be templates filled in with specific fields.

The templates were intended to be acp 128 formatted messages.

The following parameters can be putinto the message to be filled in when a message or messages are 
generated or emailed to a destination.

{DRI} destination routing indicator

{OSRI} originating routing indicator

{JUL} days in the year that have elapsed

{DTG} acp 128 formated date time group

{FL6} FM line in the acp 128 message

{FL7} TO line in the acp 128 message

{FL8} INFO line in the acp 128 message.

The requirements necessary to run this app are nodejs, and mongodb.

once you have both of those requirements you can clone this repository and from the root type

# npm install

to generate some base test data in the data base use the generator scripts under the model directory

i.e. # node <scriptname>

after the script says the data has been loaded press Ctrl-C to exit.

finally to run the web app type the following in the root of the project:

# node app.js

you can view the app by navigating to http://localhost:3000 in chrome or firefox.
