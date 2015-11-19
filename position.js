
function Position() {
	this.row;
	this.column;
}

function Position_set(r,c) {
	this.row = r;
	this.column = c;
}

function Position_equals(p2) {
	return ( this.row == p2.row && this.column == p2.column );
}

function Position_toString() {
	return "Row: " + this.row + ", Column: " + this.column;
}

Position.prototype.set = Position_set;
Position.prototype.equals = Position_equals;
Position.prototype.toString = Position_toString;