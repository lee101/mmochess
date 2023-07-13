gcloud config set project bigmultiplayerchess
gsutil -m rsync -r ./static gs://static.bigmultiplayerchess.com/static
gcloud app deploy --project bigmultiplayerchess

# deploy index.yaml - dont need this much
gcloud app deploy --project bigmultiplayerchess --no-promote index.yaml
