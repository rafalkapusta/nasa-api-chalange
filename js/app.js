let formInput = document.querySelector('#form-search-input');
let content = document.querySelector('.content');
let background = document.querySelector('.background');
let explanation = document.querySelector('.explanation');
let pictureTitle = document.querySelector('.title');
let formButton = document.querySelector('#form-search-btn');
let loadMoreButton = document.querySelector('#form-loadMore-btn');
let formScrollButton = document.querySelector('#form-loadMore-scroll');

let counter;

const lightBox = document.querySelector('.lightBox');
const leftArrow = document.createElement('div');
const rightArrow = document.createElement('div');
let lightBoxPicture;

let nasaUrl = new URL('https://images-api.nasa.gov/search');
let pictureOfTheDayUrl = new URL ('https://api.nasa.gov/planetary/apod');
let apiKey = `hb1JysnbGsfK6GI9NK8VbbGHMgTNmNdd5RSLDhct`;


loadMoreButton.style.visibility = 'hidden';
formScrollButton.style.visibility = 'hidden';

function loadPictureOfTheDay() {
    let params = {date: getRandomDate(), api_key: apiKey};
    Object.keys(params).forEach(key => pictureOfTheDayUrl.searchParams.append(key, params[key]));
    fetch(pictureOfTheDayUrl)
        .then(response => response.json())
        .then(json => {
            let hdUrl = json.hdurl;
            background.style.backgroundImage = `url(${hdUrl})`;
            explanation.innerText = json.explanation;
            pictureTitle.innerText = json.title;
        })
        .catch(() => loadPictureOfTheDay());
}

loadPictureOfTheDay();

function getRandomDate() {
    let year = Math.floor(Math.random()*(2019+1-2000) + 2000).toString();
    let month = Math.floor(Math.random()*(12+1-1) + 1).toString();
    let day = Math.floor(Math.random()*(28+1-1) + 1).toString();
    let date = `${year}-${month}-${day}`;
    return date;
}

function loadPictures(searchQuery, counter) {
params = {q: formInput.value};
Object.keys(params).forEach(key => nasaUrl.searchParams.append(key, params[key]));
fetch(nasaUrl)
    .then(response => response.json())
    .then(json => {
        //console.log(json);
        loadMoreButton.style.visibility = 'visible';
        formScrollButton.style.visibility = 'visible';
        if(counter === 0) {
            while (content.firstChild) {
                    content.removeChild(content.firstChild);
            }
            let start = 0;
            let end = start + 5;
            insertPicture(filterImages(json.collection.items), start, end);
        }
        else {
            let pictures = document.querySelectorAll('div .picture');
            let start = pictures.length-1+1;
            let end = start + 5;
            insertPicture(filterImages(json.collection.items), start, end);
        }
    })
    .catch(error => console.log(error));
}

function arrowClick(index) {
    const allPictures = document.querySelectorAll('.picture');
    leftArrow.classList.add('leftArrow');
    rightArrow.classList.add('rightArrow');
    lightBox.classList.add('active');
    /*while(lightBox.firstChild) {
        lightBox.removeChild(lightBox.firstChild)
    }*/
    leftArrow.addEventListener('click', e => {
        while(lightBox.firstChild) {
            lightBox.removeChild(lightBox.firstChild)
        }
        if(index < 1) {
            index = allPictures.length-1;
        } else {
            index--;
        }
        lightBoxPicture = allPictures[index].cloneNode(false);
        lightBox.appendChild(leftArrow);
        lightBox.appendChild(lightBoxPicture);
        lightBox.appendChild(rightArrow);
        //console.log(index)
    });
    rightArrow.addEventListener('click', e => {
        //console.log(index)
        while(lightBox.firstChild) {
            lightBox.removeChild(lightBox.firstChild)
        }
        if(index > allPictures.length-2) {
            index = 0;
        } else {
            index++;
        }
        lightBoxPicture = allPictures[index].cloneNode(false);
        lightBox.appendChild(leftArrow);
        lightBox.appendChild(lightBoxPicture);
        lightBox.appendChild(rightArrow);
        //console.log(index)
    });
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
            pictureContainer.appendChild(pictureDiv);
            pictureContainer.appendChild(pictureParagraph);
            content.appendChild(pictureContainer);
            const allPictures = document.querySelectorAll('.picture');
            pictureContainer.addEventListener('click', e => {
                if(e.target.className === 'picture' ) {
                    //console.log(index, e.target.id, allPictures);
                    while(lightBox.firstChild) {
                        lightBox.removeChild(lightBox.firstChild)
                    }
                    arrowClick(index);
                    lightBoxPicture = allPictures[index].cloneNode(false);
                    lightBox.appendChild(leftArrow);
                    lightBox.appendChild(lightBoxPicture);
                    lightBox.appendChild(rightArrow);
                }
            })
        }
    })
}

lightBox.addEventListener('click', e => {
    if(e.target === e.currentTarget) {
        lightBox.classList.remove('active');
    }
});

function filterImages(array) {
    return array.filter(elem => elem.data[0].media_type === 'image')
}

formButton.addEventListener('click', function(e) {
    e.preventDefault();
    content.style.height = '100%';
    if(formInput.value) {
        formButton.setAttribute('disabled', 'true');
        let search = formInput.value;
        counter = 0;
        loadPictures(search,counter);
        formButton.removeAttribute('disabled');
        //formInput.value = '';
    } else {
        formInput.placeholder = 'search query cannot be empty'
    }
});

loadMoreButton.addEventListener('click', function (e) {
   e.preventDefault();
   loadMoreButton.setAttribute('disabled', 'true');
   let search = formInput.value;
   counter = 1;
   loadPictures(search, counter);
   loadMoreButton.removeAttribute('disabled');
});

formScrollButton.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo(0, 0);
});
