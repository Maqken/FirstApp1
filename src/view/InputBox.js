exports.component = {
    view: function(vnode)
    {
        return vnode.attrs.state.inputboxes.map(function (inputBox)
        {
            return m("inputBox",{class:"", key:inputBox.id },[
                m("p",{class:""},inputBox.title),
                m("input",{
                    class:"",
                    type:"text",
                    onchange: m.withAttr("value", inputBox.searchMethod),
                }),
                m('a',{class:"ph1"},inputBox.lastSearch)
            ])
        })
    }
}