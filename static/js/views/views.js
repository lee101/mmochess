(function () {
    "use strict";
    window.APP = window.APP || {Routers: {}, Collections: {}, Models: {}, Views: {}};

    APP.Views['/'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('start.jinja2'));

            return this;
        }
    });
    function LevelView(numPlayers) {
        return Backbone.View.extend({
            initialize: function (options) {
            },

            render: function () {
                var self = this;

                var level = {
                    "height": 12 * 3,
                    "width": 12 * 2,
                    "num_players": 6,
                    "num_human_players": numPlayers
                };

                APP.game = new mmochess.Game(level);
                APP.game.render(self.$el);

                return self;
            }
        });
    }

    var onePlayerLevel = LevelView(1);
    APP.Views['/play'] = onePlayerLevel;


    APP.Views['/done-level'] = Backbone.View.extend({
        initialize: function (options) {
            this.level = options.args[0];
        },

        render: function () {

        }

    });

    APP.Views['/versus'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('versus.jinja2'));
            return this;
        }
    });

    APP.Views['/versus/1player'] = onePlayerLevel;

    APP.Views['/versus/2player'] = LevelView(2);
    APP.Views['/versus/3player'] = LevelView(3);
    APP.Views['/versus/4player'] = LevelView(4);
    APP.Views['/versus/5player'] = LevelView(5);
    APP.Views['/versus/6player'] = LevelView(6);


    APP.Views['/contact'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('contact.jinja2'));
            return this;
        }
    });

    APP.Views['/about'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('about.jinja2'));
            return this;
        }
    });
    APP.Views['/terms'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('terms.jinja2'));
            return this;
        }
    });
    APP.Views['/privacy'] = Backbone.View.extend({
        initialize: function (options) {
        },

        render: function () {
            this.$el.html(evutils.render('privacy.jinja2'));
            return this;
        }
    });


    APP.Views.Header = Backbone.View.extend({
        initialize: function (options) {
            this.path = options.path;
        },

        render: function () {
            var self = this;
            gameon.getUser(function (user) {
                self.$el.html(evutils.render('header.jinja2', {'path': self.path, 'user': user}));
            });

            return self;
        }
    });

    APP.Views.Footer = Backbone.View.extend({
        initialize: function (options) {
            this.path = options.path;
        },

        render: function () {
            this.$el.html(evutils.render('footer.jinja2', {'path': this.path}));
            return this;
        }
    });

}());
