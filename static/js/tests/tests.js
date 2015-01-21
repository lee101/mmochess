describe("fixtures", function () {

    it('other stuff', function () {
    });

});
describe("mmochess", function () {

    it('lets you navigate around', function (done) {
        APP.goto('/');
        APP.goto('/play');
        specHelpers.once = function () {
            done();
        }
    });

    it('AI scoreBoard', function (done) {
        APP.goto('/play');
        specHelpers.once = function () {
            var game = APP.game;
            var board = game.board;
            var tiles = board.tiles;

            game.players_turn = 1;

            var scoreBoard = game.aiHandler.scoreBoard();

            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                if (tile.playerNum == 1) {
                    board.setTile(tile.yPos, tile.xPos, new game.EmptyTile());
                }
            }
            var currentScore = game.aiHandler.scoreBoard();
            expect(scoreBoard).toBeGreaterThan(currentScore);

            game.players_turn = 2;
            //score board is relative to a players turn
            var p2CurrentScore = game.aiHandler.scoreBoard();
            expect(currentScore).toBeLessThan(p2CurrentScore);

            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                if (tile.playerNum == 3) {
                    board.setTile(tile.yPos, tile.xPos, new game.EmptyTile());
                }
            }
            var newCurrentScore = game.aiHandler.scoreBoard();
            expect(p2CurrentScore).toBeLessThan(newCurrentScore);

            expect(newCurrentScore).toBe(game.aiHandler.scoreBoard());

            APP.goto('/tests');
            done();
        }
    });


    it('AI find max move', function (done) {
        APP.goto('/play');
        specHelpers.once = function () {
            var game = APP.game;
            var board = game.board;
            var tiles = board.tiles;

            game.players_turn = 2;

            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                if (tile.playerNum == 2 && tile.type == "pawn") {
                    var pawn = tile;
                    board.setTile(tile.yPos + 1, tile.xPos + 1, new game.MainTile('queen', 1));
                    break;
                }
            }
            var move = game.aiHandler.findMaxScoreMove();
            expect(move[0].type).toBe("pawn");

            expect(move[1].yPos).toBe(pawn.yPos + 1);
            expect(move[1].xPos).toBe(pawn.xPos + 1);

            APP.goto('/tests');
            done();
        }
    });

    it('tears down', function () {
        APP.goto('/tests');
    });
});
