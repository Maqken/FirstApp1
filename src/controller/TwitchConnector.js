
var Vod = require("../data/Vod").factory
exports.connector = {
    subscriptions: function(userName){        
        let State = require("./../data/Globals").state
        State.addToSearchHistory(userName,'follows')
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
                    console.log(result)
                    State.activeConnector = TwitchConnector
                    State.vods = result.data.map(function(stream){
                        return Vod(                            
                            stream.title,
                            stream.thumbnail_url.replace('{width}','320').replace('{height}','180'),
                            stream.user_id,
                            'twitch.tv/'+stream.user_name
                        )
                    })
                })
            })
        })


    },
    stream: function(userName){
        let State = require("./../data/Globals").state
        State.addToSearchHistory(userName,'stream')
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
                    return Vod(                            
                        stream.title,
                        stream.thumbnail_url.replace('{width}','320').replace('{height}','180'),
                        stream.user_id,
                        'twitch.tv/'+stream.user_name
                    )
                })
            })
        })
    },

    vod: function(vodId){
        let State = require("./../data/Globals").state
        State.addToSearchHistory(vodId,'tVod')
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
                return Vod(                            
                    stream.title,
                    stream.thumbnail_url.replace('-%{width}x%{height}','-320x180'),
                    vodId,
                    'https://www.twitch.tv/videos/' + vodId,
                    0,
                    0,
                    false,
                    ['--player-passthrough','http,hls,rtmp',]
                )
            })
        })
    },   

    vods: function(userName){
        let State = require("./../data/Globals").state
        State.addToSearchHistory(userName,'tVods')
        //urlBase = 'https://api.twitch.tv/kraken/users/:userName/follows/channels'//https://api.twitch.tv/helix/users/follows?from_id=<user ID>
        urlBase = "https://api.twitch.tv/helix/users?login=:userName"
        m.request({
            method: "GET",
            url: urlBase,
            data: {userName:userName.replace(/\s/g, '')},
            headers:{
                "Client-ID":"j21jts5r8up5ijbt1pav5ngtb6ctkw"
            }
        }).then(function(result) {
        userId = result.data[0].id
        urlBase = "https://api.twitch.tv/helix/videos?user_id=:userId&first=100"
        m.request({
            method: "GET",
            url: urlBase,
            data: {
                user_id:userId.replace(/\s/g, ''),
                first:100,
                type:'archive'
            },
            headers:{
                "Client-ID":"j21jts5r8up5ijbt1pav5ngtb6ctkw"
            }
        }).then(function(result) {
            State.activeConnector = TwitchConnector
            State.vods = result.data.map(function(stream){
                return Vod(                            
                    stream.title,
                    stream.thumbnail_url.replace('-%{width}x%{height}','-320x180'),
                    stream.id,
                    'https://www.twitch.tv/videos/' + stream.id,
                    0,
                    0,
                    false,
                    ['--player-passthrough','http,hls,rtmp',]
                )
            })
        })
        })
    }
}