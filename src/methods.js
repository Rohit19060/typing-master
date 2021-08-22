import $ from "jquery";
import store from "./store";
import "./style.css";
import templates from "./templates";

let curCount;
let blink = true;
let blinkTimer;
let pause = false;
let timer;
let error = 0;
let seconds = 0;
let charArray = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
];
let type = "char";
let pauseSecondsInterval;
let pauseSeconds = 2;
let msgWord;
let msgWordCount = 5;
const symbols = [" ", ",", ".", "Backspace", "Delete", "'", '"']
let wordCount = 0;

const blinkFun = (element) => {
    $(element).removeClass("blink");
    if (blink) {
        if (blinkTimer) {
            clearInterval(blinkTimer);
            blinkTimer = null;
        }
        if (!blinkTimer) {
            blinkTimer = window.setInterval(() => {
                $(element).toggleClass("blink");
            }, 400);
        }
    } else {
        clearInterval(blinkTimer);
    }
};

const addEvents = () => {
    $("main").off();
    switch (store.status()) {
        case "Practice":
            $("#done").on("click", () => {
                console.log("called");
                store.reset();
                render();
            });

            break;
        case "Setting":
            $("#done").on("click", () => {
                store.reset();
                render();
            });
            break;
        case "Error":
            $("main").append(error());
            break;
        default:
            $("#practice-btn").on("click", () => {
                store.practiceMode();
                render();
            });
            $("#setting-btn").on("click", () => {
                store.changeSetting();
                render();
            });
            let stage = $("#typing-stage");
            let msg = $("#msg");
            stage.on("click", () => {
                if (stage.hasClass("disabled")) {
                    stage.removeClass("disabled");
                    msg.addClass("hidden");
                    msg.removeClass("show");
                    const arr = stage.children("span");
                    blinkFun(arr[curCount]);
                } else {
                    msg.removeClass("hidden");
                    msg.addClass("show");
                    stage.addClass("disabled");
                    const arr = stage.children("span");
                    arr[curCount].classList.remove("blink");
                    if (blinkTimer) {
                        clearInterval(blinkTimer);
                        blinkTimer = null;
                    }
                }
            });

            break;
    }
};

const render = () => {
    $("main").html(`<h1 class="text-center mt-3">King's Typing Master</h1>`);
    switch (store.status()) {
        case "Practice":
            $("main").append(templates.practice());
            break;
        case "Setting":
            $("main").append(templates.setting());
            break;
        case "Error":
            $("main").append(templates.error());
            break;
        default:
            $("main").append(templates.mainScreen());
            break;
    }
    addEvents();
};

const shuffle = (array) => {
    let currentIndex = array.length;
    while (0 !== currentIndex) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        let temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

const randomWordGenerator = () => {
    let result = [];
    curCount = 0;
    let res = shuffle(store.words);
    for (let index = 0; index < res.length; index++) {
        if (res[index].includes("a")) {
            result.push(res[index]);
            if (result.length >= msgWordCount) {
                break;
            }
        }
    }
    return result.join(" ");
};

const addSpanToChar = () => {
    let stage = $("#typing-stage");
    randomWordGenerator()
        .split("")
        .forEach((character) => {
            let characterSpan = document.createElement("span");
            if (character == " ") {
                character = "␣";
            }
            characterSpan.innerText = character;
            stage.append(characterSpan);
            if (character == "␣") {
                stage.append(document.createElement("wbr"));
            }
        });
    blinkSpan();
};

const addSpanToWord = () => {
    let stage = $("#typing-stage");
    randomWordGenerator()
        .split(" ")
        .map((e) => {
            let characterSpan = document.createElement("span");
            characterSpan.innerText = e;
            characterSpan.classList.add("word");
            stage.append(characterSpan);
            stage.append(document.createElement("wbr"));
        });
    blinkSpan();
};

const blinkSpan = () => {
    const arr = $("#typing-stage").children("span");
    blinkFun(arr[0]);
};

const keyPressEvent = () => {
    let stage = $("#typing-stage");
    const errorElement = $("#error");
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
        if (!stage.hasClass("disabled")) {
            if (charArray.includes(key) || symbols.includes(key)) {
                const arr = document.getElementById("typing-stage").querySelectorAll("span");
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
                        Array.from(arr).forEach((element) => {
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
                            addSpanToChar();
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
};

export default { render, addSpanToWord, addSpanToChar, keyPressEvent };
