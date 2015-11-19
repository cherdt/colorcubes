// A hastily-made and rather sloppy object representing the game board

function Board() {
	this.w = 10;
	this.h = 10;
	this.disjointSets = new Array();
	this.piecesLeft = this.w * this.h;
	this.rows = new Array(this.h);
	for ( var i = 0; i < this.h; i++ )
		this.rows[i] = new Array(this.w);

	// clear existing board
	document.getElementById("game").innerHTML = '';

	for ( var i = 0; i < this.rows.length; i++ )
		for (var j = 0; j < this.rows[i].length; j++ ) {
			var p = new Piece()
			p.position.set(i,j);
			this.rows[i][j] = p;
			document.getElementById("game").appendChild(p.getHTML());
		}
		
	document.getElementById("status").innerHTML = "";
	
}


function Board_draw() {

	// clear all sets
	this.disjointSets = new Array();
	for ( var i = 0; i < this.rows.length; i++ )
		for (var j = 0; j < this.rows[i].length; j++ ) 
			this.rows[i][j].set = undefined;

	this.findAllAdjacent();
	var c1 = 0;
	for ( var x = 0; x < this.disjointSets.length; x++ ) {
		//alert(this.disjointSets[x].cardinality());
		if ( this.disjointSets[x].cardinality() == 1 )
			c1++;
	}
	//alert(this.disjointSets.length + " sets,  " + c1 + " of size 1");
	this.movesLeft();

	for ( var i = 0; i < this.rows.length; i++ )
		for (var j = 0; j < this.rows[i].length; j++ )  {
			var a = document.getElementById("p"+i+""+j);
			a.parentNode.replaceChild( this.rows[i][j].getHTML(), a);
		}
	//alert(this.movesLeft());
	document.getElementById("pieces").innerHTML = "<strong>" + this.piecesLeft + "</strong> pieces remaining";
}


function Board_findAllAdjacent() {
	for ( var i = 0; i < this.rows.length; i++ )
		for (var j = 0; j < this.rows[i].length; j++ )  
			this.findAdjacent(i,j);
}

function Board_findAdjacent(i,j) {
		var adj = 0;
		var p = this.rows[i][j];

		if ( !p.removed ) {

			var c = p.color;
			//check piece above
			if ( i-1 >= 0 && c.name == this.rows[i-1][j].color.name) {
				this.removeFromSet( p.assignSet(this.rows[i-1][j]) );
				//this.disjointSets.splice(index,howmany);
				adj++;
			}
			//check piece right
			if ( j+1 < this.w && c.name == this.rows[i][j+1].color.name) {
				//this.removeFromSet( p.assignSet(this.rows[i][j+1]) );
				adj++;
			}
			//check piece below
			if ( i+1 < this.h && c.name == this.rows[i+1][j].color.name) {
				//this.removeFromSet( p.assignSet(this.rows[i+1][j]) );
				adj++;
			}
			//check piece left
			if ( j-1 >= 0 && c.name == this.rows[i][j-1].color.name) {
				this.removeFromSet( p.assignSet(this.rows[i][j-1]) );
				adj++;
			}


			// If this piece is not yet in a set, put it in one.
			// All pieces much be in a set.
			if ( p.set == undefined ) {
				p.set = new Set();
				p.set.add(p);
				this.disjointSets.push(p.set);
			}

		}
		
		this.rows[i][j].numberOfAdjacentPieces = adj;
		return adj;
}


function Board_swapPieces(p1,p2) {
	var temp = new Piece();

	temp.color.name = p1.color.name;
	temp.color.value = p1.color.value;
	temp.removed = p1.removed;
	
	p1.color.name = p2.color.name;
	p1.color.value = p2.color.value;
	p1.removed = p2.removed;

	p2.color.name = temp.color.name;
	p2.color.value = temp.color.value;
	p2.removed = temp.removed;	

}


function Board_swapAbove(i,j) {
	//you need to go up to find the next non-white piece
	var nonWhitePiece;
	var n = 1;
	while ( nonWhitePiece == null && i-n >= 0 ) {
		if ( this.rows[i-n][j].color.name != "" ) {
			nonWhitePiece = this.rows[i-n][j];
		}
		n++;
	}

	if ( nonWhitePiece != null ) {
		this.swapPieces(this.rows[i][j],nonWhitePiece);
//		this.rows[i][j].color.name = nonWhitePiece.color.name;
//		this.rows[i][j].color.value = nonWhitePiece.color.value;
//		nonWhitePiece.blank();
	}
}


function Board_swapColumns(col1,col2) {
	var tempCol = new Array();
	for ( var i = 0; i < this.h; i++ ) 
		this.swapPieces(this.rows[i][col1],this.rows[i][col2]);
}
	


