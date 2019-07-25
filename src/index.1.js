var cmd = require('node-cmd');
const {google} = require('googleapis');

// initialize the Youtube API library
const youtube = google.youtube({
version: 'v3',
auth: 'AIzaSyCmfo2f63mY7yWZ1t5buHvcAKNskpc65ck',
});

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
            /*var streamRequest = new XMLHttpRequest();
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
                streamRequest.send();*/
            displayStreamsSepByCommas(commaSepChannelsIds);
        };
        
    };
    xhttp.open("GET",urlCompleta,true);
    xhttp.setRequestHeader("Client-ID","j21jts5r8up5ijbt1pav5ngtb6ctkw");
    xhttp.send();   

}
function displayStream(currentStream)
{
    var top = document.createElement('div');
    top.classList.add('positionRelative','overflowAuto','tinyMargin');

    var mid = document.createElement('div');
    
    var bot = document.createElement('div');
    bot.classList.add('marginTop');

    var streamThumb = document.createElement('img');
    streamThumb.classList.add('widthAll');
    streamThumb.src = currentStream.preview.large;
    mid.appendChild(streamThumb);

    var image = document.createElement('img');
    image.src = currentStream.channel.logo;
    image.classList.add('floatLeft', 'marginLeft', 'verticalAlignMiddle');
    image.style.height = '30px';
    top.appendChild(image);

    var title = document.createElement('h1');
    title.innerHTML = currentStream.channel.display_name ;
    title.classList.add('center', 'xxl', 'floatLeft', 'smallMarginLeft');
    top.appendChild(title);

    var status = document.createElement('h2');
    status.innerHTML = currentStream.channel.status;
    status.classList.add('center', 'm','textEllipsis');
    bot.appendChild(status);
    
    var desc = document.createElement('p');
    desc.classList.add('s','textEllipsis');
    desc.innerHTML = ' stremeando: '+currentStream.game;
    bot.appendChild(desc);

    var watchButton = document.createElement('button');
    watchButton.innerHTML = 'Buscar calidades';
    watchButton.addEventListener('click',function(event) {
        launchLivesream(currentStream,event);
        event.preventDefault();
    });
    watchButton.classList.add('generic_button', 'positionRelative', 'darkGrayBg', 'widthAll');
    watchButton.id = 'watchButton'+currentStream.channel.name;
    bot.appendChild(watchButton);

    var loadingGif = document.createElement('img');
    loadingGif.id = currentStream.channel.name+'LoadingGif';
    loadingGif.src = 'resources/loading.gif';
    loadingGif.style.display = 'none';
    loadingGif.classList.add('clearBorh');
    loadingGif.style.height = '30px';
    bot.appendChild(loadingGif);

    var element = document.createElement("div");
    element.classList.add('defaultBoxPadding',  'grayBg','floatLeft', 'marginLeft', 'defaultMargin','farElementShadow','white','textEllipsis' );
    element.style.width = '25%';
    element.style.backgroundColor = '#6441a4';
    element.appendChild(top);
    element.appendChild(mid);
    element.appendChild(bot);
    element.id = currentStream.channel.name+'Card';
    
    var node =document.getElementById('channelGrid');
    node.appendChild(element);    
    
}

