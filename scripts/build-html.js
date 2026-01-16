const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

// Create the static HTML file for desktop
const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
    <title>Big Multiplayer Chess</title>
    <meta name="description" content="Battle it out on a big multiplayer chess board!">

    <!-- Desktop App Icons -->
    <link rel="shortcut icon" href="../static/img/favicon.ico" type="image/x-icon"/>

    <!-- Bundled Styles -->
    <link type="text/css" rel="stylesheet" href="./bundle.css"/>
</head>
<body>
    <!-- Facebook SDK placeholder -->
    <div id="fb-root"></div>

    <!-- GameOn Volume Template -->
    <div class="gameon-volume-template">
        <div class="gameon-volume">
            <button class="gameon-volume__mute btn btn-large btn-info" type="button" onclick="gameon.muteClick()">
                <span class="glyphicon glyphicon-volume-off"></span>
            </button>
            <button class="gameon-volume__unmute btn btn-large btn-info" type="button" onclick="gameon.unmuteClick()">
                <span class="glyphicon glyphicon-volume-up"></span>
            </button>
            <div class="gameon-volume__slider">
                <input type="text" data-slider="true" value="0.4" data-slider-highlight="true" data-slider-theme="volume"/>
            </div>
            <div class="clear"></div>
        </div>
    </div>

    <!-- GameOn Starbar Template -->
    <script class="gameon-starbar-template" type="text/html">
        <div class="gameon-starbar">
            <div class="gameon-starbar__bar progress progress-striped">
                <div class="gameon-starbar__stars">
                    <span class="fa fa-star-o gameon-starbar__star gameon-starbar__star--one"></span>
                    <span class="fa fa-star-o gameon-starbar__star gameon-starbar__star--two"></span>
                    <span class="fa fa-star-o gameon-starbar__star gameon-starbar__star--three"></span>
                </div>
                <p class="gameon-starbar__score"></p>
                <div class="gameon-starbar__track progress-bar" role="progressbar" style="width: 0%"></div>
            </div>
            <p class="gameon-starbar__center-message"></p>
        </div>
    </script>

    <!-- Modal -->
    <div id="modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        <i class="fa fa-times close-modal"></i>
                    </button>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>

    <!-- Main Game Container -->
    <div class="mm-background">
        <div id="headerbody">
            <div class="ws-header">
                <div class="ws-header--item">
                    <button type="button" class="back-btn gameon-btn-hg btn btn-danger btn-lg" onclick="return APP.stepBack()">
                        <i class="fa fa-arrow-left"></i>
                    </button>
                </div>
                <a href="/" title="Big Multiplayer Chess" class="ws-header--item big-multiplayer-chess-logo big-shadow" onclick="return APP.gotoLink(this)">
                    BIG MULTIPLAYER CHESS
                </a>
            </div>
        </div>

        <div id="mainbody">
            <!-- Content rendered dynamically by Backbone router -->
        </div>

        <div id="footerbody">
            <div class="footer">
                <p>
                    <a class="footer__link" href="/about" title="About Big Multiplayer Chess" onclick="return APP.gotoLink(this)">About Us</a>
                    <br />
                    <span>© 2013 Big Multiplayer Chess</span>
                </p>
            </div>
        </div>
    </div>

    <!-- Bundled Scripts -->
    <script type="text/javascript" src="./bundle.js"></script>

    <!-- Initialize App for Desktop -->
    <script>
        // Desktop mode configuration
        window.DESKTOP_MODE = true;
        window.static_url = '..';

        // Start the app when ready
        $(document).ready(function() {
            if (typeof APP !== 'undefined' && APP.router) {
                // Start Backbone history
                if (!Backbone.History.started) {
                    Backbone.history.start({ pushState: false, root: '/' });
                }
            }
        });
    </script>
</body>
</html>
`;

const outputPath = path.join(DIST, 'index.html');
fs.writeFileSync(outputPath, html);
console.log(`✓ HTML written to: ${outputPath}`);
console.log(`  Size: ${(html.length / 1024).toFixed(2)} KB`);
