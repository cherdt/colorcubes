// set.js
// A very simple set data structure, which turns out to mostly be an array...
// My apologies to anyone looking at this code--this is possibly the worst set data structure ever

/* Constructor */
function Set() {
    'use strict';
    this.s = [];
}

/* Add (insert) item into set */
/* We should probably check for duplicates here */
function Set_add(item) {
    'use strict';
    this.s.push(item);
}

/* Return the number of elements in (cardinality of) the set */
function Set_cardinality() {
    'use strict';
    return this.s.length;
}

/* Join two sets together */
function Set_union(otherSet) {
    'use strict';
    //alert("Combining sets of " + this.s.length + " and " + otherSet.s.length);

    // This is a little ugly--relies on implementation details

    var i, j, duplicates = [];

    // Combine sets
    this.s = this.s.concat(otherSet.s);


    // Issue: there may be duplicates, which sets don't allow
    for (i = 0; i < this.s.length; i += 1) {
        for (j = i; j < this.s.length; j += 1) {
            if (i !== j && this.s[i].equals(this.s[j])) {
                duplicates.push(j);
            }
        }
    }

    //if ( duplicates.length > 0 ) alert (duplicates.length + " duplicates");

    // Remove duplicate items from set -- go backwards so we don't mess up the indexing!
    for (i = duplicates.length - 1; i >= 0; i -= 1) {
        this.s.splice(duplicates[i], 1);
    }

    //if ( duplicates.length > 0 ) alert ("Other set now contains " + otherSet.s.length);
    //if (this.s.length === 0 ) alert("why does this.s.length now equal zero?");



    // Now the sets are combined, but the pieces need to know which set they are in
    for (i = 0; i < this.s.length; i += 1) {
        this.s[i].set = this;
    }

//    alert("New length " + this.s.length);

}

/* Compare 2 sets to see if they contain the same elements */
function Set_equals(otherSet) {
    // returns true if all elements in one set are in the other, and vice-versa
    // Assume same order for now?
    // Assuming the same order is crazy! Why did I think that was OK?
    'use strict';
    var i;
    for (i = 0; i < Math.max(this.s.length, otherSet.length); i += 1) {
        if (this.s[i] === undefined || otherSet[i] === undefined || !this.s[i].equals(otherSet[i])) {
            return false;
        }
    }

    return true;
}


/* Return a copy of the set */
function Set_clone() {
    'use strict';
    var i, clonedSet = new Set();
    for (i = 0; i < this.s.length; i += 1) {
        clonedSet.add(this.s[i]);
    }
    return clonedSet;
}

Set.prototype.add = Set_add;
Set.prototype.union = Set_union;
Set.prototype.equals = Set_equals;
Set.prototype.clone = Set_clone;
Set.prototype.cardinality = Set_cardinality;