$(document).ready(function() {

	var gameMode = "two";
	var side = "cross";
	var turn = "cross";
	var fieldArr = [[null, null, null], [null, null, null], [null, null, null]];
	const fieldSize = 3;
	var crossesScore = 0;
	var noughtsScore = 0;
	var movesCount = 0;
	var p1FirstMove = [];
	var p1LastMove = [];
	var p2LastMove = [];

	function changeMode() {
		gameMode = $( "#select" ).val();
		clearField();
		crossesScore = 0;
		noughtsScore = 0;
		$(".score-points").text("-");
		drawField();
	}

	function changeSide() {
		if(gameMode == "one") {
			var fieldEmpty = 
			fieldArr.reduce(function(flat, current) {
				return flat.concat(current);
			}, [])
			.filter(function(move) {
				return move != null;
			})
			.length == 0;

			if(fieldEmpty) {
				$(".score div").removeClass("active");
				$(this).addClass("active");
				if($(this).hasClass("crosses-score")) {
					side = "cross";
				} else {
					side = "nought";
					returnMove();
				}
			}
		}
	}

	function drawField() {
		var gameField = 
		'<div class="grid">\
			<div class="vertical-l left"></div>\
			<div class="vertical-l right"></div>\
			<div class="horizontal-l top"></div>\
			<div class="horizontal-l bot"></div>\
			<div class="row 0">\
				<div class="col 0"></div>\
				<div class="col 1"></div>\
				<div class="col 2"></div>\
			</div>\
			<div class="row 1">\
				<div class="col 0"></div>\
				<div class="col 1"></div>\
				<div class="col 2"></div>\
			</div>\
			<div class="row 2">\
				<div class="col 0"></div>\
				<div class="col 1"></div>\
				<div class="col 2"></div>\
			</div>\
		</div>';
        $('.field-wrapper').html(gameField);

        $(".horizontal-l").animate({width: "207px", left: "0"}, 500);
		$(".vertical-l").animate({height: "207px", top: "0"}, 500);
	}

	function drawIcon(row, col) {
		var cross = 
		'<svg class="cross">\
			<path id="line1" d="M3 3 L37 37" stroke="#545454" stroke-width="6" stroke-dasharray="51" stroke-dashoffset="0"/>\
			<path id="line2" d="M37 3 L3 37" stroke="#545454" stroke-width="6" stroke-dasharray="51" stroke-dashoffset="0"/>\
		</svg>';
		var nought = 
		'<svg class="nought">\
			<path id="circle" d="M20 3 A 17 17 0 0 0 3 20 A 17 17 0 1 0 20 3" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="107" stroke-dashoffset="0"/>\
		</svg>';
		var currentCol = $( ".row." + row ).children(".col." + col);

		if(turn == "cross") {
			currentCol.html(cross);
		} else {
			currentCol.html(nought);
		}
	}

	function checkWinner(row, col) {
		// var fieldCompleted = 
		// 	fieldArr.reduce(function(flat, current) {
		// 		return flat.concat(current);
		// 	}, [])
		// 	.filter(function(item) {
		// 		return item == null;
		// 	})
		// 	.length == 0;
		var fieldCompleted = movesCount == 9;

		function checkRow(rowNum) {
			var complete = fieldArr[rowNum].every(function(move) {
				return move == turn;
			});
			if(complete) {
				return "winner found";
			}
		}
		function checkCol(colNum) {
			var	complete = true;
			for(var i = 0; i < fieldSize; i++) {
				if(fieldArr[i][colNum] != turn) {
					complete = false;
					break;
				}
			}
			if(complete) {
				return "winner found";
			}
		}
		function checkFirstD(rowNum, colNum) {
			const diagElCoord = ["0, 0", "1, 1", "2, 2"];
			if(diagElCoord.indexOf(rowNum + ", " + colNum) != -1) {
				var complete = true;
				for(var i = 0; i < fieldSize; i++) {
					if(fieldArr[i][i] != turn) {
						complete = false;
						break;
					}
				}
				if(complete) {
					return "winner found";
				}
			}
		}
		function checkSecondD(rowNum, colNum) {
			const diagElCoord = ["0, 2", "1, 1", "2, 0"];
			if(diagElCoord.indexOf(rowNum + ", " + colNum) != -1) {
				var complete = true;
				for(var i = 0, j = fieldSize - 1; i < fieldSize; i++, j--) {
					if(fieldArr[i][j] != turn) {
						complete = false;
						break;
					}
				}
				if(complete) {
					return "winner found";
				}
			}
		}

		if(movesCount > 4) {
			switch ("winner found") {
				case checkRow(row):
					showWinner("row", row);
					break;
				case checkCol(col):
					showWinner("column", col);
					break;
				case checkFirstD(row, col):
					showWinner("first-diagonal");
					break;
				case checkSecondD(row, col):
					showWinner("second-diagonal");
					break;
				default:
					if(fieldCompleted) {
						standoff();
					} else {
						changeTurn();
						return "winner not found";
					}
			}
		} else {
			changeTurn();
			return "winner not found";
		}
	}

	function showWinner(place, position) {
		const colWidth = 65;
		const colHeight = 65;
		const gridLineWidth = 6;
		const strokeColor = (turn == "cross") ? "#545454" : "#fff";

		function crossOutRow(pos) {
			var half = colHeight / 2;
			var y = pos * colHeight + half + pos * gridLineWidth;
			var crossLine = 
			'<svg class="cross-line">\
				<path id="horizontal-line" d="M0 '+ y +' L207 '+ y +'" stroke="'+ strokeColor +'" stroke-width="6" stroke-dasharray="207" stroke-dashoffset="0"/>\
			</svg>';
			var translateX = colWidth + gridLineWidth;
			var translateY = (pos == 0) ? 71 : (pos == 1) ? 0 : -71;

			$('.grid').prepend(crossLine);
			setTimeout(function() {
				$(".cross-line").css("transform", "translateY("+ translateY +"px)");
				$( ".row." + pos ).children().each(function() {
					$(this).css("transform", "translate("+ translateX + "px ,"+ translateY +"px)");
					translateX -= (colWidth + gridLineWidth);
				});
			}, 910);
		}
		function crossOutCol(pos) {
			var half = colWidth / 2;
			var x = pos * colWidth + half + pos * gridLineWidth;
			var crossLine = 
			'<svg class="cross-line">\
				<path id="vertical-line" d="M'+ x +' 0 L'+ x +' 207" stroke="'+ strokeColor +'" stroke-width="6" stroke-dasharray="207" stroke-dashoffset="0"/>\
			</svg>';
			var translateX = (pos == 0) ? 71 : (pos == 1) ? 0 : -71;
			var translateY = colHeight + gridLineWidth;
			
			$('.grid').prepend(crossLine);
			setTimeout(function() {
				$(".cross-line").css("transform", "translateX("+ translateX +"px)");
				for(var i = 0; i < fieldSize; i++) {
					$( ".row." + i ).children(".col." + pos).css("transform", "translate("+ translateX + "px ,"+ translateY +"px)");
					translateY -= (colHeight + gridLineWidth);
				}
			}, 910);
		}
		function crossOutFirstD() {
			var crossLine = 
			'<svg class="cross-line">\
				<path id="cross-diagonal-1" d="M3 3 L204 204" stroke="'+ strokeColor +'" stroke-width="6" stroke-dasharray="284" stroke-dashoffset="0"/>\
			</svg>';
			var translateX = colWidth + gridLineWidth;
			var translateY = colHeight + gridLineWidth;

			$('.grid').prepend(crossLine);
			setTimeout(function() {
				for(var i = 0; i < fieldSize; i++) {
					$( ".row." + i ).children(".col." + i).css("transform", "translate("+ translateX + "px ,"+ translateY +"px)");
					translateX -= (colWidth + gridLineWidth);
					translateY -= (colHeight + gridLineWidth);
				}
			}, 910);
		}
		function crossOutSecondD() {
			var crossLine = 
			'<svg class="cross-line">\
				<path id="cross-diagonal-2" d="M203 3 L2 204" stroke="'+ strokeColor +'" stroke-width="6" stroke-dasharray="284" stroke-dashoffset="0"/>\
			</svg>';
			var translateX = -(colWidth + gridLineWidth);
			var translateY = colHeight + gridLineWidth;

			$('.grid').prepend(crossLine);
			setTimeout(function() {
				for(var i = 0, j = fieldSize - 1; i < fieldSize; i++, j--) {
					$( ".row." + i ).children(".col." + j).css("transform", "translate("+ translateX + "px ,"+ translateY +"px)");
					translateX += (colWidth + gridLineWidth);
					translateY -= (colHeight + gridLineWidth);
				}
			}, 910);
		}

		switch (place) {
			case "row":
				crossOutRow(position);
				break;
			case "column":
				crossOutCol(position);
				break;
			case "first-diagonal":
				crossOutFirstD();
				break;
			case "second-diagonal":
				crossOutSecondD();
		}

		$(".turn").html('<p>Game over</p>');
		if(turn == "cross") {
			crossesScore++;
			$(".crosses-score").children(".score-points").text(crossesScore);
		} else {
			noughtsScore++;
			$(".noughts-score").children(".score-points").text(noughtsScore);
		}
		
		var overlay = $('<div class="overlay"></div>');
		var winnerIcon = $('<div class="winner-icon"></div>');
		var caption = $('<div class="caption"></div>');
		var crossIcon = 
		'<svg class="cross-icon">\
			<line x1="3" y1="3" x2="37" y2="37" stroke="#545454" stroke-width="6"/>\
			<line x1="37" y1="3" x2="3" y2="37" stroke="#545454" stroke-width="6"/>\
		</svg>';
		var noughtIcon = 
		'<svg class="nought-icon">\
			<circle r="17" cx="20" cy="20" fill="none" stroke="#fff" stroke-width="6"/>\
		</svg>';

		(turn == "cross") ? winnerIcon.append(crossIcon) : winnerIcon.append(noughtIcon);
		caption.append('<p>winner!</p>');
		overlay.append(winnerIcon).append(caption);

		setTimeout(function() {
			$( ".field-wrapper" ).append(overlay);
		}, 1400);
	}

	function standoff() {
		var overlay = $('<div class="overlay"></div>');
		var winnerIcon = $('<div class="winner-icon"></div>');
		var caption = $('<div class="caption"></div>');
		var crossIcon = 
		'<svg class="cross-icon">\
			<line x1="3" y1="3" x2="37" y2="37" stroke="#545454" stroke-width="6"/>\
			<line x1="37" y1="3" x2="3" y2="37" stroke="#545454" stroke-width="6"/>\
		</svg>';
		var noughtIcon = 
		'<svg class="nought-icon">\
			<circle r="17" cx="20" cy="20" fill="none" stroke="#fff" stroke-width="6"/>\
		</svg>';

		$(".turn").html('<p>Game over</p>');
		winnerIcon.append(crossIcon).append(noughtIcon);
		caption.append('<p>draw</p>');
		overlay.append(winnerIcon).append(caption);

		setTimeout(function() {
			$( ".field-wrapper" ).append(overlay);	
		}, 400);
	}

	function changeTurn() {
		var crossIcon = 
		'<svg class="cross-icon">\
			<line x1="1" y1="1" x2="11" y2="11" stroke="#000" stroke-width="2" />\
	    	<line x1="11" y1="1" x2="1" y2="11" stroke="#000" stroke-width="2" />\
		</svg>';
		var noughtIcon = 
		'<svg class="nought-icon">\
			<circle r="5" cx="6" cy="6" fill="none" stroke="#000" stroke-width="2"/>\
		</svg>';

		if(turn == "cross") {
			turn = "nought";
			$(".score div").removeClass("active");
			$(".noughts-score").addClass("active");
			$(".turn").html($('<p>Turn of the</p>').append(noughtIcon));
		} else {
			turn = "cross";
			$(".score div").removeClass("active");
			$(".crosses-score").addClass("active");
			$(".turn").html($('<p>Turn of the</p>').append(crossIcon));
		}
	}

	function returnMove() {
		function move(coord) {
			const rowNum = coord[0];
			const colNum = coord[1];
			drawIcon(rowNum, colNum);
			movesCount++;
			fieldArr[rowNum][colNum] = turn;
			p2LastMove = [rowNum, colNum];
			checkWinner(rowNum, colNum);
		}

		function closingSeries(moveCoord) {
			const rowNum = moveCoord[0];
			const colNum = moveCoord[1];
			var rowIndex;
			var colIndex;

			function checkInRow(row) {
				var testArr = fieldArr[row];
				var series = testArr.filter(function(move) {
				    return move != null;    
				});

				if(series.length == 2) {
				    if (series[0] == series[1]) {
				    	if(testArr.indexOf(null) != -1) {
				    		rowIndex = row;
				        	colIndex = testArr.indexOf(null);
				        	return "series found";
				    	}
				    }
				}
			}
			function checkInCol(col) {
				var testArr = [];
				for(var i = 0; i < fieldSize; i++) {
					testArr.push(fieldArr[i][col]);
				}
				var series = testArr.filter(function(move) {
				    return move != null;    
				});

				if(series.length == 2) {
				    if (series[0] == series[1]) {
				    	if(testArr.indexOf(null) != -1) {
				    		rowIndex = testArr.indexOf(null);
				        	colIndex = col;
				        	return "series found";
				    	}
				    }
				}
			}
			function checkInFirstD(row, col) {
				const diagElCoord = ["0, 0", "1, 1", "2, 2"];
				if(diagElCoord.indexOf(row + ", " + col) != -1) {
					var testArr = [];
					for(var i = 0; i < fieldSize; i++) {
						testArr.push(fieldArr[i][i]);
					}
					var series = testArr.filter(function(move) {
					    return move != null;    
					});

					if(series.length == 2) {
					    if (series[0] == series[1]) {
					    	if(testArr.indexOf(null) != -1) {
					    		rowIndex = testArr.indexOf(null);
					        	colIndex = testArr.indexOf(null);
					        	return "series found";
					    	}
					    }
					}
				}
			}
			function checkInSecondD(row, col) {
				const diagElCoord = ["0, 2", "1, 1", "2, 0"];
				if(diagElCoord.indexOf(row + ", " + col) != -1) {
					var testArr = [];
					for(var i = 0, j = fieldSize - 1; i < fieldSize; i++, j--) {
						testArr.push(fieldArr[i][j]);
					}
					var series = testArr.filter(function(move) {
					    return move != null;    
					});

					if(series.length == 2) {
					    if (series[0] == series[1]) {
					    	if(testArr.indexOf(null) != -1) {
					    		for(var m = 0, n = fieldSize - 1; m < fieldSize; m++, n--) {
									if(fieldArr[m][n] == null) {
										rowIndex = m;
										colIndex = n;
										return "series found";
									}
								}
					    	}
					    }
					}
				}
			}
			switch ("series found") {
				case checkInRow(rowNum):
				case checkInCol(colNum):
				case checkInFirstD(rowNum, colNum):
				case checkInSecondD(rowNum, colNum):
					move([rowIndex, colIndex]);
					return "executed";
			}
		}

		function checkCombinations() {
			const centerCoord = [1, 1];

			function inTheCorner(moveCoord) {
				const rowNum = moveCoord[0];
				const colNum = moveCoord[1];
				const cornersCoord = ["0, 0", "0, 2", "2, 0", "2, 2"];
				
				return cornersCoord.indexOf(rowNum + ", " + colNum) != -1;
			}
			function emptyCorner() {
				for (var i = 0; i < fieldSize; i += 2) {
					for(var j = 0; j < fieldSize; j += 2) {
						if(fieldArr[i][j] == null) {
							return [i, j];
						}
					}
				}
			}

			if (side == "nought") {
				function cornerWithoutOpponent() {
					const sidesCentersCoord = ["0, 1", "1, 0", "1, 2", "2, 1"];
					const correspondingConrers = [["0, 0", "0, 2"], ["2, 0", "0, 0"], ["0, 2", "2, 2"], ["2, 0", "2, 2"]];
					
					for(var i = 0; i < sidesCentersCoord.length; i++) {
						var rowNum = sidesCentersCoord[i].split(", ")[0];
						var colNum = sidesCentersCoord[i].split(", ")[1];
						if(fieldArr[rowNum][colNum] == null) {
							for(var j = 0; j < correspondingConrers[i].length; j++) {
								var rowN = correspondingConrers[i][j].split(", ")[0];
								var colN = correspondingConrers[i][j].split(", ")[1];
								if(fieldArr[rowN][colN] == null) {
									return[rowN, colN];
								}
							}
						}
					}
				}
				function lastDiagonalCorner(moveCoord) {
					const rowNum = moveCoord[0];
					const colNum = moveCoord[1];
					const firstDCorners = ["0, 0", "2, 2"];

					if(firstDCorners.indexOf(rowNum + ", " + colNum) != -1) {
						for(var i = 0; i < fieldSize; i++) {
							if(fieldArr[i][i] == null) {
								return [i, i];
							}
						}
					} else {
						for(var i = 0, j = fieldSize - 1; i < fieldSize; i++, j--) {
							if(fieldArr[i][j] == null) {
								return [i, j];
							}
						}
					}

				}

				switch(true) {
					case fieldArr[centerCoord[0]][centerCoord[1]] == null:
						move(centerCoord);
						return "executed";
						break;
					case inTheCorner(p1FirstMove) && movesCount == 2:
						move(lastDiagonalCorner(p1FirstMove));
						return "executed";
						break;
					case (p2LastMove[0] == centerCoord[0]) && (p2LastMove[1] == centerCoord[1]):
						move(emptyCorner());
						return "executed";
						break;
					case inTheCorner(p2LastMove):
						move(cornerWithoutOpponent());
						return "executed";
				}
			} else {
				function jointCorner(firstMove, secondMove) {
					const correspRowsCorners = [["0, 0", "0, 2"], [null, null], ["2, 0", "2, 2"]];
					const correspColsCorners = [["0, 0", "2, 0"], [null, null], ["0, 2", "2, 2"]];
					var rowNumsArr = [];
					var colNumsArr = [];

					rowNumsArr.push(firstMove[0]);
					rowNumsArr.push(secondMove[0]);
					colNumsArr.push(secondMove[1]);
					colNumsArr.push(firstMove[1]);
					for(var i = 0; i < rowNumsArr.length; i++) {
						for(var j = 0; j < correspRowsCorners[rowNumsArr[i]].length; j++) {
							var jointCorner = correspColsCorners[colNumsArr[i]].indexOf(correspRowsCorners[rowNumsArr[i]][j]);
							if(jointCorner != -1) {
								var rowNum = correspColsCorners[colNumsArr[i]][jointCorner].split(", ")[0];
								var colNum = correspColsCorners[colNumsArr[i]][jointCorner].split(", ")[1];
								return [rowNum, colNum];
							}
						}
					}
				}

				switch(true) {
					case (p1LastMove[0] == centerCoord[0]) && (p1LastMove[1] == centerCoord[1]):
						move(emptyCorner());
						return "executed";
						break;
					case inTheCorner(p2LastMove):
						move(emptyCorner());
						return "executed";
						break;
					case fieldArr[centerCoord[0]][centerCoord[1]] == null:
						move(centerCoord);
						return "executed";
						break;
					case inTheCorner(p1FirstMove) && (!inTheCorner(p1LastMove) && movesCount == 3):
						move(jointCorner(p1FirstMove, p1LastMove));
						return "executed";
						break;
					case !inTheCorner(p1FirstMove) && (inTheCorner(p1LastMove) && movesCount == 3):
						move(jointCorner(p1FirstMove, p1LastMove));
						return "executed";
				}
			}
		}

		function emptyPos() {
			function chanceToWinPos() {
				var rowIndex;
				var colIndex;

				function checkRows() {
					for(var i = 0; i < fieldSize; i++) {
						var withoutOpponent = true;
						var testArr = [];
						for(var j = 0; j < fieldSize; j++) {
							if(fieldArr[i][j] == side) {
								withoutOpponent = false;
								break;
							}
							testArr.push(fieldArr[i][j]);
						}
						if(withoutOpponent) {
							if(testArr.indexOf(null) != -1) {
								rowIndex = i;
								colIndex = testArr.indexOf(null);
								return "position found";
							}
						}
					}
				}
				function checkCols() {
					for(var i = 0; i < fieldSize; i++) {
						var withoutOpponent = true;
						var testArr = [];
						for(var j = 0; j < fieldSize; j++) {
							if(fieldArr[j][i] == side) {
								withoutOpponent = false;
								break;
							}
							testArr.push(fieldArr[j][i]);
						}
						if(withoutOpponent) {
							if(testArr.indexOf(null) != -1) {
								rowIndex = testArr.indexOf(null);
								colIndex = i;
								return "position found";
							}
						}
					}
				}
				function checkFirstD() {
					var withoutOpponent = true;
					var testArr = [];
					for(var i = 0; i < fieldSize; i++) {
						if(fieldArr[i][i] == side) {
							withoutOpponent = false;
							break;
						}
						testArr.push(fieldArr[i][i]);
					}
					if(withoutOpponent) {
						if(testArr.indexOf(null) != -1) {
							rowIndex = testArr.indexOf(null);
							colIndex = testArr.indexOf(null);
							return "position found";
						}
					}
				}
				function checkSecondD() {
					var withoutOpponent = true;
					for(var i = 0, j = fieldSize - 1; i < fieldSize; i++, j--) {
						if(fieldArr[i][j] == side) {
							withoutOpponent = false;
							break;
						}
					}
					if(withoutOpponent) {
						for(var m = 0, n = fieldSize - 1; m < fieldSize; m++, n--) {
							if(fieldArr[m][n] == null) {
								rowIndex = m;
								colIndex = n;
								return "position found";
							}
						}
					}
				}

				switch ("position found") {
					case checkRows():
					case checkCols():
					case checkFirstD():
					case checkSecondD():
						move([rowIndex, colIndex]);
						return "executed";
				}
			}
			function firstEmptyPos() {
				outer: for(var i = 0; i < fieldSize; i++) {
					for(var j = 0; j < fieldSize; j++) {
						if(fieldArr[i][j] == null) {
							move([i, j]);
							break outer;
						}
					}
				}
			}

			if(chanceToWinPos() != "executed") {
				firstEmptyPos();
			}
		}

		if(movesCount >= 3) {
			switch ("executed") {
				case closingSeries(p2LastMove):
					break;
				case closingSeries(p1LastMove):
					break;
				case checkCombinations():
					break;
				default:
					emptyPos();
			}
		} else {
			if(checkCombinations() != "executed") {
				emptyPos();
			}
		}

	}

	function clearField() {
		$(".field-wrapper").empty();
		turn = "cross";
		fieldArr = [[null, null, null], [null, null, null], [null, null, null]];
		movesCount = 0;
		$(".score div").removeClass("active");
		$(".crosses-score").addClass("active");
		if(gameMode == "two") {
			var crossIcon = 
			'<svg class="cross-icon">\
				<line x1="1" y1="1" x2="11" y2="11" stroke="#000" stroke-width="2" />\
		    	<line x1="11" y1="1" x2="1" y2="11" stroke="#000" stroke-width="2" />\
			</svg>';

			$(".turn").fadeOut( 200, function() {
			    $(this).html($('<p>Turn of the</p>').append(crossIcon)).fadeIn(200);
			});
			
		} else {
			$(".turn").fadeOut( 200, function() {
			    $(this).html('<p>Change the side above or start the game</p>').fadeIn(200);
			});
			side = "cross";
			p1FirstMove = [];
			p1LastMove = [];
			p2LastMove = [];
		}
	}

	drawField();

	$( "#select" ).change(changeMode);

	$(".score div").click(changeSide);

	$(document).on("click", ".col", function() {
		const rowNum = $(this).parent().attr("class").split(" ")[1];
		const colNum = $(this).attr("class").split(" ")[1];
		
		if ($(this).html() == '') {
			if(gameMode == "two") {
				drawIcon(rowNum, colNum);
				movesCount++;
				fieldArr[rowNum][colNum] = turn;
				checkWinner(rowNum, colNum);
			} else {
				if(side == turn) {
					drawIcon(rowNum, colNum);
					movesCount++;
					fieldArr[rowNum][colNum] = turn;
					if( side == "cross" && movesCount == 1) {
						p1FirstMove = [rowNum, colNum];
					} else if( side == "nought" && movesCount == 2) {
						p1FirstMove = [rowNum, colNum];
					} else {
						p1LastMove = [rowNum, colNum];
					}
					if(checkWinner(rowNum, colNum) == "winner not found") {
						setTimeout(returnMove, 400);
					}
				}
			}
		}
	});

	$(".restart").click(function() {
		clearField();
		drawField();
	});

});