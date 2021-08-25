const SECONDS = 3;
const MILLISECONDS = SECONDS*1000;
function getTimeAgo(ms) {
    var d = new Date();
    var n = d.getTime();
    var r = n - ms;
    return r;    
}

var WSHOST = location.origin.replace(/^http/, 'ws');
var sock = false;

function handleBpmButtonClick(e) {
    e.preventDefault();
    var timenow = getTimeAgo(0);
    var timeago = getTimeAgo(MILLISECONDS);
    var clicks = [];
    var minTime = 10000000000000;
    var maxTime = 0;
    //// If our component is storing any clicks
    if (bpmApp.clicks.length>0) {
        //// For each click:
        for (var c in bpmApp.clicks) {
            var click = bpmApp.clicks[c];
            if (click.time > timeago) {
                clicks.push(click);
            }
        }
    }
    bpmApp.clicks = clicks;
    maxTime = timenow;
    bpmApp.clicks.push({
        time: timenow
    });
    for (var c in bpmApp.clicks) {
        var click = bpmApp.clicks[c];
        //// If its time is greater than max, adjust max
        if (maxTime < click.time) { maxTime = click.time; } 
        //// If its time is lower than min, adjust min
        if (minTime > click.time) { minTime = click.time; }            

    }
    var diffMS = maxTime - minTime;
    var bpm = 0;
    if (diffMS > 0) {
        var numclicks = clicks.length - 1;
        var msPerClick = diffMS / numclicks;
        var clicksPerSecond = Math.round(60000 / msPerClick);
        bpm = clicksPerSecond;
    }

    //// Send our data to the websocket
    var msgdata = {
        action:"bpm",
        bpm: bpm,
        bpm_id: BPM_ID
    };
    sock.send(JSON.stringify(msgdata));


}





function logout(opts) {
    if (typeof opts == "undefined") {
        opts = {};
    }
    if (typeof opts.closeSocket == "undefined") {
        opts.closeSocket = true;
    }
    if (opts.closeSocket) {
        try {
            sock.close();
        } catch(er) {}        
    }
    sock = false;
    room = false;
    username = false;
    document.querySelector("#login").style.display = "block";
    document.querySelector("#logout").style.display = "none";
    document.querySelector("#output").style.display = "none";
    btnSendMsg.removeEventListener("click", clickSendMessage);
    chatmsg.removeEventListener("keyup", keyupChatMessage);
    inputroom.focus();
}













function loadMonitor() {

    //// Initialize a Vue component for the chatlog
    bpmApp = new Vue({
      el: '#bpm-app',
      data: {
        clicks:[]
        ,
        bpm:0
      }
    })
    $("#bpm-button").on("mousedown", function(e) { e.preventDefault(); });    
    $("#bpm-button").click(handleBpmButtonClick);



    sock = new WebSocket(WSHOST);
    sock.onclose = function(e) {
        logout({closeSocket:false});
    };
    //// Listen for when the socket is open and ready to receive/send events
    sock.onopen = (e) => {
//        console.clear();
        //// We'll package an initial message with the info they entered
        var msgdata = {
            action:"init",
            message: "Hello World!",
            bpm_id: BPM_ID
        };
        // // ... and send that info to the server to initialize things (see server.js notes)
        e.target.send(JSON.stringify(msgdata));
    }

    /// When a message is received from the server...
    sock.onmessage = function(m) {
        var x = JSON.parse(m.data);
        if (x.action=="log") {
            //// ... then let's just log it to our console.
            console.log(x.content);
        }
        if (x.action=="bpm") {
            console.log("bpm from websocket: ", x.bpm);
            bpmApp.bpm = x.bpm;
        }
    }



}



var bpmApp;
$(window).on("load", function() {
    if (BPM_ID!="") {
        loadMonitor();
    }
});




