exports.component = {
    view:function(vnode)
    {
        return m("div",{class: "vodGrid"},vnode.attrs.state.vods.map(function (vod)
            {
                console.log(vod.imageUrl)
                return m("div",{class:"vodContainer"},[
                    m("img",{ src : vod.imageUrl}),
                    m("div",{class:"vodControls"},[
                        !vod.pickQlty ? m("button",{class:"qltyButton", onclick: function() {vod.pickQlty=!vod.pickQlty}},"Buscar Calidades") : "",
                        vod.pickQlty ? m("select",{class: "qltySelector"}) : "",
                        vod.pickQlty ? m("button",{class: "playButton"}, "Ver"): ""


                    ])
                ])
            } 
            )
        )
    }
}