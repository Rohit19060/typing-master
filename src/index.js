// Document Constants
const avgSpeed = document.getElementById("avgSpeed");
const blinkInput = document.getElementById("blinkControl");
const capControlInput = document.getElementById("capControl");
const charInput = document.getElementById("char");
const currentWordDiv = document.getElementById("currentWordDiv");
const currentWordInput = document.getElementById("currentWord");
const errorElement = document.getElementById("error");
const main = document.getElementById("main");
const msg = document.getElementById("msg");
const msgWordCounter = document.getElementById("msgWordCount");
const msgWordCounterSpan = document.getElementById("msgWordCountValue");
const speed = document.getElementById("speed");
const wordDiv = document.getElementById("wordDiv");
const wordInput = document.getElementById("word");
const wordLengthInput = document.getElementById("wordLength");
const wordLengthSpan = document.getElementById("wordLengthValue");
const wordSpan = document.getElementById("wordSpan");

// Variables
let blink = true;
let capControl = true;
let curCount;
let currentWord = "a";
let error = 0;
let msgWord;
let msgWordCount = 15;
let pause = false;
let pauseSeconds = 2;
let pauseSecondsInterval;
let seconds = 0;
let speedArray = [];
let timer;
let blinkTimer;
let type = "char";
let word = "";
let wordCount = 0;
let wordLength = 5;

// Utilities
const getLocal = (element) => {
    return localStorage.getItem(element);
};

const setLocal = (element, value) => {
    localStorage.setItem(element, value);
};

const randomFixedInteger = (length) => {
    return Math.floor(
        Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    );
};

const checkLength = () => {
    let fieldLength = currentWordInput.value;
    if (fieldLength.length <= 1) {
        return true;
    } else {
        let str = currentWordInput.value;
        str = str.substring(0, str.length - 1);
        currentWordInput.value = str;
    }
};

