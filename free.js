// TODO: paint should only be applied when mouse released
// (so when mouse released, paint over highlight)

var data = [];
window.onload = setup;
var cells = document.getElementById("when").getElementsByTagName("td");	
var selected   = "red";
var unselected = "white";
var mousedown = false;
var fromCell, toCell;
var COLUMN_HEIGHT = Math.floor(cells.length / 7);

function setup() {

	document.onmouseup = function() {
		mousedown = false;
	}

	for (var i = 0; i < cells.length; i++) {

		cells[i].onmousedown = function() {
			fromCell = this.id;
			mousedown = true;

			// Toggle the value & colour at the clicked cell
			if (data[this.id] == 1) {
				data[this.id] = 0;
				this.style.backgroundColor = unselected;

			} else {
				data[this.id] = 1;
				this.style.backgroundColor = selected;
			}
		}

		cells[i].onmouseover = function() {
			var value;
			if (data[this.id] == 1) {
				value = 0;

			} else {
				value = 1;
			}
			toCell = this.id;

			// Paint selection if mouse down
			if (mousedown) {
				paintRange(fromCell, toCell, value);
			}

			document.getElementById("debug").innerHTML = ("Cell: " + this.id);
		}
	}
}

// Square paint
function paintRange(from, to, value) {
	from = Number(from);
	to = Number(to);

	var colour = selected;
	if (value == 0) { colour = unselected; }
	var columnMin = Math.floor( from / COLUMN_HEIGHT );
	var columnMax = Math.floor( to / COLUMN_HEIGHT );

	// For each column
	// (columnMax < columnMin) when (to < from)
	// Thus the use of Math.min / Math.max to cover this case
	for (var i = Math.min(columnMin, columnMax); i <= Math.max(columnMin, columnMax); i++) {
		var start = (from % COLUMN_HEIGHT) + (i * COLUMN_HEIGHT);
		var end =     (to % COLUMN_HEIGHT) + (i * COLUMN_HEIGHT);

		// For each row in that column
		for (var j = Math.min(start, end); j <= Math.max(start, end); j++) {

			// Paint cell & update value
			var cell = document.getElementById(j);
			data[j] = value;
			cell.style.backgroundColor = colour;
		}
	}

	console.log("");
}