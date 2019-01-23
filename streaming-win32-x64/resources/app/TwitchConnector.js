
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
            var cmd = require('node-cmd');
            vod.userName = result.data[0].login
            var command = 'streamlink twitch.tv/'+vod.userName;
            cmd.get(command,function (data,err){
                if (!err)
                {
                    var pos = data.indexOf('Available streams:');
                    var slicedData = data.slice(pos+18);
                    var pat = /\w+/g;
                    vod.qlties = slicedData.match(pat);
                    vod.pickQlty = true
                    m.redraw()
                }else{
                    alert(data);
                    console.log(err);
                }
            });
        })
        

    },
    playStream:function(vod){
        var cmd = require('node-cmd');
        var command = 'streamlink twitch.tv/'+vod.userName + ' ' + vod.qlties[vod.selectedQlty] //+ ' --player-passthrough hls';
        cmd.get(command,function (data,err){
            if (!err)
            {
            }else{
                alert(data);
                console.log(err);
            }
        });
    },

    getVodQltys: function(vod){
        
        var cmd = require('node-cmd');
        var command = 'streamlink '+vod.url;
        cmd.get(command,function (data,err){
            if (!err)
            {
                var pos = data.indexOf('Available streams:');
                var slicedData = data.slice(pos+18);
                var pat = /\w+/g;
                vod.qlties = slicedData.match(pat);
                vod.pickQlty = true
                m.redraw()
            }else{
                alert(data);
                console.log(err);
            }
        })
        

    },

    playVod:function(vod){
        var cmd = require('node-cmd');
        var command = 'streamlink '+ vod.url + ' ' + vod.qlties[vod.selectedQlty] + ' --player-passthrough hls';
        cmd.get(command,function (data,err){
            if (!err)
            {
            }else{
                alert(data);
                console.log(err);
            }
        });
    }
}