const shuffle = (array) => {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

// Working with local Storage to get/set setting values
if (getLocal("currentWord") === null) {
    setLocal("currentWord", "a");
} else {
    currentWord = getLocal("currentWord");
    currentWordInput.value = currentWord;
}
if (getLocal("msgWordCount") === null) {
    setLocal("msgWordCount", 15);
} else {
    msgWordCount = getLocal("msgWordCount");
    msgWordCounter.value = msgWordCount;
    msgWordCounterSpan.innerText = msgWordCount;
}
if (getLocal("wordLength") === null) {
    setLocal("wordLength", 5);
} else {
    wordLength = getLocal("wordLength");
    wordLengthInput.value = wordLength;
    wordLengthSpan.innerText = wordLength;
}
if (getLocal("blink") === null) {
    setLocal("blink", true);
} else {
    blink = getLocal("blink");
    if (blink == "true") {
        blinkInput.checked = true;
        blink = true;
    } else {
        blinkInput.checked = false;
        blink = false;
    }
}

if (getLocal("capControl") === null) {
    setLocal("capControl", true);
} else {
    capControl = getLocal("capControl");
    if (capControl == "true") {
        capControlInput.checked = true;
        capControl = true;
        charArray.push(...capitalCharArray);
    } else {
        capControlInput.checked = false;
        capControl = false;
    }
}
if (getLocal("type") === null) {
    setLocal("type", "char");
} else {
    type = getLocal("type");
    if (type == "char") {
        charInput.checked = true;
        wordInput.checked = false;
        currentWordDiv.classList.remove("hide");
        wordDiv.classList.add("hide");
    } else {
        charInput.checked = false;
        wordInput.checked = true;
        currentWordDiv.classList.add("hide");
        wordDiv.classList.remove("hide");
    }
}

const blinkFun = (element) => {
    element.classList.add("blink");
    if (blink) {
        if (blinkTimer) {
            clearInterval(blinkTimer);
            blinkTimer = null;
        }
        if (!blinkTimer) {
            blinkTimer = window.setInterval(() => {
                element.classList.toggle("blink");
            }, 400);
        }
    } else {
        clearInterval(blinkTimer);
    }
};

blinkInput.addEventListener("change", () => {
    blink = blinkInput.checked;
    setLocal("blink", blink);
    const arr = main.querySelectorAll("span");
    blinkFun(arr[curCount]);
    blinkInput.blur();
});

capControlInput.addEventListener("change", () => {
    capControl = capControlInput.checked;
    if (capControl) {
        charArray.push(...capitalCharArray);
    } else {
        charArray = charArray.filter((el) => !capitalCharArray.includes(el));
        if (currentWord == currentWord.toUpperCase()) {
            currentWord = "a";
            setLocal("currentWord", currentWord);
            currentWordInput.value = currentWord;
            renderNewWords();
        }
    }
    setLocal("capControl", capControl);
    capControlInput.blur();
});

currentWordInput.addEventListener("keyup", () => {
    currentWord = currentWordInput.value;
    currentWord = currentWord.substring(currentWord.length - 1);
    currentWordInput.value = currentWord;
    setLocal("currentWord", currentWord);
    error = 0;
    errorElement.innerHTML = `Errors: ${error}`;
    currentWordInput.blur();
    renderNewWords();
});

msgWordCounter.addEventListener("change", () => {
    msgWordCount = msgWordCounter.value;
    setLocal("msgWordCount", msgWordCount);
    msgWordCounterSpan.innerText = msgWordCount;
    msgWordCounter.blur();
    renderNewWords();
});

wordLengthInput.addEventListener("change", () => {
    wordLength = wordLengthInput.value;
    setLocal("wordLength", wordLength);
    wordLengthSpan.innerText = wordLength;
    wordLengthInput.blur();
    renderNewWords();
});

charInput.addEventListener("change", () => {
    type = "char";
    setLocal("type", "char");
    currentWordDiv.classList.remove("hide");
    wordDiv.classList.add("hide");
    renderNewWords();
});

wordInput.addEventListener("change", () => {
    type = "word";
    setLocal("type", "word");
    currentWordDiv.classList.add("hide");
    wordDiv.classList.remove("hide");
    renderNewWords();
});

window.addEventListener("keydown", (e) => {
    pause = false;
    if (!timer) {
        timer = window.setInterval(() => {
            if (!pause) {
                seconds++;
            }
        }, 200);
    }
    let key = e.key;
    if (!main.classList.contains("disabled")) {
        if (charArray.includes(key) || symbols.includes(key)) {
            const arr = main.querySelectorAll("span");
            if (type === "word") {
                if (e.code === "Backspace") {
                    word = word.slice(0, -1);
                    wordSpan.innerText = word;
                } else if (e.code === "Space") {
                    if (arr[curCount].innerText === word) {
                        arr[curCount].classList.remove("correctWord");
                        arr[curCount].classList.add("correct");
                    } else {
                        arr[curCount].classList.remove("wrongWord");
                        arr[curCount].classList.add("incorrect");
                    }
                    arr[curCount].classList.remove("blink");
                    word = "";
                    wordSpan.innerText = word;
                    wordCount++;
                    msgWord--;
                    if (msgWord <= 1 && timer) {
                        let temp = 300 / seconds;
                        wordCount = wordCount * temp;
                        speedArray.push(parseFloat(wordCount.toFixed(3)));
                        let sum = 0;
                        speedArray.forEach((element) => {
                            sum += element;
                        });
                        let avg = sum / speedArray.length;
                        clearInterval(timer);
                        timer = null;
                        seconds = 0;
                        wordCount = 0;
                        errorElement.innerHTML = `Errors: ${error}`;
                        speed.innerHTML = `Speed: ${avg.toFixed(1)}`;
                    }
                    curCount++;
                    blinkFun(arr[curCount]);
                } else {
                    word = word + key;
                    wordSpan.innerText = word;
                }
                if (e.code !== "Space") {
                    if (arr[curCount].innerText.includes(word)) {
                        if (arr[curCount].classList.contains("wrongWord")) {
                            arr[curCount].classList.remove("wrongWord");
                        }
                    } else {
                        if (!arr[curCount].classList.contains("wrongWord")) {
                            arr[curCount].classList.add("wrongWord");
                        }
                        error++;
                        errorElement.innerText = `Errors: ${error}`;
                    }
                }
                msgWord <= 1 ? renderNewWords() : null;
            } else {
                if (
                    e.key === arr[curCount].innerText ||
                    (e.code === "Space" && arr[curCount].innerText === "␣")
                ) {
                    if (e.code === "Space") {
                        wordCount++;
                        msgWord--;
                        if (msgWord <= 1 && timer) {
                            let temp = 300 / seconds;
                            wordCount = wordCount * temp;
                            speedArray.push(parseFloat(wordCount.toFixed(3)));
                            let sum = 0;
                            speedArray.forEach((element) => {
                                sum += element;
                            });
                            let avg = sum / speedArray.length;
                            errorElement.innerHTML = `Errors: ${error}`;
                            speed.innerHTML = `Speed: ${wordCount.toFixed(1)}`;
                            avgSpeed.innerHTML = `Avg Speed: ${avg.toFixed(1)}`;
                            currentWord = charArray[charArray.indexOf(currentWord) + 1];
                            setLocal("currentWord", currentWord);
                            if (currentWord === undefined) {
                                currentWord = charArray[0];
                                setLocal("currentWord", currentWord);
                            }
                            currentWordInput.value = currentWord;
                            clearInterval(timer);
                            timer = null;
                            seconds = 0;
                            wordCount = 0;
                        }
                    }
                    arr[curCount].classList.add("correct");
                    arr.forEach((element) => {
                        if (element.classList.contains("wrong")) {
                            arr[curCount].classList.remove("correct");
                            element.classList.remove("wrong");
                            element.classList.add("incorrect");
                        }
                    });
                    arr[curCount].classList.remove("blink");
                    curCount++;
                    curCount < arr.length ? blinkFun(arr[curCount]) : null;
                    if (msgWord <= 1) {
                        renderNewWords();
                    }
                } else {
                    arr[curCount].classList.add("wrong");
                    error++;
                    errorElement.innerText = `Errors: ${error}`;
                }
            }
        }
    }
    if (!pauseSecondsInterval) {
        pauseSecondsInterval = window.setInterval(() => {
            pauseSeconds--;
            if (pauseSeconds <= 0) {
                pause = true;
            }
        }, 1000);
    }
});
main.addEventListener("click", () => {
    if (main.classList.contains("disabled")) {
        main.classList.remove("disabled");
        msg.classList.add("hidden");
        msg.classList.remove("show");
        const arr = main.querySelectorAll("span");
        blinkFun(arr[curCount]);
    } else {
        msg.classList.remove("hidden");
        msg.classList.add("show");
        main.classList.add("disabled");
        const arr = main.querySelectorAll("span");
        arr[curCount].classList.remove("blink");
        if (blinkTimer) {
            clearInterval(blinkTimer);
            blinkTimer = null;
        }
    }
});
const renderNewWords = () => {
    curCount = 0;
    const wordsArray = getRandomWords();
    main.innerHTML = "";
    type === "char"
        ? wordsArray.split("").forEach((character) => {
            const characterSpan = document.createElement("span");
            if (character == " ") {
                character = "␣";
            }
            characterSpan.innerText = character;
            main.appendChild(characterSpan);
            if (character == "␣") {
                main.appendChild(document.createElement("wbr"));
            }
        })
        : wordsArray.split(" ").map((e) => {
            const characterSpan = document.createElement("span");
            characterSpan.innerText = e;
            characterSpan.classList.add("word");
            main.appendChild(characterSpan);
            main.appendChild(document.createElement("wbr"));
        });
    const arr = main.querySelectorAll("span");
    blinkFun(arr[0]);
};
const getRandomWords = () => {
    let result = [];
    let res = shuffle(words);
    if (type === "char") {
        if (!isNaN(currentWord * 1)) {
            for (let index = 0; index < msgWordCount; index++) {
                let semaphore = true;
                while (semaphore) {
                    let number = randomFixedInteger(wordLength);
                    let a = number.toString().split("");
                    for (let index = 0; index < a.length; index++) {
                        const element = a[index];
                        if (element == currentWord) {
                            result.push(a.join(""));
                            semaphore = false;
                            break;
                        }
                    }
                }
                if (result.length >= msgWordCount) {
                    break;
                }
            }
        } else if (currentWord == currentWord.toUpperCase()) {
            for (let index = 0; index < res.length; index++) {
                if (
                    res[index].includes(currentWord.toLowerCase()) &&
                    res[index].length == wordLength
                ) {
                    let a = res[index].split("");
                    for (let index = 0; index < a.length; index++) {
                        if (a[index] === currentWord.toLowerCase()) {
                            a[index] = a[index].toUpperCase();
                        }
                    }
                    result.push(a.join(""));
                    if (result.length >= msgWordCount) {
                        break;
                    }
                }
            }
        } else if (currentWord == currentWord.toLowerCase()) {
            for (let index = 0; index < res.length; index++) {
                if (
                    res[index].includes(currentWord) &&
                    res[index].length == wordLength
                ) {
                    result.push(res[index]);
                    if (result.length >= msgWordCount) {
                        break;
                    }
                }
            }
        }
    } else {
        for (let index = 0; index < res.length; index++) {
            if (res[index].length == wordLength) {
                result.push(res[index]);
                if (result.length >= msgWordCount) {
                    break;
                }
            }
        }
    }
    result.push("");
    msgWord = result.length;
    return result.join(" ");
};
renderNewWords();
