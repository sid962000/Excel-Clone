//feature 1 //Example formula ( A1 + B1 = C1)       ----->    A1=10   B1=20 so C1 becomes 30
// feature 2 // changing this formula to A1=20 so C1 becomes 40
// feature 3 // if any value is updated in the connection then remove the formula on it
let addbar = document.querySelector(".address-input");

for (let i = 0; i < allcells.length; i++) {
    allcells[i].addEventListener("blur", function() {
        let cc = addbartocc(); // A1 and then B1
        let ourcell = sheetDB[cc.getAttribute("rid") - 1][cc.getAttribute("cid").charCodeAt(0) - 65];
        if (ourcell.value == cc.innerText) {
            return;
        }
        if (ourcell.value) {
            let addbar = document.querySelector(".address-input");
            removeformulafromparent(ourcell, addbar); // remove the child from the parent and update the formula attribute in db
            formulacontainer.value = "";
        }
        ourcell.value = cc.innerText; // update value in data base when leaving a cell i.e. A1 and then B1
        updatevalues(ourcell); // passing  A1 and then B1 element
    })
}


formulacontainer.addEventListener("keydown", function(e) {
    if (e.key == "Enter" && formulacontainer.value && formulacontainer.value[0] == "=") { // press enter on formula bar
        let formula = formulacontainer.value; //( A1 + B1 ) 
        let cc = addbartocc(); // A1 and then B1
        let ourcell = sheetDB[cc.getAttribute("rid") - 1][cc.getAttribute("cid").charCodeAt(0) - 65];
        
        // now when you are updating the formula first remove the original formula from db
        // by updating the parent's children array and making the formula attribute empty

        if (formula != ourcell.formula) {
            let addbar = document.querySelector(".address-input");
            removeformulafromparent(ourcell, addbar);
        }

        // console.log(ourcell.formula);
        let evaluatedval = evaluationfunc(formula); // 30
        setvaltocurrentcell(evaluatedval, formula);

        let addbar = document.querySelector(".address-input"); // C1 element
        setchildrenformulaarr(formula, addbar.value.substring(1))

        updatevalues(ourcell); // passing  C1
    }
})

function setvaltocurrentcell(evaluatedval, expression) { // set value and formula to current cell db and ui
    let cc = addbartocc();
    cc.innerText = evaluatedval; //UI

    let ourcell = sheetDB[cc.getAttribute("rid") - 1][cc.getAttribute("cid").charCodeAt(0) - 65];
    ourcell.value = evaluatedval;
    ourcell.formula = expression; //DB
}

function evaluationfunc(formula) { // pass the fomula, it will return calculated value from replacing cells to value
    //so that you can set that value to your cell
    if (formula == "") return;
    formula = formula.substring(1);
    console.log(formula);
    let formulatokens = formula.split(" "); //[(,A1,+,B2,)]
    for (let i = 0; i < formulatokens.length; i++) {
        let ascii = formulatokens[i].charCodeAt(0);
        // console.log(ascii, " ", formulatokens[i]);
        if (ascii >= 65 && ascii <= 90) {
            let num = Number(formulatokens[i].substring(1));
            let cc = document.querySelector(`.cells[rid = "${num}"][cid = "${formulatokens[i][0]}"]`);
            let ourcell = sheetDB[cc.getAttribute("rid") - 1][cc.getAttribute("cid").charCodeAt(0) - 65];
            let value = ourcell.value == "" ? 0 : ourcell.value;
            formulatokens[i] = value;
        }
    }
    let finalformula = formulatokens.join(" ");
    // console.log(finalformula);
    let calcval = eval(finalformula);
    return calcval;
}


function setchildrenformulaarr(formula, childaddress) { //fill the children string in their parent
    let formulatokens = formula.split(" "); // [(,A2,+,B2,)]
    for (let i = 0; i < formulatokens.length; i++) {
        let ascii = formulatokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let num = Number(formulatokens[i].substring(1));
            let cc = document.querySelector(`.cells[rid = "${num}"][cid = "${formulatokens[i][0]}"]`);
            let ourcell = sheetDB[cc.getAttribute("rid") - 1][cc.getAttribute("cid").charCodeAt(0) - 65];
            ourcell.childrenformulaarr.push(childaddress); //  A1.children += C1 
            // B1 .children += C1 in next iteration, jisme if condn chlegi
        }
    }
}

// recursive funtion update all the related formulas
function updatevalues(parentcell) { // parent cell is passed from the db
    let arr = parentcell.childrenformulaarr;
    for (let i = 0; i < arr.length; i++) { // iterate on children array
        //get the element
        let ourcell = sheetDB[arr[i][1] - 1][arr[i][0].charCodeAt(0) - 65]; // children cell in db
        let evaluatedval = evaluationfunc(ourcell.formula); // 30 //children formula
        //update the value in db 
        ourcell.value = evaluatedval;
        //update the value in ui
        let currentcell = document.querySelector(`.cells[rid = "${arr[i][1]}"][cid = "${arr[i][0]}"]`);
        currentcell.innerText = ourcell.value;
        //do same for upcoming children i.e. pass  db children  cell as parent cell
        updatevalues(ourcell);
    }
}

function removeformulafromparent(mycell, address) {
    let myname = address.innerText.substring(1);
    let formula = mycell.formula;
    let formulatokens = formula.split(" ");// ( A1 + B1 ) ==> [(,A1,+,B1,)]
    for (let i = 0; i < formulatokens.length; i++) {
        let ascii = formulatokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let num = Number(formulatokens[i].substring(1));
            let cc = document.querySelector(`.cells[rid = "${num}"][cid = "${formulatokens[i][0]}"]`);
            let ourcell = sheetDB[cc.getAttribute("rid") - 1][cc.getAttribute("cid").charCodeAt(0) - 65];
            ourcell.childrenformulaarr.splice(ourcell.childrenformulaarr.indexOf(myname), 1);
            //first find the index of current cell then remove it
        }
    }
    mycell.formula = ""; //make the formula attribute empty
}