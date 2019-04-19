import { qmpeer } from "..";


var imkit = qmpeer.imkit("");
imkit.sendMessage({});
imkit.onmessage = (msg: {}) => { };


var callkit = qmpeer.callkit("");
callkit.ontrackadded = (trackinfo, stream) => { }; // remote
callkit.ontrackremoved = (trackinfo) => { }; // remote

callkit.addtracks([], []); // user
callkit.removetracks([]); // user

callkit.oncalling = (trackinfolist, stream) => { }; // internal
callkit.oncallended = (reason, trackinfolist) => { }; // remote

callkit.onreconnecting = () => { }; // internal
callkit.onreconnectfailed = (trackinfolist) => { } // remote

callkit.endcall(); // user
callkit.holdcall(); // user
callkit.unholdcall(); // user

callkit.oncallheld = () => { }; // remote
callkit.oncallunhold = () => { }; // remote
