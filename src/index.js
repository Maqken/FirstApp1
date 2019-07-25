var cmd = require('node-cmd');
var m = require("mithril")
const net = require('net');
// initialize the Youtube API library

const path = __dirname;
let State = require("./../../../src/Globals").state
var MenuBoton = require("./../../../src/MenuButton").component
var Menu = require("./../../../src/Menu").component
var VodDisplay = require("./../../../src/VodDisplay").component
//player.observeProperty('time-pos',t => console.log('Current time: ' + t))


var App = {
    view: function()
    {
        return m("div",{class:"appStyle"},[
            m('div',{class:"tc pv2 bg-silver fixed w-100 z-3 bb"},[                
                State.menuToggle ? m(Menu,{state:State}) : "",
                m('nav',{class:""},[m(MenuBoton,{state:State})])                
            ]),
            m(VodDisplay,{state:State})
        ])
    }
}
m.mount(document.body,App)