function launchLivesream(currentStream,event)
{
    
    var watchButton = document.getElementById('watchButton'+currentStream.channel.name);
    watchButton.style.display = 'none';
    var parentElement = event.srcElement.parentNode;
    showLoadingGif(currentStream);
    var command = 'streamlink twitch.tv/'+currentStream.channel.name;
    cmd.get(command,function (data,err){
        if (!err)
        {
            var pos = data.indexOf('Available streams:');
            slicedData = data.slice(pos+18);
            var pat = /\w+/g;
            var calidades = slicedData.match(pat);
            var node = document.createElement('select');
            node.style.width = '50%';
            node.style.backgroundColor = '#6441a4';
            calidades.forEach(function (currentQuality){
                var qualityWatchButton = document.createElement('option');
                qualityWatchButton.innerHTML = currentQuality;
                node.appendChild(qualityWatchButton);
            });
            var verButton = document.createElement('button');
            verButton.innerHTML = 'Ver stream';
            verButton.addEventListener('click',function(event){
                var selector = event.srcElement.parentElement.lastChild;
                var streamQuality = selector.options[selector.selectedIndex].text;
                console.log(command+' '+streamQuality);
                showLoadingGif(currentStream);
                cmd.run(command+' '+streamQuality);
                hideLoadingGif(currentStream);
            });
            verButton.classList.add('generic_button', 'darkGrayBg', 'widthAll');
            verButton.style.width = '50%';
            hideLoadingGif(currentStream);
            event.srcElement.parentNode.appendChild(verButton);
            event.srcElement.parentNode.appendChild(node);

            console.log(event);

        }else{
            alert(data);
            console.log(err);
        }
    });
    console.log(currentStream);
}

function showLoadingGif(currentStream)
{
    var loadingGif = document.getElementById(currentStream.channel.name+'LoadingGif');
    loadingGif.style.display = 'inline';
}

function hideLoadingGif(currentStream)
{
    var loadingGif = document.getElementById(currentStream.channel.name+'LoadingGif');
    loadingGif.style.display = 'none';
}

function displayStreamsSepByCommas(commaSepChannelsIds)
{
    var node =document.getElementById('channelGrid');
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
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
}

function ShowLiveStream()
{
     var streams = document.getElementById('streamName').value;
     displayStreamsSepByCommas(streams);
}

function displayVod(currentVod)
{
    var top = document.createElement('div');
    top.classList.add('positionRelative','overflowAuto','tinyMargin');

    var mid = document.createElement('div');
    
    var bot = document.createElement('div');
    bot.classList.add('marginTop');

    var streamThumb = document.createElement('img');
    streamThumb.classList.add('widthAll');
    streamThumb.src = currentVod.thumbnails[0].url;
    mid.appendChild(streamThumb);

    var image = document.createElement('img');
    image.src = 'resources/vod_icon.png';
    image.classList.add('floatLeft', 'marginLeft', 'verticalAlignMiddle');
    image.style.height = '30px';
    top.appendChild(image);

    var title = document.createElement('h1');
    title.innerHTML = currentVod.channel.display_name ;
    title.classList.add('center', 'xxl', 'floatLeft', 'smallMarginLeft');
    top.appendChild(title);

    var status = document.createElement('h2');
    status.innerHTML = currentVod.description;
    status.classList.add('center', 'm','textEllipsis');
    bot.appendChild(status);
    
    var desc = document.createElement('p');
    desc.classList.add('s','textEllipsis');
    desc.innerHTML = ' stremeando: '+currentVod.game;
    bot.appendChild(desc);

    var watchButton = document.createElement('button');
    watchButton.innerHTML = 'Buscar calidades';
    watchButton.addEventListener('click',function(event) {
        launchVod(currentVod,event);
        event.preventDefault();
    });
    watchButton.classList.add('generic_button', 'positionRelative', 'darkGrayBg', 'widthAll');
    watchButton.id = 'watchButton'+currentVod.channel.name;
    bot.appendChild(watchButton);

    var loadingGif = document.createElement('img');
    loadingGif.id = currentVod.channel.name+'LoadingGif';
    loadingGif.src = 'resources/loading.gif';
    loadingGif.style.display = 'none';
    loadingGif.classList.add('clearBorh');
    loadingGif.style.height = '30px';
    bot.appendChild(loadingGif);

    var element = document.createElement("div");
    element.classList.add('defaultBoxPadding',  'grayBg','floatLeft', 'marginLeft', 'defaultMargin','farElementShadow','white','textEllipsis' );
    element.style.width = '25%';
    element.style.backgroundColor = '#4c2496';
    element.appendChild(top);
    element.appendChild(mid);
    element.appendChild(bot);
    element.id = currentVod.channel.name+'Card';
    
    var node =document.getElementById('channelGrid');
    node.appendChild(element);    
    
}

