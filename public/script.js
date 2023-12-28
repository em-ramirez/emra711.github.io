// function pause(X) => pause for X milliseconds
function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// function cycleWords() => cycle words
function cycleWords() {
    const words = document.querySelector(".animate-word").children,
    textOutTimer = 2800;
    
    let idx = 0;
    function changeWord() {
        for (let i = 0; i < words.length; i++) {
            words[i].classList.remove("change-word", "change-word2");
        }
        words[idx].classList.add("change-word");
        
        setTimeout(function(){
            words[idx].classList.add("change-word2");
        }, textOutTimer);
        
        idx = idx == words.length - 1 ? 0 : idx + 1;
        
        setTimeout(changeWord, 2500);
    }  
    
    changeWord();
}

// function deleteWord(X) => delete words located at html reference X
async function deleteWord(ref) {
    const sentence = $(ref).text();
    const words = sentence.split(" ");

    // get last word since that corresponds to the name
    const nameLetters = words[words.length - 1].split("");
    words.pop();

    let i = 0;
    while (nameLetters.length > 0) {
        await pause(80);
        nameLetters.pop();
        words.push(nameLetters.join(""))
        $(ref).text(words.join(" "));
        words.pop();
    }
}

// function typeWord(A, B, C) => type word A into html reference B. Remove it based on flag C
async function typeWord(name, ref, remove) {
    await pause(500);
    const letters = name.split("");

    let i = 0;
    while (i < letters.length) {
        await pause(50);
        $(ref).append(letters[i]);
        i++;
    }

    if (remove == true) {
        await pause(1000);
        deleteWord(ref);
    } else {
        await pause(200);
        
        $(document).ready(function () {
            $('.fade-in-wrapper').addClass('fade-in'); 
        });

        if ($('body').is('#index')) {
            cycleWords();
            // not-so-strict check to see if user is on computer vs. phone
            if (screen.orientation.type == 'landscape-primary') {
                document.querySelector("body#index").classList.add("svg");
            }
        }
        return;
    }

    await pause(1000);
    typeWord("Eman", ".home-name", false);
}

const fetchImages = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/images');
        const data = await response.json();

        console.log("dat here:", data)

        renderImages(data);
    } catch(error) {
        console.error('Error retrieving images: ', error);
    }
}

const renderImages = (images) => {
    const imageWrapper = document.getElementById('film-wrapper')

    images.forEach(image => {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.backgroundColor = 'aquamarine';
        wrapperDiv.style.marginTop = '3rem';
        wrapperDiv.style.float = 'left';
        wrapperDiv.style.width = '50%';
        wrapperDiv.style.height = '50%';

        const imgElement = document.createElement('img');
        imgElement.style.objectFit = 'contain';
        imgElement.style.height = '100%';
        imgElement.style.width = '100%';
        imgElement.alt = image.context.custom.alt
        imgElement.src = image.secure_url;

        wrapperDiv.appendChild(imgElement);
        imageWrapper.appendChild(wrapperDiv);
    });
}

$(document).ready(function() {
    if ($('body').is('#index')) {
        typeWord("Hey, I'm Emmanuel", ".home-name", true);
    }
    else if ($('body').is('#resume')) {
        typeWord("Resume", ".home-name", false);
    }
    else if ($('body').is('#film')) {
        typeWord("Film", ".home-name", false);
        fetchImages();
    }
});
  