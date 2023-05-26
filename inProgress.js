

function formatPolicyActionMSTeamsNotification(e) {
    policyName = ""
    for (let i in e.owner) {
        for (let j in e.owner[i]) {
            if (e.id == e.owner[i][j].id) { // console.log(e.owner[i][j].name)
                policyName = e.owner[i][j].name;
                break;
            }
        }
    }


    let msTeamsMsg = {
        "channel": "iq",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Nexus IQ Administrative Action"
                }
            }, {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": e.type + " " + e.action + " for *" + policyName + "* in " + e.owner.name + " " + e.owner.type.toLowerCase() + "."
                    },
                ]
            }, {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Visit Nexus IQ Server"
                        },
                        "style": "primary",
                        "url": IQ_URL
                    }
                ]
            }
        ]
    }
    sendMSTeamsMessage(msTeamsMsg)
}



function formatLicenseManagementMSTeams(e) {

    let comments = ""
    if (e.licenseOverride.comment.length > 1) {
        comments = "\n\nComments: \"" + e.licenseOverride.comment + "\""
    }

    let lics = e.licenseOverride.licenseIds.toString()
    lics = lics.replaceAll(",", ", ")


    let mainText = "component " + extractComponentName(e.licenseOverride.componentIdentifier)
    if (e.licenseOverride.licenseIds.length > 0) {
        mainText += " - license(s): " + lics
    }

    let msTeamsMsg = {
        "channel": "iq",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Nexus IQ License Override"
                }
            }, {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": "License " + e.licenseOverride.status + " for " + mainText + ". " + comments
                    },
                ]
            }, {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Visit Nexus IQ Server"
                        },
                        "style": "primary",
                        "url": IQ_URL
                    }
                ]
            }
        ]
    }

    sendMSTeamsMessage(msTeamsMsg)
}

function extractComponentName(e) { // Pass in componentIdentifier
    let name = "";
    if (e.format == "maven") {
        name = e.coordinates.groupId + " : " + e.coordinates.artifactId + " : " + e.coordinates.version
        name += " (" + e.format + ")"

    } else {
        name = e.coordinates.packageId + " : " + e.coordinates.version + " (" + e.format + ")"
    }
    return name;
}

function formatViolationAlertMSTeamsNotification(e) {
    let scanURL = IQ_URL + "assets/index.html#/applicationReport/" + e.application.publicId + "/" + e.applicationEvaluation.reportId + "/policy"
    console.log(scanURL)

    // Reformat message
    let violationJSON = []
    e.policyAlerts = e.policyAlerts.reverse();
    for(let i in e.policyAlerts) {
        // console.log(e.policyAlerts[i])
        let p = e.policyAlerts[i]
        let violation = p.policyName+" ("+p.threatLevel+")"

        if (p.threatLevel >=9){
            violation = ":bangbang: "+violation
        }
        if (p.threatLevel <9 && p.threatLevel >=7){
            violation = ":warning: "+violation
        }
        
        for(let j in p.componentFacts){
            let pj = p.componentFacts[j]
            let displayName = pj.displayName.replaceAll(' ', '')

            let description = ""
            // for(let k in pj.constraintFacts){
            //     for(let l in pj.constraintFacts[k].satisfiedConditions){
            //         description+= ""+violation+" : "+pj.constraintFacts[k].satisfiedConditions[l].reason+"\n"
            //     }
            // }

            found = false
            for(let m in violationJSON){
                if (displayName == violationJSON[m].name){
                    // violationJSON[m].details += description
                    found = true
                    break;
                }
            }

            if (found==false){
                violationJSON.push({
                    name:displayName,
                    details:violation
                })
            }
        }
    }
    
    let violationDetails = ""
    for(let i in violationJSON){
        violationDetails+="\n• "+violationJSON[i].details+" | "+violationJSON[i].name
    }

    let msTeamsMsg = {
        "channel": "iq",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "New Security Violation(s) found for "+ e.application.name+" with Sonatype Continuous Monitoring",
                }
            }, {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": "*Application Evaluation Report*\n"+
                                "\t*• Affected Components:*\t"+e.applicationEvaluation.affectedComponentCount+"\n"+
                                "\t*• Critical Components:*\t"+e.applicationEvaluation.criticalComponentCount+" \n"+
                                "\t*• Severe Components:  *\t"+e.applicationEvaluation.severeComponentCount+" \n"+
                                "\t*• Moderate Components:*\t"+e.applicationEvaluation.moderateComponentCount+"\n"+
                                "*Stage:* "+e.applicationEvaluation.stage+"\n"+
                                "*Outcome:* "+e.applicationEvaluation.outcome+"\n"
                    },
                ]
            }, 
            {
                "type": "context",
                "elements": [
                    {
                        "type": "plain_text",
                        "text": violationDetails,
                        "emoji": true
                    }
                ]
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "View Report"
                        },
                        "style": "primary",
                        "url": scanURL
                    }
                ]
            }
        ]
    }
    sendMSTeamsMessage(msTeamsMsg)
}
