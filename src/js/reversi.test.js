/// <reference path="reversi.js"/>

$(document).ready(function () {
    g = Reversi();

    test("getIndex of position", function () {
        var p = g.position(3, 3);
        var index = p.toIndex();
        expect(1);
        equal(index, 27, "Index 27 expected");
    });

    test("move from center", function () {
        var pos = g.position(3, 3);

        var p1 = pos.move(0);
        equal(p1.get_row(), 4);
        equal(p1.get_column(), 3);

        equal(pos.get_row(), 3);
        equal(pos.get_column(), 3);

        var p2 = pos.move(1);
        console.log(p2);
        equal(p2.get_row(), 4);
        equal(p2.get_column(), 4);

        var p3 = pos.move(2);
        equal(p3.get_row(), 3);
        equal(p3.get_column(), 4);

        var p4 = pos.move(3);
        equal(p4.get_row(), 2);
        equal(p4.get_column(), 4);

        var p5 = pos.move(4);
        equal(p5.get_row(), 2);
        equal(p5.get_column(), 3);

        var p6 = pos.move(5);
        equal(p6.get_row(), 2);
        equal(p6.get_column(), 2);

        var p7 = pos.move(6);
        equal(p7.get_row(), 3);
        equal(p7.get_column(), 2);

        var p8 = pos.move(7);
        equal(p8.get_row(), 4);
        equal(p8.get_column(), 2);
    });

    test("Exception illegal move", function () {
        var p = g.position(3, 3);
        raises(function () { p.move(-1); });
        raises(function () { p.move(8); });
    });

    test("Null when moving outside", function () {
        var p = g.position(0, 0);
        equal(null, p.move(3));
        equal(null, p.move(4));
        equal(null, p.move(5));
        equal(null, p.move(6));
        equal(null, p.move(7));

    });

    test("Null when moving outside top row", function () {
        var p = g.position(0, 3);
        equal(null, p.move(3));
        equal(null, p.move(4));
        equal(null, p.move(5));
        notEqual(null, p.move(2));
        notEqual(null, p.move(6));
    });

    test("Test of get/set piece on board", function () {
        var b = g.board();
        var p = g.position(3, 3);


        var before = b.getTypeAtPosition(p);
        equal(0, before);
        b.setTypeAtPosition(g.position(3, 3), 1);
        var after = b.getTypeAtPosition(p);
        equal(1, after);
    });

    test("Test initial state of reversi game", function () {
        var game = g.reversi();
        game.setup();
        var board = game.getBoard();

        equal(1, board.getTypeAtPosition(g.position(3, 3)));
        equal(1, board.getTypeAtPosition(g.position(4, 4)));
        equal(2, board.getTypeAtPosition(g.position(4, 3)));
        equal(2, board.getTypeAtPosition(g.position(3, 4)));
    });

    test("board output", function () {
        var game = g.reversi();
        game.setup();
        var string = game.getBoard().toString();
        $("#test_output").html(string);
        ok(true);
    });

    test("Turn pieces", function () {
        var game = g.reversi();
        game.setup();

        var list = game.getTurnedPieces(game.getBoard(), g.position(3, 2), 2);
        equal(list.length, 1);
        var pos = list[0];
        equal(pos.get_row(), 3);
        equal(pos.get_column(), 3);

        list = game.getTurnedPieces(game.getBoard(), g.position(2, 3), 2);
    });

    test("Make move", function () {
        var game = g.reversi();
        game.setup();

        equal(game.getCurrentPlayer(), 1);
        var newPos = g.position(4, 2);
        var turnPos = g.position(4, 3);
        game.makeMove(newPos);

        var board = game.getBoard();
        var string = board.toString();
        $("#test_output").html(string);

        equal(game.getCurrentPlayer(), 2);


        equal(board.getTypeAtPosition(newPos), 1);
        equal(board.getTypeAtPosition(turnPos), 1);

        newPos = g.position(5, 2);
        turnPos = g.position(4, 3);
        game.makeMove(newPos);
        equal(game.getCurrentPlayer(), 1);
        board = game.getBoard();
        $("#test_output").append(board.toString());
        equal(board.getTypeAtPosition(newPos), 2);
        equal(board.getTypeAtPosition(turnPos), 2);

    });

    test("Legal moves on statup", function () {
        var game = g.reversi();
        game.setup();

        var allowedMoves = game.getLegalMoves();
        equal(4, allowedMoves.length);

        game.makeMove(g.position(4, 2));
        allowedMoves = game.getLegalMoves();
        equal(3, allowedMoves.length);
    });

    test("Pass move", function () {
        var game = g.reversi();
        game.setup();
        var b = game.getBoard();
        b.setTypeAtPosition(g.position(3, 4), 1);
        b.setTypeAtPosition(g.position(4, 3), 1);
        game.makePassMove();

        equal(2, game.getCurrentPlayer());

        game.makePassMove();
        equal(1, game.getCurrentPlayer());
    });

    test("Pass is not legal when move is possible", function () {
        var game = g.reversi();
        game.setup();

        raises(function () {
            game.makePassMove();
        });
    });

    test("Random game", function () {
        var game = g.reversi();
        game.setup();

        for( var i = 0; i < 10; i++ ) {
            var listOfMoves = game.getLegalMoves();
            var randomIndex = Math.floor(Math.random()*listOfMoves.length);
            game.makeMove( listOfMoves[randomIndex] );
            $("#test_output").append(game.getBoard().toString());
        }
    });
});