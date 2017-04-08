var cmd = require('node-cmd');

function GetAndShowLiveSuscriptions() {
    var user = document.getElementById('UserName').value;
    var $ =  require('jQuery');
    var urlBase = 'https://api.twitch.tv/kraken/users/<user ID>/follows/channels'
    var urlCompleta = urlBase.replace('<user ID>',user);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200)
        {
            var response = JSON.parse(this.responseText);
            var commaSepChannelsIds = '';
            response.follows.forEach(function(currentChannel){
                if (commaSepChannelsIds !== '')
                    commaSepChannelsIds += ',';
                commaSepChannelsIds += currentChannel.channel.display_name;
            })
            console.log(commaSepChannelsIds);
            console.log(response.follows);
            var streamRequest = new XMLHttpRequest();
                streamRequest.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200){
                        var streamResponse = JSON.parse(this.responseText);
                        console.log(streamResponse);
                        streamResponse.streams.forEach(displayStream);
                    }
                };
                var stremURL = "https://api.twitch.tv/kraken/streams/?channel="+commaSepChannelsIds;
                streamRequest.open('get',stremURL,true);
                streamRequest.setRequestHeader("Client-ID","j21jts5r8up5ijbt1pav5ngtb6ctkw");
                streamRequest.send();
        };
        
    };
    xhttp.open("GET",urlCompleta,true);
    xhttp.setRequestHeader("Client-ID","j21jts5r8up5ijbt1pav5ngtb6ctkw");
    xhttp.send();   

}
function displayStream(currentStream)
{
    var image = document.createElement('img');
    image.src = currentStream.channel.logo;
    image.classList.add('displayInlineBlock','floatLeft','defaultPadding');
    image.style.height = '50px';
    var desc = document.createElement('p');
    desc.classList.add('floatLeft','positionRelative');
    desc.innerHTML = currentStream.channel.display_name+' stremeando: '+currentStream.game;
    var watchButton = document.createElement('button');
    watchButton.innerHTML = 'Ver';
    watchButton.addEventListener('click',function(event) {
        launchLivesream(currentStream,event);
        event.preventDefault();
    });
    watchButton.classList.add('blueBg','generic_button');
    var element = document.createElement("div");
    element.classList.add('grid-100','defaultMargin');
    element.appendChild(image);
    element.appendChild(desc);
    element.appendChild(watchButton);
    var node =document.getElementById('channelGrid');
    node.classList.add('mContainer','centerBox','maxWidthContainer','doubleMargin');
    node.appendChild(element);    
    
}

function launchLivesream(currentStream,event)
{
    var command = 'streamlink twitch.tv/'+currentStream.channel.name;
    cmd.get(command,function (data,err){
        if (!err)
        {
            var pos = data.indexOf('Available streams:');
            slicedData = data.slice(pos+18);
            var pat = /\w+/g;
            var calidades = slicedData.match(pat);
            var node = document.createElement('div');
            calidades.forEach(function (currentQuality){
                var qualityWatchButton = document.createElement('button');
                qualityWatchButton.innerHTML = currentQuality;
                qualityWatchButton.addEventListener('click',function(event){
                    console.log(command+' '+currentQuality);
                    cmd.run(command+' '+currentQuality);
                });
                qualityWatchButton.classList.add('generic_button')
                node.appendChild(qualityWatchButton);
            });
            event.srcElement.parentNode.appendChild(node);
            console.log(event);

        }else{
            console.log(err);
        }
    });
    console.log(currentStream);
}



//.\node_modules\.bin\electron .