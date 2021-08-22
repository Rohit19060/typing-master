const mainScreen = () => {
    return `
    <div class="results">
       <div id="speed">Speed: 0.0</div>
       <div id="avgSpeed">Avg Speed: 0.0</div>
       <div id="error">Errors: 0</div>
    </div>
        </div>
        <div id="typing-stage"></div>
        <div class="hidden my-2" id="msg">
            <h3>Click again to enable...</h3>
        </div>
        <div class="hide" id="wordDiv">
            Your Input:&nbsp; <span id="wordSpan"></span>
        </div>
    <div>
    <button class="tm-button" id="practice-btn">Practice</button>
    <button class="tm-button" id="setting-btn">Settings</button>
    </div>`;
}

const setting = () => {
    return `<div class="text-center">
                Words Count: <input type="range" id="msgWordCount" value="15" min="1" max="60" step="1">
                <span id="msgWordCountValue">15</span>
            </div>
            <div class="text-center">
                Word Length: <input type="range" id="wordLength" value="5" min="4" max="10" step="1">
                <span id="wordLengthValue">5</span>
            </div>
            <div class="text-center">
                Typing By: <input type="radio" id="char" name="type" checked> Char
                <input type="radio" id="word" name="type"> Word
            </div>
            <div>Blink On/Off <input type="checkbox" id="blinkControl" checked></div>
            <div>Capital Letter <input type="checkbox" id="capControl" checked></div>
            <button class="tm-button" id="done">Done</button>`;
}

const practice = () => {
    return `Practice
     <button class="tm-button" id="done">Done</button>`;
}


const error = () => {
    return `<div>
  <p>Error</p>
  <button id="back">Back</button>
  </div>`;
}

export default {
    mainScreen, error, setting, practice
};
