/*global
    Color, Position, board
*/

function Piece() {
    'use strict';
    this.color = new Color();
    this.position = new Position();
    this.numberOfAdjacentPieces = 0;
    this.removed = false;
    this.set = null;
}

function Piece_blank() {
    'use strict';
    this.color.blank();
    this.removed = true;
    this.numberOfAdjacentPieces = 0;
}

function Piece_getHTML() {
    'use strict';
    var a = document.createElement("a");
    a.id = "p" + this.position.row + "" + this.position.column;
    a.className = "piece";
    a.style.backgroundColor = this.color.value;

    if (this.color.name === "yellow" || this.color.name === "green") {
        a.style.color = "black";
    } else {
        a.style.color = "white";
    }

    a.onclick = function () {
        board.remove(this);
        return false;
    };

    if (this.numberOfAdjacentPieces > 0) {
        a.href = "";
    }

    //if (!this.removed && this.set !== undefined) {
        //a.innerHTML = this.numberOfAdjacentPieces;
        //a.innerHTML = this.set.cardinality();
    //}

    return a;
}

function Piece_assignSet(p2) {
    'use strict';
    //var smallerSet;
    if (p2.set !== undefined) {
        if (this.set === undefined) {
            this.set = p2.set;
            this.set.add(this);
        } else {
            // union

            //if (this.set.cardinality > p2.set.cardinality) {
            //    smallerSet = p2.set;
            //} else {
            //    smallerSet = this.set.clone();
            //}

            this.set.union(p2.set);
            //return smallerSet;
            return p2;
        }
    }
}

function Piece_equals(p2) {
    'use strict';
    return this.position.equals(p2.position);
}

Piece.prototype.blank = Piece_blank;
Piece.prototype.equals = Piece_equals;
Piece.prototype.getHTML = Piece_getHTML;
Piece.prototype.assignSet = Piece_assignSet;