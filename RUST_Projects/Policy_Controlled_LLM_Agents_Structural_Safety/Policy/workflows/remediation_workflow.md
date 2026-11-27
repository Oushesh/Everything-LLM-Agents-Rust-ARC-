## Overview

## Approving Routing Rules

## Environment-Based Routing

## Risk-Based Routing (UAT only)

## Critical Schema Rules (PROD only)
   Changes affecting critical schemas in PROD require dual approval from both a DBA and the businees owner of that schema:

   Schema	Approver 1 (Technical)	Approver 2 (Business)
   FINANCE	Senior DBA	CFO or Finance Director
   HR	Senior DBA	CHRO or HR Director
   CORE_APP	Senior DBA	Engineering Lead
   PAYROLL	Senior DBA	CFO or Finance Director
   AUDIT	Senior DBA	Compliance Officer

Non-critical PROD schemas require single approval from the assigned Senior DBA.

## Routing Decision Tree
   START
     |
     v
   Is environment = DEV?
      YES -> Auto-approve -> Execute -> Notify -> END
  NO  -> Continue
  |
  v
Is environment = UAT?
  YES -> Is risk LOW?
           YES -> Auto-approve -> Execute -> Notify -> END
           NO  -> Request single DBA approval -> Wait -> Execute -> END
  NO  -> Continue
  |
  v
Is environment = PROD?
  YES -> Does change affect a critical schema?
           YES -> Request dual approval (DBA + Business Owner) -> Wait -> Execute -> END
           NO  -> Request single DBA approval -> Wait -> Execute -> END

## Approval Channels
   Approval requests are delivered through multiple channels simultaneously to maximize the chance of timely response.

   <This one mentions all the channels connected here.>

## Slack (Primary Channel)
   * Destination: #dba-ops channel (configurable per environment)
   * Format: Rich message with inline approve/deny buttons
   * Callback: Webhook endpoint processes button clicks
   * Threading: Follow-up messages (approval, execution result) posted as replies
   * Timeout Warning: A reminder is posted at 45 minutes if no response.

## Email (Fallback Channel)
   * To: Assigned DBA (from environment config dba_owner)

   * Subject: [URGENT] 
   * Body: Full approval package (see below)
   * Reply actions: Approve by replying with "APPROVED", deny with "DENIED"
   * Sent: Simultaneouslty with Slack notification
   
## JIRA (Tracking)
   * P

<How does the agent approve or knows what to approve in case it does so>

## Approval Package Contents
   Every approval request includes a complete context package so the approach informed decision without needing to investigate indepedently
   
   <We also decide or dictate how they the approval menas or what does it take>
 
   === SENTRI APPROVAL REQUEST ===

    Database:       PROD-DB-07 (PRODDB)
    Environment:    PROD
    Issue:          Tablespace USERS at 92% capacity
    Alert Type:     tablespace_full
    Detected:       2026-02-12 14:15:00 UTC
    Workflow ID:    wf-20260212-001

    --- Verification (Agent 2) ---
    - Tablespace confirmed at 92.3% (reported: 92%)
    - Disk space available: 45 GB free on ASM disk group DATA
    - No duplicate active workflows for this resource
    - Verification confidence: 98%

    --- Proposed Action ---
    SQL: ALTER TABLESPACE USERS ADD DATAFILE SIZE 10G AUTOEXTEND ON;
    Risk Level:     LOW
    Downtime:       NONE (online operation)
    Est. Duration:  ~12 seconds
    Affects Schema: None (tablespace-level operation)

    --- Rollback Plan ---
    SQL: ALTER TABLESPACE USERS DROP DATAFILE '/u01/oradata/PRODDB/users_0047.dbf';
    Rollback Risk:  LOW
    Auto-Rollback:  Yes (triggered on validation failure)

    --- Historical Context ---
    Similar past cases: 847 executions across all environments
    Success rate:        94.2%
    Avg. duration:       14 seconds
    Last execution:      2026-02-10 on PROD-DB-07 (SUCCESS)

    --- Approver Action ---
    [Approve]    [Deny]    [View Full Details]


## Timeout Behavior
   Approval requests have a finite lifetime. If no response is received within the timeout period, the request is escalated.

## Timeout Sequence
   T+0m   - Approval request sent (Slack, Email, JIRA)
    T+45m  - Reminder sent: "Approval still pending for {workflow_id}"
    T+60m  - Timeout reached:
            - Escalate to DBA Manager
            - Update JIRA priority to Urgent
            - If severity = CRITICAL:
                - Send PagerDuty alert
                - Post to #dba-escalations channel
    T+90m  - Second timeout reached:
            - Mark workflow as TIMEOUT
            - Require manual intervention
            - Page senior on-call DBA
    T+120m - Final escalation:
            - Notify VP of Engineering
            - Workflow remains in TIMEOUT until manually resolved

## Timeout Exceptions