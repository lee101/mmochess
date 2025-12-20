#!/usr/bin/env python3
import os
import requests
import sys

def clear_cloudflare_cache():
    api_key = os.environ.get('CLOUDFLARE_API_KEY') or os.environ.get('CLOUDFLARE_API')
    email = os.environ.get('CLOUDFLARE_EMAIL', 'leepenkman@gmail.com')
    zone_id = os.environ.get('CLOUDFLARE_ZONE_BIGMULTIPLAYERCHESS') or os.environ.get('CLOUDFLARE_ZONE_V5GAMES')

    if not api_key or not zone_id:
        print("Missing CLOUDFLARE_API/CLOUDFLARE_API_KEY or zone ID")
        return False

    headers = {
        'X-Auth-Email': email,
        'X-Auth-Key': api_key,
        'Content-Type': 'application/json'
    }

    urls = [
        'https://bigmultiplayerchess.v5games.com/',
        'https://bigmultiplayerchess.v5games.com/play',
        'https://bigmultiplayerchess.v5games.com/static/js/game.js',
        'https://bigmultiplayerchess.v5games.com/static/css/style.css',
        'https://bigmultiplayerchesstatic.bigmultiplayerchess.v5games.com/',
    ]

    print(f"Clearing {len(urls)} URLs...")

    response = requests.post(
        f'https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache',
        headers=headers,
        json={"files": urls}
    )

    if response.status_code == 200 and response.json().get('success'):
        print("Cache cleared successfully")
        return True
    else:
        print(f"Failed: {response.text}")
        return False

if __name__ == '__main__':
    success = clear_cloudflare_cache()
    sys.exit(0 if success else 1)
