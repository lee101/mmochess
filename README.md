mmochess
============

http://BigMultiplayerChess.com an online word search puzzle game and app

Big Multiplayer Chess uses Twitter Bootstrap, JQuery and Python running on the Google app engine.



## setyp upload bucket
# setup upload bucket

echo '[{"origin": ["*"], "method": ["GET", "HEAD", "PUT", "POST"], "responseHeader": ["*"], "maxAgeSeconds": 3600}]' | cat - > cors.json

gsutil cors get gs://static.bigmultiplayerchess.com
echo '[{"origin": ["*"], "method": ["GET", "HEAD", "PUT", "POST"], "responseHeader": ["*"], "maxAgeSeconds": 3600}]' | cat - > cors.json
gsutil cors set cors.json gs://static.bigmultiplayerchess.com

