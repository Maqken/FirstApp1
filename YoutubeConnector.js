exports.connector = {
    
    vod:function(vodId){
        var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyCmfo2f63mY7yWZ1t5buHvcAKNskpc65ck'
        
        let State = require("./Globals").state
        m.request({
            method: "GET",
            url: url,
            data: {id:vodId.replace(/\s/g, ''),
            maxResults:50
            }
        })
        .then(function(result) {
            console.log(result)
            State.vods = result.items.map(function(stream){
                if (stream.snippet.description == 'This video is unavailable.') return
                return {
                    title:stream.snippet.title,
                    imageUrl:stream.snippet.thumbnails.medium.url,
                    id:stream.id,
                    pickQlty:false,
                    url:'https://www.youtube.com/watch?v=' + stream.id,
                    play:YoutubeConnector.playVod,
                    getQltys:YoutubeConnector.getQltys
                }
            }).filter(n=>n)
            if (result.nextPageToken) getNextPage(result.nextPageToken)
        })
    },

    playListVods:function(listId)
    {
        let State = require("./Globals").state
        //https://content.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLplGIzXSUQ60QXaZQxmktQIhhYNImec92&key=AIzaSyD-a9IF8KKYgoC3cpgS-Al7hLQDbugrDcw
        url = 'https://content.googleapis.com/youtube/v3/playlistItems?part=snippet&key=AIzaSyCmfo2f63mY7yWZ1t5buHvcAKNskpc65ck'
        var getNextPage = function(nextPageToken)
        {
            m.request({
                method: "GET",
                url: url,
                data: {playlistId:listId.replace(/\s/g, ''),
                maxResults:50,
                pageToken:nextPageToken
                }
            })
            .then(function(result) {
                console.log(result)
                State.vods = State.vods.concat(result.items.map(function(stream){
                    if (stream.snippet.description == 'This video is unavailable.') return
                    return {
                        title:stream.snippet.title,
                        imageUrl:stream.snippet.thumbnails.medium.url,
                        id:stream.snippet.resourceId.videoId,
                        url:'https://www.youtube.com/watch?v=' + stream.snippet.resourceId.videoId,
                        pickQlty:false,
                        play:YoutubeConnector.playVod,
                        getQltys:YoutubeConnector.getQltys
                    }
                }).filter(n=>n))
                if (result.nextPageToken)  getNextPage(result.nextPageToken)
    
            })
        }

        
        m.request({
            method: "GET",
            url: url,
            data: {playlistId:listId.replace(/\s/g, ''),
            maxResults:50
            }
        })
        .then(function(result) {
            console.log(result)
            State.vods = result.items.map(function(stream){
                if (stream.snippet.description == 'This video is unavailable.') return
                return {
                    title:stream.snippet.title,
                    imageUrl:stream.snippet.thumbnails.medium.url,
                    id:stream.snippet.resourceId.videoId,
                    url:'https://www.youtube.com/watch?v=' + stream.snippet.resourceId.videoId,
                    pickQlty:false,
                    play:YoutubeConnector.playVod,
                    getQltys:YoutubeConnector.getQltys
                }
            }).filter(n=>n)
            if (result.nextPageToken) getNextPage(result.nextPageToken)
        })
    },
    getQltys: function(vod){
        vod.qlties = []
        var cmd = require('node-cmd');
        var command = 'streamlink '+ vod.url;
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
    
        

    },
    
    playVod:function(vod){
        var cmd = require('node-cmd');
        var command = 'streamlink '+ vod.url + ' ' + vod.qlties[vod.selectedQlty] + ' --player-passthrough http';
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