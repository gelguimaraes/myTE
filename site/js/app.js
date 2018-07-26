// url e chave api do max hists no last.fm
const optAPI = {
    apiUrl: 'https://ws.audioscrobbler.com/2.0/?',
    apiKey: 'e2805d5ce0b3beab9baba72efd52d7c2',
};


//carregando opcões padrões para o inicio do carregamento da página
const optType = {
    cat: "Eletrônica",
    midia: "Tracks",
    country: "Brasil",
    midiaCountry: "Tracks",
    radio: "electrohouse",
    name: "eletronics"
};

//opcão padrão para as tags ou categorias
const optTag = {
    //method : 'tag.gettopalbums',
    //method : 'tag.gettopartists',
    method: 'tag.gettoptracks',
    tag: 'eletronic',
    limit: '30',
};

//opcão padrão para paises
const optCountry = {
    method: 'geo.gettoptracks',
    //method : 'geo.gettopartists',
    country: 'brazil',
    limit: '10'
};

//captura clique das categorias
$('ul.cat li').on('touchend click', function () {
    execSlide();
   // $('.radio').animate({'margin-bottom': '0px', 'top': '0px'}, 200).css({"display": "block"});
});

//captura clique da tab de midias tracks, artistas e albums para categorias
$('ul.tabsCat li').click(function () {
    let data = $(this).attr('data');
    $('ul.tabsCat li').removeClass('current');
    $('div.tab-content-cat').removeClass('current');
    $(this).addClass('current');
    $("#" + data).addClass('current').html("<span class='loading'></span>");
    optType.cat = $('ul.cat li.itemslide-active span').text();
    optType.midia = $('ul.tabsCat li.itemslide-active').text();
    optTag.method = 'tag.gettop' + data;
    getTopList(optTag, data, optType);
    //console.log(data)
});

//captura click do selectbox
$('#selectCountry-box-scroll .icon').click(function () {
    let country = $('#selectCountry-box-scroll div.selected img').attr('icon-value');
    $('ul.tabsCountry li').removeClass('current');
    $('div.tab-content-country').removeClass('current');
    $("#tabtracksCountry").addClass('current');
    $("#tracksCountry").addClass('current').html("<span class='loading'></span>");
    optType.country = $('#selectCountry-box-scroll div.selected img').attr('name');
    optType.midiaCountry = $('ul.tabsCountry li.current').text();
    optCountry.country = country;
    optCountry.method = 'geo.gettoptracks';
    getTopList(optCountry, 'tracksCountry', optType);
    //console.log(country);

});

//captura clique da tab de midias tracks e artistas para paises
$('ul.tabsCountry li').click(function () {
    let data = $(this).attr('data');
    $('ul.tabsCountry li').removeClass('current');
    $('div.tab-content-country').removeClass('current');
    $(this).addClass('current');
    $("#tab" + data + "Country").addClass('current');
    $("#" + data + "Country").addClass('current').html("<span class='loading'></span>");
    optType.country = $('#selectCountry-box-scroll div.selected img').attr('name');
    optType.midiaCountry = $('ul.tabsCountry li.current').text();
    optCountry.method = 'geo.gettop' + data;
    getTopList(optCountry, data + "Country", optType);
    //console.log(data)
});

//buscando as midias
$('#submit').click(function () {
    execSearch();
});

$('#search').keypress(function (e) {
    if (e.which === 13)
        execSearch();
});


