
function Position() {
    'use strict';
    this.row = 0;
    this.column = 0;
}

function Position_set(r, c) {
    'use strict';
    this.row = r;
    this.column = c;
}

function Position_equals(p2) {
    'use strict';
    return (this.row === p2.row && this.column === p2.column);
}

function Position_toString() {
    'use strict';
    return "Row: " + this.row + ", Column: " + this.column;
}

Position.prototype.set = Position_set;
Position.prototype.equals = Position_equals;
Position.prototype.toString = Position_toString;