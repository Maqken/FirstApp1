var cmd = require('node-cmd');
const {google} = require('googleapis');
var m = require("mithril")
// initialize the Youtube API library
const youtube = google.youtube({
version: 'v3',
auth: 'AIzaSyCmfo2f63mY7yWZ1t5buHvcAKNskpc65ck',
});
var count = 0
var displayYoutubeVod = function(videoCode)
{
}
var MenuBoton = {
    view: function(){
        return m("button",{class: "boton", onclick:function(){count++}},count + " clicks")
    }
}
var App = {
    view: function()
    {
        return m("div",{class:"appStyle"},[
            m(Menu),
            m(MenuBoton)
        ])
    }
}
var Menu = {
    view: function()
    {
        return m("div",{class:"panelStyle"},[
            m(inputBox,{title:"Youtube",findMethod:displayYoutubeVod})
        ])
    }
}
var inputBox = {
    view: function(vnode)
    {
        return m("inputBox",{class:"inputBox"},[
            m("p",{class:"titleInputBox"},vnode.attrs.title),
            m("input",{class:"inputText",type:"text", onchange:vnode.attrs.findMethod})
        ])
    }
}
var vodDisplay = {
    view:function()
    {
        return m("p","hola")
    }
}
m.mount(document.body,App)