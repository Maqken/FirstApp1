exports.component = {
    view: function(vnode){
        return m("button",{
            class: "boton" ,
            onclick: function(){State.menuToggle = !State.menuToggle},
        })
    }
}