import html
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, Response

router = APIRouter()
SITE = "https://bigmultiplayerchess.v5games.com"
UPDATED = "2026-10-22"

POSTS = [
    {
        "slug": "chess-variants-to-try",
        "title": "Chess Variants to Try Beyond the Classic 8x8 Board",
        "desc": "A friendly tour of chess variants, from bigger boards to many armies, and how to play two of them free in your browser.",
        "body": [
            ("p", "Chess has been reshaped by players for centuries. The rules for how pieces move stay familiar, while the board, the number of armies and the goal change. Here is a quick tour of ideas worth exploring, plus where to try them."),
            ("h2", "Bigger boards"),
            ("p", "A larger board gives every piece more room. Bishops and rooks travel farther, knights need more hops to reach the action, and the opening phase lasts longer because armies start further apart. Big Multiplayer Chess includes a classic 1v1 mode on a bigger board, so you can feel the difference while the piece moves stay the ones you know."),
            ("h2", "More than two armies"),
            ("p", "Multiplayer chess places three, four or more armies on the same board. Every move now matters to several opponents at once. A capture helps you, and it also changes the balance between everyone else. In Big Multiplayer Chess you can face up to six armies on one giant board, and the goal is to be the last army standing."),
            ("h2", "Human and computer mix"),
            ("p", "Versus mode lets you choose how many human players sit at the device. Computers take control of every remaining army. That makes it simple to host a game with one friend, with a family group passing the screen around, or on your own against a full table of computer opponents."),
            ("h2", "How to pick a variant"),
            ("ul", [
                "Choose classic 1v1 on a bigger board when you want to sharpen familiar tactics with extra space.",
                "Choose a multiplayer board when you enjoy shifting alliances and watching the whole table.",
                "Start with fewer human players, then add more as the group learns the flow of turns.",
                "Play a few quick games first to see how the pieces travel on the larger board.",
            ]),
            ("h2", "Tips for your first variant game"),
            ("p", "Take a moment before your first move to look at the whole board. Find your army, note which armies sit closest, and plan which pieces to develop first. Develop knights and bishops early, keep your king protected by neighbours, and watch for pieces of yours that are guarded by friends. Variants reward patience, and every game teaches something new."),
            ('h2', 'Why variants keep chess fresh'),
            ('p', 'Every variant asks the same question in a new way: what is the best use of my pieces right now? Familiar patterns such as protecting your king, linking your pieces and trading when ahead still apply, while the setting rewards fresh thinking. Players who explore variants often return to the classic game with sharper eyes for piece activity and board control.'),
            ('p', 'Try a short session of each style in one evening. Play one game on the bigger classic board, then one with several armies. Compare how the opening felt, where your pieces were most useful and which plan you would repeat. Notes in your head are plenty, and the contrast teaches quickly.'),
            ('h2', 'Playing with family and friends'),
            ('p', 'Multi army chess suits groups well, because everyone plays at the same table and the computer fills any empty seats. Beginners can join a lively game without needing an opponent of equal skill, and experienced players enjoy the extra layers of planning.'),
            ("h2", "Try it now"),
            ("p", "No download or signup is needed. Open Big Multiplayer Chess in your browser, pick a mode and start moving pieces within seconds."),
        ],
    },
    {
        "slug": "how-big-multiplayer-chess-works",
        "title": "How Big Multiplayer Chess Works: Armies, Turns and Winning",
        "desc": "A clear walkthrough of Big Multiplayer Chess: choosing players, taking turns, computer opponents and the zoomable board.",
        "body": [
            ("p", "Big Multiplayer Chess is a free chess game that runs in your browser. Instead of one opponent, you can share a large board with several armies. This guide explains how a game flows so you can jump in confidently."),
            ("h2", "Starting a game"),
            ("p", "From the home page you can open Versus mode and choose how many human players will take part, from one to four. Every other army is controlled by the computer, so the board always feels full. You can also open the classic 1v1 mode for a two army match on a bigger board."),
            ("h2", "Taking turns"),
            ("p", "Players move in order around the table. On your turn, select one of your pieces and choose a highlighted destination. Pieces move the way chess players expect, and the game checks that your choice is allowed. When your move is complete the turn passes to the next army, whether that army belongs to a person or to the computer."),
            ("h2", "Winning"),
            ("p", "The game finishes when one army remains. The result screen offers a quick replay, so you can set up the next match right away."),
            ("h2", "Moving around a large board"),
            ("p", "A big board needs good navigation. The board fits itself to your screen, and on touch devices you can pan with two fingers and pinch to zoom in on a busy corner. Zoom in to read a crowded area, then fit the board again to see the full picture."),
            ("h2", "Computer opponents"),
            ("p", "Computer armies weigh the power of pieces, how freely they can move, how well they are protected and which pieces are under threat. That gives them a sensible sense of danger, so expect them to defend their strong pieces and look for good captures."),
            ("h2", "Quick start checklist"),
            ("ul", [
                "Open the game and choose Versus for a multiplayer board or the classic mode for 1v1.",
                "Pick the number of human players.",
                "Tap a piece, then tap a highlighted square to move.",
                "Pinch or use the zoom controls to inspect busy areas.",
                "Replay from the result screen when the game ends.",
            ]),
            ('h2', 'Why the pace feels lively'),
            ('p', 'With several armies, there is always something happening on the board. Between your turns, other armies reposition, capture and defend. Watching those moves is part of the fun, and it gives you useful information for your next decision. Look for which pieces moved, which squares opened up and which of your pieces just became more or less protected.'),
            ('h2', 'Good habits from the very first move'),
            ('p', 'Start by developing pieces toward the middle of your side, keep your king close to friendly pieces and take captures that are safe. As the game continues, the board opens and your pieces gain room. Use zoom to double check crowded areas before you commit to a capture, so each move is made with the full picture in mind.'),
            ('h2', 'Sharing a game'),
            ('p', 'Because everything runs in the browser, you can start on a laptop, a tablet or a phone. Share the link with friends, set the number of human players and enjoy a new table whenever you like.'),
            ("h2", "Play today"),
            ("p", "Big Multiplayer Chess is free and ready in your browser. Gather a friend, or start alone against the computer, and see how your strategy holds up on a giant board."),
        ],
    },
    {
        "slug": "chess-tips-large-boards-and-team-play",
        "title": "Chess Tips for Large Boards and Multi Army Games",
        "desc": "Practical strategy for big chess boards and games with many armies: development, safety, timing and reading the table.",
        "body": [
            ("p", "Large boards and several armies change how a good plan looks. Here are practical habits that help in Big Multiplayer Chess and in any chess game with more than two sides."),
            ("h2", "Develop with purpose"),
            ("p", "With more space, pieces take longer to join the action. Bring your knights and bishops toward the centre early and keep your rooks ready for open lines. A compact, connected army defends itself well and responds quickly to whichever neighbour moves first."),
            ("h2", "Keep your king well guarded"),
            ("p", "On a crowded board threats may arrive from several directions. Surround your king with friendly pieces, and check each turn which opposing pieces could reach it. Protected pieces are harder to capture, so aim for pieces that defend each other."),
            ("h2", "Read the whole table"),
            ("p", "Before moving, scan every army. Note who has strong attackers near your pieces, and who is busy with someone else. When two neighbours focus on each other, you gain time to improve your position or collect a safe capture."),
            ("h2", "Trade with intention"),
            ("p", "In a multi army game, an exchange affects everyone. After a trade, the armies not involved keep their full strength. Favour trades that leave your army compact and well protected, and choose moments when neighbours are occupied."),
            ("h2", "Use the zoom"),
            ("p", "On a large board, details hide in corners. Pinch to zoom for a close look at a crowded area, then fit the board to see the overall balance. Doing this once per turn is a great habit."),
            ("h2", "Playing together"),
            ("ul", [
                "Choose Versus and set several human players to share one device.",
                "Take turns to plan aloud, since everyone benefits from spotting threats.",
                "Let the computer fill the remaining armies for a lively table.",
                "Replay quickly from the result screen and try a different opening plan.",
            ]),
            ('h2', 'Timing your attacks'),
            ('p', 'A strong attack arrives when your pieces are connected and your target has few defenders. Bring a second piece toward the same area before capturing, so your first capture is supported. On a large board this takes a few extra moves, and the preparation pays off because opponents also need time to respond.'),
            ('h2', 'Using the computer armies'),
            ('p', 'Computer armies value strong pieces, mobility and protection, so they tend to guard important pieces. Use that to your advantage by aiming at pieces that are poorly protected, and by keeping your own pieces defended. Practising against them is a relaxed way to learn how multi army games unfold.'),
            ("h2", "Patience pays"),
            ("p", "Large boards reward steady plans. Make one useful improvement each turn, such as moving a piece to a better square or adding protection to a key piece. Over several turns these small steps add up to a strong position, and you will be ready when a good capture appears."),
            ("h2", "A simple checklist per turn"),
            ("ul", [
                "Which of my pieces are protected?",
                "Which opposing pieces can reach my king?",
                "Which capture is safe and improves my position?",
                "Which neighbour is currently the most active?",
            ]),
            ("h2", "Put it into practice"),
            ("p", "Open Big Multiplayer Chess, choose a mode and apply one tip per game. Small habits build stronger play quickly."),
        ],
    },
]

