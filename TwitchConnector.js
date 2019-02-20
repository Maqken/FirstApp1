

var Streamlink = require("./Streamlink")

exports.connector = {
    subscriptions: function(userName){
        //urlBase = 'https://api.twitch.tv/kraken/users/:userName/follows/channels'//https://api.twitch.tv/helix/users/follows?from_id=<user ID>
        urlBase = "https://api.twitch.tv/helix/users?login=:userName"
        m.request({
            method: "GET",
            url: urlBase,
            data: {userName:userName.replace(/\s/g, '')},
            headers:{
                "Client-ID":"j21jts5r8up5ijbt1pav5ngtb6ctkw"
            }
        })
        .then(function(result) {
            userId = result.data[0].id
            urlBase = "https://api.twitch.tv/helix/users/follows?first=100&from_id=:userId"
            m.request({
                method: "GET",
                url: urlBase,
                data: {userId:userId},
                headers:{
                    "Client-ID":"j21jts5r8up5ijbt1pav5ngtb6ctkw"
                }
            })
            .then(function(result){
                userIds = result.data.map(function(user){return "user_id=" + user.to_id})
                urlBase = "https://api.twitch.tv/helix/streams?first=100&user_id=:userId"
                m.request({
                    method: "GET",
                    url: urlBase,
                    data: {userId:userIds.join("&")},
                    headers:{
                        "Client-ID":"j21jts5r8up5ijbt1pav5ngtb6ctkw"
                    }
                })
                .then(function(result){
                    let State = require("./Globals").state
                    State.activeConnector = TwitchConnector
                    State.vods = result.data.map(function(stream){
                        return {
                            title:stream.title,
                            imageUrl:stream.thumbnail_url.replace('{width}','320').replace('{height}','180'),
                            id:stream.user_id,
                            pickQlty:false,
                            play:TwitchConnector.playStream,
                            getQltys:TwitchConnector.getQltys
                        }
                    })
                })
            })
        })


    },
    stream: function(userName){
        //urlBase = 'https://api.twitch.tv/kraken/users/:userName/follows/channels'//https://api.twitch.tv/helix/users/follows?from_id=<user ID>
        urlBase = "https://api.twitch.tv/helix/users?login=:userName"
        m.request({
            method: "GET",
            url: urlBase,
            data: {userName:userName.replace(/\s/g, '')},
            headers:{
                "Client-ID":"j21jts5r8up5ijbt1pav5ngtb6ctkw"
            }
        })
        .then(function(result) {
            userId = result.data[0].id
            urlBase = "https://api.twitch.tv/helix/streams?first=100&user_id=:userId"
            m.request({
                method: "GET",
                url: urlBase,
                data: {userId:userId},
                headers:{
                    "Client-ID":"j21jts5r8up5ijbt1pav5ngtb6ctkw"
                }
            })
            .then(function(result){
                State.activeConnector = TwitchConnector
                State.vods = result.data.map(function(stream){
                    return {
                        title:stream.title,
                        imageUrl:stream.thumbnail_url.replace('{width}','320').replace('{height}','180'),
                        id:stream.user_id,
                        pickQlty:false,
                        play:TwitchConnector.playStream,
                        getQltys:TwitchConnector.getQltys
                    }
                })
            })
        })
    },

    vod: function(vodId){
        //urlBase = 'https://api.twitch.tv/kraken/users/:userName/follows/channels'//https://api.twitch.tv/helix/users/follows?from_id=<user ID>
        urlBase = "https://api.twitch.tv/helix/videos?id=:vodId"
        m.request({
            method: "GET",
            url: urlBase,
            data: {vodId:vodId.replace(/\s/g, '')},
            headers:{
                "Client-ID":"j21jts5r8up5ijbt1pav5ngtb6ctkw"
            }
        })
        .then(function(result) {
        
            State.activeConnector = TwitchConnector
            State.vods = result.data.map(function(stream){
                console.log(stream)
                return {
                    title:stream.title,
                    imageUrl:stream.thumbnail_url.replace('%{width}','320').replace('%{height}','180'),
                    id:stream.user_id,
                    url:stream.url,
                    pickQlty:false,
                    play:TwitchConnector.playVod,
                    getQltys:TwitchConnector.getVodQltys
                }
            })
        })
    },

    getQltys: function(vod){
        vod.qlties = []
        urlBase = "https://api.twitch.tv/helix/users?id=:userId"
        m.request({
            method: "GET",
            url: urlBase,
            data: {userId:vod.id},
            headers:{
                "Client-ID":"j21jts5r8up5ijbt1pav5ngtb6ctkw"
            }
        })
        .then(function(result){
            vod.userName = result.data[0].login
            
            vod.qlties = []
        
            var stream = new Streamlink('twitch.tv/'+vod.userName)
            
            stream.getQualities()
            stream.on('quality', (data) => {
                vod.qlties=data;
                vod.pickQlty = true
                m.redraw()
            });
            console.log(stream)
        })
        

    },
    playStream:function(vod){
        
        var stream = new Streamlink('twitch.tv/'+vod.userName)
        stream.quality(vod.qlties[vod.selectedQlty])
        var arguments = [/*'--player-passthrough','http,hls,rtmp'*/]
        stream.start(null,arguments);
        
        console.log(stream)
        
    },

    getVodQltys: function(vod){
        vod.qlties = []
        
        var stream = new Streamlink(vod.url)
        
        stream.getQualities()
        stream.on('quality', (data) => {
            vod.qlties=data;
            vod.pickQlty = true
            m.redraw()
        });
        console.log(stream)
        

    },

    playVod:function(vod){
        var stream = new Streamlink(vod.url)
        stream.quality(vod.qlties[vod.selectedQlty])
        var arguments = ['--player-passthrough','http,hls,rtmp']
        stream.start(null,arguments);
        
        console.log(stream)
    }
}