//recuperando listas de tracks, albuns e artistas por categoria e/ou por pais
let getTopList = (opt, id, type) => $.ajax({
    url: (optAPI.apiUrl + 'method=' + opt.method + '&tag=' + opt.tag + '&country=' + opt.country + '&api_key=' + optAPI.apiKey + '&format=json&limit=' + opt.limit),
    method: 'GET',
    dataType: 'JSON',
    async: true,
    success: function (json) {
        //console.log(opt);

        let firstKey = Object.keys(json)[0];
        //console.log(firstKey)
        let secondKey = Object.keys(json[firstKey])[0];
        //console.log(secondKey)
        let objItems =  json[firstKey][secondKey]
        let html, position = 1;

        let method = opt.method.substr(0, 3);
        //console.log(method)

        let localization, midias;
        if (method === 'tag') {
            localization = " em " + type.cat;
            midias = type.midia;
        } else {
            localization = " " + type.country;
            midias = type.midiaCountry;
        }


        tracks = [];
        artists = [];
        albums = [];
        tracksCountry = [];
        artistsCountry = [];
        tracksTurtle = [];
        artistsTurtle = [];
        albumsTurtle = [];


        //console.log(objItems)
        //monta o titulo da tab
        $("div#" + id).html("<ul id='ul" + id + "'><span class='topTitle'>Top " + opt.limit + " " + midias + localization + "</span></ul>");

        objItems.map((item) =>
            $("#ul" + id).append(function () {
                if (method === 'tag') { // por categorias ou ritmos
                    switch (secondKey) {
                        case 'track':
                            html = "<li class='track'><span class='rank'>#" + item['@attr']['rank'] + "</span><figure><img width='60' height='60' src='" + ((item.image[1]['#text']) ? item.image[1]['#text'] : "images/track.png") + "'></img></figure><p class='trackName'>" + item.name + ((item.duration !== "0") ? " [" + formatSeconds(item.duration) + "]" : "") + "<a data-lity href='#boxInfo'  onclick=\"$('#boxInfo').html('<span class=loading></span>'); getInformation('artist.getInfo', '" + addslashes(item.artist.name) + "')\">" + item.artist.name + "</a></p><a data-lity class='info' href='#boxInfo' onclick=\"$('#boxInfo').html('<span class=loading></span>'); getInformation('track.getInfo', '" + addslashes(item.artist.name) + "', '" + addslashes(item.name) + "')\"><i class='fa fa-info-circle'></i></a></li>"

                            track = {
                                "@type": "MusicRecording",
                                "name": addslashes(item.name),
                                "position": item['@attr']['rank'],
                                "url": "https://gelguimaraes.github.io/myTE/site/index.html?track#" + item.artist.name +"/"  + item.name,
                                "image": ((item.image[1]['#text']) ? item.image[1]['#text'] : "images/track.png"),
                                "duration": item.duration + "s",
                                "byArtist": {
                                    "@type": "MusicGroup",
                                    "name": addslashes(item.artist.name)
                                }
                            };

                            tracks.push(track)

                           MusicPlaylist = {
                                "@context": "http://schema.org",
                                "@type": "MusicPlaylist",
                                //"@id":"https://gelguimaraes.github.io/myTE/site/",
                                "name": "Top Tracks em " + type.cat,
                                "genre": type.cat,
                                "track": tracks

                            }
                            crateJson_ld(MusicPlaylist, "musicList")

                            trackTurtle = "\n\t[\n" +
                                "\t\t a schema:MusicRecording ;\n" +
                                "\t\t schema:byArtist [\n" +
                                "\t\t\t a schema:MusicGroup ;\n" +
                                "\t\t\t schema:name '"+addslashes(item.artist.name)+"'^^xsd:string ;\n" +
                                "\t\t ] ;\n" +
                                "\t\t schema:duration '" + item.duration + "s'^^xsd:string ;\n" +
                                "\t\t schema:image <"+ ((item.image[1]['#text']) ? item.image[1]['#text'] : "images/track.png") +"> ;\n" +
                                "\t\t schema:name '"+addslashes(item.name)+"'^^xsd:string ;\n" +
                                "\t\t schema:position '"+item['@attr']['rank']+"'^^xsd:string ;\n"+
                                "\t\t schema:url <https://gelguimaraes.github.io/myTE/site/index.html?track#" + item.artist.name.replace(/\s/g, "%20") +"/"  + item.name.replace(/\s/g, "%20") +">\n" +
                                "\t]"


                            tracksTurtle.push(trackTurtle)

                            if(item['@attr']['rank'] == 30){
                                let stringTurtle = "" +
                                    "@base <https://gelguimaraes.github.io/myTE/site/>.\n"+
                                    "@prefix schema: <http://schema.org/> .\n" +
                                    "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\n"+
                                    "<https://gelguimaraes.github.io/myTE/site/>\n"+
                                    "\t a schema:MusicPlaylist;\n"+
                                    "\t schema:genre '"+ type.cat  + "'^^xsd:string;\n" +
                                    "\t schema:name 'Top Tracks em " + type.cat + "'^^xsd:string;\n"+
                                    "\t schema:track" +
                                    tracksTurtle +"."

                                createTurtle(stringTurtle,"MusicPlayList"+type.cat+".ttl","text/plain")
                            }

                            break;

                        case 'artist':
                            html = "<li class='artist'><span class='rank'>#" + item['@attr']['rank'] + "</span><figure><img width='90' height='90'src='" + ((item.image[2]['#text']) ? item.image[2]['#text'] : "images/artist.png") + "'></img></figure><p class='artistName'>" + item.name + "</p><a data-lity class='info' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo', '" + addslashes(item.name) + "')\"><i class='fa fa-info-circle'></i></a></li>"



                            artist = {
                                "@type": "ListItem",
                                "position": item['@attr']['rank'],
                                "item": {
                                    "@type": "MusicGroup",
                                    "genre": type.cat,
                                    "name": addslashes(item.name),
                                    "url": "https://gelguimaraes.github.io/myTE/site/index.html?artist#" + item.name,
                                    "sameAs": item.url,
                                    "image": ((item.image[2]['#text']) ? item.image[2]['#text'] : "images/artist.png")
                                }

                            }

                            artists.push(artist)

                            ArtistPlaylist = {
                                "@context": "http://schema.org",
                                "@type": "Itemlist",
                               // "@id":"https://gelguimaraes.github.io/myTE/site/",
                                "name": "Top Artists em " + type.cat,
                                "itemListElement": artists
                            }
                            crateJson_ld(ArtistPlaylist, "itemList")


                            artistTurtle = "\n\t[\n" +
                                "\t\t a schema:ListItem ;\n" +
                                "\t\t schema:position '"+item['@attr']['rank']+"'^^xsd:string ;\n"+
                                "\t\t schema:item [\n" +
                                "\t\t\t a schema:MusicGroup ;\n" +
                                "\t\t\t schema:genre '"+ type.cat  + "'^^xsd:string;\n" +
                                "\t\t\t schema:name '"+addslashes(item.name)+"'^^xsd:string;\n" +
                                "\t\t\t schema:image <"+ ((item.image[2]['#text']) ? item.image[2]['#text'] : "images/artist.png") +"> ;\n" +


                                "\t\t\t schema:url <https://gelguimaraes.github.io/myTE/site/index.html?artist#" + item.name.replace(/\s/g, "%20")+">\n"+
                                "\t\t];\n" +
                                "\t]"


                            artistsTurtle.push(artistTurtle)

                            if(item['@attr']['rank'] == 30){
                                let stringTurtle = "" +
                                    "@base <https://gelguimaraes.github.io/myTE/site/>.\n"+
                                    "@prefix schema: <http://schema.org/> .\n" +
                                    "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\n"+
                                    "<https://gelguimaraes.github.io/myTE/site/>\n"+
                                    "\t a schema:Itemlist;\n"+
                                    "\t schema:name 'Top Artists em " + type.cat + "'^^xsd:string;\n"+
                                    "\t schema:itemListElement" +
                                    artistsTurtle +"."

                                createTurtle(stringTurtle,"MusicGroupList"+type.cat+".ttl","text/plain")
                            }


                            break;

                        case 'album':
                            html = "<li class='album'><span class='rank'>#" + item['@attr']['rank'] + "</span><figure><img width='90' height='90' src='" + ((item.image[2]['#text']) ? item.image[2]['#text'] : "images/album.png") + "'></img></figure><p class='albumName'>" + item.name + "</p><a data-lity class='info' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('album.getInfo', '" + addslashes(item.artist.name) + "','" + addslashes(item.name) + "')\"><i class='fa fa-info-circle'></i></a></li>";

                            album = {
                                "@type": "ListItem",
                                "position": item['@attr']['rank'],
                                "item": {
                                    "@type": "MusicAlbum",
                                    "genre": type.cat,
                                    "name": addslashes(item.name),
                                    "url": "https://gelguimaraes.github.io/myTE/site/index.html?album#" + item.artist.name +"/"  + item.name,
                                    "image": ((item.image[2]['#text']) ? item.image[2]['#text'] : "images/artist.png"),
                                    "byArtist": {
                                        "@type": "MusicGroup",
                                        "name": addslashes(item.artist.name)
                                    }
                                }

                            }

                            albums.push(album)

                            AlbumPlaylist = {
                                "@context": "http://schema.org",
                                "@type": "Itemlist",
                                "name": "Top Albums em " + type.cat,
                                "itemListElement": albums
                            }
                            crateJson_ld(AlbumPlaylist, "itemList")


                            albumTurtle = "\n\t[\n" +
                                "\t\t a schema:ListItem ;\n" +
                                "\t\t schema:position '"+item['@attr']['rank']+"'^^xsd:string ;\n"+
                                "\t\t schema:item [\n" +
                                "\t\t\t a schema:MusicAlbum ;\n" +
                                "\t\t\t schema:byArtist [\n" +
                                "\t\t\t\t a schema:MusicGroup ;\n" +
                                "\t\t\t\t schema:name '"+addslashes(item.artist.name)+"'^^xsd:string ;\n" +
                                "\t\t\t ] ;\n" +
                                "\t\t\t schema:image <"+ ((item.image[2]['#text']) ? item.image[2]['#text'] : "images/artist.png") +"> ;\n" +
                                "\t\t\t schema:name '"+addslashes(item.name)+"'^^xsd:string ;\n" +
                                "\t\t\t schema:url <https://gelguimaraes.github.io/myTE/site/index.html?album#" + item.artist.name.replace(/\s/g, "%20") +"/"  + item.name.replace(/\s/g, "%20") +">\n" +
                                "\t\t];\n" +
                                "\t]"



                            albumsTurtle.push(albumTurtle)

                            if(item['@attr']['rank'] == 30){
                                let stringTurtle = "" +
                                    "@base <https://gelguimaraes.github.io/myTE/site/>.\n"+
                                    "@prefix schema: <http://schema.org/> .\n" +
                                    "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\n"+
                                    "<https://gelguimaraes.github.io/myTE/site/>\n"+
                                    "\t a schema:Itemlist;\n"+
                                    "\t schema:genre '"+ type.cat  + "'^^xsd:string;\n" +
                                    "\t schema:name 'Top Albums em " + type.cat + "'^^xsd:string;\n"+
                                    "\t schema:itemListElement" +
                                    albumsTurtle +"."

                                createTurtle(stringTurtle,"MusicAlbumList"+type.cat+".ttl","text/plain")
                            }

                            break;
                    }


                } else if (method === 'geo') { //por paises
                    switch (secondKey) {
                        case 'track':
                            html = "<li class='track'><span class='rank'>#" + (parseInt(item['@attr']['rank']) + 1) + "</span><figure><img width='34' height='34' src='" + ((item.image[0]['#text']) ? item.image[0]['#text'] : "images/track.png") + "'></img></figure><p><a data-lity class='info' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('track.getInfo', '" + addslashes(item.artist.name) + "', '" + addslashes(item.name) + "')\">" + item.name + "</a><a data-lity href='#boxInfo'  onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo','" + addslashes(item.artist.name) + "')\">" + item.artist.name + "</a></p><span class='ouvintes'><i class='fa fa-headphones'></i>" + nFormatter(item.listeners, 1) + "</span></li>"

                            trackCountry = {
                                "@type": "MusicRecording",
                                "name": item.name,
                                "image": ((item.image[0]['#text']) ? item.image[0]['#text'] : "images/track.png"),
                                "url": "https://gelguimaraes.github.io/myTE/site/index.html?track#" + item.artist.name +"/"  + item.name,
                                "interactionStatistic": {
                                    "@type": "InteractionCounter",
                                    "identifier": {
                                        "@type": "PropertyValue",
                                        "name": "Ouvintes do track " + item.name,
                                        "value": nFormatter(item.listeners, 1)
                                    }
                                },
                                "byArtist": {
                                    "@type": "MusicGroup",
                                    "name": item.artist.name
                                }
                            }

                            tracksCountry.push(trackCountry)

                            MusicPlaylistCountry = {
                                "@context": "http://schema.org",
                                "@type": "MusicPlaylist",
                                "contentLocation": {
                                    "@type": "Place",
                                    "name": type.country,
                                },
                                "name": "Top Tracks in " + type.country,
                                "track": tracksCountry
                            }

                            crateJson_ld(MusicPlaylistCountry, "musicCountryList")
                            break;

                        case 'artist':
                            html = "<li class='artist'><span class='rank'>#" + position + "</span><figure><img width='34' height='34' src='" + ((item.image[0]['#text']) ? item.image[0]['#text'] : "images/artist.png") + "'></img></figure><p><a data-lity class='artistName' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo', '" + addslashes(item.name) + "')\">" + item.name + "</a></p><span class='ouvintes'><i class='fa fa-headphones'></i>" + nFormatter(item.listeners, 1) + "</span></li>"

                            artistCountry = {
                                "@type": "ListItem",
                                "position": position++,
                                "item": {
                                    "@type": "MusicGroup",
                                    "name": item.name,
                                    "location": {
                                        "@type": "Place",
                                        "name": type.country,
                                    },
                                    "url": "https://gelguimaraes.github.io/myTE/site/index.html?artist#" + item.name,
                                    "sameAs": item.url,
                                    "image": ((item.image[0]['#text']) ? item.image[0]['#text'] : "images/artist.png"),
                                }
                            };

                            artistsCountry.push(artistCountry)

                            ArtistPlaylistCountry = {
                                "@context": "http://schema.org",
                                "@type": "Itemlist",
                                "name": "Top Artists in " + type.country,
                                "itemListElement":  artistsCountry
                            }
                            crateJson_ld(ArtistPlaylistCountry, "itemList")

                            break;

                    }
                }
                return html;
            }), //fim funcao append

        ) //fim map

    }, //fim json
    error: function (json) {
        //alert("Error");
    }
})//fim ajax