CSS = "body{margin:0;font:17px/1.65 system-ui,Segoe UI,Helvetica,Arial,sans-serif;background:#f5f1e8;color:#1c1c1c}header,footer{background:#2b2118;color:#fff;padding:14px 16px;text-align:center}header a,footer a{color:#ffd98a;text-decoration:none;margin:0 10px;font-weight:600}main{max-width:720px;margin:0 auto;padding:24px 16px}h1{font-size:2rem;line-height:1.25}h2{margin-top:1.8em;font-size:1.35rem}a{color:#7a3b00}.cta{display:inline-block;background:#1f6f3a;color:#fff;padding:12px 22px;border-radius:6px;font-weight:700;text-decoration:none;margin:12px 0}.card{background:#fff;border-radius:8px;padding:16px 18px;margin:14px 0;box-shadow:0 1px 4px rgba(0,0,0,.12)}.card h2{margin:0 0 6px}.meta{color:#555;font-size:.9rem}"

NAV = '<header><a href="/">Play</a><a href="/versus">Versus</a><a href="/blog">Blog</a><a href="/about">About</a></header>'
FOOT = '<footer><a href="/">Play</a><a href="/blog">Blog</a><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><br><span>More games: <a href="https://v5games.com">V5 Games</a><a href="https://rewordgame.com">reWord Game</a><a href="https://wordsmashing.com">Word Smashing</a></span></footer>'