function Board_rebuild() {
	for ( var i = this.rows.length-1; i >= 0; i-- )
		for (var j = 0; j < this.rows[i].length; j++ ) {
			//trace(i + " " + j + " " + this.rows[i][j].color.name);
			if ( this.rows[i][j].color.name == "" )
				this.swapAbove(i,j);
		}


	trace("collapse blank columns");
	// Collapse blank columns
	for ( var j = 0; j < this.w; j++ ) {
		trace("check blank column " + j);
		if ( this.isColumnEmpty(j) ) {
			// Collapse column
			trace("collapse column " + j);
			// Find the next non-blank column
			var nextColumn;
			var n = j+1;
			while ( n < this.w && this.isColumnEmpty(n) )
				n++;
			// Move it to the current column
			if ( n < this.w ) 
				this.swapColumns(j,n);
		}		
	}
	
	
	// Re-draw the board
	this.draw();
}


function Board_remove(obj) {
	trace("Trying to remove " + obj.id);
	var i = parseInt(obj.id.substring(1,2),10);
	var j = parseInt(obj.id.substring(2,3),10);
	trace("calling " + i + " " + j);
	//alert(this.rows[i][j].set.cardinality());
	// call only if there are adjacent pieces!
//	if ( this.findAdjacent(i,j) > 0 ) {
	if ( this.rows[i][j].numberOfAdjacentPieces > 0 ) {
		this.removeAdjacent(i,j);
		this.rebuild();
	}
}

function Board_removeAdjacent(i,j) {
	var c = this.rows[i][j].color.name;
	trace("C name is now " + c);
	trace("c:"+c + " at " + "["+i+"]" + "["+j+"]");
	this.rows[i][j].blank();
	this.piecesLeft--;
	trace("C name is now " + c);
	if ( c != "" && c != undefined ) {
		//check up
		if ( i-1 >= 0 && c == this.rows[i-1][j].color.name) 
			this.removeAdjacent(i-1,j);
		//check right
		if ( j+1 < this.w && c == this.rows[i][j+1].color.name)
			this.removeAdjacent(i,j+1);
		//check down
		if ( i+1 < this.h && c == this.rows[i+1][j].color.name)
			this.removeAdjacent(i+1,j);
		//check up
		if ( j-1 >= 0 && c == this.rows[i][j-1].color.name)
			this.removeAdjacent(i,j-1);
	}

}


function Board_movesLeft() {
	// ideally, this would count the number of disjoint sets with > 1 members
	// ah, set theory. some other day.

	
	var moves = 0;

	// Iterate over all board pieces and count pieces that have adjacent pieces
/*
	for ( var i = this.rows.length-1; i >= 0; i-- )
		for (var j = 0; j < this.rows[i].length; j++ ) 
			if ( this.rows[i][j].numberOfAdjacentPieces > 0 )
				moves++;
*/

	// Count the number of disjoint sets with more than 1 member (valid moves)
	for ( var i = 0; i < this.disjointSets.length; i++ )
		if ( this.disjointSets[i].cardinality() > 1 )
			moves++;

	document.getElementById("moves").innerHTML = "<strong>" + moves + "</strong> moves available";
				
	if ( moves == 0 )
		document.getElementById("status").innerHTML = '<strong>Game over!</strong> ' + this.getComment() + ' <a href="index.html" onclick="board = new Board(); board.draw(); return false;"><em>Play Again?</em></a>';

	return moves;
}

function Board_isColumnEmpty(j) {
	trace("isColumnEmpty? " + j);
	for ( i = 0; i < this.h; i++ )
		if ( this.rows[i][j].color.name != '' ) {
			trace(i + " " + j + " is not blank");
			return false;
		}
	return true;
}

/* removeFromSet is poorly named, as it only removes if it is given an object to remove */
function Board_removeFromSet(s) {
	if ( typeof s == "object" ) {
		for ( var i = 0; i < this.disjointSets.length; i++ ) 
			if ( this.disjointSets[i].equals(s) ) {
				this.disjointSets.splice(i,1);
				break;
			}
	}
}

/* In the future, this might be based on the actual difficulty of the board? For now, just a flat scale */
function Board_getComment() {
	if ( this.piecesLeft == 0 )
		return "PERFECT GAME!";
	else if ( this.piecesLeft <= 2 )
		return "Excellent work!";
	else if ( this.piecesLeft <=5 )
		return "Well played!"
	else
		return "I bet you can do better.";
}

Board.prototype.findAllAdjacent = Board_findAllAdjacent;
Board.prototype.findAdjacent = Board_findAdjacent;
Board.prototype.remove = Board_remove;
Board.prototype.removeAdjacent = Board_removeAdjacent;
Board.prototype.rebuild = Board_rebuild;
Board.prototype.draw = Board_draw;
Board.prototype.swapPieces = Board_swapPieces;
Board.prototype.swapAbove = Board_swapAbove;
Board.prototype.swapColumns = Board_swapColumns;
Board.prototype.isColumnEmpty = Board_isColumnEmpty;
Board.prototype.removeFromSet = Board_removeFromSet;
Board.prototype.movesLeft = Board_movesLeft;
Board.prototype.getComment = Board_getComment;