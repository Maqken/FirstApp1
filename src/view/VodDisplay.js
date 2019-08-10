exports.component = {
    view:function(vnode)
    {
        
        return m("div",{class: "cf pa2 bg-silver black flex-nowrap-m justify-around-ns pt5"},vnode.attrs.state.vods.map(function (vod)
            {               
                var progress = Math.ceil((100/vod.data.duration)*vod.data.elapsed) 
                return m("div",{class:"fl w-100 w-50-m w-25-ns  db no-underline black br3 bg-moon-gray ba b--black relative"},[
                    m('div',{class:"bg-black-50 w-100 absolute  br3 br--top"},[
                        m("div",{class:"measure truncate w-90 white  ph3 mr3 nowrap-m"},m("p",{class:"title"},vod.data.title))
                    ]),                    
                    m("div",{class:"br3 br--top"},[
                        m("div",{ class:"aspect-ratio--16x9 cover br3 br--top", style:"background-image:url("+vod.data.imageUrl+")"}),
                        m("div",{class:"",style:"width:100%"},
                        progress ? m("div",{class:"bg-gray ", style:"width:"+progress+"%;height:5px"}) : ""
                        ),
                        m("div",{class:"flex flex-column items-center h3 justify-center"},[
                            !vod.pickQlty ? m("button",{class:"f6 no-underline br-pill ba ph3 pv2 mb2 dib black ", onclick: function() {
                                vod.getQltys(vod)
                            }},"Buscar Calidades") : "",
                            vod.pickQlty ? m("div",{class:""},[
                                m("select",{class: "",onclick(){vod.selectedQlty = this.selectedIndex}},vod.qlties.map(function(qlty,index){
                                    return m("option",{class:"f6 no-underline br-pill ba ph3 pv2 mb2 dib black ",value:qlty},qlty)
                                })) ,
                                vod.pickQlty ? m("button",{class: "br-pill", onclick:function() {
                                    vod.play(vod)
                                }}, "▶"): ""
                            ]) : "",
                        ])
                    ])
                    
                ])
            })
        )
    }
}