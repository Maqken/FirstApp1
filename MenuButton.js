exports.component = {
    view: function(vnode){
        return m("button",{
            class: "f6 link dim br-pill ph3 pv2 mb2 dib white bg-dark-gray cover" ,
            onclick: function(){State.menuToggle = !State.menuToggle
            },
            style: 'background: url("../resources/menu.png")'
        },'MENU')
    }
}