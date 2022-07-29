// in address bar first letter at index 0 is space i.e. " "

let allcells = document.querySelectorAll(".grid-linings .cells");
let gridlining = document.querySelector(".grid-linings");
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let align = document.querySelector(".align-container");
let alignchildren = align.children;
let fontsizeelem = document.querySelector(".font-size");
let fontfam = document.querySelector(".font-family");
let tc = document.querySelector(".text-colour");
let bgc = document.querySelector(".bg-colour");
let colouring = document.querySelectorAll(".coloured");
let formulacontainer = document.querySelector(".formula-input");
let boldflag = false;
let underlineflag = false;
let italicflag = false;
let sheetarray = [];
let sheetDB;
let add = document.querySelector(".add-sheet-btn");
let sheetlist = document.querySelector(".sheet-list");
let sheetlisteles = document.querySelectorAll(".sheets");


//first of all create the UI left boxes and top columns
let leftcol = document.querySelector(".left-col");
let toprow = document.querySelector(".top-row");
let rows = 100;
for (let i = 0; i < rows; i++) {
    let colbox = document.createElement("div");
    colbox.innerText = i + 1;
    colbox.setAttribute("class", "box");
    leftcol.appendChild(colbox);
}
let cols = 26;
for (let i = 0; i < cols; i++) {
    let cell = document.createElement("div");
    cell.innerText = String.fromCharCode(i + 65);
    cell.setAttribute("class", "cells");
    toprow.appendChild(cell);
}

// creating row and column
for (let i = 0; i < rows; i++) {
    let row = document.createElement("div");
    row.setAttribute("class", "row");
    for (let j = 0; j < cols; j++) {

        let cell = document.createElement("div");
        // cell.innerText = `${String.fromCharCode(j + 65)}${i+1}`;
        cell.setAttribute("class", "cells");
        cell.setAttribute("rid", i + 1);
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("cid", String.fromCharCode(j + 65));
        row.appendChild(cell);
    }
    gridlining.appendChild(row);
}


//come and apply all property to current sheets and make first sheet active
for (let i = 0; i < sheetlisteles.length; i++) {
    addingactiveprop(sheetlisteles[i]);
    addingremoveprop(sheetlisteles[i]);
    createnewsheet();
}
sheetDB = sheetarray[0];
sheetlisteles[0].click();
// console.log(sheetarray.length);

function addingactiveprop(currshet) {

    currshet.addEventListener("click", function() {
        sheetlisteles = document.querySelectorAll(".sheets");
        sheetlisteles.forEach(function(e) {
            e.classList.remove("active");
        })
        currshet.classList.add("active");
        currshet.setAttribute("spellcheck","false");
        let i = currshet.getAttribute("idx");

        sheetDB = sheetarray[i];
        setUi();
    })
}

function addingremoveprop(currsheet) {

    currsheet.addEventListener("dblclick", function() {
        if (sheetarray.length == 1) {
            alert("Single sheet can not be removed");
            return;
        }
        alert("Are you sure, you want to delete the current sheet?");
        //remove the current sheet from sheetarray and from UI
        let idx = sheetarray.indexOf(sheetDB);
        sheetarray.splice(idx, 1);
        currsheet.remove();

        //make first sheet active
        sheetDB = sheetarray[0];
        sheetlisteles[0].click();

        //reassign the index of sheets
        let count = 0;
        sheetlisteles = document.querySelectorAll(".sheets");
        sheetlisteles.forEach(function(e) {
            e.setAttribute("idx", `${count}`);
            count++;
        })

    })

}


//for opening a sheet and display the data
function setUi() {
    allcells = document.querySelectorAll(".grid-linings .cells");
    allcells.forEach(function(e) {
        let ourcell = sheetDB[e.getAttribute("rid") - 1][e.getAttribute("cid").charCodeAt(0) - 65];
        //control inner value
        e.innerText = ourcell.value;
        e.style.fontWeight = ourcell.bold;
        e.style.fontStyle = ourcell.italic;
        e.style.textDecoration = ourcell.underline;
        e.style.textAlign = ourcell.textAlign;
        e.style.fontFamily = ourcell.fontFamily;
        e.style.fontSize = ourcell.fontSize;
        e.style.color = ourcell.tc;
        e.style.backgroundColor = ourcell.bgc;
        e.formula = ourcell.formula;
        e.childrenformulaarr = ourcell.childrenformulaarr;
    })
    allcells[0].click();

}

