# BPM Co-Monitoring

## About

This is an app-in-progress that allows two users to go to the same coded URL and then monitor one of their pulse counts together. For example, a patient and a doctor might go to <app_url>/monitor/<some_id>. Each person on a given page will see a BPM count (at 0 until it changes) and a button to click repeatedly. The BPM count will update (using websockets) in all browsers that are connected using the same <some_id>.


## Installation

Clone this repo and enter it. Then...
```
$ npm install
$ npm start
```
... Then visit localhost:3000 in your browser.

