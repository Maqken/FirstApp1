exports.component = {
    view: function(vnode)
    {
        return vnode.attrs.state.inputboxes.map(function (inputBox)
        {
            return m("inputBox",{class:"inputBox", key:inputBox.id },[
                m("p",{class:"titleInputBox"},inputBox.title),
                m("input",{class:"inputText",type:"text"})])
        } 
        )
    }
}