def page(title, desc, path, body, ld, og_type="website"):
    url = SITE + path
    e = html.escape
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<title>{e(title)}</title><meta name="description" content="{e(desc)}">'
        f'<link rel="canonical" href="{url}">'
        f'<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}">'
        f'<meta property="og:url" content="{url}"><meta property="og:type" content="{og_type}">'
        '<meta property="og:site_name" content="Big Multiplayer Chess">'
        f'<meta property="og:image" content="{SITE}/static/img/og-bigmultiplayerchess.png">'
        '<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="twitter:title" content="{e(title)}"><meta name="twitter:description" content="{e(desc)}">'
        f'<meta name="twitter:image" content="{SITE}/static/img/og-bigmultiplayerchess.png">'
        '<link rel="icon" href="/static/favicon.ico">'
        f'<style>{CSS}</style><script type="application/ld+json">{ld}</script></head>'
        f'<body>{NAV}<main>{body}</main>{FOOT}</body></html>'
    )


def render_body(items):
    out = []
    for kind, val in items:
        if kind == "p":
            out.append(f"<p>{html.escape(val)}</p>")
        elif kind == "h2":
            out.append(f"<h2>{html.escape(val)}</h2>")
        else:
            out.append("<ul>" + "".join(f"<li>{html.escape(x)}</li>" for x in val) + "</ul>")
    return "".join(out)


@router.get("/blog", response_class=HTMLResponse)
async def blog_index(request: Request):
    import json
    cards = "".join(
        f'<div class="card"><h2><a href="/blog/{p["slug"]}">{html.escape(p["title"])}</a></h2><p>{html.escape(p["desc"])}</p></div>'
        for p in POSTS
    )
    body = f'<h1>Big Multiplayer Chess Blog</h1><p>Variants, strategy and guides for playing chess on a giant board.</p>{cards}<a class="cta" href="/">Play free now</a>'
    ld = json.dumps({"@context": "https://schema.org", "@type": "Blog", "name": "Big Multiplayer Chess Blog", "url": SITE + "/blog",
                     "blogPost": [{"@type": "BlogPosting", "headline": p["title"], "url": f'{SITE}/blog/{p["slug"]}'} for p in POSTS]})
    return HTMLResponse(page("Big Multiplayer Chess Blog: Variants and Strategy", "Guides on chess variants, how multi army chess works and strategy tips for large boards.", "/blog", body, ld))


@router.get("/blog/{slug}", response_class=HTMLResponse)
async def blog_post(slug: str):
    import json
    p = next((x for x in POSTS if x["slug"] == slug), None)
    if not p:
        return HTMLResponse(page("Not found", "Post not found", "/blog", '<h1>Post not found</h1><p><a href="/blog">Back to the blog</a></p>', "{}"), status_code=404)
    body = (f'<p class="meta"><a href="/blog">Blog</a> / {html.escape(p["title"])}</p><article><h1>{html.escape(p["title"])}</h1>'
            f'<p class="meta">Updated {UPDATED}</p>{render_body(p["body"])}</article><a class="cta" href="/">Play Big Multiplayer Chess free</a>'
            '<p>More reading: ' + " ".join(f'<a href="/blog/{o["slug"]}">{html.escape(o["title"])}</a>' for o in POSTS if o is not p) + "</p>")
    ld = json.dumps({"@context": "https://schema.org", "@type": "Article", "headline": p["title"], "description": p["desc"],
                     "datePublished": UPDATED, "dateModified": UPDATED, "mainEntityOfPage": f'{SITE}/blog/{slug}',
                     "image": SITE + "/static/img/og-bigmultiplayerchess.png",
                     "author": {"@type": "Organization", "name": "Big Multiplayer Chess"},
                     "publisher": {"@type": "Organization", "name": "Big Multiplayer Chess", "logo": {"@type": "ImageObject", "url": SITE + "/static/img/big-multiplayer-chess-logo512.png"}}})
    return HTMLResponse(page(p["title"], p["desc"], f"/blog/{slug}", body, ld, "article"))
