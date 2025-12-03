#!/usr/bin/env python

import os
import json
import urllib.parse

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import logging

import fixtures
from gameon import gameon_router
from ws import ws
from database import init_db

class GameOnUtils:
    class MyEncoder:
        pass

FACEBOOK_APP_ID = "138831849632195"
FACEBOOK_APP_SECRET = "93986c9cdd240540f70efaea56a9e3f2"

DEV = os.environ.get('DEV', 'true').lower() == 'true'
STATIC_URL = '' if DEV else 'https://bigmultiplayerchessstatic.bigmultiplayerchess.com'

app = FastAPI()
templates = Jinja2Templates(directory=".")

@app.on_event("startup")
async def startup_event():
    init_db()

app.mount("/gameon/static", StaticFiles(directory="gameon/static"), name="gameon_static")
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/transient", StaticFiles(directory="transient"), name="transient")

app.include_router(gameon_router)

def get_template_values(request: Request, **kwargs):
    return {
        'request': request,
        'fixtures': fixtures,
        'ws': ws,
        'json': json,
        'GameOnUtils': GameOnUtils,
        'url': str(request.url),
        'host': request.url.hostname,
        'host_url': f"{request.url.scheme}://{request.url.netloc}",
        'path': request.url.path,
        'urlencode': urllib.parse.quote_plus,
        'static_url': STATIC_URL,
        'dev': DEV,
        **kwargs
    }

@app.get('/', response_class=HTMLResponse)
async def index(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))


@app.get('/tests', response_class=HTMLResponse)
async def tests(request: Request):
    return templates.TemplateResponse('templates/tests.jinja2', get_template_values(request))

@app.get('/facebook', response_class=HTMLResponse)
async def facebook(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))

@app.get('/contact', response_class=HTMLResponse)
async def contact(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/contact.jinja2', get_template_values(request, noads=noads))

@app.get('/about', response_class=HTMLResponse)
async def about(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/about.jinja2', get_template_values(request, noads=noads))

@app.get('/privacy-policy')
async def privacy_policy_redirect():
    return RedirectResponse(url='/privacy', status_code=301)

@app.get('/privacy', response_class=HTMLResponse)
async def privacy(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/privacy.jinja2', get_template_values(request, noads=noads))

@app.get('/terms', response_class=HTMLResponse)
async def terms(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/terms.jinja2', get_template_values(request, noads=noads))

@app.get('/versus', response_class=HTMLResponse)
@app.get('/versus/{subpath:path}', response_class=HTMLResponse)
async def versus(request: Request, subpath: str = None, noads: bool = True):
    return templates.TemplateResponse('templates/versus.jinja2', get_template_values(request, noads=noads))

@app.get('/timed', response_class=HTMLResponse)
async def timed(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))

@app.get('/multiplayer', response_class=HTMLResponse)
async def multiplayer(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/versus.jinja2', get_template_values(request, noads=noads))

@app.get('/games-multiplayer', response_class=HTMLResponse)
async def games_multiplayer(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))

@app.get('/games', response_class=HTMLResponse)
async def games(request: Request):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=True))

@app.get('/play', response_class=HTMLResponse)
async def play(request: Request, noads: bool = True):
    return templates.TemplateResponse('templates/campaign.jinja2', get_template_values(request, noads=noads))

@app.get('/sitemap')
async def sitemap(request: Request):
    from fastapi.responses import Response
    content = templates.get_template('templates/sitemap.xml').render(get_template_values(request))
    return Response(content=content, media_type='text/xml')


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8080)