//recuperando as informações de artista, album ou track
let getInformation = (method, artist, trackOrAlbum) => $.ajax({
    url: (optAPI.apiUrl + 'method=' + method + '&artist=' + artist + '&track=' + trackOrAlbum + '&album=' + trackOrAlbum + '&api_key=' + optAPI.apiKey + '&format=json'),
    method: 'GET',
    dataType: 'JSON',
    success: function (json) {
        let key = Object.keys(json)[0];
        //console.log(key);
        let item = json[key],
            html;
        //console.log(objItems);
        method = method.split('.')[0];
        //console.log(method);

        $("#boxInfo").html(function () {
            if (method === 'track') {
                $(".lity").css({
                    'background-image': 'url(images/overlay.png), url(' + ((item.album && item.album.image[3]['#text'] !== '') ? item.album.image[3]['#text'] : "images/album.png") + ')'
                });

                html = "<div class='contentInfo'><div class='contentTop'><a class='infoTitle' target='_blank' href='" + item.url + "'><i class='fa fa-play'></i>" + item.name + ((item.duration !== "0") ? " [" + formatMiliSeconds(item.duration) + "]" : "") + "</a></div><div class='contentLeft'><figure><img class='imgTrackInfo' src='" + ((item.album && item.album.image[3]['#text'] !== '') ? item.album.image[3]['#text'] : "images/album.png") + "'></figure>" + ((item.album) ? "<p class='Album'><a class='infoAlbum' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('album.getInfo', '" + addslashes(item.artist.name) + "','" + addslashes(item.album.title) + "')\"><i class='fa fa-music'></i>" + item.album.title + "</a></p>" : '') + "<p class='Artist'><a  class='infoArtist' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo', '" + addslashes(item.artist.name) + "')\"><i class='fa fa-user-circle'></i>" + item.artist.name + "</a></p> <span class='ouvintes'><i class='fa fa-headphones'></i>" + ((item.listeners) ? nFormatter(item.listeners, 1) : 'sem') + " ouvintes</span> <span class='toptags'><i class='fa fa-tags'></i>Top Tags:<br>" + item.toptags.tag.map(t => '#' + t.name).join(' ') + "</span></div><div class='contentRight'>" + ((item.wiki) ? "<p class='wiki'>Biografia by Wiki</p><p class='publibWiki'><i class='fa fa-calendar-o'></i>" + item.wiki.published + "</p><p class='sumaryWiki'><i class='fa fa-comments'></i>" + item.wiki.summary + "</p><p class='contentWiki'><i class='fa fa-align-justify'></i>" + item.wiki.content + "</p>" + ((item.wiki.content.length > 720) ? "<p class='expand'><a class='textExpand'><i class='fa fa-angle-double-down'></i></a><p>" : '') : '') + "</div></div>";


                //tracks similares
               getTrackSimilar(item.artist.name.replace('&', '%26'), item.name.replace('&', '%26'));

                MusicRecording = {
                    "@context": "http://schema.org",
                    "@type": "MusicRecording",
                    "name": addslashes(item.name),
                    "image": ((item.album && item.album.image[3]['#text'] !== '') ? item.album.image[3]['#text'] : "images/album.png"),
                    "duration": item.duration + "ms",
                    "inAlbum" : addslashes(item.album.title),
                    "interactionStatistic": {
                        "@type": "InteractionCounter",
                        "identifier": {
                            "@type": "PropertyValue",
                            "name": "Ouvintes do track " + addslashes(item.name),
                            "value": ((item.listeners) ? nFormatter(item.listeners, 1) : 'nenhum'),
                        }
                    },
					"dateCreated": ((item.wiki) ? item.wiki.published : ""),
                    "description": ((item.wiki) ? item.wiki.summary : ""),
                    "text": ((item.wiki) ? item.wiki.content : ""),
                    "keywords": item.toptags.tag.map(t =>  addslashes(t.name)).join(', '),
                    "byArtist": {
                        "@type": "MusicGroup",
                        "name": addslashes(item.artist.name)
                    }
                }

                crateJson_ld(MusicRecording, "musicRecording")

                let stringTurtle = "" +
                    "@base <https://gelguimaraes.github.io/myTE/site/?track>.\n"+
                    "@prefix schema: <http://schema.org/> .\n" +
                    "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\n"+
                    "<#" + item.artist.name.replace(/\s/g, "%20") +"/"  + item.name.replace(/\s/g, "%20") +">\n"+
                    "\t a schema:MusicRecording ;\n" +
                    "\t schema:name '"+addslashes(item.name)+"'^^xsd:string ;\n" +
                    "\t schema:byArtist [\n" +
                    "\t\t a schema:MusicGroup ;\n" +
                    "\t\t schema:name '"+addslashes(item.artist.name)+"'^^xsd:string ;\n" +
                    "\t ] ;\n" +
                    "\t schema:duration '" + item.duration + "s'^^xsd:string ;\n" +
                    "\t schema:image <"+ ((item.album && item.album.image[3]['#text'] !== '') ? item.album.image[3]['#text'] : "images/album.png") +"> ;\n" +
                    "\t schema:url <https://gelguimaraes.github.io/myTE/site/index.html?track#" + item.artist.name.replace(/\s/g, "%20") +"/"  + item.name.replace(/\s/g, "%20") +">;\n" +
                    "\t schema:dateCreated '"+((item.wiki) ? item.wiki.published : "")+"'^^schema:Date ;\n" +
                    "\t schema:description '"+addslashes(((item.wiki) ? item.wiki.summary : "")).replace(/\r?\n|\r/g, "") +"'^^xsd:string ;\n" +
                    "\t schema:inAlbum '" + addslashes(item.album.title) + "'^^xsd:string ;\n" +
                    "\t schema:interactionStatistic [\n" +
                    "\t\t a schema:InteractionCounter ;\n" +
                    "\t\t schema:identifier [ \n" +
                    "\t\t\t a schema:PropertyValue ;\n" +
                    "\t\t\t schema:name 'Ouvintes do track " + addslashes(item.name)+ "'^^xsd:string ;\n" +
                    "\t\t\t schema:value '" + ((item.listeners) ? nFormatter(item.listeners, 1) : 'nenhum')+"'^^xsd:string\n" +
                    "\t\t]\n" +
                    "\t] ;\n" +
                    "\t schema:keywords '"+item.toptags.tag.map(t =>  t.name).join(', ')+"'^^xsd:string; \n" +
                    "\t schema:text '"+addslashes(((item.wiki) ? item.wiki.content : "")).replace(/\r?\n|\r/g, "")+"'^^xsd:string .\n"


                createTurtle(stringTurtle,"MusicInfo["+addslashes(item.name)+"].ttl","text/plain")




            } else if (method === 'artist') {
                $(".lity").css({
                    'background-image': 'url(images/overlay.png), url(' + ((item.image && item.image[5]['#text'] !== '') ? item.image[5]['#text'] : "images/artist.png") + ')'
                });

                html = "<div class='contentInfo'><div class='contentTop'><a class='infoTitle' target='_blank' href='" + item.url + "'><i class='fa fa-user-circle'></i>" + item.name + "</a></div><div class='contentLeft'><figure><img class='imgArtistInfo' src='" + ((item.image && item.image[3]['#text'] !== '') ? item.image[3]['#text'] : "images/artist.png") + "'></figure><span class='ouvintes'><i class='fa fa-headphones'></i>" + ((item.stats.listeners) ? nFormatter(item.stats.listeners, 1) : 'sem') + " ouvintes</span> <span class='toptags'><i class='fa fa-tags'></i>Tags Relacionadas:<br>" + item.tags.tag.map(t => '#' + t.name).join('  ') + "</span></div><div class='contentRight'>" + ((item.bio) ? "<p class='wiki'>Biografia</p><p class='publibWiki'><i class='fa fa-calendar-o'></i>" + item.bio.published + "</p><p class='sumaryWiki'><i class='fa fa-comments'></i>" + item.bio.summary + "</p>" + ((item.bio.content && item.bio.content !== '') ? "<p class='contentWiki'><i class='fa fa-align-justify'></i>" + item.bio.content + "</p>" + ((item.bio.content.length > 720) ? "<p class='expand'><a class='textExpand'><i class='fa fa-angle-double-down'></i></a><p>" : '') : '') : "<p class='noPublic'>Sem Publicação</p>") + "</div><div class='contentDown'>" + ((item.similar && item.similar.artist !== '') ? "<p class='titleSimilar'>Artistas Similares</p><div class='artistsSimilares'>" + item.similar.artist.map((s) => "<div class='artistSimilar'><figure><img class='imgArtistInfo' width='174' src='" + ((s.image && s.image[2]['#text'] !== '') ? s.image[2]['#text'] : "images/artist.png") + "'/></figure><p class='Artist'><a class='infoArtist' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo', '" + addslashes(s.name) + "')\"><i class='fa fa-user-circle'></i>" + s.name + "</a></p></div>").join('') + "</div>" : "<p class='noPublic'>Sem Artistas Similares</p>") + "</div></div>";
                // top albums do artista
                getTopTracksOrAlbumsforArtist(item.name.replace('&', '%26'), 'album', 5);

                // top tracks do artista
                 getTopTracksOrAlbumsforArtist(item.name.replace('&', '%26'), 'track', 16);

                MusicGroup = {
                    "@context": "http://schema.org",
                    "@type": "MusicGroup",
                    "name": addslashes(item.name),
                    "url": "https://gelguimaraes.github.io/myTE/site/index.html?artist#" + item.name,
                    "image": ((item.image && item.image[3]['#text'] !== '') ? item.image[3]['#text'] : "images/artist.png"),
                    "description": item.bio.content,
                    "sameAs": ((item.similar && item.similar.artist !== '') ? item.similar.artist.map((s) => s.url).join(', '): "")
                }

                crateJson_ld(MusicGroup, "musicGroup")

                let stringTurtle = "" +
                    "@base <https://gelguimaraes.github.io/myTE/site/?artist>.\n"+
                    "@prefix schema: <http://schema.org/> .\n" +
                    "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\n"+
                    "<#" + item.name.replace(/\s/g, "%20") +">\n"+
                    "\t a schema:MusicGroup ;\n" +
                    "\t schema:name '"+addslashes(item.name)+"'^^xsd:string ;\n" +
                    "\t schema:image <"+ ((item.image && item.image[3]['#text'] !== '') ? item.image[3]['#text'] : "images/artist.png") +"> ;\n" +
                    "\t schema:url <https://gelguimaraes.github.io/myTE/site/index.html?artist#" + item.name.replace(/\s/g, "%20") +">;\n" +
                    "\t schema:dateCreated '"+((item.bio) ? item.bio.published : "")+"'^^schema:Date ;\n" +
                    "\t schema:description '"+addslashes(((item.bio) ? item.bio.summary : "")).replace(/\r?\n|\r/g, "") +"'^^xsd:string ;\n" +
                    "\t schema:interactionStatistic [\n" +
                    "\t\t a schema:InteractionCounter ;\n" +
                    "\t\t schema:identifier [ \n" +
                    "\t\t\t a schema:PropertyValue ;\n" +
                    "\t\t\t schema:name 'Ouvintes do artista " + addslashes(item.name)+ "'^^xsd:string ;\n" +
                    "\t\t\t schema:value '" + ((item.stats) ? nFormatter(item.stats.listeners, 1) : 'nenhum')+"'^^xsd:string\n" +
                    "\t\t]\n" +
                    "\t] ;\n" +
                    "\t schema:keywords '"+item.tags.tag.map(t =>  addslashes(t.name)).join(', ')+"'^^xsd:string; \n" +
                    "\t schema:text '"+addslashes(((item.bio) ? item.bio.content : "")).replace(/\r?\n|\r/g, "")+"'^^xsd:string ;\n" +
                    "\t schema:sameAs '" +((item.similar && item.similar.artist !== '') ? item.similar.artist.map((s) => s.url).join(', '): "")+"'."


                createTurtle(stringTurtle,"ArtistInfo["+addslashes(item.name)+"].ttl","text/plain")






            } else if (method === 'album') {
                $(".lity").css({
                    'background-image': 'url(images/overlay.png), url(' + ((item.image && item.image[5]['#text'] !== '') ? item.image[5]['#text'] : "images/album.png") + ')'
                });

                html = "<div class='contentInfo'><div class='contentTop'><a class='infoTitle' target='_blank' href='" + item.url + "'><i class='fa fa-music'></i>" + item.name + "</a></div><div class='contentLeft'><figure><img class='imgAlbumInfo' src='" + ((item.image && item.image[3]['#text'] !== '') ? item.image[3]['#text'] : "images/album.png") + "'></figure><a class='infoArtist' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('artist.getInfo', '" + addslashes(item.artist) + "')\"><i class='fa fa-user-circle'></i>" + item.artist + "</a><span class='ouvintes'><i class='fa fa-headphones'></i>" + ((item.listeners) ? nFormatter(item.listeners, 1) : 'sem') + " ouvintes</span> <span class='toptags'><i class='fa fa-tags'></i>Tags Relacionadas:<br>" + item.tags.tag.map(t => '#' + t.name).join('  ') + "</span></div><div class='contentRight'>" + item.tracks.track.map((tr) => "<a class='infoAlbumTrack' target='_blank' href='" + tr.url + "'><i class='fa fa-play-circle'></i><span class='infoTitleTrack'>" + tr.name + "</span><span class='infoDuracTrack'>[" + formatSeconds(tr.duration) + "]</span></a>").join('') + "</div><div class='contentDown'>" + ((item.wiki) ? "<p class='wiki'>Biografia</p><p class='publibWiki'><i class='fa fa-calendar-o'></i>" + item.wiki.published + "</p><p class='sumaryWiki'><i class='fa fa-comments'></i>" + item.wiki.summary + "</p><p class='contentWiki'><i class='fa fa-align-justify'></i>" + item.wiki.content + "</p>" : "") + "</div></div>";

                let tracksAlbum = []

                item.tracks.track.map((tr) => {
                    trackAlbum = {
                        "@type":"MusicRecording",
                        "name": tr.name,
                        "url" : tr.url,
                        "duration": tr.duration + "s",
                    }
                    tracksAlbum.push(trackAlbum)
                })


                //console.log(tracksAlbum)

                MusicAlbum = {
                    "@context": "http://schema.org",
                    "@type": "MusicAlbum",
                    "name": item.name,
                    "image": ((item.image && item.image[3]['#text'] !== '') ? item.image[3]['#text'] : "images/album.png"),
                    "byArtist": {
                        "@type": "MusicGroup",
                        "name": item.artist
                    },
                    "interactionStatistic": {
                        "@type": "InteractionCounter",
                        "identifier": {
                            "@type": "PropertyValue",
                            "name": "Ouvintes do Artista " + item.name,
                            "value": ((item.listeners) ? nFormatter(item.listeners, 1) : 'sem')
                        }
                    },
                    "dateCreated": ((item.wiki) ? item.wiki.published : ""),
                    "description": ((item.wiki) ? item.wiki.summary : ""),
                    "text": ((item.wiki) ? item.wiki.content : ""),
                    "keywords": item.tags.tag.map(t => '#' + t.name).join(', '),
                    "numTracks" : item.tracks.track.length,
                    "track": tracksAlbum
                }
                crateJson_ld(MusicAlbum , "musicAlbum")


                tracksAlbumTurtle = []

                item.tracks.track.map((tr) => {
                trackAlbumTurtle = "\n\t[\n" +
                    "\t\t a schema:MusicRecording ;\n" +
                    "\t\t schema:name '"+addslashes(item.name)+"'^^xsd:string ;\n" +
                    "\t\t schema:duration '" + item.duration + "s'^^xsd:string ;\n" +
                    "\t\t schema:url <https://gelguimaraes.github.io/myTE/site/index.html?track#" + item.artist.replace(/\s/g, "%20") +"/"  + item.name.replace(/\s/g, "%20") +">\n" +
                    "\t]"
                    tracksAlbumTurtle.push(trackAlbumTurtle)
                })

                let stringTurtle = "" +
                    "@base <https://gelguimaraes.github.io/myTE/site/?album>.\n"+
                    "@prefix schema: <http://schema.org/> .\n" +
                    "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\n"+
                    "<#" + item.artist.replace(/\s/g, "%20") +"/"  + item.name.replace(/\s/g, "%20") +">\n"+
                    "\t a schema:MusicAubum ;\n" +
                    "\t schema:name '"+addslashes(item.name)+"'^^xsd:string ;\n" +
                    "\t schema:byArtist [\n" +
                    "\t\t a schema:MusicGroup ;\n" +
                    "\t\t schema:name '"+addslashes(item.artist)+"'^^xsd:string ;\n" +
                    "\t ] ;\n" +
                    "\t schema:image <"+ ((item.image && item.image[3]['#text'] !== '') ? item.image[3]['#text'] : "images/album.png") +"> ;\n" +
                    "\t schema:url <https://gelguimaraes.github.io/myTE/site/index.html?album#" + item.artist.replace(/\s/g, "%20") +"/"  + item.name.replace(/\s/g, "%20") +">;\n" +
                    "\t schema:dateCreated '"+((item.wiki) ? item.wiki.published : "")+"'^^schema:Date ;\n" +
                    "\t schema:description '"+addslashes(((item.wiki) ? item.wiki.summary : "")).replace(/\r?\n|\r/g, "") +"'^^xsd:string ;\n" +
                    "\t schema:interactionStatistic [\n" +
                    "\t\t a schema:InteractionCounter ;\n" +
                    "\t\t schema:identifier [ \n" +
                    "\t\t\t a schema:PropertyValue ;\n" +
                    "\t\t\t schema:name 'Ouvintes do track " + addslashes(item.name)+ "'^^xsd:string ;\n" +
                    "\t\t\t schema:value '" + ((item.listeners) ? nFormatter(item.listeners, 1) : 'nenhum')+"'^^xsd:string\n" +
                    "\t\t]\n" +
                    "\t] ;\n" +
                    "\t schema:keywords '"+ item.tags.tag.map(t => addslashes(t.name)).join(', ')+"'^^xsd:string; \n" +
                    "\t schema:text '"+addslashes(((item.wiki) ? item.wiki.content : "")).replace(/\r?\n|\r/g, "")+"'^^xsd:string ;\n" +
                    "\t schema:numTracks '" + item.tracks.track.length + "'^^xsd:int;\n" +
                    "\t schema:track" + tracksAlbumTurtle +"."


               createTurtle(stringTurtle,"AlbumInfo["+addslashes(item.name)+"].ttl","text/plain")

            }

            return html;

        }) //fim funcao html


        //link que espande o conteudo da biografia
        $('.textExpand').click(function () {
            let contentWiki = $('.contentWiki');

            if (contentWiki.height() === 200) {
                contentWiki.css("height", "auto");

                let height = contentWiki.height();

                contentWiki.css("height", "200px");
                contentWiki.animate({height: height + "px"}, 1000, function () {
                    contentWiki.css("height", "auto");
                });
            } else {
                contentWiki.animate({height: "200px"}, 1500);
                $('#boxInfo').animate({scrollTop: 0}, 1000);
            }
            $('.textExpand i').toggleClass('fa-angle-double-down fa-angle-double-up')

        });


    } //fim json
}); //fim ajax

