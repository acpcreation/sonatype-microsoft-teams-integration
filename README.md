# Sonatype Microsoft Teams Webhook Integration

Steps for configuring a node.js service to forward Sonatype Lifecycle Webhook notifications to a Microsoft Teams (MS Teams) connector.

*Copyright Sonatype Inc. 2022*

Contributors:
- Alexander Plattel: aplattel@sonatype.com


Sonatype WebHook Documentation: https://help.sonatype.com/iqserver/automating/iq-server-webhooks
    

## Project Prep
### Configure Microsoft Teams Incomming Webhook 
1. Create a connector and get a webhook URL by going to this page: https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook?tabs=javascript 
2. Name it "Sonatype Lifecycle" and use the logo in this git repository as the image
3. Copy the Webhook connector URL generated into the `TEAMS_URL` field in the `.env` file


### Create the Sonatype Nexus IQ Server Webhook
1. Sign in to IQ Server with appropriate permissions
2. Click the settings button (gear icon) in the top right of the screen
3. Click the "+ Add a Webhook" button
    - This node.js service we are creating will default run on *http://localhost:3000/* which is what you can use as the URL
    - You can ignore the optional fields for now 
    - check the boxes for Application Evaluation and Violation Alert
    - Click the "Create" button



## Run the project
If everything has been set up correctly, we will be able to run the service and watch notifications come through.

Configure the `.env` file to include:
```
- TEAMS_URL=https://sonatype.webhook.office.com/webhookb2/...
- PORT=3000
- IQ_URL=http://localhost:8070/
```

In the terminal for this directory, run the service by typing:
```
- npm install
- npm start
```


All Done!


You can go to *http://localhost:3000/test* to trigger a test Microsoft Teams message

Then you should scan an app with Lifecycle and watch the notifications go!




## The Fine Print

Remember:
It is worth noting that this is **NOT SUPPORTED** by Sonatype, and is a contribution of ours to the open source
community (read: you!)

* Use this contribution at the risk tolerance that you have
* Do NOT file Sonatype support tickets related to `ossindex-lib`
* DO file issues here on GitHub, so that the community can pitch in

Phew, that was easier than I thought. Last but not least of all - have fun!
