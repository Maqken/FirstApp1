var cmd = require('node-cmd');
var m = require("mithril")
const net = require('net');
// initialize the Youtube API library


let State = require("./Globals").state
var MenuBoton = require("./MenuButton").component
var Menu = require("./Menu").component
var VodDisplay = require("./VodDisplay").component

let mpv = require('mpv-ipc');
let player = new mpv.MPVClient('\\\\.\\pipe\\tmp-app.mpvsocket');
//player.observeProperty('time-pos',t => console.log('Current time: ' + t))


var App = {
    view: function()
    {
        return m("div",{class:"appStyle"},[
            m('div',{class:"tc pv2 pv3-ns bg-silver"},[                
                State.menuToggle ? m(Menu,{state:State}) : "",
                m('nav',{class:""},[m(MenuBoton,{state:State})])                
            ]),
            m(VodDisplay,{state:State})
        ])
    }
}
m.mount(document.body,App)
