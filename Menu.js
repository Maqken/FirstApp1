var inputBox = require("./InputBox").component

exports.component = {
    view: function(vnode)
    {
        return m("div",{class:""},[
            m(inputBox,{state:vnode.attrs.state})
        ])
    }
}