TwitchConnector = require("./TwitchConnector").connector

exports.state = {
    inputboxes:[
        {id: 1,title:"Twitch subscriptions for:",searchMethod:TwitchConnector.subscriptions},
        {id: 2,title:"Twitch stream for:",searchMethod:TwitchConnector.stream},
        {id: 3,title:"Twitch Vod for:",searchMethod:TwitchConnector.vod},
        {id: 4,title:"Twitch",searchMethod:function(){}},
        {id: 5,title:"Twitch",searchMethod:function(){}}
    ],
    menuImg : "./resources/menu.png",
    menuToggle : false,
    vods:[
        {title:"Testing title",imageUrl:"https:\\static-cdn.jtvnw.net\\previews-ttv\\live_user_cohhcarnage-320x180.jpg",pickQlty:false},
        {imageUrl:"https:\\static-cdn.jtvnw.net\\previews-ttv\\live_user_cohhcarnage-320x180.jpg",pickQlty:false}
    ],
    TwitchConnector:TwitchConnector,
    activeConnector:null
}