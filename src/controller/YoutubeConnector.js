
var Vod = require("../data/Vod").factory
exports.connector = {
    
    vod:function(vodId){
        let State = require("./../data/Globals").state
        State.addToSearchHistory(vodId,'yVod')
        var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyCmfo2f63mY7yWZ1t5buHvcAKNskpc65ck'
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
                if (stream.snippet.description == 'This video is unavailable.'|| stream.snippet.description == 'This video is private.') return
                return Vod(
                    stream.snippet.title,
                    stream.snippet.thumbnails.medium.url,
                    stream.snippet.resourceId.videoId,
                    'https://www.youtube.com/watch?v=' + stream.snippet.resourceId.videoId
                )
            }).filter(n=>n)
            if (result.nextPageToken) getNextPage(result.nextPageToken)
        })
    },

    playListVods:function(listId)
    {
        let State = require("./../data/Globals").state
        State.addToSearchHistory(listId,'yList')
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
                    //console.log(stream.snippet.position)
                    if (stream.snippet.description == 'This video is unavailable.' || stream.snippet.description == 'This video is private.') return
                    return Vod(
                        stream.snippet.title,
                        stream.snippet.thumbnails.medium.url,
                        stream.snippet.resourceId.videoId,
                        'https://www.youtube.com/watch?v=' + stream.snippet.resourceId.videoId
                    )
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
            i = 1;
            State.vods = result.items.map(function(stream){
                //console.log(stream.snippet.position)
                if (stream.snippet.description == 'This video is unavailable.' || stream.snippet.description == 'This video is private.') return
                return Vod(
                    stream.snippet.title,
                    stream.snippet.thumbnails.medium.url,
                    stream.snippet.resourceId.videoId,
                    'https://www.youtube.com/watch?v=' + stream.snippet.resourceId.videoId
                )
            }).filter(n=>n)
            if (result.nextPageToken) getNextPage(result.nextPageToken)
        })
    }
}