function GetAndShowSuscriptions() {
    var user = document.getElementById('UserName').value;
    var $ =  require('jQuery');
    var urlBase = 'https://api.twitch.tv/kraken/users/<user ID>/follows/channels'
    var urlCompleta = urlBase.replace('<user ID>',user);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200)
        {
            var response = JSON.parse(this.responseText);
            response.follows.forEach(function(currentChannel){
                console.log(currentChannel.channel.display_name);
            })
            console.log(response.follows);
        };
        
    };
    xhttp.open("GET",urlCompleta,true);
    xhttp.setRequestHeader("Client-ID","j21jts5r8up5ijbt1pav5ngtb6ctkw");
    xhttp.send();   

}