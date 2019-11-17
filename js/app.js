let formInput = document.querySelector('#form-search-input');
let content = document.querySelector('.content');
let formButton = document.querySelector('#form-search-btn');
let loadMoreButton = document.querySelector('#form-loadMore-btn');
let formScrollButton = document.querySelector('#form-loadMore-scroll');

let nasaUrl = new URL('https://images-api.nasa.gov/search');
let pictureOfTheDayUrl = new URL ('https://api.nasa.gov/planetary/apod');
let apiKey = `hb1JysnbGsfK6GI9NK8VbbGHMgTNmNdd5RSLDhct`;

function loadPictureOfTheDay() {
    let params = {date: getRandomDate(), api_key: apiKey};
    Object.keys(params).forEach(key => pictureOfTheDayUrl.searchParams.append(key, params[key]));
    fetch(pictureOfTheDayUrl)
        .then(response => response.json())
        .then(json => {
            if(json.msg === "day is out of range for month") {
                loadPictureOfTheDay();
            }
            //console.log(json);
            let hdUrl = json.hdurl;
            content.style.backgroundImage = `url(${hdUrl})`;
            content.innerText = json.explanation;
        })
        .catch(error => console.log(error));
}

loadPictureOfTheDay();

function getRandomDate() {
    let year = Math.floor(Math.random()*(2019+1-2000) + 2000).toString();
    let month = Math.floor(Math.random()*(12+1-1) + 1).toString();
    let day = Math.floor(Math.random()*(31+1-1) + 1).toString();
    let date = `${year}-${month}-${day}`;
    return date;
}

function loadPictures(searchQuery, counter) {
params = {q: formInput.value};
Object.keys(params).forEach(key => nasaUrl.searchParams.append(key, params[key]));
fetch(nasaUrl)
    .then(response => response.json())
    .then(json => {
        console.log(json);
        if(counter === 0) {
            while (content.firstChild) {
                    content.removeChild(content.firstChild);
            }
            let start = 0;
            let end = start + 5;
            insertPicture(filterImges(json.collection.items), start, end);
        }
        else {
            let pictures = document.querySelectorAll('div .picture');
            let start = pictures.length;
            let end = start + 5;
            insertPicture(filterImges(json.collection.items), start, end);
        }
    })
    .catch(error => console.log(error));
}

function insertPicture(picturesArr, start, end) {
    picturesArr.forEach( (picture, index) => {
        if(index >= start && index <= end) {
            let pictureContainer = document.createElement('div');
            let pictureDiv = document.createElement('div');
            let pictureParagraph = document.createElement('p');
            pictureDiv.classList.add('picture');
            pictureDiv.style.backgroundImage = `url(${picture.links[0].href})`;
            pictureDiv.id = index;
            pictureParagraph.innerText = `${picture.data[0].title}`;
            pictureContainer.classList.add('pictureContainer');
            //content.appendChild(pictureDiv);
            //content.appendChild(pictureParagraph)
            pictureContainer.appendChild(pictureDiv);
            pictureContainer.appendChild(pictureParagraph);
            content.appendChild(pictureContainer);
            //console.log(pictureDiv);
        }
    })
}

function filterImges(array) {
    return array.filter(elem => elem.data[0].media_type === 'image')
}

formButton.addEventListener('click', function(e) {
    e.preventDefault();
    content.style.height = '100%';
    formButton.setAttribute('disabled', 'true');
    let search = formInput.value;
    let counter = 0;
    loadPictures(search,counter);
    formButton.removeAttribute('disabled');
    //formInput.value = '';
});

loadMoreButton.addEventListener('click', function (e) {
   e.preventDefault();
   loadMoreButton.setAttribute('disabled', 'true');
   let search = formInput.value;
   let counter = 1;
   loadPictures(search, counter);
   loadMoreButton.removeAttribute('disabled');
});

formScrollButton.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo(0, 0);
});
