"use strict";
var tok     //current Token
var tokens  //Token.list()
var level = 0
/*let F = Object.getOwnPropertyNames(Math);
let a = F.filter(k => Math[k].length == 1);
function calculate(str, exp) {
	var strng = str;
	var expr = exp;
	return Math[strng](expr);
}*/
function match(k) {
    if (tok.kind == k) 
        tok = tokens.pop();
    else expected(k);
}
function expected(s) {
    error(s+" expected -- "+tok+" found");
}
function error(s) {
    throw ("At index "+tok.index+": "+s);
}
function showError(elt) {
    elt.selectionStart = tok.index;
    elt.selectionEnd = tok.index + tok.length;
    elt.focus(); 
}
class Constant {
   constructor(num) { this.num = num; }
   fValue() { return this.num; }
   toTree(a) { return " ".repeat(a)+this.num+'\n'; }
   toPostfix() { return this.num+' '; }
   toString() { return this.num.toString(); }
}
class Binary {
	constructor(left, oper, right) {
		this.left = left; this.oper = oper; this.right = right;
	}
	fValue() {
		switch (this.oper) {
		  case PLUS:  return this.left.fValue()+this.right.fValue();
		  case MINUS: return this.left.fValue()-this.right.fValue();
		  case STAR:  return this.left.fValue()*this.right.fValue();
		  case POWER: return this.left.fValue()**this.right.fValue();
		  case MOD: return this.left.fValue()%this.right.fValue();
		  case IDENT: return eval("Math." + this.left + "(" + this.right.fValue() + ")");
		  case SLASH: 
			 let v = this.right.fValue();
			 if (v == 0) 
				throw ("Division by zero");
			 return this.left.fValue()/v;
		  default: return NaN;
		}	
   }
	toTree() { 
		switch(this.oper){
			case IDENT: return " ".repeat(++level)+this.oper+'\n'+this.left.toTree(level--);
			default: return " ".repeat(++level)+this.oper+'\n'+this.left.toTree(level)+this.right.toTree(level--);
		}
	}
	   toPostfix() {
		 switch(this.oper){
			case IDENT: return this.right.toPostfix()+this.left+' ';
			default: return this.left.toPostfix()+this.right.toPostfix()+this.oper+' ';
		 }
	   }
	   toString() {
		  return '('+this.left + this.oper + this.right+')'
	   }
	}
	function binary(e) {
		let op = tok.kind; match(op);
		return new Binary(e, op, term());
	}
	function expression() {
		let e = (tok.kind == MINUS)?
		  binary(new Constant(0)) : term();
		while (tok.kind == PLUS || tok.kind == MINUS) 
		  e = binary(e);
		return e;
	}
	function term() {
		let e = factor();
		while (tok.kind == STAR || tok.kind == SLASH || tok.kind == POWER || tok.kind == MOD) {
			let op = tok.kind; match(op);
			e = new Binary(e, op, factor());
		}
		return e;
	}
	function factor() {
		switch (tok.kind)  {
			case NUMBER:
			  let c = tok.val;
			  match(NUMBER);
			  return new Constant(c);
			case LEFT:
			  match(LEFT); 
			  let e = expression();
			  match(RIGHT); 
			  return e;
			case IDENT:
			  let str = tok.val;
			  match(IDENT);
			  match(LEFT);
			  let e1 = expression();
			  match(RIGHT);
			  return new Binary(str, IDENT, e1);
			default: expected("Factor");
		}
		return null;
	}