//recuperado as midias pelo campo de busca
let getSearch = (method, type, midia) => $.ajax({
    url: (optAPI.apiUrl + 'method=' + method + '&' + type + '=' + midia + '&api_key=' + optAPI.apiKey + '&format=json&limit=54'),
    method: 'GET',
    dataType: 'JSON',
    success: function (json) {

        let results = Object.keys(json)[0];
        //console.log(results)

        let matches = Object.keys(json[results])[4];
        //console.log(matches)

        let key = Object.keys(json[results][matches])[0];
        //console.log(key)

        let objItems = json[results][matches][key],
            html;
        //console.log(objItems[0])

        $(".resultSearch").html("<p class=titleSearch>Procurando por: \"" + midia + "\"</p><div class=itensResult></div>");

        objItems.map((item) =>
            $(".itensResult").append(function () {
                html = "<a data-lity class='itemResult result" + type + "' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('" + type + ".getInfo', '" + ((item.artist) ? addslashes(item.artist) : addslashes(item.name)) + "','" + addslashes(item.name) + "')\"><figure><img class='img" + type + "Search' src='" + ((item.image && item.image[2]['#text'] !== '') ? item.image[2]['#text'] : "images/" + type + ".png") + "'></figure><span class='nameResult'>" + item.name + "</span>" + ((item.artist) ? "<span class='artistNameResult'><i class='fa fa-user-circle'></i>" + item.artist + "</span>" : '') + "</a>";

                return html;
            }) //fim funcao apeend
        ) //fim map

        if (json.results["opensearch:totalResults"] === 0) {
            $(".itensResult").html("<p class='noResult'>Nenhum Resultado Encontrado! :( </p>");
        }

        //inserindo os botoes voltar e topo
        $(".resultSearch").append("<div class='btArrows'><span class='backSearch'><i class='fa fa-arrow-left'></i></span><span class='scrollTop'><i class='fa fa-arrow-up'></i></span><div>");

        //botao que retorna a estrutura inicial da pagina e volta para o topo da pagina
        $('.backSearch').click(function () {
            $('html, body').animate({scrollTop: 0}, 2000);
            $('.resultSearch').fadeOut();
            $('#carousel').fadeIn();
            $('#search').val('');
            $('.lists').fadeIn();
        })
        //botao que volta para o topo da pagina
        $('.scrollTop').click(function () {
            $('html, body').animate({scrollTop: 0}, 2000);
        });
    } //fim json
}); //fim ajax

