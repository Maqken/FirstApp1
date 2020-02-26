TwitchConnector = require("../controller/TwitchConnector").connector
YoutubeConnector = require("../controller/YoutubeConnector").connector
var Vod = require("./Vod").factory
const remote = require('electron').remote;
const app = remote.app;
let mpv = require('mpv-ipc');
const Store = require('electron-store');
const store = new Store({
    cwd:app.getPath('home')+"/Google Drive/StreamlinkData"
});
var searchHistory = store.get('searchHistory') ? store.get('searchHistory') : {}
var vodHistory = store.get('history') ? store.get('history') : []
const startingvods = vodHistory.map((historyVod)=>{
    return Vod(
        historyVod.title,
        historyVod.imageUrl,
        historyVod.id,        
        historyVod.url,        
        historyVod.elapsed,    
        historyVod.duration,        
    )
})
exports.state = {
    inputboxes:[
        {id: 1,title:"Twitch Follows",searchMethod:TwitchConnector.subscriptions,lastSearch:searchHistory.follows},
        {id: 2,title:"Twitch Stream",searchMethod:TwitchConnector.stream,lastSearch:searchHistory.stream},
        {id: 3,title:"Twitch Vod",searchMethod:TwitchConnector.vod,lastSearch:searchHistory.tVod},
        {id: 3,title:"Twitch Vods",searchMethod:TwitchConnector.vods,lastSearch:searchHistory.tVods},
        {id: 4,title:"Youtube Vod",searchMethod:YoutubeConnector.vod,lastSearch:searchHistory.yVod},
        {id: 5,title:"Youtube List",searchMethod:YoutubeConnector.playListVods,lastSearch:searchHistory.yList}
    ],
    menuImg : "./resources/menu.png",
    menuToggle : false,
    vods: startingvods.reverse(),
    TwitchConnector:TwitchConnector,
    player: () => new mpv.MPVClient('\\\\.\\pipe\\tmp-app.mpvsocket'),
    history: vodHistory,
    addToHistory:(vod,history)=>{
        vodHistory = vodHistory.filter((hVod)=>hVod.id !== vod.id)
        vodHistory.push(vod)        
        store.set('history',vodHistory)
    },
    addToSearchHistory:(search,type)=>{
        searchHistory[type]=search        
        store.set('searchHistory',searchHistory)
    },
    playNextVod:(vod,vods)=>{
        var vodPosition = vods.reduce((carry,listVod,index)=>{
            if (listVod.data.id == vod.data.id) return index
            return carry
        },null)
        if (vodPosition !== null && vodPosition < vods.length){
            var nextVod = vods[vodPosition + 1]
            nextVod.selectedQlty = vod.selectedQlty
            nextVod.qlties = vod.qlties
            nextVod.play(nextVod)
        }        
    },
    activeConnector:null

}