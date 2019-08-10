var cmd = require('node-cmd');
var m = require("mithril")
const net = require('net');

const root = __dirname;
let State = require("./data/Globals").state
var MenuBoton = require("./view/MenuButton").component
var Menu = require("./view/Menu").component
var VodDisplay = require("./view/VodDisplay").component


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
