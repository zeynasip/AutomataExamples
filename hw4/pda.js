"use strict";
function delta(c, p) { // Unary addition
    if (p=='E') return "+T";
    if (p=='T') return "*F";
	if (p=='F') return "n";
    return '#';  //default -- no transition
}
function accept(w, init = 'E') {
    //w: input String
    //init: start symbol
    //S: stack as Array
	let inp = input.value;
    let txt = "P = (" + inp + " , " + init + ")"; 
    let i = 0, m = w.length, S = [init];
    while (i < m) {
        let c = 0, p = S.pop();
        if (c == p) { //input matches stack  
			inp = inp.substr(1);
            i++; 
			S.pop();
			let arr = S.reverse();
			let str = arr.join("");
			txt += "\n⊢ "+ "(" + inp + " , " + str + ")";
        } 
		else { //find a valid transition
            let d = delta(c, p);
            if (d == '#') break;
            let A = d.split('').reverse();
            for (let x of A) S.push(x);
			let arr = S.reverse();
			let str = arr.join("");
            txt += "\n⊢ "+ "(" + inp + " , " + str + ")";
        }
        //txt += "\n⊢ ";
        //for (let j = S.length-1; j >= 0; j--) 
          //txt += S[S.length-1];
    }
	if(i == m && S.length == 0) return txt + " " + "Accept";
	else return txt + " " + "Reject";
	/*let a = (i == m && S.length == 0);
    return txt + '  ' + (a? "Accept" : "Reject");*/
}
function test() {
    let s = accept(input.value);
    console.log(s); 
	out.innerHTML = s;
}