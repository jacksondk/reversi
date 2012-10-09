/// <reference path="reversi.js"/>
/// <reference path="http://code.jquery.com/qunit/git/qunit.js"/>

$(document).ready(function () {
    module("Basic game mechanics");
    g = Reversi();

    test("getIndex of position", function () {
        var p = new g.Position(3, 3);
        var index = p.toIndex();
        expect(1);
        equal(index, 27, "Index 27 expected");
    });

    test("move from center", function () {
        var pos = new g.Position(3, 3);

        var p1 = pos.move(0);
        equal(p1.getRow(), 4);
        equal(p1.getColumn(), 3);

        equal(pos.getRow(), 3);
        equal(pos.getColumn(), 3);

        var p2 = pos.move(1);
        equal(p2.getRow(), 4);
        equal(p2.getColumn(), 4);

        var p3 = pos.move(2);
        equal(p3.getRow(), 3);
        equal(p3.getColumn(), 4);

        var p4 = pos.move(3);
        equal(p4.getRow(), 2);
        equal(p4.getColumn(), 4);

        var p5 = pos.move(4);
        equal(p5.getRow(), 2);
        equal(p5.getColumn(), 3);

        var p6 = pos.move(5);
        equal(p6.getRow(), 2);
        equal(p6.getColumn(), 2);

        var p7 = pos.move(6);
        equal(p7.getRow(), 3);
        equal(p7.getColumn(), 2);

        var p8 = pos.move(7);
        equal(p8.getRow(), 4);
        equal(p8.getColumn(), 2);
    });

    test("Exception illegal move", function () {
        var p = new g.Position(3, 3);
        raises(function () { p.move(-1); });
        raises(function () { p.move(8); });
    });

    test("Null when moving outside", function () {
        var p = new g.Position(0, 0);
        equal(null, p.move(3));
        equal(null, p.move(4));
        equal(null, p.move(5));
        equal(null, p.move(6));
        equal(null, p.move(7));

    });

    test("Null when moving outside top row", function () {
        var p = new g.Position(0, 3);
        equal(null, p.move(3));
        equal(null, p.move(4));
        equal(null, p.move(5));
        notEqual(null, p.move(2));
        notEqual(null, p.move(6));
    });

    test("Test of get/set piece on board", function () {
        var b = new g.Board();
        var p = new g.Position(3, 3);


        var before = b.getTypeAtPosition(p);
        equal(0, before);
        b.setTypeAtPosition(new g.Position(3, 3), 1);
        var after = b.getTypeAtPosition(p);
        equal(1, after);
    });

    test("Board copy", function () {
        var b = new g.Board();
        var p = new g.Position(3, 3);
        b.setTypeAtPosition(p, 1);

        var b2 = b.copy();

        equal(1, b.getTypeAtPosition(p));
        equal(1, b2.getTypeAtPosition(p));

        b.setTypeAtPosition(p, 2);
        equal(2, b.getTypeAtPosition(p));
        equal(1, b2.getTypeAtPosition(p));

    });

    test("Test initial state of reversi game", function () {
        var game = new g.Reversi();
        game.setup();
        var board = game.getBoard();

        equal(1, board.getTypeAtPosition(new g.Position(3, 3)));
        equal(1, board.getTypeAtPosition(new g.Position(4, 4)));
        equal(2, board.getTypeAtPosition(new g.Position(4, 3)));
        equal(2, board.getTypeAtPosition(new g.Position(3, 4)));
    });

    test("board output", function () {
        var game = new g.Reversi();
        game.setup();
        var string = game.getBoard().toString();
        $("#test_output").html(string);
        ok(true);
    });

    test("Turn pieces", function () {
        var game = new g.Reversi();
        game.setup();

        var list = g.getTurnedPieces(game.getBoard(), new g.Position(3, 2), 2);
        equal(list.length, 1);
        var pos = list[0];
        equal(pos.getRow(), 3);
        equal(pos.getColumn(), 3);

        list = g.getTurnedPieces(game.getBoard(), new g.Position(2, 3), 2);
    });

    test("Make move", function () {
        var game = new g.Reversi();
        game.setup();

        equal(game.getCurrentPlayer(), 1);
        var newPos = new g.Position(4, 2);
        var turnPos = new g.Position(4, 3);
        game.makeMove(g.positionMove(newPos));

        var board = game.getBoard();
        var string = board.toString();
        $("#test_output").html(string);

        equal(game.getCurrentPlayer(), 2);


        equal(board.getTypeAtPosition(newPos), 1);
        equal(board.getTypeAtPosition(turnPos), 1);

        newPos = new g.Position(5, 2);
        turnPos = new g.Position(4, 3);
        game.makeMove(g.positionMove(newPos));
        equal(game.getCurrentPlayer(), 1);
        board = game.getBoard();
        $("#test_output").append(board.toString());
        equal(board.getTypeAtPosition(newPos), 2);
        equal(board.getTypeAtPosition(turnPos), 2);

    });

    test("Legal moves on statup", function () {
        var game = new g.Reversi();
        game.setup();

        var allowedMoves = game.getLegalMoves();
        equal(4, allowedMoves.length);

        game.makeMove(g.positionMove(new g.Position(4, 2)));
        allowedMoves = game.getLegalMoves();
        equal(3, allowedMoves.length);
    });

    test("Pass move when game over", function () {
        var game = new g.Reversi();
        game.setup();
        var b = game.getBoard();
        b.setTypeAtPosition(new g.Position(3, 4), 1);
        b.setTypeAtPosition(new g.Position(4, 3), 1);

        raises(function () {
            game.makePassMove();
        });

    });

    test("Game over", function () {
        var game = new g.Reversi();
        game.setup();
        var b = game.getBoard();
        b.setTypeAtPosition(new g.Position(3, 4), 1);
        b.setTypeAtPosition(new g.Position(4, 3), 1);

        var allowedMoves = game.getLegalMoves();
        equal(1, allowedMoves.length);
        equal(true, allowedMoves[0].isGameOver());
    });

    test("Pass is not legal when move is possible", function () {
        var game = new g.Reversi();
        game.setup();

        raises(function () {
            game.makePassMove();
        });
    });

    test("Random game", function () {
        var game = new g.Reversi();
        game.setup();

        for (var i = 0; i < 10; i++) {
            var listOfMoves = game.getLegalMoves();
            var randomIndex = Math.floor(Math.random() * listOfMoves.length);
            game.makeMove(listOfMoves[randomIndex]);
            $("#test_output").append(game.getBoard().toString());
        }
        expect(0);
    });

    test("doMake", function () {
        var game = new g.Reversi();
        game.setup();

        var listOfMoves = game.getLegalMoves();
        var randomIndex = Math.floor(Math.random() * listOfMoves.length);
        var move = listOfMoves[randomIndex];
        var game2 = game.doMove(move);

        equal(1, game2.getBoard().getTypeAtPosition(move.getPosition()));
        equal(1, game2.getBoard().getTypeAtPosition(new g.Position(4, 4)));
        equal(0, game.getBoard().getTypeAtPosition(move.getPosition()));
        equal(1, game.getBoard().getTypeAtPosition(new g.Position(4, 4)));
    });



    test("simple eval", function () {
        var game = new g.Reversi();
        game.setup();

        equal(0, g.simpleEvaluator(game.getBoard()));
        var listOfMoves = game.getLegalMoves();
        var randomIndex = Math.floor(Math.random() * listOfMoves.length);
        var move = listOfMoves[randomIndex];
        var game2 = game.doMove(move);
        equal(3, g.simpleEvaluator(game2.getBoard()));
    });

    test("game play 1", function () {
        var game = new g.Reversi();
        game.setup();
        // 4F:3D
        game.makeMove(g.positionMove(new g.Position(3, 5)));
        var move = g.getBestMoveMinimax(game, g.simpleEvaluator, 4);
        equal(2, move.getPosition().getRow());
        equal(3, move.getPosition().getColumn());
        game.makeMove(move);
        
        // 2C:4G
        game.makeMove(g.positionMove(new g.Position(1, 2)));
        move = g.getBestMoveMinimax(game, g.simpleEvaluator, 4);
        equal(3, move.getPosition().getRow());
        equal(6, move.getPosition().getColumn());
        game.makeMove(move);
        
        // 3E:2D
        game.makeMove(g.positionMove(new g.Position(2, 4)));
        move = g.getBestMoveMinimax(game, g.simpleEvaluator, 4);
        equal(1, move.getPosition().getRow());
        equal(3, move.getPosition().getColumn());
        game.makeMove(move);
        
        // 2E:1B
        game.makeMove(g.positionMove(new g.Position(1, 4)));
        move = g.getBestMoveMinimax(game, g.simpleEvaluator, 4);
        equal(0, move.getPosition().getRow());
        equal(1, move.getPosition().getColumn());
        game.makeMove(move);
        
        // 3C:5F:2B:1A:2A:1C:4C:4B:1D
        game.makeMove(g.positionMove(new g.Position(2, 2)));
        move = g.getBestMoveMinimax(game, g.simpleEvaluator, 4);
        equal(4, move.getPosition().getRow());
        equal(5, move.getPosition().getColumn());
        game.makeMove(move);
        
        // 2B:1A:2A:1C:4C:4B:1D
        game.makeMove(g.positionMove(new g.Position(1, 1)));
        move = g.getBestMoveMinimax(game, g.simpleEvaluator, 4);
        equal(0, move.getPosition().getRow());
        equal(0, move.getPosition().getColumn());
        game.makeMove(move);
        
        // 2A:1C:4C:4B:1D
        game.makeMove(g.positionMove(new g.Position(1, 0)));
        move = g.getBestMoveMinimax(game, g.simpleEvaluator, 4);
        equal(0, move.getPosition().getRow());
        equal(2, move.getPosition().getColumn());
        game.makeMove(move);
        
        // 4C:4B
        game.makeMove(g.positionMove(new g.Position(3, 2)));
        move = g.getBestMoveMinimax(game, g.simpleEvaluator, 4);
        equal(3, move.getPosition().getRow());
        equal(1, move.getPosition().getColumn());
        game.makeMove(move);

        // 1D
        var accepted = game.getLegalMoves();
        game.makeMove(g.positionMove(new g.Position(0, 3)));
        move = g.getBestMoveMinimax(game, g.simpleEvaluator, 4);
        
    });

    test("simple max evel", function () {
        var game = new g.Reversi();
        game.setup();

        var row, column;
        var board = game.getBoard();
        board.clear();
        for (row = 0; row < 8; row++) {
            board.setTypeAtPosition(new g.Position(row, 0), 1);
            for (column = 1; column < row; column++) {
                board.setTypeAtPosition(new g.Position(row, column), 2);
            }
        }
        $("#test_output").append(game.getBoard().toString());
        var listOfMoves = game.getLegalMoves();
        equal(9, listOfMoves.length);

        var move = g.getBestMove(game, g.simpleEvaluator);
        equal(false, move.isPassMove());
        equal(false, move.isGameOver());
        var position = move.getPosition();
        equal(7, position.getRow());
        equal(7, position.getColumn());
    });

    test("simple max evel - player 2", function () {
        var game = new g.Reversi();
        game.setup();
        game.setCurrentPlayer(2);
        var row, column;
        var board = game.getBoard();
        board.clear();
        for (row = 0; row < 8; row++) {
            board.setTypeAtPosition(new g.Position(row, 0), 2);
            for (column = 1; column < row; column++) {
                board.setTypeAtPosition(new g.Position(row, column), 1);
            }
        }
        $("#test_output").append(game.getBoard().toString());
        var listOfMoves = game.getLegalMoves();
        equal(9, listOfMoves.length);

        var move = g.getBestMove(game, g.simpleEvaluator);
        equal(false, move.isPassMove());
        equal(false, move.isGameOver());
        var position = move.getPosition();
        equal(7, position.getRow());
        equal(7, position.getColumn());
    });

    module("minimax stuff");

    test("min-max", function () {

        var evalCount = 0;
        function node(value, subnodes) {
            return { value: value, next: subnodes };
        };
        function eval(state) {
            evalCount = evalCount + 1;
            return state.value;
        };
        function getActions(state) {
            return state.next || [];
        };
        function doAction(state, action) {
            return action;
        };

        var tree = node(3,
            [node(2, [node(4, null), node(2, [node(2, null), node(3, null)]), node(5, null)]),
             node(1, [node(1, null), node(8, null), node(6, null)])]);

        var move = g.minimax(tree, eval, getActions, doAction, 3);
        equal(move.move, tree.next[0]);
        equal(move.value, 3);
        equal(evalCount, 7);
    });

    function node(value, subnodes) {
        return { value: value, next: subnodes };
    };
    function getTestTree() {
        var tree = node(3,
            [node(2,
                    [node(4, null),
                     node(2,
                         [node(2, null),
                          node(3, null)]),
                     node(5, null)]),
             node(1,
                     [node(1, null),
                      node(8, null),
                      node(6, null),
              node(2, null)])]);
        return tree;
    };
    var evalCount = 0;
    function eval(state) {
        evalCount = evalCount + 1;
        return state.value;
    };
    function getActions(state) {
        return state.next || [];
    };
    function doAction(state, action) {
        return action;
    };

    test("min-max alpha-beta", function () {
        evalCount = 0;
        var tree = getTestTree();
        var move = g.minimax(tree, eval, getActions, doAction, 1);

        equal(move.move, tree.next[0]);
        equal(move.value, 2);
        equal(move.visited, 3);

        move = g.minimax(tree, eval, getActions, doAction, 2);
        equal(move.move, tree.next[0]);
        equal(move.value, 2);
        equal(move.visited, 10);

        move = g.minimax(tree, eval, getActions, doAction, 2, true);
        equal(move.move, tree.next[0]);
        equal(move.value, 2);
        equal(move.visited, 7);

        move = g.minimax(tree, eval, getActions, doAction, 3);
        equal(move.move, tree.next[0]);
        equal(move.value, 3);
        equal(move.visited, 12);

        move = g.minimax(tree, eval, getActions, doAction, 3, true);
        equal(move.value, 3);
        equal(move.visited, 9);
    });

    test("min-max alpha-beta player 2", function () {
        evalCount = 0;
        var tree = getTestTree();
        var move = g.minimax(tree, eval, getActions, doAction, 2, false,
                     function () { return false; });

        equal(move.move, tree.next[0]);
        equal(move.value, 5);
        equal(move.visited, 10);

        var move = g.minimax(tree, eval, getActions, doAction, 2, true,
                     function () { return false; });
        equal(move.move, tree.next[0]);
        equal(move.value, 5);
        equal(move.visited, 8);

    });



    test("game-minimax", function () {
        function eval(game) {
            return g.simpleEvaluator(game.getBoard());
        };
        function getActions(game) {
            var actions = game.getLegalMoves();
            return actions;
        };
        function doAction(state, action) {
            var newState = state.doMove(action);
            return newState;
        };
        function maxPlayer(state) {
            return state.getCurrentPlayer() == 1;
        };

        var game = new g.Reversi();
        game.setup();

        var move = g.minimax(game, eval, getActions, doAction, 2, true, maxPlayer);
        console.log(move);
        expect(0);
    });

});