//recuperando tracks similares
let getTrackSimilar =  (artist, track) =>  $.ajax({
        url: (optAPI.apiUrl + 'method=track.getsimilar&artist=' + artist + '&track=' + track + '&api_key=' + optAPI.apiKey + '&format=json&limit=15'),
        method: 'GET',
        dataType: 'JSON',
        success: function (json) {
            let firstKey = Object.keys(json)[0];
            //console.log(firstKey);

            let secondKey = Object.keys(json[firstKey])[0];
            //console.log(secondKey)
            let objItems = json[firstKey][secondKey],
                html;
            //console.log(objItems);


            $(".contentRight").append("<p class=titleTrackSimilar>Tracks Similares</p><div class=tracksSimilares></div>");

            objItems.map((item) =>
                $(".tracksSimilares").append(function () {
                    html = "<a class='itemSimilar'  href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('track.getInfo', '" + addslashes(item.artist.name) + "','" + addslashes(item.name) + "')\"><figure><img class='imgSimilar' src='" + ((item.image && item.image[2]['#text'] !== '') ? item.image[2]['#text'] : "images/track.png") + "'></figure><span class='nameSimilar'>" + item.name + "</span>" + ((item.artist) ? "<span class='artistSimilar'><i class='fa fa-user-circle'></i>" + item.artist.name + "</span>" : '') + "</a>";
                    return html;
                }) //fim funcao append
            ) //fim map
        }//fim json
    })//fim ajax