//for new sheet
function clearUi() {
    allcells = document.querySelectorAll(".grid-linings .cells");
    allcells.forEach(function(e) {
        let ourcell = sheetDB[e.getAttribute("rid") - 1][e.getAttribute("cid").charCodeAt(0) - 65];
        //control inner value
        e.innerText = "";
        ourcell.value = "";
        e.style.fontWeight = "400px";
        ourcell.bold = "400px";
        e.style.fontStyle = "normal";
        ourcell.italic = "normal";
        e.style.textDecoration = "none";
        ourcell.underline = "none";
        e.style.textAlign = "left";
        ourcell.textAlign = "left";
        e.style.fontFamily = "Arial";
        ourcell.fontFamily = "Arial";
        e.style.fontSize = "12px";
        ourcell.fontSize = "12px";
        e.style.color = "black";
        ourcell.tc = "black";
        e.style.backgroundColor = "transparent";
        ourcell.bgc = "transparent";
        e.formula = "";
        ourcell.formula = "";
        e.childrenformulaarr = [];
        ourcell.childrenformulaarr = [];
    })
    allcells[0].click();
}

//add btn will active the new sheet , add all properties and click it to make it active
add.addEventListener("click", function() {
    sheetlisteles = document.querySelectorAll(".sheets");
    let lastsheet = sheetlisteles[sheetlisteles.length - 1];
    let lastidx = Number(lastsheet.getAttribute("idx"));
    //create new sheet btn
    let sheetnum = document.createElement("div");
    sheetnum.setAttribute("class", "sheets");
    sheetnum.setAttribute("contenteditable", "true")
    sheetnum.setAttribute("idx", `${lastidx+1}`);
    sheetnum.innerText = `Sheet${lastidx+2}`;
    sheetlist.appendChild(sheetnum);
    sheetlisteles.forEach(function(e) {
            e.classList.remove("active");
        })
        //make it active
    sheetnum.classList.add("active");
    // create new sheet
    createnewsheet();
    //add all properties
    sheetlisteles = document.querySelectorAll(".sheets");
    addingactiveprop(sheetnum);
    addingremoveprop(sheetnum);

    sheetnum.click();
})

//new sheet will be appended into sheetarray with its formatting
function createnewsheet() {
    //clear add 2d array in a sheetarry
    let newsheet = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            let onecell = {
                bold: "400px",
                italic: "normal",
                underline: "none",
                textAlign: "left",
                fontFamily: "Arial",
                fontSize: "12px",
                tc: "black",
                bgc: "transparent",
                value: "",
                formula: "",
                childrenformulaarr: []
            }
            row.push(onecell);
        }
        newsheet.push(row);
    }
    sheetarray.push(newsheet);
}


//when you click event on a cell in current sheet where sheetDB is pointing in the sheetarray
allcells = document.querySelectorAll(".grid-linings .cells");
allcells.forEach(function(e) {
    e.addEventListener("focus", function() {
        e.style.border = "2px solid blue";
    })
    e.addEventListener("blur", function() {
        e.style.border = "1px solid transparent";
        e.style.borderRight = "1px solid rgb(200, 198, 198)";
        e.style.borderBottom = " 1px solid rgb(202, 201, 201)";
    })
    e.addEventListener("click", function() {

        //add attribute to address bar
        let rowid = e.getAttribute("rid");
        let columnid = e.getAttribute("cid");
        let addbar = document.querySelector(".address-input");
        addbar.value = ` ${columnid}${rowid}`;



        //update the property on that cell
        let ourcell = sheetDB[e.getAttribute("rid") - 1][e.getAttribute("cid").charCodeAt(0) - 65];

        if (ourcell.bold == "400px") {
            bold.classList.remove("active");
        }
        if (ourcell.bold == "bold") {
            bold.classList.add("active"); //glow bold button
        }
        if (ourcell.italic == "normal") {
            italic.classList.remove("active");
        }
        if (ourcell.italic == "italic") {
            italic.classList.add("active"); //glow bold button
        }
        if (ourcell.underline == "none") {
            underline.classList.remove("active");
        }
        if (ourcell.underline == "underline") {
            underline.classList.add("active"); //glow bold button
        }


        //control font size
        for (let i = 0; i < fontsizeelem.children.length; i++) {
            fontsizeelem[i].selected = false;
        }
        for (let i = 0; i < fontsizeelem.children.length; i++) {
            let val = fontsizeelem[i].getAttribute("value");
            if (val + "px" == ourcell.fontSize) {
                fontsizeelem[i].selected = true;
            }
        }

        // control font family
        for (let i = 0; i < fontfam.children.length; i++) {
            fontfam[i].selected = false;
        }
        for (let i = 0; i < fontfam.children.length; i++) {
            let val = fontfam[i].getAttribute("value");
            if (val == ourcell.fontFamily) {
                fontfam[i].selected = true;
            }
        }

        //alignment
        if (ourcell.textAlign != "left") {
            alignchildren[0].classList.remove("active");
        }
        if (ourcell.textAlign != "center") {
            alignchildren[1].classList.remove("active");
        }
        if (ourcell.textAlign != "right") {
            alignchildren[2].classList.remove("active");
        }
        if (ourcell.textAlign != "justify") {
            alignchildren[3].classList.remove("active");
        }
        if (ourcell.textAlign == "left") {
            alignchildren[0].classList.add("active");
        }
        if (ourcell.textAlign == "center") {
            alignchildren[1].classList.add("active");
        }
        if (ourcell.textAlign == "right") {
            alignchildren[2].classList.add("active");
        }
        if (ourcell.textAlign == "justify") {
            alignchildren[3].classList.add("active");
        }


        //updating the formula
        if (ourcell.formula == "") {
            formulacontainer.value = ourcell.value;
        } else if (ourcell.formula != "") {
            formulacontainer.value = ourcell.formula;
        }



    })

})
allcells[0].click();


