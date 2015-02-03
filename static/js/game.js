gameon.loadSound('theme', 'http://commondatastorage.googleapis.com/wordsmashing%2Fws-piano-theme2.mp3');
gameon.loadSound('score', '/gameon/static/music/star.mp3');
gameon.loadSound('win', '/gameon/static/music/winning-level.mp3');
gameon.loadSound('moved', '/static/music/moved-letter.m4a');
gameon.loadSound('moving', '/static/music/moving-letter.m4a');

var mmochess = new (function () {
    "use strict";
    var self = this;

    self.Game = function (level) {
        var gameState = this;

        function construct() {
            gameon.pauseAll();
//            gameon.loopSound("theme");

            gameState.players_turn = 1;
            var tiles = gameState.initialBoardTiles();
            gameState.board = new gameon.Board(level.width, level.height, tiles);

            var $html = $(evutils.render('static/templates/shared/game.jinja2'));
            gameState.board.render($html.find('.gameon-board'));
            gameState.destruct = function () {
                gameon.cleanBoards();
//                gameon.pauseSound("theme");
            };

            if (level.computer_opponent) {
                gameState.aiHandler = new gameState.AIHandler();
            }


//            gameon.renderVolumeTo($html.find('.mm-volume'));

            gameState.endHandler = new gameState.EndHandler();
            gameState.endHandler.render($html.find('.mm-end-condition'));
            gameState.$html = $html;


            if (typeof GAMESAPI === 'object') {
                GAMESAPI.beginGameSession(
                    function (response) {
                        // success callback.  response.statusCode == 200
                    },
                    function (response) {
                        // error handler callback.  response.statusCode != 200
                    }
                );
            }
        }

        gameState.initialBoardTiles = function () {
            var tiles = [];

            for (var i = 0; i < level.width * level.height; i++) {
                tiles.push(new EmptyTile());
            }
            //TODO automate init
//            for (var i = 0; i < level.num_players; i++) {
//                initPlayerAt(tiles, [2, 2], 1);
//            }
            initPlayerAt(tiles, [2, 2], 1);
            initPlayerAt(tiles, [14, 2], 2);
            initPlayerAt(tiles, [2, 14], 3);
            initPlayerAt(tiles, [14, 14], 4);
            initPlayerAt(tiles, [26, 14], 5);
            initPlayerAt(tiles, [26, 2], 6);

            return tiles;
        };
        function initPlayerAt(tiles, yxPos, playerNum) {
            var y = yxPos[0];
            var x = yxPos[1];
            tiles[y * level.width + x] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 1] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 2] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 3] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 4] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 5] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 6] = new MainTile("pawn", playerNum);
            tiles[y * level.width + x + 7] = new MainTile("pawn", playerNum);

            tiles[(y + 1) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 2) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 3) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 4) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 5) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 6) * level.width + x] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x] = new MainTile("pawn", playerNum);

            tiles[(y + 7) * level.width + x + 1] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 2] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 3] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 4] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 5] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 6] = new MainTile("pawn", playerNum);
            tiles[(y + 7) * level.width + x + 7] = new MainTile("pawn", playerNum);

            tiles[(y + 6) * level.width + x + 7] = new MainTile("pawn", playerNum);
            tiles[(y + 5) * level.width + x + 7] = new MainTile("pawn", playerNum);
            tiles[(y + 4) * level.width + x + 7] = new MainTile("pawn", playerNum);
            tiles[(y + 3) * level.width + x + 7] = new MainTile("pawn", playerNum);
            tiles[(y + 2) * level.width + x + 7] = new MainTile("pawn", playerNum);
            tiles[(y + 1) * level.width + x + 7] = new MainTile("pawn", playerNum);

            tiles[(y + 1) * level.width + x + 1] = new MainTile("castle", playerNum);

            tiles[(y + 1) * level.width + x + 2] = new MainTile("horse", playerNum);
            tiles[(y + 2) * level.width + x + 1] = new MainTile("horse", playerNum);

            tiles[(y + 1) * level.width + x + 3] = new MainTile("bishop", playerNum);
            tiles[(y + 3) * level.width + x + 1] = new MainTile("bishop", playerNum);

            tiles[(y + 1) * level.width + x + 4] = new MainTile("bishop", playerNum);
            tiles[(y + 4) * level.width + x + 1] = new MainTile("bishop", playerNum);

            tiles[(y + 1) * level.width + x + 5] = new MainTile("horse", playerNum);
            tiles[(y + 5) * level.width + x + 1] = new MainTile("horse", playerNum);

            tiles[(y + 1) * level.width + x + 6] = new MainTile("castle", playerNum);
            tiles[(y + 6) * level.width + x + 1] = new MainTile("castle", playerNum);

            tiles[(y + 2) * level.width + x + 6] = new MainTile("horse", playerNum);
            tiles[(y + 6) * level.width + x + 2] = new MainTile("horse", playerNum);

            tiles[(y + 3) * level.width + x + 6] = new MainTile("bishop", playerNum);
            tiles[(y + 6) * level.width + x + 3] = new MainTile("bishop", playerNum);

            tiles[(y + 4) * level.width + x + 6] = new MainTile("bishop", playerNum);
            tiles[(y + 6) * level.width + x + 4] = new MainTile("bishop", playerNum);

            tiles[(y + 5) * level.width + x + 6] = new MainTile("horse", playerNum);
            tiles[(y + 6) * level.width + x + 5] = new MainTile("horse", playerNum);

            tiles[(y + 6) * level.width + x + 6] = new MainTile("castle", playerNum);

            tiles[(y + 3) * level.width + x + 3] = new MainTile("queen", playerNum);
            tiles[(y + 4) * level.width + x + 4] = new MainTile("king", playerNum);
        }

        gameState.currentSelected = null;
        gameState.unselectAll = function () {
            if (!gameState.currentSelected) {
                return;
            }
            gameState.currentSelected.selected = false;
            gameState.currentSelected.reRender();
            gameState.currentSelected = null;
        };

        gameState.moveFromTo = function (startTile, endTile) {

        };

        var EmptyTile = function () {
            var self = this;
            self.canPassThrough = true;

            self.click = function () {
                if (!gameState.currentSelected) {
                    return;
                }
                var moves = gameState.currentSelected.getAllowedMoves();
                var isValidMove = _.any(moves, function (move) {
                    return move.yPos == self.yPos && move.xPos == self.xPos;
                });
                if (isValidMove) {
                    //moveto this
                    var path = gameState.board.getPathFromTo(gameState.currentSelected, self, true);
                    if (path) {

                        //shorter=faster
                        var animationSpeed = 200;
                        if (gameState.players_turn != 1 && level.computer_opponent) {
                            animationSpeed = 200;
                        }
//                        gameon.unmuteSound('moving');
//                        gameon.playSound('moving');

                        //TODO start ai search ASAP
                        gameState.board.animateTileAlongPath(gameState.currentSelected, path, animationSpeed, function () {
                            gameState.endHandler.turnEnd(gameState.currentSelected, self);
//                            gameon.muteSound('moving');
//                            gameon.pauseSound('moving');
                        });
                    }
                }
            };

            self.render = function () {
                return '<div class="btn btn-lg btn-link"></div>';
            };
        };

        var MainTile = function (type, playerNum, halfgrown) {
            var self = new EmptyTile();
            if (typeof halfgrown == 'undefined') {
                halfgrown = false;
            }

            self.canPassThrough = true;

            self.setHalfgrown = function (halfgrown) {
                self.halfgrown = halfgrown;
                if (!self.halfgrown) {
                    self.oldClick = self.click;
                    self.click = function () {
                        var canClick = (self.playerNum == gameState.players_turn);
                        if (!canClick) {
                            return self.oldClick();
                        }
                        function clearHighlighting() {
                            $.each(gameState.board.tiles, function (i, tile) {
                                tile.getRenderedCell().removeClass('ws-cell-highlight');
                            })
                        }

                        if (!self.selected) {
                            gameState.unselectAll();
                            self.selected = true;
                            gameState.currentSelected = self;

                            clearHighlighting();
                            var allowedMoves = gameState.currentSelected.getAllowedMoves();
                            $.each(allowedMoves, function (i, move) {
                                move.getRenderedCell().addClass('ws-cell-highlight');
                            })
                        }
                        else {
                            gameState.currentSelected = null;
                            self.selected = false;
                            clearHighlighting();
                        }
                        self.reRender();
                    };
                }
                else {
                    if (self.oldClick) {
                        self.click = self.oldClick;
                    }
                }
            };

            self.setHalfgrown(halfgrown);


            self.type = type;
            self.points = 0;
            self.playerNum = playerNum;
            self.timesMoved = 0;

            self.selected = false;

            self.getAllowedMoves = function (currentPlayer) {
                if (typeof currentPlayer == 'undefined') {
                    currentPlayer = gameState.players_turn;
                }
                function validateMoves(positions) {
                    return _.map(_.filter(positions, function (position) {
                        return gameState.board.isInBoard(position[0], position[1]) &&
                            gameState.board.getTile(position[0], position[1]).playerNum != currentPlayer;
                    }), function (move) {
                        return gameState.board.getTile(move[0], move[1]);
                    });
                }

                function addDiag(y, x) {
                    if (gameState.board.isInBoard(y, x) &&
                        gameState.board.getTile(y, x).playerNum &&
                        gameState.board.getTile(y, x).playerNum != currentPlayer) {
                        allowedMoves.push([y, x])
                    }
                }

                var allowedMoves = [];
                if (self.type == "king") {
                    allowedMoves = [
                        [self.yPos + 1, self.xPos],
                        [self.yPos, self.xPos + 1],
                        [self.yPos - 1, self.xPos ],
                        [self.yPos, self.xPos - 1],
                        [self.yPos + 1, self.xPos + 1],
                        [self.yPos - 1, self.xPos + 1],
                        [self.yPos + 1, self.xPos - 1],
                        [self.yPos - 1, self.xPos - 1]
                    ];
                }
                if (self.type == "pawn") {
                    var normalMoves = [
                        [self.yPos + 1, self.xPos],
                        [self.yPos, self.xPos + 1],
                        [self.yPos - 1, self.xPos ],
                        [self.yPos, self.xPos - 1]
                    ];
                    if (self.timesMoved == 0) {
                        var blockingTile = gameState.board.getTile([self.yPos + 1, self.xPos]);
                        if (blockingTile && !blockingTile.playerNum) {
                            normalMoves.push([self.yPos + 2, self.xPos]);
                        }
                        blockingTile = gameState.board.getTile([self.yPos, self.xPos + 1]);
                        if (blockingTile && !blockingTile.playerNum) {
                            normalMoves.push([self.yPos, self.xPos + 2]);
                        }
                        blockingTile = gameState.board.getTile([self.yPos - 1, self.xPos]);
                        if (blockingTile && !blockingTile.playerNum) {
                            normalMoves.push([self.yPos - 2, self.xPos]);
                        }
                        blockingTile = gameState.board.getTile([self.yPos, self.xPos - 1]);
                        if (blockingTile && !blockingTile.playerNum) {
                            normalMoves.push([self.yPos, self.xPos - 2]);
                        }
                    }
                    for (var i = 0; i < normalMoves.length; i++) {
                        var postition = normalMoves[i];
                        var targetTile = gameState.board.getTile(postition[0], postition[1]);
                        if (!targetTile || !targetTile.playerNum) {
                            allowedMoves.push(postition);
                        }
                    }
                    addDiag(self.yPos + 1, self.xPos + 1);
                    addDiag(self.yPos - 1, self.xPos + 1);
                    addDiag(self.yPos + 1, self.xPos - 1);
                    addDiag(self.yPos - 1, self.xPos - 1);
                }
                if (self.type == "horse") {
                    allowedMoves = [
                        [self.yPos + 2, self.xPos + 1],
                        [self.yPos + 2, self.xPos - 1],
                        [self.yPos - 2, self.xPos + 1],
                        [self.yPos - 2, self.xPos - 1],
                        [self.yPos + 1, self.xPos + 2],
                        [self.yPos + 1, self.xPos - 2],
                        [self.yPos - 1, self.xPos + 2],
                        [self.yPos - 1, self.xPos - 2]
                    ];
                }
                if (self.type == "bishop" || self.type == "queen") {
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos + i, self.xPos + i];
                        if (gameState.board.getTile(move[0], move[1]) &&
                            gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != currentPlayer) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]) && gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos - i, self.xPos + i];
                        if (gameState.board.getTile(move[0], move[1]) &&
                            gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != currentPlayer) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]) && gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos + i, self.xPos - i];
                        if (gameState.board.getTile(move[0], move[1]) &&
                            gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != currentPlayer) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]) && gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos - i, self.xPos - i];
                        if (gameState.board.getTile(move[0], move[1]) &&
                            gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != currentPlayer) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]) && gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                }
                if (self.type == "castle" || self.type == "queen") {
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos + i, self.xPos];
                        if (gameState.board.getTile(move[0], move[1]) &&
                            gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != currentPlayer) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]) && gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos - i, self.xPos];
                        if (gameState.board.getTile(move[0], move[1]) &&
                            gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != currentPlayer) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]) && gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos, self.xPos + i];
                        if (gameState.board.getTile(move[0], move[1]) && gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != currentPlayer) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]) && gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                    for (var i = 1; i < 8; i++) {
                        var move = [self.yPos, self.xPos - i];
                        if (gameState.board.getTile(move[0], move[1]) && gameState.board.getTile(move[0], move[1]).playerNum &&
                            gameState.board.getTile(move[0], move[1]).playerNum != currentPlayer) {
                            allowedMoves.push(move);
                            break;
                        }
                        else if (gameState.board.getTile(move[0], move[1]) && gameState.board.getTile(move[0], move[1]).playerNum) {
                            break;
                        }
                        else {
                            allowedMoves.push(move);
                        }
                    }
                }
                return validateMoves(allowedMoves);

            };

            self.render = function () {
                var selectedClass = '';
                if (self.selected) {
                    selectedClass = ' chess-piece--selected';
                }
                var pieceText = fixtures.pieces[self.type];
                return '<button type="button" class="chess-piece chess-piece--player-' + self.playerNum + selectedClass + '">' + pieceText +
                    '</button>';
            };
            return self;
        };

        gameState.EndHandler = function () {
            var endSelf = {};
            endSelf.moves = level.moves;
            endSelf.render = function (target) {
                endSelf.$target = $(target);
                if (level.moves) {
                    endSelf.$target.html('<p>Moves: ' + endSelf.moves + '</p>');
                }
                else {
                    endSelf.$target.html('<p>Time: <span class="gameon-clock"></span></p>');
                }
            };
            endSelf.setMoves = function (moves) {
                endSelf.moves = moves;
                if (moves <= 0) {
                    //todo settimeout so they can watch successanimation
                    endSelf.gameOver();
                    return;
                }
                endSelf.render(endSelf.$target);
            };

            endSelf.addToScore = function (score) {
            };

            endSelf.turnEnd = function (startTile, endTile) {
                var startPlayerNum = startTile.playerNum;
                var endPlayerNum = endTile.playerNum;

                if (endTile.type == "king") {
                    //todo kingowned popup
                    for (var i = 0; i < gameState.board.tiles.length; i++) {
                        var tile = gameState.board.tiles[i];
                        if (tile.playerNum == endPlayerNum) {
                            tile.playerNum = startPlayerNum
                        }
                    }
                }
                //figure out if endtile should be removed(ifpiece is taken)
                gameState.board.setTile(endTile.yPos, endTile.xPos, new EmptyTile());
                startTile.timesMoved++;

                gameState.board.swapTiles(startTile, endTile);

                endSelf.nextTurn();

                gameState.board.render();
            };

            endSelf.nextTurn = function () {
                gameState.players_turn = gameState.players_turn++ % level.num_players + 1;

                if (gameState.players_turn != 1) {
                    if (level.num_human_players < gameState.players_turn) {
                        if (level.computer_opponent) {
                            gameState.aiHandler.makeAiMove();
                        }
                    }
                }
            }


            endSelf.gameOver = function () {

                gameState.destruct();
                APP.doneLevel(level);
                if (typeof GAMESAPI === 'object') {
                    GAMESAPI.postScore(gameState.starBar.getScore(), function () {
                    }, function () {
                    });
                    GAMESAPI.endGameSession(
                        function (response) {
                            // success callback.  response.statusCode == 200
                        },
                        function (response) {
                            // error handler callback.  response.statusCode != 200
                        }
                    );
                }
            };

            return endSelf;
        };
        gameState.MainTile = MainTile;
        gameState.EmptyTile = EmptyTile;

        gameState.AIHandler = function () {
            var AISelf = {};
            //hatred based on distance/total scores todo recalculate
            // full hate = numplayers-1, no hate = 0
            AISelf.hatredMatrix = {
                1: {
                    2: 1.1,
                    3: 1,
                    4: 1,
                    5: 1,
                    6: 1
                },
                2: {
                    1: 1.1,
                    3: 1.1,
                    4: 1.1,
                    5: 0.9,
                    6: 0.9
                },
                3: {
                    1: 1,
                    2: 1,
                    4: 1,
                    5: 1,
                    6: 1
                },
                4: {
                    1: 0.9,
                    2: 1,
                    3: 1.1,
                    5: 1.1,
                    6: 0.9
                },
                5: {
                    1: 0.9,
                    2: 1,
                    3: 1.1,
                    4: 1.1,
                    6: 0.9
                },
                6: {
                    1: 0.9,
                    2: 0.9,
                    3: 1,
                    4: 1.1,
                    5: 1.1
                }
            };

            AISelf.boardScore = 0;
            AISelf.scoreBoard = function () {
                var MOBILITY_FACTOR = 0.01;
                var PROTECTION_FACTOR = 0.01;
                //todo reduce attack surface factor based on multiples
                var ATTACK_SURFACE_FACTOR = 0.01;
                var DANGER_FACTOR = ATTACK_SURFACE_FACTOR * (level.num_players - 1);
                var playersPower = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0
                };
                var playersMobility = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0
                };
                var playersProtection = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0
                };
                var playersAttackingSurface = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0
                };
                var playersDirectDanger = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0
                };

                var tilesToTilesTheyCanTake = {};
                var tilesToTilesWhichCanTakeThem = {};
                var tilesToOwnTilesTheyCanTake = {};
                var tilesToOwnTilesWhichCanTakeThem = {};

                for (var tileNum = 0; tileNum < gameState.board.tiles.length; tileNum++) {
                    var currentTile = gameState.board.tiles[tileNum];
                    if (currentTile.playerNum) {
                        playersPower[currentTile.playerNum] += fixtures.piecesPower[currentTile.type];

                        //include take yourself moves!
                        var allowedMoves = currentTile.getAllowedMoves(-1);

                        playersMobility[currentTile.playerNum] += allowedMoves.length * MOBILITY_FACTOR;
                        for (var i = 0; i < allowedMoves.length; i++) {
                            var move = allowedMoves[i];
                            if (move.playerNum) {
                                if (move.playerNum == currentTile.playerNum) {
                                    playersProtection[currentTile.playerNum] += 1 / fixtures.piecesPower[move.type] * PROTECTION_FACTOR;
                                    if ($.isArray(tilesToOwnTilesWhichCanTakeThem[move])) {
                                        tilesToOwnTilesWhichCanTakeThem[move].push(currentTile);
                                    }
                                    else {
                                        tilesToOwnTilesWhichCanTakeThem[move] = [currentTile];
                                    }
                                    if ($.isArray(tilesToOwnTilesTheyCanTake[move])) {
                                        tilesToOwnTilesTheyCanTake[move].push(currentTile);
                                    }
                                    else {
                                        tilesToOwnTilesTheyCanTake[move] = [currentTile];
                                    }
                                }
                                else {
                                    playersAttackingSurface[currentTile.playerNum] += fixtures.piecesPower[move.type] * ATTACK_SURFACE_FACTOR
                                    playersDirectDanger[move.playerNum] -= fixtures.piecesPower[move.type] * DANGER_FACTOR;
                                    if ($.isArray(tilesToTilesTheyCanTake[currentTile])) {
                                        tilesToTilesTheyCanTake[currentTile].push(move);
                                    }
                                    else {
                                        tilesToTilesTheyCanTake[currentTile] = [move];
                                    }
                                    if ($.isArray(tilesToTilesWhichCanTakeThem[move])) {
                                        tilesToTilesWhichCanTakeThem[move].push(currentTile);
                                    }
                                    else {
                                        tilesToTilesWhichCanTakeThem[move] = [currentTile];
                                    }
                                }
                            }
                        }
                    }
                }

                var playersExchangeScores = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0
                };


                $.each(tilesToTilesTheyCanTake, function (tileIdx, tilesWeCanTake) {
                    var tile = gameState.board.getTile(tileIdx.split('-'));
                    //does taking them cause a favourable exchange?
                    for (var j = 0; j < tilesWeCanTake.length; j++) {
                        var playersCurrentExchangeScores = {
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0
                        };
                        var tileWeCanTake = tilesWeCanTake[j];
                        var tilesProtectors = tilesToOwnTilesWhichCanTakeThem[tileWeCanTake];
                        var tilesAggressors = tilesToTilesWhichCanTakeThem[tileWeCanTake];
                        tilesProtectors = _.sortBy(tilesProtectors, function (tile) {
                            return fixtures.piecesPower[tile.type];
                        });
                        tilesAggressors = _.sortBy(tilesAggressors, function (tile) {
                            return fixtures.piecesPower[tile.type];
                        });

                        playersCurrentExchangeScores[tileWeCanTake.playerNum] -= fixtures.piecesPower[tileWeCanTake.type];
                        for (var k = 0; k < tilesAggressors.length && k < tilesProtectors.length; k++) {
                            var aggressor = tilesAggressors[k];
                            var defender = tilesProtectors[k];
                            playersCurrentExchangeScores[aggressor.playerNum] -= fixtures.piecesPower[aggressor.type];
                            playersCurrentExchangeScores[defender.playerNum] -= fixtures.piecesPower[defender.type];
                        }

                        $.each(playersCurrentExchangeScores, function (playerNum, score) {
                            playersExchangeScores[playerNum] += score
                        });
                        //todo dampering when multiple playernums are counted in the conflict

                    }
                });


                var boardsScore = 0;

                function changeScore(changer) {
                    for (var playerNum = 1; playerNum <= level.num_players; playerNum++) {
                        if (playerNum == gameState.players_turn) {
                            boardsScore += changer[playerNum];
                        }
                        else {
                            boardsScore -= changer[playerNum] / (level.num_players - 1) *
                                AISelf.hatredMatrix[gameState.players_turn][playerNum];
                        }
                    }
                }

                changeScore(playersPower);
                changeScore(playersMobility);

                changeScore(playersAttackingSurface);
                changeScore(playersProtection);
                changeScore(playersDirectDanger);

                return boardsScore;
            };

            AISelf.scoreMove = function (startTile, endTile) {

                //simulate move
                var oldEndTilePos = [endTile.yPos, endTile.xPos];
                var oldStartTilePos = [startTile.yPos, startTile.xPos];
                startTile.timesMoved++;

                gameState.board.setTile(oldEndTilePos, new EmptyTile());
                gameState.board.swapTiles(oldStartTilePos, oldEndTilePos);

                var boardScore = AISelf.scoreBoard();

                //rollback board state
                gameState.board.swapTiles(oldStartTilePos, oldEndTilePos);
                gameState.board.setTile(oldEndTilePos, endTile);//alters the endtile
                startTile.timesMoved--;

                return boardScore;
            };

            AISelf.findMaxScoreMove = function () {
                var totalNumMovesFound = 0;

                var maxScore = -Infinity;
                var maxScoreMove = [null, null];

                for (var y = 0; y < level.height; y++) {
                    for (var x = 0; x < level.width; x++) {
                        var currentTile = gameState.board.getTile(y, x);
                        if (currentTile.playerNum == gameState.players_turn) {
                            var allowedMoves = currentTile.getAllowedMoves();
                            totalNumMovesFound += allowedMoves.length;
                            for (var j = 0; j < allowedMoves.length; j++) {
                                var move = allowedMoves[j];
                                var currentScore = AISelf.scoreMove(currentTile, move);
                                if (currentScore > maxScore) {
                                    maxScoreMove = [currentTile, move];
                                    maxScore = currentScore;
                                }
                            }
                        }
                    }
                }
                return maxScoreMove;
            };


            AISelf.makeAiMove = function () {
                gameon.blockUI();

                var maxScoreMove = AISelf.findMaxScoreMove();

                if (!maxScoreMove[0]) {
                    //no moves! TODO destroy player which can't move?
                    //todo if all turns dont work then gameover
                    gameState.endHandler.nextTurn();
//                    gameState.endHandler.gameOver();
                    gameon.unblockUI();
                    return;
                }

                //update view
                maxScoreMove[0].click();
                setTimeout(function () {
                    //move there
                    maxScoreMove[1].click();
                    gameon.unblockUI();
                    //gameState.unselectAll();
                }, 800);
            };


            return AISelf;
        };

        gameState.render = function (target) {
            gameState.$target = $(target);
            gameState.$target.html(gameState.$html);
        };

        construct();
        return gameState;
    }


})();