function launchVod(currentVod,event)
{
    
    var watchButton = document.getElementById('watchButton'+currentVod.channel.name);
    watchButton.style.display = 'none';
    var parentElement = event.srcElement.parentNode;
    showLoadingGif(currentVod);
    var command = 'streamlink '+currentVod.url;
    cmd.get(command,function (data,err){
        if (!err)
        {
            var pos = data.indexOf('Available streams:');
            slicedData = data.slice(pos+18);
            var pat = /\w+/g;
            var calidades = slicedData.match(pat);
            var node = document.createElement('select');
            node.style.width = '50%';
            node.style.backgroundColor = '#6441a4';
            calidades.forEach(function (currentQuality){
                var qualityWatchButton = document.createElement('option');
                qualityWatchButton.innerHTML = currentQuality;
                node.appendChild(qualityWatchButton);
            });
            var verButton = document.createElement('button');
            verButton.innerHTML = 'Ver stream';
            verButton.addEventListener('click',function(event){
                var selector = event.srcElement.parentElement.lastChild;
                var streamQuality = selector.options[selector.selectedIndex].text;
                console.log(command+' '+streamQuality);
                showLoadingGif(currentVod);
                cmd.run(command+' '+streamQuality+' --player-passthrough hls');
                hideLoadingGif(currentVod);
            });
            verButton.classList.add('generic_button', 'darkGrayBg', 'widthAll');
            verButton.style.width = '50%';
            hideLoadingGif(currentVod);
            event.srcElement.parentNode.appendChild(verButton);
            event.srcElement.parentNode.appendChild(node);

            console.log(event);

        }else{
            alert(data);
            console.log(err);
        }
    });
    console.log(currentVod);
}

function ShowVod()
{
    var vodId = document.getElementById('vodId').value;
    displayVodsSepByCommas(vodId);
}

function displayVodsSepByCommas(vodId)
{
    var node =document.getElementById('channelGrid');
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    var streamRequest = new XMLHttpRequest();
    streamRequest.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            var streamResponse = JSON.parse(this.responseText);
            console.log(streamResponse);
            displayVod(streamResponse);
        }
    };
    var stremURL = "https://api.twitch.tv/kraken/videos/v"+vodId;
    streamRequest.open('get',stremURL,true);
    streamRequest.setRequestHeader("Client-ID","j21jts5r8up5ijbt1pav5ngtb6ctkw");
    streamRequest.send();
}


async function ShowYTList()
{
    var listId = document.getElementById('YTListId').value;
    
    /*
    const headers = {};
    var res = await youtube.playlists.list({
        part: 'id,snippet',
        id: listId,
        headers: headers,
      });
    console.log(res);*/
    
    // the first query will return data with an etag
    const res = await getPlaylistData(null);
    const etag = res.data.etag;
    console.log(`etag: ${etag}`);

    // the second query will (likely) return no data, and an HTTP 304
    // since the If-None-Match header was set with a matching eTag
    const res2 = await getPlaylistData(etag);
    console.log(res2.status);

}


async function getPlaylistData(etag) {
    // Create custom HTTP headers for the request to enable use of eTags
    var data = [];
    const headers = {};
    if (etag) {
      headers['If-None-Match'] = etag;
    }
    do {
        var res = await youtube.playlistItems.list({
            part: 'id,snippet,contentDetails',
            playlistId : 'PLplGIzXSUQ60QXaZQxmktQIhhYNImec92',
            maxResults : 50,
            headers: headers,
          });
        data = data.concat(res.data.items);
        nextPageToken = res.data.nextPageToken;
    } while (nextPageToken);
    console.log('Status code: ' + res.status);
    console.log(res);
    return res;
  }



//.\node_modules\.bin\electron .