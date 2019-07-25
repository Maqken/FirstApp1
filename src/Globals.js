TwitchConnector = require("./TwitchConnector").connector
YoutubeConnector = require("./YoutubeConnector").connector
const remote = require('electron').remote;
const app = remote.app;
let mpv = require('mpv-ipc');
const Store = require('electron-store');
const store = new Store({
    cwd:app.getPath('home')+"/Google Drive/StreamlinkData"
});
const vodHistory = store.get('history') ? store.get('history') : []
const startingvods = vodHistory.map((historyVod)=>{
    return {
        title:historyVod.title,
        imageUrl:historyVod.imageUrl,
        id:historyVod.id,
        pickQlty:historyVod.pickQlty,
        url:historyVod.url,
        play:YoutubeConnector.playVod,
        qlties:historyVod.qlties,
        getQltys:YoutubeConnector.getQltys
    }
})
exports.state = {
    inputboxes:[
        {id: 1,title:"Twitch Follows",searchMethod:TwitchConnector.subscriptions},
        {id: 2,title:"Twitch Stream",searchMethod:TwitchConnector.stream},
        {id: 3,title:"Twitch Vod",searchMethod:TwitchConnector.vod},
        {id: 4,title:"Youtube Vod",searchMethod:YoutubeConnector.vod},
        {id: 5,title:"Youtube List",searchMethod:YoutubeConnector.playListVods}
    ],
    menuImg : "./resources/menu.png",
    menuToggle : false,
    vods: startingvods,
    TwitchConnector:TwitchConnector,
    player: () => new mpv.MPVClient('\\\\.\\pipe\\tmp-app.mpvsocket'),
    history: vodHistory,
    addToHistory:(vod,history)=>{
        console.log(vodHistory)
        vodHistory.push(vod)
        store.set('history',vodHistory)
    },
    activeConnector:null

}