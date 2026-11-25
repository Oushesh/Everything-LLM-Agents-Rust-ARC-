## Problem: 
   AI Frontend review: 
   
   AI Frontend code review takes time and we wanna find a way how to make it better and 
   correct it. Time per unit 


## Solution:
   Use AI to code and set up automations: 

   libraries you need are playwright, github actions and event triggers.

   ```
   import {defineConfig, devices} from '@playwright/test';

   export de 
   ```

## End-to-end tests without writing them

   Playwright’s recorder writes the test while you use the site. Start both servers, then record:

   ```
   bash
   # terminal 1, in airbnb_api
   cargo loco start

   # terminal 2, in staycore-web
   pnpm dev

   # terminal 3, in staycore-web
   pnpm test:e2e:codegen
   ```

   