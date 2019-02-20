
var Streamlink = require("./Streamlink")

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
                //console.log(result)
                State.vods = State.vods.concat(result.items.map(function(stream){
                    //console.log(stream.snippet.position)
                    if (stream.snippet.description == 'This video is unavailable.' || stream.snippet.description == 'This video is private.') return
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
            //console.log(result)
            i = 1;
            State.vods = result.items.map(function(stream){
                //console.log(stream.snippet.position)
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