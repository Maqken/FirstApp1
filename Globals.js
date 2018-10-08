TwitchConnector = require("./TwitchConnector").connector
YoutubeConnector = require("./YoutubeConnector").connector

exports.state = {
    inputboxes:[
        {id: 1,title:"Twitch Subscriptions",searchMethod:TwitchConnector.subscriptions},
        {id: 2,title:"Twitch Stream",searchMethod:TwitchConnector.stream},
        {id: 3,title:"Twitch Vod",searchMethod:TwitchConnector.vod},
        {id: 4,title:"Youtube Vod",searchMethod:YoutubeConnector.vod},
        {id: 5,title:"Youtube List",searchMethod:YoutubeConnector.playListVods}
    ],
    menuImg : "./resources/menu.png",
    menuToggle : false,
    vods:[
    ],
    TwitchConnector:TwitchConnector,
    activeConnector:null
}