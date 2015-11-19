function getRandomColor() {
	var colors = [{name:'red',value:"#f00"},{name:'green',value:"#0f0"},{name:'blue',value:"#00f"},{name:'yellow',value:'#ff0'}];
	return colors[Math.floor(Math.random()*colors.length)];
}

function Color() {
	var rc = getRandomColor();
 	this.name = rc.name;
 	this.value = rc.value;
}

 function Color_blank() {
 	this.name = '';
 	this.value = '#fff';
 }
 
Color.prototype.blank = Color_blank;