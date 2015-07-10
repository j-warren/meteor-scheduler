var data = [];
window.onload = setup;

function setup() {
	var cells = document.getElementById("when").getElementsByTagName("td");	
	var selected   = "red";    //"#d88c8c";
	var unselected = "white";  //"#FFFFFF";

	for (var i = 0; i < cells.length; i++) {

		cells[i].onclick = function() {
			if (data[this.id] == 1) {
				data[this.id] = 0;
				this.style.backgroundColor = unselected;

			} else {
				data[this.id] = 1;
				this.style.backgroundColor = selected;
			}
		}
	}
}