//retornando os top Tracks ou Albuns do artista
let getTopTracksOrAlbumsforArtist =(artist, trackOrAlbum, limit) => {
    var tracks = []
    $.ajax({
        url: (optAPI.apiUrl + 'method=artist.gettop' + trackOrAlbum + 's&artist=' + artist + '&api_key=' + optAPI.apiKey + '&format=json&limit=' + limit),
        method: 'GET',
        dataType: 'JSON',
        success: function (json) {
            let firstKey = Object.keys(json)[0];
            //console.log(firstKey);
            let secondKey = Object.keys(json[firstKey])[0];
            //console.log(secondKey)
            let objItems = json[firstKey][secondKey],
                html, title, icon, totalOuvintes;
            //console.log(objItems);


            if (secondKey === 'track') {

                //totalOuvintes = objItems.reduce((sum, item) => (sum + parseInt(item.listeners)), 0);
                totalOuvintes = parseInt(objItems[0].listeners);

                $(".contentDown").prepend("<p class=titleArtistTopTrack>Top Tracks de " + json[firstKey]['@attr'].artist + "</p><div class=graficTracks></div>");


                let $i = 1, arrayTracks =[];

                objItems.map((item) =>
                        $(".graficTracks").append(function () {
                            html = "<div class='itemsGrafic'><p class='tracksNamesGrafic'><a class='nameArtistTopTrack' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('track.getInfo', '" + addslashes(item.artist.name) + "','" + addslashes(item.name) + "')\"><span class='numberTracks'>#" + ($i++) + "</span><i class='fa fa-play'></i>" + item.name + "</a></p><p class='tracksBarsGrafic'><span class='barsGrafic' style='width:" + ((parseInt(item.listeners) / totalOuvintes) * 100) + "%'></span><i class='fa fa-headphones'></i><span class='ouvintesArtistTopTrack'>" + nFormatter(parseInt(item.listeners), 1) + "</span></p><div>";



                            track = {
                                "@type": "MusicRecording",
                                "name": item.name,
                                "image": ((item.image[1]['#text']) ? item.image[1]['#text'] : "images/track.png"),
                                "interactionStatistic": {
                                    "@type": "InteractionCounter",
                                    "identifier": {
                                        "@type": "PropertyValue",
                                        "name": "Ouvintes do track " + item.name,
                                        "value": nFormatter(parseInt(item.listeners), 1)
                                    }
                                }
                            }

                            arrayTracks.push(track)

                            TracksMusicGroup = {
                                "@context": "http://schema.org",
                                "@type": "MusicGroup",
                                "name": item.name,
                                "tracks" : arrayTracks
                            }
                            crateJson_ld(TracksMusicGroup, "tracksMusicGroup")

                            return html;
                        })//fim funcao apeend
            ) //fim map

            } else if (secondKey === 'album') {

                $(".contentDown").prepend("<p class=titleArtistTopAlbum>Top Álbums de " + json[firstKey]['@attr'].artist + "</p><div class=ArtistTopAlbum></div>");

                objItems.map((item) =>
                    $(".ArtistTopAlbum").append(function () {
                        html = "<div class='itemArtistTopAlbum'><figure><img class='imgArtistTopAlbum' src='" + ((item.image && item.image[2]['#text'] !== '') ? item.image[2]['#text'] : "images/album.png") + "'></figure><a class='nameArtistTopAlbum' href='#boxInfo' onclick=\"$('#boxInfo').html('<div class=loading></div>'); getInformation('album.getInfo', '" + addslashes(item.artist.name) + "','" + addslashes(item.name) + "')\"><i class='fa fa-music'></i>" + item.name + "</a></div>";
                        return html;
                    }) //fim funcao append
                ) //fim map
            } //fim else
        } //fim json
    }) //fim ajax
    return tracks
}

