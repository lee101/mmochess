(function () {
    "use strict";
    window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};
    APP.routerViews = {};

    APP.goto = function (name) {
        if (APP.game) {
            APP.game.destruct();
        }
        APP.router.navigate(name, {trigger: true});
        return false
    };



    APP.stepBack = function () {
        var currrentPath = window.location.hash;
        if (currrentPath == "") {
            currrentPath = window.location.pathname;
        }
        if (currrentPath.length <= 1) {
            APP.goto('/');
        }
        else {
            currrentPath = currrentPath.split('/');
            currrentPath.pop();
            currrentPath = currrentPath.join('/');
            APP.goto(currrentPath);
        }
        return false
    };


    $(document).on('click', 'a:not([data-bypass])', function (e) {
        var href = $(this).prop('href');
        var root = location.protocol + '//' + location.host + '/';
        if (root === href.slice(0, root.length)) {
            e.preventDefault();
            APP.goto(href.slice(root.length));
        }
    });

    APP.gotoLink = function (link) {
        if(gameon.isInIFrame()) {
            return true;
        }
        var href = $(link).prop('href');
        var root = location.protocol + '//' + location.host + '/';
        if (root === href.slice(0, root.length)) {
            APP.goto(href.slice(root.length));
            return false;
        }
    };

    var currentView;

    function animateTo(view) {
        var $mainbody = $('#mainbody');
        var duration = 300;
        if (gameon.noAnimation) {
            duration = 0;
        }

        $mainbody.fadeOut(duration, function () {
            if (currentView) {
                currentView.close();
            }

            currentView = view;
            if (view.rendersAsync) {
                view.renderCallback = function () {
                    $mainbody.html(view.el);
                    $mainbody.fadeIn(duration, function () {
                        if (typeof specHelpers == 'object') {
                            specHelpers.once();
                        }
                    });
                };
                view.render();
            }
            else {
                $mainbody.html(view.render().el);

                $mainbody.fadeIn(duration, function () {
                    //scroll to top
                    $("html, body").scrollTop(0);
                    if (typeof specHelpers == 'object') {
                        specHelpers.once();
                    }
                });
            }
        });

        //scroll to top
        $("html, body").scrollTop(0);
    }

    APP.refresh = function () {
        APP.footer.path = location.pathname;
        APP.header.path = location.pathname;
        $('#headerbody').html(APP.header.render().el);
        $('#footerbody').html(APP.footer.render().el);
        $.ajax({ url: 'http://platform.twitter.com/widgets.js', dataType: 'script', cache: true});
    };


    APP.currentView = location.pathname;
    function defaultHandler(pathname) {
        return function () {
            var args = arguments;
            if (APP.currentView == pathname && prerenderedPages[APP.currentView]) {
                return;
            }

            APP.currentView = pathname;
            APP.refresh();
            animateTo(new APP.Views[pathname]({args: args}));
        }
    }

    var prerenderedPages = {
        "/": "home",
        '/timed': 'timed',
        '/classic': 'classic',
        '/versus': 'versus',

        '/instructions': 'instructions',
        "/about": "about",
        "/contact": "contact",
        "/terms": "terms",
        "/privacy": "privacy"
    };
    var routes = {};
    $.each(prerenderedPages, function (key, value) {
        routes[key.substring(1)] = value;
    });
    jQuery.extend(routes, {
        //pages needing js rendering
        'play': 'play',
        'classic1v1': 'classic1v1',
        'classic1v1/ai': 'classic1v1ai',
        'versus/1player': 'versus1player',
        'versus/2player': 'versus2player',
        'versus/3player': 'versus3player',
        'versus/4player': 'versus4player',
        'versus/5player': 'versus5player',
        'versus/6player': 'versus6player'
    });

    var Router = Backbone.Router.extend({
        // Define routes
        'routes': routes,
        'home': defaultHandler('/'),
        'play': defaultHandler('/play'),
        'timed': defaultHandler('/timed'),
        'classic': defaultHandler('/classic'),
        'classic1v1': defaultHandler('/classic1v1'),
        'classic1v1ai': defaultHandler('/classic1v1/ai'),
        'versus': defaultHandler('/versus'),
        'versus1player': defaultHandler('/versus/1player'),
        'versus2player': defaultHandler('/versus/2player'),
        'versus3player': defaultHandler('/versus/3player'),
        'versus4player': defaultHandler('/versus/4player'),
        'versus5player': defaultHandler('/versus/5player'),
        'versus6player': defaultHandler('/versus/6player'),
        'instructions': defaultHandler('/instructions'),
        'contact': defaultHandler('/contact'),
        'about': defaultHandler('/about'),
        'terms': defaultHandler('/terms'),
        'privacy': defaultHandler('/privacy')
    });


    $(document).ready(function () {
        APP.router = new Router();
        APP.header = new APP.Views.Header({path: location.pathname});
        APP.footer = new APP.Views.Footer({path: location.pathname});
        APP.doneLevel = defaultHandler('/done-level');
        Backbone.history.start({
            pushState: true
//            silent: true
        });

        $(document).on('click', '.ws-help-btn', function () {
            var $modal = $('#modal');
            $modal.find('.modal-body').html($('#instructions').html());
            $modal.modal('show');
        });
    });
}());
