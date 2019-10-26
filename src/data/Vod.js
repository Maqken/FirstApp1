var Streamlink = require("../controller/Streamlink")

exports.factory = (title,imageUrl,id,url,elapsed = 0,duration = 0)=>{
    const vod = {}
    vod.pickQlty = false
    
    var State = require("./Globals").state
    var historyVers = State ? State.history.find((hVod)=>{
        return hVod.id==id //|| hVod.title==title
    }):false
    vod.data = historyVers ? historyVers : {
        title:title,
        imageUrl:imageUrl,
        id:id,
        url:url,
        elapsed:elapsed,
        duration:duration
    }
    vod.play = (vod)=>{
        var stream = new Streamlink(vod.data.url)
        stream.quality(vod.qlties[vod.selectedQlty])
        var arguments = ['--player-passthrough','http,hls,rtmp']
        stream.start(null,arguments);
        setTimeout(()=>
        {
            var State = require("./Globals").state
            State.player().seek(vod.data.elapsed)
            State.player().observeProperty('time-pos',t => {
                if (Math.round(t) % 5 === 0) vod.data.elapsed = t                 
                m.redraw()
            })
            State.player().getProperty('duration')
                .then(function(duration) {
                    vod.data.duration = duration                 
                    m.redraw()
                });
            State.player().on('end-file', function(data) {
                if (vod.data.elapsed > vod.data.duration - 10){
                    console.log("play next vod!!")
                    State.playNextVod(vod,State.vods)
                }
            });
            State.player().on('close', function(data,asd) {
                State.addToHistory(vod.data,State.history)
                //State.playNextVod(vod.data,State.vods)
                });
        },20000)
        
    }    
    vod.getQltys = (vod)=>{
        vod.qlties = []        
        var stream = new Streamlink(vod.data.url)        
        stream.getQualities()
        stream.on('quality', (data) => {
            vod.qlties=data;
            vod.pickQlty = true
            m.redraw()
        });

    }
    return vod
} 