let getRadio = (opt) => {
    //const url = `http://prem1.di.fm/${opt.radio}?5f14551afa408910a820a8af`;
    //const url = `https://hot.friezy.ru/?radio=di&station=${radio}&bitrate=320`;
    //const url = `https://pub2.diforfree.org:8000/di_${radio}_hi`;
    //console.log(radio);
    let stream = {
        m4a: `https://pub2.diforfree.org:8000/di_${opt.radio}_hi`
    }
    $(".interface .folder").css({"background-image": "url('images/ritmos/" + opt.name + ".jpg')"});
    //$(".interface .titleRadio").html(opt.cat);
    $(".interface .titleRadio").animate({
        opacity: 0
    }, 10).animate({
        opacity: 1,
    }, 200).html(opt.cat);
    $("#jplayer").jPlayer("destroy");
    let ready = false;
    $("#jplayer").jPlayer({
        ready: function (event) {
            ready = true;
            $(this).jPlayer("setMedia", stream).jPlayer("play");
        },
        pause: function () {
            $(this).jPlayer("clearMedia");
        },
        stop: function () {
            $(this).jPlayer("destroy");

        },
        error: function (event) {
            if (ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
                // Setup the media stream again and play it.
                $(this).jPlayer("setMedia", stream).jPlayer("play");
            }
        },
        supplied: "m4a, oga",
        wmode: "transparent",
        autoBlur: false,
        keyEnabled: false,
        preload: 'none',
    });

    $('.stop').click(function () {
        $("#jplayer").jPlayer("destroy");
        $('.radio').animate({'margin-bottom': '-100px', 'top': '-100px'}, 50);
    })
};