function addbartocc() {
    let addbar = document.querySelector(".address-input");
    let adbval = addbar.value;
    let num = Number(adbval.substring(2));
    let currentcell = document.querySelector(`.cells[rid = "${num}"][cid = "${adbval[1]}"]`);
    return currentcell;
}
bold.addEventListener("click", function() {
    let currentcell = addbartocc();
    let ourcell = sheetDB[currentcell.getAttribute("rid") - 1][currentcell.getAttribute("cid").charCodeAt(0) - 65];
    if (boldflag == false) {
        currentcell.style.fontWeight = "bold";
        bold.classList.add("active");
        ourcell.bold = "bold"; //update database
    } else {
        currentcell.style.fontWeight = "400px";
        bold.classList.remove("active");
        ourcell.bold = "400px";
    }
    boldflag = !boldflag;
})
italic.addEventListener("click", function() {
    let currentcell = addbartocc();
    let ourcell = sheetDB[currentcell.getAttribute("rid") - 1][currentcell.getAttribute("cid").charCodeAt(0) - 65];
    if (italicflag == false) {
        currentcell.style.fontStyle = "italic";
        italic.classList.add("active");
        ourcell.italic = "italic";
    } else {
        currentcell.style.fontStyle = "normal";
        italic.classList.remove("active");
        ourcell.italic = "normal";
    }
    italicflag = !italicflag;

})
underline.addEventListener("click", function() {
    let currentcell = addbartocc();
    let ourcell = sheetDB[currentcell.getAttribute("rid") - 1][currentcell.getAttribute("cid").charCodeAt(0) - 65];
    if (underlineflag == false) {
        currentcell.style.textDecoration = "underline";
        underline.classList.add("active");
        ourcell.underline = "underline";
    } else {
        currentcell.style.textDecoration = "none";
        underline.classList.remove("active");
        ourcell.underline = "none";
    }
    underlineflag = !underlineflag;

})
for (let i = 0; i < alignchildren.length; i++) {
    alignchildren[i].addEventListener("click", function() {
        console.log(alignchildren.length);
        let workalignele = alignchildren[i].getAttribute("class");
        let workalign = workalignele.split(" ")[1];
        console.log(workalign);
        let cc = addbartocc();
        let ourcell = sheetDB[cc.getAttribute("rid") - 1][cc.getAttribute("cid").charCodeAt(0) - 65];
        cc.style.textAlign = `${workalign}`;

        for (let j = 0; j < alignchildren.length; j++) {
            alignchildren[j].classList.remove("active");
        }
        alignchildren[i].classList.add("active");
        ourcell.textAlign = `${workalign}`;
    })
}
fontsizeelem.addEventListener("change", function() {
    let v = fontsizeelem.value;
    let cc = addbartocc();
    let ourcell = sheetDB[cc.getAttribute("rid") - 1][cc.getAttribute("cid").charCodeAt(0) - 65];
    cc.style.fontSize = v + "px";
    ourcell.fontSize = v + "px";

})
fontfam.addEventListener("change", function() {
    let val = fontfam.value;
    let cc = addbartocc();
    let ourcell = sheetDB[cc.getAttribute("rid") - 1][cc.getAttribute("cid").charCodeAt(0) - 65];
    cc.style.fontFamily = val;
    ourcell.fontFamily = val;
})
colouring[0].addEventListener("click", function() {
    tc.click();
})
colouring[1].addEventListener("click", function() {
    bgc.click();
})
tc.addEventListener("change", function() {
    let val = tc.value;
    let cc = addbartocc();
    let ourcell = sheetDB[cc.getAttribute("rid") - 1][cc.getAttribute("cid").charCodeAt(0) - 65];
    cc.style.color = val;
    ourcell.tc = val;
})
bgc.addEventListener("change", function() {
    let val = bgc.value;
    let cc = addbartocc();
    let ourcell = sheetDB[cc.getAttribute("rid") - 1][cc.getAttribute("cid").charCodeAt(0) - 65];
    cc.style.backgroundColor = `${val}`;
    ourcell.bgc = `${val}`;
})