exports.component = {
    view:function(vnode)
    {
        return m("div",{class: "vodGrid"},vnode.attrs.state.vods.map(function (vod)
            {               
                return m("div",{class:"vodSlot"},[
                    m("div",{class:"vodTitleBox"},m("p",{class:"vodTitle"},vod.title)),                    
                    m("div",{class:"vodContainer"},[
                        m("img",{ src : vod.imageUrl}),
                        m("div",{class:"vodControls"},[
                            !vod.pickQlty ? m("button",{class:"qltyButton", onclick: function() {
                                vod.getQltys(vod)
                            }},"Buscar Calidades") : "",
                            vod.pickQlty ? m("select",{class: "qltySelector",onclick(){vod.selectedQlty = this.selectedIndex}},vod.qlties.map(function(qlty,index){
                                return m("option",{value:qlty},qlty)
                            })) : "",
                            vod.pickQlty ? m("button",{class: "playButton", onclick:function() {
                                vod.play(vod)
                            }}, "▶"): ""
                        ])
                    ]),
                    
                ])
            })
        )
    }
}