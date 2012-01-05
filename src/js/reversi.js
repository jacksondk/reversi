var Reversi = function () {
    var colName = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    var rowName = ['1', '2', '3', '4', '5', '6', '7', '8'];

    var position = function (row, column) {
        var that = {};

        that.show = "" + row + "," + colName[column];

        that.toIndex = function () {
            return row + 8 * column;
        };

        that.move = function (direction) {
            var newRow;
            var newColumn;
            switch (direction) {
                case 0: newRow = row + 1; newColumn = column; break;
                case 1: newRow = row + 1; newColumn = column + 1; break;
                case 2: newRow = row; newColumn = column + 1; break;
                case 3: newRow = row - 1; newColumn = column + 1; break;
                case 4: newRow = row - 1; newColumn = column; break;
                case 5: newRow = row - 1; newColumn = column - 1; break;
                case 6: newRow = row; newColumn = column - 1; break;
                case 7: newRow = row + 1; newColumn = column - 1; break;
                default: throw "Not valid direction";
            }
            if (newRow >= 0 && newRow <= 7 && newColumn >= 0 && newColumn <= 7)
                return position(newRow, newColumn);
            else
                return null;
        };

        that.getRow = function () { return row; };
        that.getColumn = function () { return column };

        return that;
    };

    var passMove = function () {
        var that = {};

        that.isPassMove = function () { return true; }
        that.isGameOver = function () { return false; }
        that.getPosition = function () { return null; }

        return that;
    };

    var gameOverMove = function () {
        var that = {};

        that.isPassMove = function () { return false; }
        that.isGameOver = function () { return true; }
        that.getPosition = function () { return null; }

        return that;
    };

    var positionMove = function (position) {
        var that = {};
        var movePosition = position;
        that.isPassMove = function () { return false; }
        that.isGameOver = function () { return false; }
        that.getPosition = function () { return movePosition; }

        return that;

    };

    board = function (spec) {
        var that = {};
        spec = spec || {};

        var myBoard = [];

        if (spec.board != null) {
            for (var i = 0; i < 8 * 8; i++) {
                myBoard[i] = spec.board[i];
            }
        } else {
            for (var i = 0; i < 8 * 8; i++) {
                myBoard[i] = 0;
            }
        }

        that.setTypeAtPosition = function (position, type) {
            var index = position.toIndex();
            if (index >= 0 && index < 8 * 8)
                myBoard[index] = type;
        };

        var getTypeAtPosition = function (position) {
            var index = position.toIndex();
            if (index >= 0 && index < 8 * 8)
                return myBoard[index];
            else
                return -1;
        };

        that.copy = function () { return board({ "board": myBoard }); }

        that.getTypeAtPosition = getTypeAtPosition;

        that.toString = function () {
            var string = "<table border='1px'>";
            var string = string + "<tr><td></td>";
            for (var col = 0; col < 8; col++) {
                string = string + "<td>" + colName[col] + "</td>";
            }
            for (var row = 0; row < 8; row++) {
                string = string + "<tr><td>" + rowName[row] + "</td>";
                for (var column = 0; column < 8; column++) {
                    var type = getTypeAtPosition(position(row, column));
                    if (type == 1) {
                        string = string + "<td>x</td>";
                    } else if (type == 2) {
                        string = string + "<td>o</td>";
                    }
                    else {
                        string = string + "<td></td>";
                    }
                }
                string = string + "<td>" + rowName[row] + "</td></tr>";
            };
            var string = string + "<tr><td></td>";
            for (var col = 0; col < 8; col++) {
                string = string + "<td>" + colName[col] + "</td>";
            }
            return string + "</table>";
        };

        return that;
    };

    var reversi = function (spec) {
        var that = {};
        spec = spec || {};

        var b;
        if (spec.board != null) {
            b = spec.board.copy();
        }
        var currentPlayer = spec.currentPlayer || 1;

        var otherPlayer = function (type) {
            if (type == 1) return 2;
            if (type == 2) return 1;
        };

        that.setup = function () {
            b = board();
            b.setTypeAtPosition(position(3, 3), 1);
            b.setTypeAtPosition(position(4, 4), 1);
            b.setTypeAtPosition(position(3, 4), 2);
            b.setTypeAtPosition(position(4, 3), 2);
            currentPlayer = 1;
        };

        that.getBoard = function () {
            return b;
        };

        that.getCurrentPlayer = function () {
            return currentPlayer;
        };

        var getTurnedPieces = function (board, position, type) {
            var otherColor = otherPlayer(type);
            var turnList = [];
            if (board.getTypeAtPosition(position) != 0)
                return turnList;

            for (var direction = 0; direction < 8; direction++) {
                var newPosition = position.move(direction);
                if (newPosition == null)
                    continue;
                var typeAtPosition = b.getTypeAtPosition(newPosition);
                var possibleList = [];
                while (typeAtPosition == otherColor) {
                    possibleList.push(newPosition);
                    newPosition = newPosition.move(direction);
                    if (newPosition == null) {
                        break;
                    }
                    typeAtPosition = b.getTypeAtPosition(newPosition);
                    if (typeAtPosition == type) {
                        turnList = turnList.concat(possibleList);
                    }
                }
            }
            return turnList;
        };
        that.getTurnedPieces = getTurnedPieces;

        var makePassMove = function () {
            var allowedMoveList = getLegalMoves();
            if (allowedMoveList.length > 1)
                throw "Not allowed to pass when multiple possible moves exist";

            if (allowedMoveList[0].isGameOver())
                throw "Pass move not allowed when game is over";

            if (allowedMoveList[0].isPassMove()) {
                currentPlayer = otherPlayer(currentPlayer);
            } else {
                throw "Not allowed to pass when possible move exists";
            }
        };


        that.makeMove = function (positionMove) {
            if (positionMove.isPassMove()) {
                makePassMove();
                return;
            }

            var position = positionMove.getPosition();
            if (position == null)
                throw "Not a valid move";
            var turnList = getTurnedPieces(b, position, currentPlayer);
            if (turnList.length == 0)
                throw "Illegal move";

            for (var index = 0; index < turnList.length; index++) {
                b.setTypeAtPosition(turnList[index], currentPlayer);
            };
            b.setTypeAtPosition(position, currentPlayer);
            currentPlayer = otherPlayer(currentPlayer);
        };

        var getLegalMoves = function () {

            // Find all legal moves where a piece is placed on board
            var findLegalMovesForPlayer = function (player) {
                var legalMoves = [];
                for (var row = 0; row < 8; row++) {
                    for (var column = 0; column < 8; column++) {
                        var tryLocation = position(row, column);
                        var turnList = getTurnedPieces(b, tryLocation, player);
                        if (turnList.length > 0) {
                            legalMoves.push(positionMove(tryLocation));
                        }
                    }
                }
                return legalMoves;
            };

            legalMoves = findLegalMovesForPlayer(currentPlayer);

            // If no pieces may be placed player we have two cases
            // If other player has valid moves the current player may only make a pass move
            // If other player also has no valid moves the game has ended.
            if (legalMoves.length == 0) {
                var otherPlayerLegalMoves = findLegalMovesForPlayer(otherPlayer(currentPlayer));
                if (otherPlayerLegalMoves.length == 0) {
                    legalMoves.push(gameOverMove());
                } else {
                    legalMoves.push(passMove());
                }
            }


            return legalMoves;
        };


        that.getLegalMoves = getLegalMoves;

        that.drawBoard = function (location) {
            var tableAsHtml = b.toString();
            $(location).append(tableAsHtml);
        };

        return that;

    };

    var drawBoard = function (game, clickEventHandler, passHandler) {
        var rowIndex, columnIndex;
        var playerOneCount = 0, playerTwoCount = 0;

        var board = game.getBoard();
        var allowedMoves = game.getLegalMoves();

        var table = $("<table>").addClass("board");
        var row = $("<tr>");
        table.append(row);
        row.append($("<td>"));
        for (columnIndex = 0; columnIndex < 8; columnIndex++) {
            row.append($("<td>").append(colName[columnIndex]));
        }
        row.append($("<td>"));

        for (rowIndex = 0; rowIndex < 8; rowIndex++) {
            row = $("<tr>").append($("<td>").append(rowName[rowIndex]));
            for (columnIndex = 0; columnIndex < 8; columnIndex++) {
                // Find type to draw
                var type = board.getTypeAtPosition(position(rowIndex, columnIndex));
                var sign = " ";
                var field = $("<td>");
                if (type == 1) {
                    playerOneCount = playerOneCount + 1;
                    field.addClass("p1");
                }
                if (type == 2) {
                    playerTwoCount = playerTwoCount + 1;
                    field.addClass("p2");
                }
                var allowed = false;
                if (type == 0) {
                    for (var movesIndex = 0; movesIndex < allowedMoves.length; movesIndex++) {
                        var move = allowedMoves[movesIndex];
                        if (move.isPassMove() == false && move.isGameOver() == false) {
                            var location = move.getPosition();
                            if (location.getRow() == rowIndex && location.getColumn() == columnIndex) {
                                field.addClass("allowed");
                            }
                        }
                    }
                }
                // Draw field
                if (type == 0) {
                    field.click({ row: rowIndex, column: columnIndex }, function (event) {
                        var r = event.data.row;
                        var c = event.data.column;
                        clickEventHandler(r, c);
                    });
                }
                row.append(field);
            }
            row.append($("<td>").append(rowName[rowIndex]));
            table.append(row);
        }

        row = $("<tr>").append($("<td>").attr("colspan", "10").append($("<button>Pass</button>").click(passHandler)));
        table.append(row);
        var state = "";
        if (allowedMoves.length === 1 && allowedMoves[0].isGameOver()) {
            state = "Game over";
        }

        row = $("<tr>");
        row.append($("<td>").attr("colspan", "3").addClass("p1").append("Player 1")).append($("<td>").addClass("p1").append(playerOneCount));
        row.append($("<td>").attr("colspan", "2").append(state));
        row.append($("<td>").addClass("p2").append(playerTwoCount)).append($("<td>").attr("colspan", "3").addClass("p2").append("Player 2"));
        table.append(row);

        return table;
    };

    return {
        position: position,
        gameOverMove: gameOverMove,
        positionMove: positionMove,
        passMove: passMove,
        board: board,
        reversi: reversi,
        drawBoard: drawBoard
    };
};