let execSlide = () => {
    $('ul.tabsCat li').removeClass('current');
    $('div.tab-content-cat').removeClass('current');
    $("#tabtracks").addClass('current');
    $("#tracks").addClass('current').html("<span class='loading'></span>");
    optType.name = $('.itemslide-active').attr('data-name');
    optType.radio = $('.itemslide-active').attr('data-radio');
    optType.cat = $('ul.cat li.itemslide-active span').text();
    optType.midia = $('ul.tabsCat li.current').text();
    optTag.tag = optType.name;
    optTag.method = 'tag.gettoptracks';
    getTopList(optTag, 'tracks', optType);
    getRadio(optType);
    //console.log(data);
};

let execSearch = () => {
    let search = $('#search').val();
    let method = search
    let type = method.split('.')[0];
    if (search !== "") {
        //console.log(validacampo(search));
        if (validateInput(search)) {
            $('#carousel').fadeOut();
            $('.lists').fadeOut();
            $('.resultSearch').css({
                'display': 'block'
            }).html("<span class='loading'></span>");
            getSearch(method, type, search);
        } else {
            $('#search').focus();
            alertify.alert('Por favor, digite um nome válido para buscar !');
        }

    } else {
        $('#search').focus();
        alertify.alert('Por favor, digite o nome de uma mídia para buscar !');
    }
};


//formata milisegundos em time min
let formatMiliSeconds = (ms) => {
    let hours = Math.floor(ms / 3600000);
    let minutes = Math.floor((ms % 3600000) / 60000);
    let seconds = Math.floor(((ms % 360000) % 60000) / 1000);
    let result = (minutes < 10 ? "0" + minutes : minutes);
    result += ":" + (seconds < 10 ? "0" + seconds : seconds);
    return result;
};

//formata segundos em time min
let formatSeconds = (totalSeconds) => {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = totalSeconds - (hours * 3600) - (minutes * 60);
    seconds = Math.round(seconds * 100) / 100
    let result = (minutes < 10 ? "0" + minutes : minutes);
    result += ":" + (seconds < 10 ? "0" + seconds : seconds);
    return result;
};

//formata numeros em unidades K e M
let nFormatter = (num, digits) => {
    let si = [{
        value: 1,
        symbol: ""
    }, {
        value: 1E3,
        symbol: "K"
    }, {
        value: 1E6,
        symbol: "M"
    }];
    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value)
            break;
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
};

//gera as barras do grafico equalizador
let equalizerBars = (number) => {
    for (let i = 0; i < number; i++)
        $('.equalizer').append('<div class=bar></div>');
};


//replace caracteres especiais nas strings
let addslashes = (ch) => {
    ch = ch.replace(/\'/g, "\\'")
    ch = ch.replace(/\"/g, "\\\"")
    ch = ch.replace(/&/g, "%26")
    return ch
};

//regex de validacao de busca - so permite letras com acentos numeros & ' _ - espaco
let validateInput = (string) => {
    let rx = /^[a-zA-Z_éúíóáÉÚÍÓÁèùìòàçÇÈÙÌÒÀõãñÕÃÑêûîôâÊÛÎÔÂ&'\-\ \s\d]+$/ig;
    return !!(string.match(rx))
};


let crateJson_ld = (object, id) =>{
    stringJSON = JSON.stringify(object);
        var s = document.createElement("script");
        s.type = "application/ld+json";
        s.text = stringJSON;
        s.id = id
    if (document.getElementById(id)) {
        (elem = document.getElementById(id)).parentNode.removeChild(elem)
    }
        $("head").append(s);

}

let createTurtle = (data, filename, type) => {
    //console.log(data)
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

let redirect = () => {
    let url = window.location.href
    let params = url.split("?");
    //console.log("parametros: " + params[1])

    if (params[1] != undefined) {
        let type = (params[1].split("#"))[0]
        let secondParams = (params[1].split("#"))[1]
        let a = document.createElement("a")
        a.setAttribute("data-lity", "")
        a.href = "#boxInfo";
        document.body.appendChild(a);
        if(type != 'artist'){
            let trackorAlbum = secondParams.split("/")
            a.click(getInformation(type + ".getInfo", trackorAlbum[0], trackorAlbum[1]))
        }else {
            a.click(getInformation(type + ".getInfo", secondParams))
        }
        document.body.removeChild(a);
    }
    return false
}

//carregando todas as funcoes das listas com parametros iniciais
$(getTopList(optTag, 'tracks', optType));
$(getTopList(optCountry, 'tracksCountry', optType));
$(redirect());
//$(getRadio(optType));

//inicia variaveis e metodos no carregamento da pagina
$(document).ready(function () {

    //carousel/slides dos ritimos
    let carousel;
    carousel = $("ul.cat");
    carousel.itemslide({
        start: 2
    });
    $(window).resize(function () {
        carousel.reload();

    });
    $('.next').click(function () {
        carousel.next();
        execSlide();
    });
    $('.previous').click(function () {
        carousel.previous();
        execSlide();
    });
    //barras do grafico equalizador
    equalizerBars(35);

    //imagens do background
    $("body").vegas({
        timer: false,
        autoplay: true,
        animation: 'fade',
        transitionDuration: 8000,
        animationDuration: 50000,
        delay: 10000,
        slides: [
            {src: 'images/backgrounds/bg-max_hits_1.jpg'},
            {src: 'images/backgrounds/bg-max_hits_2.jpg'},
            {src: 'images/backgrounds/bg-max_hits_3.jpg'},
            {src: 'images/backgrounds/bg-max_hits_4.jpg'},
            {src: 'images/backgrounds/bg-max_hits_5.jpg'},
            {src: 'images/backgrounds/bg-max_hits_7.jpg'},
            {src: 'images/backgrounds/bg-max_hits_6.jpg'}
        ],
        overlay: 'images/overlay.png'
    });

    //selectbox da busca
    $('#select').niceSelect();

    alertify.defaults.transition = "slide";
    alertify.defaults.glossary.title = 'AVISO';
    alertify.defaults.glossary.ok = 'Fechar';

});
