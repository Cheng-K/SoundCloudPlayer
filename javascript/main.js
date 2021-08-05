// Acts as a query handler
class Response {

    submitRequest (query) {
        soundCloudServer.getTracks(query);
    }
}

// Sound Cloud API that contains all methods to render results on screen & query for data
class SoundCloudAPI {

    constructor () {
        SC.initialize({
            client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
        });
    }

    getTracks(keywords){
       SC.get('/tracks', {
            q: keywords, limit : 20
        }).then(
            function(tracks) {
                tracks.forEach(function(element){
                    soundCloudServer.renderTrack(element);
                });
            }
        );
    }

    renderTrack(track) {

        let outputContainer = document.querySelector(".search-results");
        let card = document.createElement("div");
        card.className = "card";
        let imageContent = this.renderTrackImage(track.artwork_url);
        let trackContent = this.renderTrackContent(track.permalink_url,track.title);
        let footerContent = this.renderAddButton(track.permalink_url);

        card.append(imageContent,trackContent,footerContent);
        outputContainer.appendChild(card);

    }

    renderTrackImage(imageUrl) {
        if (imageUrl === null)
            imageUrl = "https://via.placeholder.com/290.jpg?text=No+Image+Available";
        let imageContainer = document.createElement("div");
        imageContainer.className = "image";
        let image = document.createElement("img");
        image.className = "image_img";
        image.setAttribute("src",imageUrl);
        imageContainer.appendChild(image);
        return imageContainer;
    }

    renderTrackContent(musicUrl,musicTitle) {
        let contentContainer = document.createElement("div");
        let headerContainer = document.createElement("div");
        let externalLink = document.createElement("a");
        contentContainer.className = "content";
        headerContainer.className = "header";
        externalLink.setAttribute("href",musicUrl);
        externalLink.setAttribute("target","_blank");
        externalLink.innerHTML = musicTitle;
        headerContainer.appendChild(externalLink);
        contentContainer.appendChild(headerContainer);
        return contentContainer;
    }

    renderAddButton (musicUrl) {
        let container = document.createElement("div");
        let button = document.createElement("i");
        let caption = document.createElement("span");
        container.classList.add("ui","bottom", "attacked", "button" ,"js-button");
        button.classList.add("add","icon");
        caption.innerHTML = "Add to playlist";

        container.addEventListener("click",function() {
            soundCloudServer.getEmbeddedPlayer(musicUrl);
        });
        container.append(button,caption);
        return container;

    }

    addMusicToPlaylist (iframeCode,musicTitle) {
        let container = document.querySelector(".js-playlist");
        let removeButton = document.createElement("button");
        let removeImage = document.createElement("img");
        let iframeContainer = document.createElement("div");

        iframeContainer.id = "iframeContainer";
        removeImage.setAttribute("src","images/remove.svg");
        removeImage.id = "removeImage";
        removeButton.append(removeImage);
        iframeContainer.innerHTML = iframeCode;

        iframeContainer.insertBefore(removeButton,iframeContainer.firstChild);
        container.insertBefore(iframeContainer,container.firstChild);

        localStorage.setItem(musicTitle,iframeCode);

        removeButton.addEventListener("click",function(){
            container.removeChild(iframeContainer);
            localStorage.removeItem(musicTitle);
        });
    }

    getEmbeddedPlayer (musicUrl){
        SC.oEmbed(musicUrl, {
            auto_play: false
        }).then(function(embed){
            soundCloudServer.addMusicToPlaylist(embed.html,embed.title);
        });
    }
}


// Code starts execution here

let soundCloudServer = new SoundCloudAPI();
let queryHandler = new Response();

let container = document.querySelector(".js-playlist");
let searchResults = document.querySelector(".js-search-results");

let submitButton = document.querySelector(".js-submit");
let inputArea = document.querySelector(".js-search");

// Adding back the saved songs from local storage to the playlist
for (let i = 0; i<localStorage.length; i++){
    let musicTitle = localStorage.key(i);
    soundCloudServer.addMusicToPlaylist(localStorage.getItem(musicTitle),musicTitle);
}

submitButton.addEventListener("click",function(){
    searchResults.innerHTML = "";
    queryHandler.submitRequest(inputArea.value.trim());
});

inputArea.addEventListener("keyup",function(e) {
    if (e.key === "Enter") {
        searchResults.innerHTML = "";
        queryHandler.submitRequest(inputArea.value.trim());
    }
});






