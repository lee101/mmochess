/**
 * AI Background Worker for MMOChess
 * Handles move evaluation calculations off the main thread to prevent UI blocking
 */

(function() {
    'use strict';

    var piecesPower = {
        'king': 200,
        'queen': 9,
        'castle': 5,
        'bishop': 4.5,
        'horse': 4,
        'pawn': 1
    };

    // Hatred matrix - how much each player dislikes other players
    var hatredMatrix = {
        1: { 2: 1.1, 3: 1, 4: 1, 5: 1, 6: 1 },
        2: { 1: 1.1, 3: 1.1, 4: 1.1, 5: 0.9, 6: 0.9 },
        3: { 1: 1, 2: 1, 4: 1, 5: 1, 6: 1 },
        4: { 1: 0.9, 2: 1, 3: 1.1, 5: 1.1, 6: 0.9 },
        5: { 1: 0.9, 2: 1, 3: 1.1, 4: 1.1, 6: 0.9 },
        6: { 1: 0.9, 2: 0.9, 3: 1, 4: 1.1, 5: 1.1 }
    };

    var boardWidth, boardHeight, numPlayers, playersTurn;
    var tiles = [];

    /**
     * Check if position is within board boundaries
     */
    function isInBoard(y, x) {
        return y >= 0 && y < boardHeight && x >= 0 && x < boardWidth;
    }

    /**
     * Get tile at position
     */
    function getTile(y, x) {
        if (!isInBoard(y, x)) return null;
        return tiles[y * boardWidth + x];
    }

    /**
     * Set tile at position
     */
    function setTile(y, x, tile) {
        if (isInBoard(y, x)) {
            tiles[y * boardWidth + x] = tile;
        }
    }

    /**
     * Get all allowed moves for a tile
     */
    function getAllowedMoves(tile, currentPlayer) {
        if (typeof currentPlayer === 'undefined') {
            currentPlayer = playersTurn;
        }

        function validateMoves(positions) {
            var result = [];
            for (var i = 0; i < positions.length; i++) {
                var position = positions[i];
                if (isInBoard(position[0], position[1])) {
                    var targetTile = getTile(position[0], position[1]);
                    if (!targetTile.playerNum || targetTile.playerNum !== currentPlayer) {
                        result.push({
                            yPos: position[0],
                            xPos: position[1],
                            tile: targetTile
                        });
                    }
                }
            }
            return result;
        }

        function addDiag(y, x, allowedMoves) {
            if (isInBoard(y, x)) {
                var targetTile = getTile(y, x);
                if (targetTile.playerNum && targetTile.playerNum !== currentPlayer) {
                    allowedMoves.push([y, x]);
                }
            }
        }

        var allowedMoves = [];
        var y = tile.yPos;
        var x = tile.xPos;

        if (tile.type === "king") {
            allowedMoves = [
                [y + 1, x], [y, x + 1], [y - 1, x], [y, x - 1],
                [y + 1, x + 1], [y - 1, x + 1], [y + 1, x - 1], [y - 1, x - 1]
            ];
        }

        if (tile.type === "pawn") {
            var dirMoves = {
                up:    { forward: [-1, 0], left: [0, -1], right: [0, 1], diagL: [-1, -1], diagR: [-1, 1] },
                down:  { forward: [1, 0],  left: [0, 1],  right: [0, -1], diagL: [1, 1],   diagR: [1, -1] },
                left:  { forward: [0, -1], left: [1, 0],  right: [-1, 0], diagL: [1, -1],  diagR: [-1, -1] },
                right: { forward: [0, 1],  left: [-1, 0], right: [1, 0],  diagL: [-1, 1],  diagR: [1, 1] }
            };
            var moves = dirMoves[tile.direction];
            var normalMoves = [
                [y + moves.forward[0], x + moves.forward[1]],
                [y + moves.left[0], x + moves.left[1]],
                [y + moves.right[0], x + moves.right[1]]
            ];
            if (tile.timesMoved === 0) {
                var blockingTile = getTile(y + moves.forward[0], x + moves.forward[1]);
                if (blockingTile && !blockingTile.playerNum) {
                    normalMoves.push([y + moves.forward[0] * 2, x + moves.forward[1] * 2]);
                }
            }
            for (var i = 0; i < normalMoves.length; i++) {
                var position = normalMoves[i];
                var targetTile = getTile(position[0], position[1]);
                if (!targetTile || !targetTile.playerNum) {
                    allowedMoves.push(position);
                }
            }
            addDiag(y + moves.diagL[0], x + moves.diagL[1], allowedMoves);
            addDiag(y + moves.diagR[0], x + moves.diagR[1], allowedMoves);
        }

        if (tile.type === "horse") {
            allowedMoves = [
                [y + 2, x + 1], [y + 2, x - 1], [y - 2, x + 1], [y - 2, x - 1],
                [y + 1, x + 2], [y + 1, x - 2], [y - 1, x + 2], [y - 1, x - 2]
            ];
        }

        if (tile.type === "bishop" || tile.type === "queen") {
            var directions = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
            for (var d = 0; d < directions.length; d++) {
                var dir = directions[d];
                for (var i = 1; i < 8; i++) {
                    var move = [y + i * dir[0], x + i * dir[1]];
                    var targetTile = getTile(move[0], move[1]);
                    if (targetTile && targetTile.playerNum && targetTile.playerNum !== currentPlayer) {
                        allowedMoves.push(move);
                        break;
                    } else if (targetTile && targetTile.playerNum) {
                        break;
                    } else {
                        allowedMoves.push(move);
                    }
                }
            }
        }

        if (tile.type === "castle" || tile.type === "queen") {
            var directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (var d = 0; d < directions.length; d++) {
                var dir = directions[d];
                for (var i = 1; i < 8; i++) {
                    var move = [y + i * dir[0], x + i * dir[1]];
                    var targetTile = getTile(move[0], move[1]);
                    if (targetTile && targetTile.playerNum && targetTile.playerNum !== currentPlayer) {
                        allowedMoves.push(move);
                        break;
                    } else if (targetTile && targetTile.playerNum) {
                        break;
                    } else {
                        allowedMoves.push(move);
                    }
                }
            }
        }

        return validateMoves(allowedMoves);
    }

    /**
     * Score the current board state from the perspective of the current player
     */
    function scoreBoard() {
        var MOBILITY_FACTOR = 0.01;
        var PROTECTION_FACTOR = 0.01;
        var ATTACK_SURFACE_FACTOR = 0.01;
        var DANGER_FACTOR = ATTACK_SURFACE_FACTOR * (numPlayers - 1);

        var playersPower = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        var playersMobility = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        var playersProtection = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        var playersAttackingSurface = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        var playersDirectDanger = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

        for (var tileNum = 0; tileNum < tiles.length; tileNum++) {
            var currentTile = tiles[tileNum];
            if (currentTile.playerNum) {
                playersPower[currentTile.playerNum] += piecesPower[currentTile.type];

                // Include take yourself moves for protection calculation
                var allowedMoves = getAllowedMoves(currentTile, -1);

                playersMobility[currentTile.playerNum] += allowedMoves.length * MOBILITY_FACTOR;

                for (var i = 0; i < allowedMoves.length; i++) {
                    var move = allowedMoves[i];
                    var moveTile = move.tile;
                    if (moveTile && moveTile.playerNum) {
                        if (moveTile.playerNum === currentTile.playerNum) {
                            playersProtection[currentTile.playerNum] += 1 / piecesPower[moveTile.type] * PROTECTION_FACTOR;
                        } else {
                            playersAttackingSurface[currentTile.playerNum] += piecesPower[moveTile.type] * ATTACK_SURFACE_FACTOR;
                            playersDirectDanger[moveTile.playerNum] -= piecesPower[moveTile.type] * DANGER_FACTOR;
                        }
                    }
                }
            }
        }

        var boardsScore = 0;

        function changeScore(changer) {
            for (var playerNum = 1; playerNum <= numPlayers; playerNum++) {
                if (playerNum === playersTurn) {
                    boardsScore += changer[playerNum];
                } else {
                    boardsScore -= changer[playerNum] / (numPlayers - 1) *
                        hatredMatrix[playersTurn][playerNum];
                }
            }
        }

        changeScore(playersPower);
        changeScore(playersMobility);
        changeScore(playersAttackingSurface);
        changeScore(playersProtection);
        changeScore(playersDirectDanger);

        return boardsScore;
    }

    /**
     * Score a potential move by simulating it and evaluating the result
     */
    function scoreMove(startTileIdx, endTileIdx) {
        var startTile = tiles[startTileIdx];
        var endTile = tiles[endTileIdx];

        // Save original state
        var oldStartTile = JSON.parse(JSON.stringify(startTile));
        var oldEndTile = JSON.parse(JSON.stringify(endTile));

        // Simulate move
        startTile.timesMoved++;

        // Create empty tile at end position
        tiles[endTileIdx] = { playerNum: null, type: null };

        // Swap tiles
        var tempTile = JSON.parse(JSON.stringify(startTile));
        tempTile.yPos = endTile.yPos;
        tempTile.xPos = endTile.xPos;
        tiles[endTileIdx] = tempTile;
        tiles[startTileIdx] = { yPos: oldStartTile.yPos, xPos: oldStartTile.xPos, playerNum: null, type: null };

        var boardScore = scoreBoard();

        // Rollback board state
        tiles[startTileIdx] = oldStartTile;
        tiles[endTileIdx] = oldEndTile;

        return boardScore;
    }

    /**
     * Find the move with the highest score
     * Returns positions instead of tile objects for message passing
     */
    function findMaxScoreMove() {
        var maxScore = -Infinity;
        var maxScoreMove = null;

        for (var y = 0; y < boardHeight; y++) {
            for (var x = 0; x < boardWidth; x++) {
                var tileIdx = y * boardWidth + x;
                var currentTile = tiles[tileIdx];

                if (currentTile.playerNum === playersTurn) {
                    var allowedMoves = getAllowedMoves(currentTile);

                    for (var j = 0; j < allowedMoves.length; j++) {
                        var move = allowedMoves[j];
                        var endTileIdx = move.yPos * boardWidth + move.xPos;
                        var currentScore = scoreMove(tileIdx, endTileIdx);

                        if (currentScore > maxScore) {
                            maxScoreMove = {
                                startY: currentTile.yPos,
                                startX: currentTile.xPos,
                                endY: move.yPos,
                                endX: move.xPos
                            };
                            maxScore = currentScore;
                        }
                    }
                }
            }
        }

        return maxScoreMove;
    }

    /**
     * Handle messages from the main thread
     */
    self.onmessage = function(e) {
        var data = e.data;

        if (data.type === 'calculateMove') {
            // Set up board state from the received data
            boardWidth = data.level.width;
            boardHeight = data.level.height;
            numPlayers = data.level.num_players;
            playersTurn = data.playersTurn;

            // Reconstruct tiles array from serialized data
            tiles = data.tiles.map(function(tileData, idx) {
                return {
                    yPos: Math.floor(idx / boardWidth),
                    xPos: idx % boardWidth,
                    playerNum: tileData.playerNum || null,
                    type: tileData.type || null,
                    direction: tileData.direction || 'up',
                    timesMoved: tileData.timesMoved || 0
                };
            });

            // Find the best move
            var bestMove = findMaxScoreMove();

            // Send the result back to the main thread
            self.postMessage({
                type: 'moveResult',
                move: bestMove
            });
        }
    };
})();
