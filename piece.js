
function Piece() {
	this.color = new Color();
	this.position = new Position();
	this.numberOfAdjacentPieces;
	this.removed = false;
	this.set;
}

function Piece_blank() {
	this.color.blank();
	this.removed = true;
	this.numberOfAdjacentPieces = 0;
}

function Piece_getHTML() {
	var a = document.createElement("a");
	a.id = "p" + this.position.row + "" + this.position.column;
	a.className = "piece";
	a.style.backgroundColor = this.color.value;

	if ( this.color.name == "yellow" || this.color.name == "green" )
		a.style.color = "black";
	else 
		a.style.color = "white";
	
	a.onclick = function () { board.remove(this); return false; };
	if ( this.numberOfAdjacentPieces > 0 )
		a.href = "";

//	if ( !this.removed && this.set != undefined )
//		a.innerHTML = this.numberOfAdjacentPieces;
//		a.innerHTML = this.set.cardinality();

	return a;
}

function Piece_assignSet(p2) {
	if ( p2.set != undefined ) {
		if ( this.set == undefined ) {
			this.set = p2.set;
			this.set.add(this);
		} else {
			// union
			var smallerSet;
			if ( this.set.cardinality > p2.set.cardinality )
				smallerSet = p2.set;
			else {
				smallerSet = this.set.clone();
			}
			//alert(this.position.toString());
			this.set.union(p2.set);
			//return smallerSet;
			return p2;
		}
	}
}

function Piece_equals(p2) {
	return this.position.equals(p2.position);
}

Piece.prototype.blank = Piece_blank;
Piece.prototype.equals = Piece_equals;
Piece.prototype.getHTML = Piece_getHTML;
Piece.prototype.assignSet = Piece_assignSet;