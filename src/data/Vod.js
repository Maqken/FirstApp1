var Streamlink = require("../controller/Streamlink")

exports.factory = (title,imageUrl,id,url,elapsed = 0,duration = 0)=>{
    const vod = {}
    vod.pickQlty = false
    vod.data = {
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
        
        let State = require("./Globals").state
        setTimeout(()=>
        {
            State.player().observeProperty('time-pos',t => {
                if (Math.round(t) % 30 === 0) vod.data.elapsed = t                 
                m.redraw()
            })
            State.player().getProperty('duration')
                .then(function(duration) {
                    vod.data.duration = duration                 
                    m.redraw()
                });
            State.player().on('close', function() {
                console.log("The vod stopped adding to history");
                State.addToHistory(vod.data,State.history)
              });
        },10000)
        
        console.log(stream)
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
        console.log(stream)

    }
    return vod
} 