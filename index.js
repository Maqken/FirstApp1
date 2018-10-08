var cmd = require('node-cmd');
const {google} = require('googleapis');
var m = require("mithril")
// initialize the Youtube API library
const youtube = google.youtube({
version: 'v3',
auth: 'AIzaSyCmfo2f63mY7yWZ1t5buHvcAKNskpc65ck',
});

let State = require("./Globals").state
var MenuBoton = require("./MenuButton").component
var Menu = require("./Menu").component
var VodDisplay = require("./VodDisplay").component


var App = {
    view: function()
    {
        return m("div",{class:"appStyle"},[
            m('div',{class:"menus"},[                
                State.menuToggle ? m(Menu,{state:State}) : "",
                m(MenuBoton,{state:State}),
            ]),
            m(VodDisplay,{state:State})
        ])
    }
}
m.mount(document.body,App)
