const mainFrag = document.querySelector("#mainFrag")
const fragMsg = document.querySelector("#fragMsg")
const speed = document.querySelector("#speed");
const avgSpeed = document.querySelector("#avgSpeed");
const errorsElement = document.querySelector("#errors");
let wordArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
    "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
]
let symbol = [" ", ",", ".", "Backspace", "Delete", "'", '"']
let currentWord = "a";
let curCount;
let msgFragWord;
let seconds = 0;
let msgFragWordCount = 15;
let timer;
let errors = 0;
let wordCount = 0;
let wordLength = 5;
let blink = true;
let pauseSeconds = 2;
let pauseSecondsInterval;
let pause = false;
let type = "char";
let speedArray = []
let word = "";
const range = (val) => {
    let temp2 = `#${val.id}`
    let temp = document.querySelector(temp2).value;
    if (val.id == "blinkControl") {
        let checked = document.querySelector(temp2).checked;
        blink = checked ? true : false;
        const arrFrag = mainFrag.querySelectorAll("span");
        arrFrag.forEach(element => {
            if (element.classList.contains("blinkOn") || element.classList.contains("blinkOff")) {
                element.classList.toggle("blinkOn");
                element.classList.toggle("blinkOff");
            }
        });
    } else {
        switch (val.id) {
            case "currentWord":
                currentWord = temp;
                document.querySelector(temp2).value = currentWord;
                errors = 0
                errorsElement.innerHTML = `Errors: ${errors}`;
                break;
            case "msgFragWordCount":
                msgFragWordCount = temp;
                document.querySelector("#msgFragWordCountValue").innerText = msgFragWordCount;
                break;
            case "wordLength":
                wordLength = temp;
                document.querySelector("#wordLengthValue").innerText = wordLength;
                break;
            case "char":
                type = "char";
                document.querySelector("#currentWordDiv").classList.toggle("hide");
                document.querySelector("#wordDiv").classList.add("hide");
                blink = true
                break
            case "word":
                type = "word";
                document.querySelector("#currentWordDiv").classList.toggle("hide");
                document.querySelector("#wordDiv").classList.remove("hide");
                blink = false
                break
            default:
                break;
        }
        renderNewQuote();
    }
    document.querySelector(temp2).blur();
}

const checkLength = () => {
    let fieldLength = document.getElementById('currentWord').value;
    if (fieldLength.length <= 1) {
        return true;
    } else {
        let str = document.getElementById('currentWord').value;
        str = str.substring(0, str.length - 1);
        document.getElementById('currentWord').value = str;
    }
}

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

    if (!mainFrag.classList.contains("disabled")) {
        if (wordArray.includes(key) || symbol.includes(key)) {
            const arrFrag = mainFrag.querySelectorAll("span");
            if (type === "word") {
                if (e.code === "Backspace") {
                    word = word.slice(0, -1);
                    document.querySelector("#wordSpan").innerText = word;
                } else if (e.code === "Space") {
                    if (arrFrag[curCount].innerText === word) {
                        arrFrag[curCount].classList.remove("correctWord")
                        arrFrag[curCount].classList.add("correct")
                    } else {
                        arrFrag[curCount].classList.remove("wrongWord")
                        arrFrag[curCount].classList.add("incorrect")
                    }
                    arrFrag[curCount].classList.remove("blinkOn");
                    arrFrag[curCount].classList.remove("blinkOff");
                    word = ""
                    document.querySelector("#wordSpan").innerText = word;
                    wordCount++;
                    msgFragWord--;
                    if (msgFragWord <= 1 && timer) {
                        let temp = 300 / seconds;
                        wordCount = wordCount * temp;
                        speedArray.push(parseFloat(wordCount.toFixed(3)))
                        let sum = 0;
                        speedArray.forEach(element => {
                            sum += element;
                        });
                        let avg = sum / speedArray.length;
                        clearInterval(timer);
                        timer = null
                        seconds = 0;
                        wordCount = 0;
                        errorsElement.innerHTML = `Errors: ${errors}`;
                        speed.innerHTML = `Speed: ${avg.toFixed(1)}`;
                    }
                    curCount++;
                    arrFrag[curCount].classList.add("blinkOff");
                } else {
                    word = word + key;
                    document.querySelector("#wordSpan").innerText = word;
                }
                if (e.code !== "Space") {
                    if (arrFrag[curCount].innerText.includes(word)) {
                        if (arrFrag[curCount].classList.contains("wrongWord")) {
                            arrFrag[curCount].classList.remove("wrongWord");
                        }
                    } else {
                        if (!arrFrag[curCount].classList.contains("wrongWord")) {
                            arrFrag[curCount].classList.add("wrongWord");
                        }
                        errors++;
                        document.querySelector("#errors").innerText = `Errors: ${errors}`;
                    }
                }
                msgFragWord <= 1 ? renderNewQuote() : null
            } else {
                if (e.key === arrFrag[curCount].innerText || e.code === "Space" && arrFrag[curCount].innerText === "␣") {
                    if (e.code === "Space") {
                        wordCount++;
                        msgFragWord--;
                        if (msgFragWord <= 1 && timer) {
                            let temp = 300 / seconds;
                            wordCount = wordCount * temp;
                            console.log(wordCount)
                            speedArray.push(parseFloat(wordCount.toFixed(3)))
                            let sum = 0;
                            speedArray.forEach(element => {
                                sum += element;
                            });
                            let avg = sum / speedArray.length;
                            errorsElement.innerHTML = `Errors: ${errors}`;
                            speed.innerHTML = `Speed: ${wordCount.toFixed(1)}`;
                            avgSpeed.innerHTML = `Avg Speed: ${avg.toFixed(1)}`;
                            currentWord = wordArray[wordArray.indexOf(currentWord) + 1]
                            if (currentWord === undefined) {
                                currentWord = wordArray[0];
                            }
                            document.querySelector("#currentWord").value = currentWord;
                            clearInterval(timer);
                            timer = null
                            seconds = 0;
                            wordCount = 0;
                        }
                    }
                    arrFrag[curCount].classList.add("correct");
                    arrFrag.forEach(element => {
                        if (element.classList.contains("wrong")) {
                            arrFrag[curCount].classList.remove("correct");
                            element.classList.remove("wrong")
                            element.classList.add("incorrect")
                        }
                    });
                    arrFrag[curCount].classList.remove("blinkOn");
                    arrFrag[curCount].classList.remove("blinkOff");
                    curCount++;
                    curCount < arrFrag.length ? blink ? arrFrag[curCount].classList.add("blinkOn") : arrFrag[curCount].classList.add("blinkOff") : null
                    if (msgFragWord <= 1) {
                        renderNewQuote()
                    }
                } else {
                    arrFrag[curCount].classList.add("wrong");
                    errors++;
                    document.querySelector("#errors").innerText = `Errors: ${errors}`;
                }
            }

        }
    }
    if (!pauseSecondsInterval) {
        pauseSecondsInterval = window.setInterval(() => {
            pauseSeconds--;
            if (pauseSeconds <= 0) {
                pause = true
            }
        }, 1000);
    }
})

