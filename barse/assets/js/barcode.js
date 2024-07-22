function morseToBar(morse){
    let translator = {
        "-": "dash",
        ".": "dot",
        " ": "space",
    };
    let output = [];
    for (let i = 0; i < morse.length; i++) {
        output.push(translator[morse[i]]);
    }
    return output;
}

function letterToMorse(letter){
    let translator = {
        A: ".- ",
        B: "-... ",
        C: "-.-. ",
        D: "-.. ",
        E: ". ",
        F: "..-. ",
        G: "--. ",
        H: ".... ",
        I: ".. ",
        J: ".--- ",
        K: "-.- ",
        L: ".-.. ",
        M: "-- ",
        N: "-. ",
        O: "--- ",
        P: ".--. ",
        Q: "--.- ",
        R: ".-. ",
        S: "... ",
        T: "- ",
        U: "..- ",
        V: "...- ",
        W: ".-- ",
        X: "-..- ",
        Y: "-.-- ",
        Z: "--.. ",
        1: ".---- ",
        2: "..--- ",
        3: "...-- ",
        4: "....- ",
        5: "..... ",
        6: "-.... ",
        7: "--... ",
        8: "---.. ",
        9: "----. ",
        0: "----- ",
        " ": " ",
    };
    return translator[letter.toUpperCase()];
}

function wordToBarse(word){
    let output = [];
    for (let i = 0; i < word.length; i++) {
        let morse = letterToMorse(word[i]);
        if(morse){
            output.push(morse);
        }
    }
    return output.map(morseToBar);
}

var dash = document.createElement("div");
var dot = document.createElement("div");
var space = document.createElement("div");
dash.className = "dash";
dot.className = "dot";
space.className = "space";
dash.innerHTML = "&nbsp;";
dot.innerHTML = "&nbsp;";
space.innerHTML = "&nbsp;";

function convert(e){
    e.preventDefault();
    let input = document.getElementById("entered_name");
    let output = document.getElementById("output");
    let control = document.getElementById("control");
    let imageModal = document.getElementById("imageModal");
    imageModal.className = "hidden";
    let barse = wordToBarse(input.value);
    let bars = [];
    barse.forEach(symbols => {
        symbols.forEach(symbol => {
            if (symbol == "space"){
                bars.push(space.cloneNode(true));
            }
            if (symbol == "dot"){
                bars.push(dot.cloneNode(true));
            }
            if (symbol == "dash"){
                bars.push(dash.cloneNode(true));
            }
        });
    });
    output.innerHTML = "";
    if (bars.length) {
        let result = document.createElement("div");
        result.className = "result";
        result.innerHTML = "";
        bars.forEach(bar => {
            result.appendChild(bar);
        });
        output.appendChild(result);
        control.className = "";
    } else {
        control.className = "hidden";
    }
}

function saveImage(e){
    e.preventDefault();
    let imageModal = document.getElementById("imageModal");
    let imageHolder = document.getElementById("imageHolder");
    imageHolder.innerHTML = "";
    let output = document.getElementById("output");
    let result = output.querySelector(".result");
    html2canvas(result).then(canvas => {
        imageHolder.appendChild(canvas);
    });
    imageModal.className = "";
}

function hideModal(e){
    e.preventDefault();
    let imageModal = document.getElementById("imageModal");
    imageModal.className = "hidden";
}
