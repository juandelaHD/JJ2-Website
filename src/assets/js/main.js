var sBrowser, sUsrAg = navigator.userAgent;
let parallaxContainer = document.querySelector('.parallax-container');

if (sUsrAg.indexOf("Firefox") > -1) {
    sBrowser = "Firefox";
}

if (sBrowser == "Firefox") {
    parallaxContainer.style.backgroundColor = "#171717";
}

let wallpaperCarousel = document.querySelector('#wallpaper-carousel');
let dotContainer = document.querySelector('#dot-container');

let wallpapers = [];
let wallpaperIndex = 1;

// Get Path to Wallpaper
const webpPath = 'assets/images/webp/1080/';
const jpgPath = 'assets/images/jpg/1080/';
const pngPath = 'assets/images/png/1080/';

// Create Picture Element
const displayWallpaper = (src, alt) => {
    // Parent Element
    let picture = document.createElement('picture');
    picture.className = 'fade';
    // Child Element
    let webpSource = document.createElement('source');
    let jpgSource = document.createElement('source');
    let pngSource = document.createElement('source');
    let image = document.createElement('img');
    // Attribute type
    webpSource.type = 'image/webp';
    jpgSource.type = 'image/jpeg';
    pngSource.type = 'image/png';
    // Attribute srcset
    webpSource.srcset = `${webpPath}${src}.webp`;
    jpgSource.srcset = `${jpgPath}${src}.jpg`;
    pngSource.srcset = `${pngPath}${src}.png`;
    // Attribute img
    image.className = 'img-resize';
    image.src = `${webpPath}${src}.webp`;
    image.alt = alt;
    image.loading = "lazy";
    // Append Child Element
    picture.append(webpSource, jpgSource, pngSource, image);
    // Return Picture Element
    return picture;
}

const displayDot = (wallpaperLength) => {
    let dots = [];
    for (let index = 0; index < wallpaperLength; index++) {
        //Create Dot Element
        let dot = document.createElement('span');
        dot.className = 'dot hover';
        dot.addEventListener('click', () => { currentWallpaper(index + 1); });
        dots.push(dot);
    }
    return dots;
}

for (let index = 1; index <= 7; index++) {
    wallpapers.push(displayWallpaper(`image${index}`, `wallpaper${index}`));
}

wallpaperCarousel.append(...wallpapers);
dotContainer.append(...displayDot(wallpapers.length));

function showWallpapers(index) {
    // let i;
    let wallpapers = document.querySelector('#wallpaper-carousel').children;
    let dots = document.querySelector('#dot-container').children;

    if (index > wallpapers.length) { wallpaperIndex = 1 }
    if (index < 1) { wallpaperIndex = wallpapers.length }

    for (let i = 0; i < wallpapers.length; i++) {
        wallpapers[i].style.display = "none";
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' dot-active', '');
    }

    wallpapers[wallpaperIndex - 1].style.display = "block";
    dots[wallpaperIndex - 1].className += ' dot-active';
}

showWallpapers(wallpaperIndex);

function currentWallpaper(index) {
    showWallpapers(wallpaperIndex = index);
}

function nextWallpaper(index) {
    showWallpapers(wallpaperIndex += index);
}

const videoYoutubeContainer = document.querySelector('#video-youtube-container');

const API = 'https://youtube-v31.p.rapidapi.com/search?channelId=UCZS2K8ZsUmujTuj3cNMyBSA&part=snippet%2Cid&order=date&maxResults=18';

/* Fetching data from YouTube API. */
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '426e606a38msh2632a8b4514886dp176946jsn1ac50e7bfbd4',
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
    }
};

async function fetchData(urlApi) {
    const response = await fetch(urlApi, options);
    const data = await response.json();
    return data;
}

function videoYoutube(thumbnailUrl, title, videoId) {
    // Video Container
    let videoYoutube = document.createElement('div');
    videoYoutube.className = 'video-youtube';

    //Thumbnail Container
    let thumbnailContainer = document.createElement('div');
    thumbnailContainer.className = 'thumbnail-container';

    //Icon Play
    let iconPlay = document.createElement('img');
    iconPlay.src = 'assets/svg/icon-youtube.svg';
    iconPlay.alt = 'play';
    iconPlay.className = 'play-icon';

    //Thumbnail
    let thumbnail = document.createElement('img');
    thumbnail.src = thumbnailUrl;
    thumbnail.alt = title;
    thumbnail.className = 'thumbnail';
    thumbnailContainer.append(iconPlay, thumbnail);

    //Title
    let titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    let h3 = document.createElement('h3');
    let span = document.createElement('span');
    span.textContent = title;
    span.href = `https://www.youtube.com/watch?v=${videoId}`;
    span.target = '_blank';
    span.rel = 'noopener noreferrer';
    h3.append(span);
    titleContainer.append(h3);

    videoYoutube.append(thumbnailContainer, titleContainer);
    return videoYoutube;
}

(async () => {
    try {
        const videos = await fetchData(API);
        const items = videos.items.reverse();
        let videosYoutube = items.map(video => videoYoutube
            (
                video.snippet.thumbnails.medium.url,
                video.snippet.title,
                video.id.videoId
            )
        );
        videoYoutubeContainer.append(...videosYoutube);
    } catch (error) {
        console.error(error);
    }
})()