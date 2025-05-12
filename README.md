# BPM Co-Monitoring

## About

This is an app-in-progress that allows two users to go to the same coded URL and then monitor one of their pulse counts together. For example, a patient and a doctor might go to <app_url>/monitor/<some_id>. Each person on a given page will see a BPM count (at 0 until it changes) and a button to click repeatedly. The BPM count will update (using websockets) in all browsers that are connected using the same <some_id>.

While it may seem basic (and there are already products out there that do this with devices and better technology), this project serves several purposes:
- It demonstrates the use of Vue.js, Node and Express in developing a real-time data exchange app over a WebSockets connection.
- It serves as a proof of concept for other similar telehealth activities that might benefit from this kind of interface.
- Because of its very basic nature, it serves as a good template for developing other very different projects using similar technologies, ranging from chat apps to games to anything else that might allow you to engage other users in real time.

## See it in action

https://bpm-share.herokuapp.com/

## Installation and Setup

Clone this repo and enter it. Then...
```
$ npm install
$ npm start
```
... Then visit localhost:3000 in your browser.