mainFrag.addEventListener("click", () => {
    if (mainFrag.classList.contains("disabled")) {
        mainFrag.classList.remove("disabled");
        fragMsg.classList.add("hidden");
        fragMsg.classList.remove("show");
    } else {
        fragMsg.classList.remove("hidden");
        fragMsg.classList.add("show");
        mainFrag.classList.add("disabled");
    }
})

const shuffle = (array) => {
    let currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

const renderNewQuote = () => {
    curCount = 0;
    const quote = getRandomQuote();
    mainFrag.innerHTML = ""
    type === "char" ?
        quote.split("").forEach(character => {
            const characterSpan = document.createElement("span");
            if (character == " ") {
                character = "␣";
            }
            characterSpan.innerText = character
            mainFrag.appendChild(characterSpan);
            if (character == "␣") {
                mainFrag.appendChild(document.createElement("wbr"));
            }
        }) :
        quote.split(" ").map((e) => {
            const characterSpan = document.createElement("span");
            characterSpan.innerText = e;
            characterSpan.classList.add("word");
            mainFrag.appendChild(characterSpan);
            mainFrag.appendChild(document.createElement("wbr"));
        });
    const arrFrag = mainFrag.querySelectorAll("span");
    blink ? arrFrag[0].classList.add("blinkOn") : arrFrag[0].classList.add("blinkOff");
}

const getRandomQuote = () => {
    let words = ["article", "auxuliary", "abbey", "able", "about", "above", "absence", "absurd", "abuse", "accent", "acceptance", "accessoria", "accord", "account",
        "accountant", "accounting", "accusation", "accused", "achilles", "acid", "action", "activity", "actual", "acuminata", "added", "addition", "address",
        "adenoidea", "adjusted", "admiral", "admiralty", "adopt", "adorable", "advance", "advantage", "advice", "advised", "advisory", "aegis", "aemia", "affairs",
        "aforementioned", "aforethought", "africa", "african", "after", "again", "against", "aged", "agency", "agent", "ages", "agog", "agreement", "ahead",
        "aircraft", "airplane", "aisle", "alata", "albatross", "albicollis", "alcohol", "algebra", "alike", "alisation", "alise", "alised", "aliser", "alism",
        "alization", "alize", "alized", "alizer", "alley", "ally", "almighty", "alms", "alone", "along", "aloud", "alphabet", "altaic", "always", "america",
        "american", "americanise", "americanize", "among", "amount", "ampere", "analysis", "anchor", "ancients", "anemone", "angina", "angle", "animal", "animals",
        "anniversary", "annunciation", "another", "antarctic", "antipodes", "anything", "apart", "apartment", "aphasia", "apocalypse", "apparatus", "apparel",
        "apple", "appointed", "apron", "aquatica", "arab", "arafat", "arch", "architecture", "arctic", "area", "arena", "argument", "armada", "armed", "arms",
        "army", "around", "arsenic", "article", "arts", "ascension", "ascent", "ascum", "aside", "asoka", "aspen", "assignment", "assistant", "association",
        "aster", "atim", "attached", "attorney", "attrition", "audit", "auspices", "australia", "austrian", "authorized", "avail", "avant", "averages", "avesta",
        "aviv", "avoidance", "awake", "away", "axle", "ayes", "baby", "back", "backlash", "baggage", "balance", "balanced", "ball", "balloon", "band", "bandage",
        "bane", "bang", "bangles", "bank", "banner", "barn", "barred", "barrel", "barrier", "base", "based", "basil", "basin", "basket", "bated", "bath", "battery",
        "battle", "beam", "beaming", "bean", "bear", "bearer", "beast", "beat", "beaten", "beater", "beaumont", "beautiful", "become", "becomes", "bedded", "beded",
        "bedroom", "beer", "beetle", "before", "begetting", "begging", "begin", "begrudge", "behaved", "behind", "being", "belief", "believe", "bell", "bellied",
        "belongings", "belt", "bench", "benefit", "bengal", "bequest", "berlin", "berliner", "berry", "best", "bestower", "betide", "better", "betting", "between",
        "bewilderment", "bike", "bill", "bird", "birth", "biscuit", "biting", "bits", "bitter", "black", "blade", "blake", "blanket", "blazer", "blende", "blessed",
        "bligh", "blight", "blind", "blindness", "blister", "block", "blood", "blooded", "blooming", "blotched", "blower", "blown", "blue", "boar", "board",
        "boards", "boat", "body", "boggles", "bola", "bolt", "bolts", "bomb", "bond", "bone", "book", "boot", "booth", "boots", "born", "borne", "both", "bottle",
        "bottom", "bound", "bowl", "boxwood", "bracelet", "bradford", "branch", "branched", "brandt", "brass", "bread", "breadth", "break", "breaker", "breakfast",
        "breaks", "breasted", "breath", "bred", "brevis", "brew", "bride", "bridge", "brief", "brigade", "britain", "broke", "bronze", "broom", "broth", "brother",
        "brown", "browser", "bubble", "buck", "bucket", "buckwheat", "buddhism", "buddhist", "buffalo", "built", "bump", "bunting", "buoy", "buoyant", "burden",
        "bureau", "burgundy", "burma", "burn", "burroughs", "burst", "business", "butler", "butt", "combiningform", "conjunction", "cabbage", "cadmium", "cake",
        "calf", "call", "camera", "camp", "campaign", "candidate", "canister", "cannon", "cant", "capacity", "capital", "caraway", "card", "care", "cares", "carnal",
        "carpet", "carrier", "cart", "case", "cask", "cassete", "cassette", "cast", "caste", "cats", "caused", "cava", "caxton", "cease", "cedar", "celebration",
        "cell", "cellar", "center", "centre", "cephalica", "ceremony", "certain", "chadic", "chain", "chair", "chairman", "challenged", "chamber", "chambre",
        "chamomile", "chance", "chancellor", "chandler", "charm", "chart", "chase", "chaser", "chasing", "cheek", "cheer", "cheese", "cherry", "chest", "chestnut",
        "chevrotain", "child", "childrens", "chill", "chime", "chinensis", "chips", "chisel", "chocolate", "chosen", "chromosome", "church", "churchill", "chute",
        "cinnamon", "circle", "circulation", "circumstances", "citium", "city", "civil", "civilization", "claim", "clark", "clary", "class", "clean", "cleaner",
        "cleaning", "clinton", "clock", "closed", "closet", "cloth", "clothes", "cloud", "clover", "club", "coal", "coast", "coat", "coated", "cobra", "cockles",
        "code", "colitis", "collar", "collects", "college", "collins", "color", "colored", "colorist", "colour", "coloured", "colourist", "colours", "column",
        "comb", "come", "comes", "coming", "comitans", "command", "commander", "commission", "commissions", "committee", "committees", "communication", "company",
        "compensation", "competence", "competing", "complex", "complexion", "concern", "concession", "conduct", "conducted", "cone", "conference", "confidence",
        "connected", "conqueror", "conscience", "conservation", "considered", "consonant", "constitution", "construction", "control", "cooled", "cooler", "copier",
        "copy", "cord", "cords", "corpuscle", "correspondent", "cost", "cotton", "cough", "could", "council", "counted", "counter", "country", "coupon", "court",
        "cover", "craigie", "cramp", "cranberry", "crane", "crater", "crayon", "cream", "creeper", "crime", "criminal", "crookes", "cross", "crossing", "crowned", "crusade", "crystal", "crystallisation",
        "crystallization", "cultural", "culture", "cultures", "cure", "curse", "customer", "cuthbert", "cutter", "cyanide", "cycle", "cylinders", "cypress", "determiner", "danddeterminer", "dale", "damage",
        "damned", "damnedest", "damocles", "dance", "danger", "dark", "date", "daub", "daughter", "days", "dead", "deaf", "deafness", "deal", "dealer", "dealing", "death", "decencies", "decision", "deck",
        "decker", "deductible", "deed", "deep", "deer", "defect", "deferens", "deficiency", "deficit", "defined", "deflection", "degree", "degrees", "deity", "delegate", "delicious", "delight",
        "demeanour", "democratic", "democrats", "demon", "demur", "departed", "department", "depends", "depressor", "derosius", "dervish", "desk", "destitute", "destruction", "determination", "determiner",
        "detriment", "deuce", "devas", "developed", "development", "devil", "devoted", "diagram", "dichromacy", "dicoccoides", "dicoccum", "dictionary", "did", "diet", "difference", "diffrent",
        "digitizing", "dimension", "dimensional", "dimensionality", "dimentional", "dine", "diplomatic", "dipper", "direction", "directory", "dirt", "dirty", "disadvantaged", "disc", "discharge", "discount",
        "discretion", "disdain", "disease", "diseases", "dishevelled", "disney", "disorder", "dispatch", "dispatcher", "dispersed", "display", "disposed", "dispossessed", "distance", "distraction",
        "distributed", "district", "disturbance", "ditch", "diver", "divider", "division", "doctor", "does", "doing", "doing", "dollar", "dome", "domitianus", "done", "donor", "dont", "doomsday", "door",
        "doubt", "dove", "down", "downs", "draw", "drawer", "drawing", "dream", "drench", "dress", "dressed", "dresser", "dressing", "drier", "drink", "drive", "driver", "drop", "drops", "drug", "drum",
        "dryer", "duality", "duck", "duckling", "ducks", "duct", "dummy", "dump", "dust", "duty", "dying", "dynasty", "dyou", "eagle", "eagled", "early", "earned", "earner", "earning", "ears", "earshot",
        "earth", "ease", "east", "easterly", "eastern", "eastward", "eastwards", "easy", "eaten", "eating", "echioides", "echo", "eclipse", "economy", "edge", "edged", "edges", "edition", "editor",
        "educate", "educated", "education		", "education", "educational", "eduction", "eelworm", "effacing", "effect", "effects", "effort", "effortless", "efforts", "eggs", "egypt", "eight", "eithties",
        "ejaculation", "elbow", "elder", "elderly", "elea", "elect", "election", "electric", "electricity", "electron", "element", "elephant", "ellison", "else", "embargo", "embrace", "emerald",
        "emerge", "emergency", "eminence", "eminent", "eminently", "emirates", "emissary", "emission", "emmer", "empire", "emplacement", "employed", "employement", "empt", "emption", "emptive",
        "enaca", "endowed", "ends", "enemies", "energy", "engine", "engined", "engineer", "england", "english", "engraving", "enjoyment", "enjoys", "enough", "enter", "enterprise", "entery", "entry",
        "envelope", "envelops", "envy", "epilepsy", "equation", "equinox", "equipment", "equitorial", "eradication", "error", "eruption", "escape", "establihed", "established", "estate", "esteem",
        "estimate", "eternal", "european", "evasion", "evening", "event", "events", "ever", "everta", "every", "evidence", "evident", "evil", "evils", "evolution", "exam", "examination", "examine",
        "excepted", "exception", "exchange", "exclusion", "executive", "exempt", "exercise", "exertion", "exist", "existence", "existent", "existing", "exmamination", "expense", "explain", "explanatory",
        "exploration", "explosion", "explosive", "exposure", "expression", "extent", "extract", "extremes", "eyebrows", "eyed", "eyes", "fabric", "face", "faced", "facility", "fact", "factory", "facts",
        "fail", "faint", "fair", "fairer", "faithful", "faithfully", "falkner", "fall", "fallen", "falls", "fame", "family", "famous", "fancy", "fare", "farm", "farmer", "farming", "fast", "fastener",
        "fate", "father", "fathers", "faucet", "faulkner", "fault", "favored", "favoured", "favourite", "feather", "fechner", "federal", "feet", "fellow",
        "female", "feminine", "fence", "fern", "festival", "festval", "fever", "fiber", "fibres]", "fidelity", "field", "fight", "figure", "file", "filter", "final", "finch", "finder", "fine", "finer",
        "finger",
        "fingers", "fingertips", "finly", "fire", "fireman", "firma", "first", "fish", "fisted", "five", "fixed", "flag", "flame", "flap", "flase", "flashpoint", "flask", "flatter", "flavius", "flea",
        "flesh", "flicker", "flies", "flight", "floor", "floribunda", "flour", "flow", "flower", "flowered", "flowering", "flown", "fluid", "flush", "flute", "flycatcher", "flying", "foil", "fold", "follow",
        "fondle", "food", "fool", "fooled", "foot", "football", "footed", "for", "force", "forces", "forecast", "forecaster", "forecasting", "foregoing", "foreign", "forelock", "forest", "forget",
        "fork", "form", "formed", "former", "forties", "forum", "found", "foundation", "founded", "fountain", "four", "fourth", "fowl", "fraction", "frame", "frazzle", "free", "freedom", "freeze",
        "french", "frequency", "fret", "friar", "friendly", "fright", "fringe", "frog", "froing", "from", "front", "frontier", "fronts", "fruit", "fruti", "frutti", "fulbright", "full", "fund", "funeral",
        "fungus", "funny", "furred", "further", "fuzz", "gage", "gallery", "game", "games", "gamma", "gander", "ganga", "ganges", "garde", "garden", "garlic", "gastric", "gate", "gates", "gathering",
        "gauge", "gauntlet", "gear", "geek", "gender", "gene", "general", "generalisation", "generally", "generation", "generator", "genetic", "genus", "geoffrey", "george", "geranium", "gereral", "germ",
        "germany", "gets", "getting", "ghost", "gibe", "gift", "gilt", "ginger", "gingerbread", "girl", "give", "given", "gives", "gladius", "gladstone", "gland", "glass", "glasses", "gloves", "gluten",
        "goat", "goats", "goby", "goddess", "godess", "godhead", "goer", "goes", "gogh", "going", "gold", "golden", "good", "goodness", "goods", "goose", "gospels", "gourd", "governing", "government",
        "gown",
        "grab", "grace", "graciousness", "gradation", "grade", "graft", "grain", "grained", "granadilla", "grand", "grandis", "grandmother", "grant", "granted", "grapes", "grapevine", "grass", "grave",
        "graveolens", "gravity", "gray", "graze", "grease", "great", "greek", "green", "greener", "greenhouse", "greens", "greetings", "gregorian", "grey", "grimm", "grip", "gritty", "groom", "groomed",
        "ground", "grounded", "group", "groups", "growing", "guard", "guess", "guest", "guide", "guilt", "guinea", "gulf", "gull", "guns", "guts", "gutter", "hades", "hair", "haired", "half", "halfpenny",
        "hall", "hammer", "hand", "handed", "handicapped", "hands", "hanging", "hangs", "happy", "hard", "harm", "harp", "harrison", "harvest", "harvey", "hatch", "hater", "have", "haven", "haves", "having",
        "havoc", "hawk", "hazard", "hazel", "head", "headed", "heads", "health", "heart", "hearted", "hearts", "heat", "heater", "heaven", "heavens", "heavy", "heel", "heeled", "heels", "heisenberg",
        "hell", "helm", "help", "hemiazygos", "hemisphere", "hemlock", "henry", "herd", "here", "here", "hereafter", "heterophyllum", "hide", "high", "higher", "highland", "highway", "hike",
        "hill", "hilt", "hind", "hindmost", "hindrance", "hindu", "hint", "historic", "hitch", "hoffman", "hold", "holder", "holding", "hole", "holies", "holiness", "hollyhock", "holy", "homage", "home",
        "homer", "honey", "honeysuckle", "honor", "honored", "honour", "honoured", "hoover", "hope", "horizon", "horned", "hornets", "horns", "horripilated", "horse", "hortensis", "hostel", "hostelling",
        "hounoured", "hour", "hours", "house", "houses", "howard", "hugger", "hugo", "human", "humble", "humor", "humour", "hunger", "hungry", "hunt", "hunter", "hurt", "husband", "hyacinth", "hyde",
        "hydrangea", "hydration", "hymns", "hypertension", "interjection", "interrogative", "iage", "iceberg", "icing", "idea", "identification", "identity", "illness", "illumination", "illusion", "image",
        "imagination", "imitation", "immediate", "immemorial", "immorality", "impaired", "impairment", "imperfect", "implement", "importance", "important", "imposed", "impossible",
        "impression", "inch", "incharge", "inchenumon", "incinerate", "income", "increase", "increment", "independence", "index", "india", "indian", "indians", "indica", "indicative", "indicator",
        "indicum", "indies", "indigo", "individual", "indonesia", "indra", "indulgence", "indulgent", "industrial", "industry", "infant", "infection", "infectious", "infective", "infinite", "infinitive",
        "infirm",
        "inflicted", "influence", "informed", "initiated", "injury", "inland", "inner", "innumerable", "inout", "insane", "insect", "inside", "insoluble", "inspector", "instinct", "institute", "institution",
        "instrument", "insurance", "insured", "integrifolium", "intelligence", "intensely", "intentioned", "intentions", "intents", "interaction", "intercourse", "interest", "interested",
        "interesting", "interface", "interference", "interjection", "internal", "international", "intervention", "into", "introduce", "invention", "inverse", "investigation", "investigator",
        "investment", "involved", "involvement", "ireland", "iris", "iron", "irving", "island", "islands", "isle", "isles", "israel", "issue", "iswas", "itch", "itself", "jack", "jacket", "jain", "james",
        "jamesii", "jane", "jasmine", "jazz", "jefferson", "jelly", "jerk", "jerker", "jerks", "jessamine", "jesus", "jewel", "jobless", "jobs", "john", "johns", "join", "joint", "joke", "joker", "jokes",
        "joking", "joneses", "journalism", "journey", "jubilee", "judge", "judgement", "judgment", "judice", "judicial", "judiciary", "judy", "juggler", "juice", "juliana", "july", "jumbo", "jump", "jumpd",
        "jumped",
        "jumper", "jumpiness", "jumping", "jumpy", "junction", "juncture", "june", "jungle", "junior", "juniper", "junk", "junket", "junketting", "junkie", "junta", "jupiter", "juridical", "jurisdiction",
        "jurisdictional", "jurisprudence", "jurist", "juror", "jury", "just", "justful", "justice", "justifiable", "justifiably", "justification", "justified", "justifier", "justifies", "justify", "justly",
        "justness", "jute", "juvenile", "juvenility", "juxtapose", "juxtaposition", "kali", "kangaroo", "karl", "kebab", "keel", "keen", "keep", "keeper", "keeping", "keeps", "keith", "kellog",
        "kellogg", "kept", "kettle", "khayyam", "kiang", "kibosh", "kill", "killer", "killing", "kilometer", "kind", "kindly", "kindness", "king", "kingdom", "kings", "kiosk", "kippur", "kiss",
        "kitchen", "klan", "klux", "knee", "kneed", "knees", "knife", "knight", "knit", "knives", "knobs", "knock", "knockabout", "knockdown", "knocked", "knocker", "knocking", "knockout", "knoll", "knot",
        "knots", "knotty", "know", "know", "knowing", "knowingly", "knowledgable", "knowledge", "knowledge;", "knowledgeable", "known", "knows", "knuckle", "knuckleduster", "koala", "kohl", "kohlrabi",
        "koichiro", "komodo", "komodoensis", "konrad", "kook", "kookaburra", "kooky", "kopeck", "koran", "koranic", "korchnoi", "korea", "korean", "kosher", "kowtwo", "kraut", "kremlin", "krill", "krishana",
        "krishna", "krona", "krypton", "kuber", "kudos", "kumbha", "kumiss", "kumquat", "kung", "kungfu", "kurt", "kuwait", "kwacha", "kwai", "kwashiorkor", "kybosh", "labor", "laboratory", "labour",
        "laced", "lady", "laevis", "lake", "lakes", "lakshmi", "lamp", "lamps", "land", "lane", "language", "lanier", "lapse", "large", "lashing", "last", "latin", "launger", "lawyer", "lazy", "lead",
        "leading", "leaf", "leafs", "league", "learn", "least", "leather", "leave", "leaved", "leaves", "ledge", "leek", "left", "legged", "legs", "lemon", "length", "lens", "less", "lesser", "letter",
        "leucophrys", "level", "liability", "libber", "liberal", "liberation", "liberationist", "licence", "license", "lick", "licorice", "lien", "lies", "lieutenant", "life", "lift", "light", "lighted",
        "lighting", "lightning", "lights", "like", "likely", "likes", "liking", "lily", "limb", "lime", "limit", "limited", "limits", "line", "lined", "linen", "ling", "linguistics", "linked", "lions",
        "lipped", "liquid", "liquorice", "lira", "list", "literature", "litigation", "little", "live", "livelong", "liven", "livered", "living", "lizard", "loading", "loaf", "local", "lock", "lodging",
        "long", "look", "loose", "lord", "lords", "lordsthe", "lorry", "lose", "lost", "lounge", "lounger", "love", "loved", "lovely", "lover", "loving", "lower", "luck", "luck", "lucky", "lump", "lunatic",
        "lung", "lying", "machine", "made", "magazine", "magic", "magistrate", "magnolia", "maheshshanker", "maidenhair", "mail", "main", "maire", "major", "majority", "make", "makepeace", "maker",
        "makes", "making", "malaysia", "malice", "mallow", "mammoth", "manage", "manager", "manchester", "mandrake", "mango", "manlike", "manner", "mannered", "manners", "mans", "many", "march", "mare",
        "marie", "marine", "marjoram", "mark", "marked", "market", "marks", "marmot", "marrow", "martini", "mary", "mask", "mass", "master", "match", "matched", "material", "maternal", "mathematics",
        "matrix", "matter", "matters", "maugham", "mays", "mccoy", "mckinley", "meadow", "meal", "mean", "meaning", "means", "meant", "measure", "measures", "meat", "mechanics", "mecum", "media",
        "medicine", "meditation", "medium", "meek", "meet", "meeting", "meets", "melon", "member", "membrane", "memeory", "memories", "memory", "merchant", "mercy", "merrier", "metal", "meteorological",
        "meter", "method", "metric", "metropolitan", "mexican", "mice", "mickey", "middle", "midland", "midnight", "migratorius", "mildly", "mile", "milk", "milky", "mill", "million", "mills", "mind",
        "minded", "mined", "minor", "mint", "minute", "miracles", "mirror", "miss", "missing", "mistaking", "mistress", "mite", "mobile", "mobility", "model", "modulus", "moment", "monday", "money",
        "monitoring", "monkey", "monley", "montenegro", "month", "monument", "mood", "moon", "moral", "more", "morning", "morris", "mortar", "moss", "most", "moth", "mothers", "motion", "motor", "motu",
        "mountains", "mounted", "moustache", "mouth", "move", "movement", "much", "mugwort", "mulberry", "mullein", "murder", "muriaria", "muscle", "mushroom", "music", "must", "mustache", "mustard",
        "nail", "naked", "namaz", "name", "namibia", "napkin", "narrow", "nasty", "national", "nations", "natural", "nature", "naval", "navy", "near", "nearby", "nearest", "nearly", "neat", "neck",
        "necked", "necking", "necklace", "needle", "needles", "neglect", "negociating", "negotiating", "nerve", "nerves", "ness", "nest", "netting", "nettle", "network", "neurosis", "never", "news",
        "newspaper", "newt", "next", "nicaragua", "nicety", "nick", "nickname", "nigh", "night", "nigra", "nigrum", "nile", "nilly", "nine", "nineteen", "ninety", "nipple", "nitty", "none", "nonscripta",
        "nonsense", "nonsticker", "norm", "normal", "north", "northern", "northwest", "nose", "nosed", "notch", "note", "nothing", "nothings", "notice", "nourished", "nowhere", "nuisance", "number",
        "numbers", "numeral", "nuncio", "nurse", "nursemaid", "nursery", "nurseryman", "nursing", "nursury", "nurture", "nurtured", "nutcase", "nutcracker", "nutcrackers", "nuthatch", "nutmeg", "nutrient",
        "nutrition", "nutritional", "nutritionally", "nutritionist", "nutritious", "nutritive", "nuts", "nutshell", "nutter", "nuttily", "nutty", "nutural", "nuzzle", "nyanza", "nyasaland", "nyctalopia",
        "nylon", "nymph", "nymphet", "nympho", "nymphomania", "nymphomaniac", "oath", "oats", "object", "obseus", "obtain", "occasion", "occassion", "occult", "ocean", "octagon", "odds", "odoratissima",
        "offender", "offensive", "offer", "offering", "office", "officer", "offices", "official", "officinalis", "often", "ogle", "oiled", "oils", "oily", "ointment", "olatry", "older", "oleracea",
        "olive", "olymipic", "olympic", "olympics", "omelet", "onca", "once", "ones", "oneself", "onion", "only", "onto", "onup", "ooard", "open", "opened", "opener", "opera", "operater", "operation",
        "operative", "opinion", "opinionated", "opportunity", "option", "opulence", "orange", "oration", "orchid", "ordeal", "order", "ordered", "orders", "ordinary", "ordination", "ordnance", "organ",
        "organic", "organisation", "organiser", "organization", "organizer", "organs", "oriented", "orifice", "origin", "orthodox", "osely", "oseness", "osity", "ostentation", "ostwald", "oten", "other",
        "others", "othr", "outcrop", "outdoors", "outlet", "outline", "outlook", "outrageous", "outs", "ouzel", "ovation", "over", "overthrough", "owen", "owner", "ownership", "oxford", "oxide",
        "oxygenise", "oxygenize", "oxymoron", "oyster", "ozawa", "ozone", "phrasal", "phrase", "proanddeterminer", "pack", "packed", "packet", "page", "pages", "pain", "paint", "painter", "painting",
        "pakistan", "palace", "paleontology", "palm", "pane", "panel", "pansy", "pants", "paper", "paperer", "papers", "park", "parsley", "parsnip", "part", "particle", "parting", "party", "passage",
        "past", "paste", "patch", "path", "pattern", "pauses", "payment", "peace", "peach", "peak", "peanut", "peddle", "pelican", "pellucida", "penality", "pence", "penny", "pentoxide", "people",
        "pepper", "percept", "perception", "perfect", "perfection", "period", "permit", "person", "persons", "peso", "pharyngealis", "philosophy", "photograph", "phrase", "piano", "picture", "piece",
        "pieces", "pigeon", "pile", "pill", "pine", "pipe", "pistol", "pitch", "pitcher", "place", "plague", "plan", "plane", "plank", "planks", "planning", "plant", "plantain", "plate", "platform",
        "play", "player", "playing", "please", "pleasure", "plenty", "plough", "ploughshare", "ploughshares", "plug", "plum", "pneumonia", "pocket", "podocarp", "poem", "point", "points", "pole", "police",
        "policy", "pollution", "polo", "pony", "pool", "poplar", "poppy", "pore", "port", "porter", "position", "possession", "possessions", "post", "poster", "potato", "powder", "power", "precinct",
        "precise", "prejudice", "premiere", "present", "preservation", "preserved", "presidency", "president", "presidential", "press", "pressure", "pretences", "pretty", "prevent", "prevention", "price",
        "principle", "printer", "prism", "process", "processing", "procession", "processor", "product", "professor", "profit", "program", "programme", "progress", "project", "promise", "proof",
        "propeller", "property", "proportioned", "prostitute", "protection", "protest", "protoytpe", "provoking", "public", "pudding", "puller", "pulp", "pump", "pumpkin", "pure", "purpose", "purposes",
        "purpura", "push", "pussy", "qualified", "quantity", "quarter", "quaver", "quavering", "quavery", "quay", "quayage", "quayside", "queasily", "queasiness", "queasy", "quechua", "queen", "queenlike",
        "queenly", "queens", "queer", "queerly", "queerness", "quell", "quench", "quercus", "querier", "quern", "querulous", "querulously", "querulousness", "query", "quest", "quester", "question",
        "questionable", "questionably", "questioner", "questioning", "questioningly", "questionnaire", "quet", "queue", "queue_up", "quibble", "quiche", "quick", "quicken", "quickening", "quickie",
        "quicklime", "quickly", "quickness", "quicksand", "quicksilver", "quickstep", "quicky", "quid", "quiddity", "quids", "quiescence", "quiescency", "quiescent", "quiet", "quieten", "quietism",
        "quietist", "quietly", "quietness", "quietude", "quiety", "quiff", "quiffy", "quill", "quilt", "quilted", "quilting", "quince", "quincentenary", "quincentennial", "quinine", "quinquenial",
        "quintastic", "quintessence", "quintessential", "quintessentially", "quintet", "quintette", "quintillion", "quintuple", "quintuplet", "quip", "quirk", "quirkiness", "quirky", "quiscent",
        "quisling", "quit", "quite", "quits", "quittance", "quitter", "quiver", "quivering", "quixotic", "quiz", "quizmaster", "quizzer", "quizzical", "quizzically", "quoit", "quoits", "quorum", "quota",
        "quotable", "quotation", "quote", "quoted", "quoteunquote", "quotha", "quothe", "quotidian", "quotient", "quran", "reflexivepro", "relativepro", "rabbit", "rabble", "race", "rack", "racket",
        "rackets", "racquet", "racquets", "radar", "radiation", "radio", "radiocommunication", "rage", "rail", "rain", "raiser", "raleigh", "rama", "ramrod", "range", "ranging", "rank", "ranking",
        "rankle", "rape", "rarebit", "rate", "rated", "rather", "ratherthan", "ravages", "raving", "rays", "reach", "reactor", "read", "reading", "ready", "real", "realise", "reality", "reap", "reason",
        "rebirth", "receiving", "reception", "recession", "recite", "record", "recorder", "recorderplayer", "recording", "redeemer", "reference", "reflection", "regard", "regent", "region", "regional",
        "regulator", "regulatoryprocedural", "rehabilitation", "related", "relation", "relationship", "relativity", "relief", "religion", "remain", "removed", "renowned", "repellent", "repens",
        "representation", "representative", "representatives", "republic", "republics", "repulican", "request", "research", "researched", "reserve", "resistance", "resistant", "respect", "rest",
        "restraint", "return", "revenue", "revised", "revolution", "rhinoceros", "rhodesia", "rhyme", "ribbon", "ribbons", "rice", "rich", "richard", "richter", "ridden", "ride", "ridiculous", "right",
        "right", "rightist", "rights", "ring", "rink", "ripe", "rise", "rites", "river", "road", "roaring", "roast", "robin", "rock", "rocket", "rocks", "roentgen", "rogers", "role", "roll", "roller",
        "rolling", "roman", "romans", "rome", "rontgen", "roof", "rooftops", "room", "root", "rope", "ropes", "rosa", "rose", "rosemary", "roses", "rotary", "rough", "round", "roundabouts", "rounded",
        "route", "royal", "ruck", "ruffled", "rufus", "rugosa", "rule", "rules", "running", "rupee", "russia", "russian", "rust", "ruthlessly", "saccharata", "sacred", "sacrifice", "sage", "sahara",
        "said", "said", "sail", "salad", "salamander", "sale", "salt", "same", "sandalwood", "sandwich", "sapphire", "satellite", "sauce", "saxon", "says", "scale", "scandal", "scented", "schedule",
        "school", "science", "scientific", "scooter", "scorpion", "scott", "scratch", "screen", "season", "seat", "seater", "second", "secretariat", "secretary", "security", "seeded", "seen", "sense",
        "separatism", "separatist", "sepulcher", "sepulchre", "serbia", "sergeon", "series", "serum", "service", "setter", "setting", "settled", "seven", "sexual", "shade", "shaft", "shafted",
        "shakespeare", "shaking", "shape", "shaped", "shark", "shattering", "shaven", "shavings", "she", "sheep", "sheet", "sheik", "sheikh", "shell", "shift", "shilling", "ship", "shiva", "shockley",
        "shoe", "shooter", "shooting", "shop", "shopping", "short", "should", "shove", "show", "shut", "side", "sided", "sight", "sign", "signal", "silica", "silicate", "silk", "sill", "site", "sitted",
        "situated", "skater", "sketch", "skiing", "skin", "slate", "slave", "slaver", "sleep", "sleeve", "slow", "small", "smallpox", "smelling", "smut", "snake", "snapdragon", "snapper", "socialist",
        "sock", "socket", "soda", "softener", "softner", "soil", "soldier", "solstice", "soluble", "someones", "somerset", "something", "soul", "souled", "sound", "soup", "sour", "southwest", "soviet",
        "space", "spacing", "spade", "span", "spaniel", "spanish", "sparrow", "spectrum", "spider", "spinach", "spinning", "spirit", "splitting", "spoke", "spoken", "spoon", "sport", "sports", "spot",
        "spout", "spring", "sprite", "spurs", "square", "squire", "stacked", "stage", "stand", "stapler", "star", "starters", "state", "states", "station", "statist", "statistics", "steam", "steel",
        "stemmed", "step", "steward", "stick", "sticks", "stitch", "stock", "stoma", "stomach", "stop", "stoppage", "storage", "store", "stork", "strap", "streaked", "street", "stress", "strider",
        "strike", "striking", "string", "strings", "strip", "stripped", "stripping", "struck", "structure", "student", "study", "style", "styron", "succession", "sugar", "suit", "sulfate", "sulfide",
        "sulphate", "summit", "sunday", "sunflower", "supply", "supremacist", "supremacy", "surface", "surfer", "surgeon", "surgeondoctor", "surgery", "surrounding", "suspicion", "swallow", "swan",
        "sweet", "swords", "sydney", "symptom", "syndrome", "system", "table", "tables", "taft", "tail", "tailed", "takes", "talk", "talkie", "talky", "tall", "tamarind", "tamil", "tank", "tanzania",
        "tapping", "task", "taster", "taylor", "tear", "teasel", "telegraph", "telegraphy", "telephone", "tell", "telling", "temporal;", "tent", "tereshkova", "term", "terms", "terrestrial", "terrier",
        "test", "thackeray", "than", "thanks", "thapsus", "that", "theater", "theatre", "their", "them", "theory", "there", "there", "theres", "thermodynamics", "they", "thin", "thing", "things",
        "thinker", "thinking", "thirds", "this", "thistle", "thompson", "thought", "throated", "through", "thrush", "thumb", "thumbed", "thyme", "tick", "tightrope", "till", "time", "timed", "timer",
        "times", "timing", "tindale", "tipped", "tire", "tissue", "toast", "tobacco", "toed", "tolerance", "tone", "toned", "tongue", "tooth", "torn", "toss", "tour", "towards", "tower", "trade",
        "traffic", "trail", "train", "training", "transmission", "trash", "travel", "traveler", "tree", "tricolor", "tried", "trimmer", "tritici", "trodden", "trojan", "trousers", "truck", "truly",
        "trust", "tumor", "tunnel", "turbine", "turk", "turn", "turned", "turnip", "turnout", "twigs", "twist", "twisted", "twister", "twisting", "twisty", "twit", "twitch", "twitching", "twitter",
        "twitterati", "twixt", "twnety", "twofer", "twofold", "twopence", "twopenny", "twos", "twoscore", "twosome", "tycoon", "tying", "tyke", "tylenchus", "tympanist", "tyndale", "type", "typecast",
        "typeface", "typescript", "typeset", "typesetter", "typesetting", "typewrite", "typewriter", "typewriting", "typewritten", "typhoid", "typhoon", "typhus", "typical", "typically", "typify", "typing",
        "typist", "typo", "typographer", "typographic", "typographical", "typographically", "typography", "typology", "tyrannic", "tyrannical", "tyrannicide", "tyrannized", "tyrannosaur",
        "tyrannosaurus", "tyrannous", "tyranny", "tyrant", "tyre", "tyro", "tzar", "tzarina", "tzetze", "under", "understaffed", "unit", "united", "university", "upon", "upper", "uppercase", "uppermost",
        "uppish", "uppity", "upraise", "upright", "uprightness", "uprise", "uprising", "upriver", "uproar", "uproarious", "uproariously", "uproot", "uprooted", "uprooting", "upscale", "upset", "upsetter",
        "upsetting", "upshot", "upside", "upskill", "upslope", "upstage", "upstager", "upstairs", "upstanding", "upstart", "upstate", "upstream", "upstroke", "upsurge", "upswing", "uptake", "upthrust",
        "uptight", "uptown", "upturn", "upturned", "upward", "upwardly", "upwards", "upwind", "uraemia", "uraemic", "ural", "uralic", "urals", "uranalysis", "urania", "uranium", "uranius", "uranologist",
        "uranology", "uranoplasty", "uranus", "urban", "urbane", "urbanely", "urbanisation", "urbanise", "urbanised", "urbanity", "urbanization", "urbanize", "urbanized", "urchin", "urdu", "urea",
        "uremia", "uremic", "ureter", "urethra", "urethral", "urethritis", "urge", "urged", "urgency", "urgent", "urgently", "urges", "urging", "urinal", "urinalysis", "urinary", "urinate", "urine",
        "urocystis", "urogenital", "uroxicide", "urubu", "uruguayan", "usability", "usable", "usableness", "usacil", "usaf", "usage", "usance", "usbeg", "usbek", "usda", "useable", "useableness", "used",
        "useful", "usefully", "usefulness", "useless", "uselessly", "uselessness", "user", "usher", "usherette", "ussr", "usual", "usually", "usufruct", "usurer", "usurp", "usurpation", "usurper", "usury",
        "usward", "utensil", "utensils", "uterine", "uterus", "utile", "utilisation", "utilise", "utilitarian", "utilitarianism", "utility", "utilization", "utilize", "utmost", "utopia", "utopian",
        "utopianism", "utter", "utterance", "utterer", "utterly", "uttermost", "utterness", "uvula", "uvular", "uvulitis", "uxorial", "uzbak", "uzbeg", "uzbek", "uzbekistan", "vane", "vanilla", "vapor",
        "vapour", "vascular", "vehicle", "vengeance", "vent", "versed", "vessel", "view", "vine", "vinegar", "virus", "vise", "vitamin", "vitriol", "voice", "volant", "volar", "volary", "volatile",
        "volatilisable", "volatilise", "volatilised", "volatility", "volatilizable", "volatilize", "volatilized", "volcanic", "volcanically", "volcanism", "volcano", "volcanology", "vole", "volga",
        "volgograd", "volition", "volitional", "volitionally", "volley", "volleyball", "volt", "volta", "voltage", "voltaic", "voltaire", "voltarean", "voltarian", "volte", "voltmeter", "volubility",
        "voluble", "volubly", "volume", "volumeter", "volumetric", "volumetrical", "volumetrically", "voluminosity", "voluminous", "voluminously", "voluminousness", "voluntarily", "voluntary", "volunteer",
        "voluptuary", "voluptuous", "voluptuously", "voluptuousness", "volute", "voluted", "volution", "volva", "vomer", "vomit", "vomiter", "vomiting", "vomitive", "vomitory", "vomitus", "voodoo",
        "voodooism", "voracious", "voraciously", "voraciousness", "voracity", "vortex", "votary", "vote", "voted", "voteless", "voter", "voting", "votive", "vouch", "vouchee", "voucher", "vouchsafe",
        "vouge", "voussoir", "vowel", "vowelise", "vowelised", "vowelize", "vowelized", "vowelled", "vowellike", "vower", "voyage", "voyageable", "voyager", "voyages", "voyeur", "voyeurism", "voyeuristic",
        "voyeuristical", "voyeuristically", "vulcan", "vulcanisation", "vulcanise", "vulcanised", "vulcaniser", "vulcanite", "vulcanization", "vulcanize", "vulcanized", "vulcanizer", "vulcanology",
        "vulgar", "vulgarian", "vulgarisation", "vulgarise", "vulgariser", "vulgarism", "vulgarity", "vulgarization", "vulgarize", "vulgarizer", "vulgarly", "vulgar~fraction", "vulgate", "vulnerability",
        "vulnerable", "vulnerably", "vulpecular", "vulphine", "vulpine", "vulture", "vultures", "vulturine", "vulturous", "vulva", "vulval", "vullet", "vulviform", "vulvitis", "vying", "wait", "watch",
        "water", "welcome", "well", "what", "white", "wish", "with", "woman", "worker", "would", "woven", "wrack", "wraith", "wraithlike", "wrangle", "wrangler", "wrangling", "wrap", "wraparound",
        "wrapped", "wrapper", "wrapping", "wrasse", "wrath", "wrathful", "wrathfully", "wrawl", "wreak", "wreath", "wreathe", "wreathed", "wreck", "wreckage", "wrecked", "wrecker", "wrecking", "wren",
        "wrench", "wrenched", "wrenching", "wrest", "wrester", "wrestle", "wrestler", "wrestling", "wretch", "wretched", "wretchedly", "wretchedness", "wrick", "wriggle", "wriggler", "wriggling",
        "wriggly", "wright", "wring", "wringer", "wringing", "wrinkle", "wrinkled", "wrinkleless", "wrinkleproof", "wrinkles", "wrinkly", "wrist", "wristband", "wristwatch", "writ", "write", "writer",
        "writers", "writhe", "writhed", "writhen", "writhing", "writing", "writings", "written", "wrold", "wrong", "wrongdoer", "wrongdoing", "wrongful", "wrongfully", "wrongfulness", "wrongheaded",
        "wrongheadedly", "wrongheadedness", "wrongly", "wrongness", "wrote", "wroth", "wrothful", "wrought", "wryly", "wryneck", "wtpf", "wuss", "wwii", "wwwituint", "wych", "wycherley", "wycliffe",
        "wysiwyg", "xanax", "xanthalin", "xanthate", "xanthein", "xanthelasma", "xanthic", "xanthine", "xanthinuria", "xanthoderm", "xanthoderma", "xanthodont", "xanthodontous", "xanthoma",
        "xanthomatosis", "xanthopathy", "xanthophyl", "xanthophyll", "xanthopia", "xanthopsia", "xanthosis", "xanthous", "xanthuria", "xcii", "xciii", "xciv", "xcvi", "xcvii", "xcviii", "xenagogy",
        "xenarthral", "xenia", "xenial", "xenium", "xenodochium", "xenodochy", "xenogamy", "xenogeneic", "xenogenesis", "xenograft", "xenolith", "xenomania", "xenomaniac", "xenomorph", "xenomorphic",
        "xenon", "xenophanes", "xenophobe", "xenophobia", "xenotransplant", "xenotransplantation", "xeransis", "xerantic", "xerasia", "xeric", "xerochastic", "xerocollyrium", "xeroderma", "xerodermia",
        "xerographic", "xerography", "xeroma", "xeromy", "xerophagy", "xerophile", "xerophilous", "xerophthalmia", "xerophthalmus", "xerophyte", "xerophytic", "xerophytism", "xeroradiography", "xerosis",
        "xerostomia", "xerotes", "xerotic", "xerotripsis", "xerox", "xerxes", "xhosa", "xiii", "xiphias", "xiphioid", "xiphoid", "xlii", "xliii", "xliv", "xlvi", "xlvii", "xlviii", "xmas", "xvii", "xviii",
        "xylanthrax", "xyle", "xylem", "xylene", "xylocaine", "xylocarp", "xylocrap", "xylograph", "xylographer", "xylographic", "xylographical", "xylography", "xylol", "xylology", "xylophone",
        "xylophonist", "xylose", "xyster", "xystus", "yardstick", "yare", "yarn", "yarrow", "yashmac", "yashmak", "yasser", "yataghan", "yatch", "yaup", "yawl", "yawn", "yawner", "yawning", "yawp", "yaws",
        "yeah", "year", "yearbook", "yearling", "yearlong", "yearly", "yearn", "yearned", "yearner", "yearning", "yearningly", "years", "yeast", "yeastlike", "yeasty", "yeats", "yeatsian", "yede", "yell",
        "yelled", "yeller", "yelling", "yellow", "yellowbelly", "yellowed", "yellowhammer", "yellowish", "yellowness", "yellowsapphire", "yellowy", "yelp", "yelping", "yenisei", "yenisey", "yeoman",
        "yeomanry", "yerk", "yesterday", "yesteryear", "yeti", "yiddish", "yield", "yielder", "yielding", "yieldingly", "yisrael", "ymca", "yobbo", "yobo", "yodel", "yodeling", "yodeller", "yoga",
        "yogacara", "yoghourt", "yoghurt", "yogi", "yogic", "yogistic", "yogurt", "yoicks", "yoke", "yokel", "yokelish", "yokohama", "yolk", "yonder", "yore", "york", "yorkshire", "youll", "young",
        "youngage", "younger", "youngest", "youngish", "youngness", "youngs", "youngster", "younker", "your", "youre", "yours", "yourself", "youth", "youthful", "youthfully", "youthfulness", "youve",
        "yowl", "yttrium", "yuan", "yucca", "yucky", "yugoslavia", "yule", "yuletide", "yummy", "yuppie", "yuppy", "ywca", "zealotry", "zealous", "zealously", "zebra", "zebu", "zedoary", "zedonk",
        "zeitgeist", "zend", "zenith", "zenithal", "zeno", "zeolite", "zephyr", "zeppelin", "zeppo", "zero", "zeroth", "zest", "zestful", "zestfully", "zestfulness", "zestily", "zesty", "zetland", "zeus",
        "ziggurat", "zigzag", "zikkurat", "zikurat", "zilch", "zill", "zillion", "zimbabwe", "zimbabwean", "zimmer", "zinc", "zinciferous", "zincification", "zincify", "zincite", "zincky", "zincograph",
        "zincographer", "zincographic", "zincographical", "zincography", "zincoid", "zincous", "zine", "zing", "zingaro", "zinger", "zingy", "zinnia", "zinsser", "zinzendorf", "zion", "zionism", "zionist",
        "zipper", "zippo", "zippy", "zircon", "zirconium", "zither", "zithern", "ziti", "zizania", "zoanthropy", "zodiac", "zodiacal", "zoftig", "zoiatria", "zoisite", "zola", "zolaesque", "zolaism",
        "zollinger", "zombi", "zombie", "zona", "zonal", "zonary", "zone", "zoning", "zonk", "zonked", "zonotrichia", "zonula", "zonule", "zooarchaeology", "zoobiology", "zoochemical", "zoochemistry",
        "zoochemy", "zoochlorella", "zoochore", "zoochorous", "zoochory", "zooerastia", "zooerasty", "zoogamous", "zoogamy", "zoogenic", "zoogeny", "zoogeographer", "zoogeographic", "zoogeographical",
        "zoogeographically", "zoogeography", "zoogony", "zoographer", "zoographic", "zoographist", "zoography", "zooid", "zoolatry", "zoolite", "zoolith", "zoological", "zoologist", "zoology", "zoom",
        "zoomancy", "zoomania", "zoometry", "zoomorphic", "zoomorphism", "zoon", "zoonic", "zoonite", "zoonomia", "zoonomy", "zoonosis", "zoonotic", "zooparasite", "zooparasitic", "zoopathology",
        "zoopathy", "zooperal", "zoopery", "zoophagous", "zoophilia", "zoophilism", "zoophobia", "zoophorous", "zoophyte", "zooplankton", "zooplastic", "zooplasty", "zoopsia", "zoopsychology", "zooscopy",
        "zoosperm", "zoospore", "zootaxy", "zootechnical", "zootechnician", "zootechnics", "zootechny", "zootheism", "zootheist", "zootic", "zootomic", "zootomical", "zootomist", "zootomy", "zootoxin",
        "zoozoo", "zopilote", "zorastrain", "zori", "zoroaster", "zoroastrian", "zoroastrianism", "zoster", "zucchini", "zulu", "zumba", "zygodactyl", "zygodactylic", "zygodactylous", "zygogenesis",
        "zygogenetic", "zygoma", "zygomatic", "zygomorphic", "zygomorphism", "zygomorphous", "zygosis", "zygosity", "zygospore", "zygote", "zygotic", "zygotically", "zylonite", "zymase", "zyme",
        "zymetologic", "zymetologist", "zymetology", "zymogen", "zymogenic", "zymogenous", "zymoid", "zymologic", "zymologist", "zymology", "zymolysis", "zymolytic", "zymome", "zymometer", "zymoscope",
        "zymosimeter", "zymosis", "zymotechmy", "zymotechnics", "zymotic", "zymurgy", "zythumzythum"]
    let result = []
    let res = shuffle(words)
    if (type === "char") {
        if (!isNaN(currentWord * 1)) {
            for (let index = 0; index < msgFragWordCount; index++) {
                let semaphore = true;
                while (semaphore) {
                    let number = randomFixedInteger(wordLength)
                    let a = number.toString().split("");
                    for (let index = 0; index < a.length; index++) {
                        const element = a[index];
                        if (element == currentWord) {
                            result.push(a.join(""))
                            semaphore = false;
                            break
                        }
                    }
                }
                if (result.length >= msgFragWordCount) {
                    break;
                }
            }
        } else if (currentWord == currentWord.toUpperCase()) {
            for (let index = 0; index < res.length; index++) {
                if (res[index].includes(currentWord.toLowerCase()) && res[index].length == wordLength) {
                    let a = res[index].split("");
                    for (let index = 0; index < a.length; index++) {
                        if (a[index] === currentWord.toLowerCase()) {
                            a[index] = a[index].toUpperCase();
                        }
                    }
                    result.push(a.join(""))
                    if (result.length >= msgFragWordCount) {
                        break;
                    }
                }
            }
        } else if (currentWord == currentWord.toLowerCase()) {
            for (let index = 0; index < res.length; index++) {
                if (res[index].includes(currentWord) && res[index].length == wordLength) {
                    result.push(res[index])
                    if (result.length >= msgFragWordCount) {
                        break;
                    }
                }
            }
        }
    } else {
        for (let index = 0; index < res.length; index++) {
            if (res[index].length == wordLength) {
                result.push(res[index])
                if (result.length >= msgFragWordCount) {
                    break;
                }
            }
        }
    }
    result.push("");
    msgFragWord = result.length;
    return result.join(" ")
}

const randomFixedInteger = (length) => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
}


renderNewQuote()