var costs = [
    {
        dest: 'Juarez',
        prices: [
            100, 200, 400
        ]
    }
];

var functions = {
    init: function() {
        if (!localStorage.users) localStorage.users = JSON.stringify([]);
        if (!localStorage.user) localStorage.user = JSON.stringify({});
        if (!localStorage.logged) localStorage.logged = false;
        if (!localStorage.travels) localStorage.travels = JSON.stringify([]);

        this.users = JSON.parse(localStorage.users);
        this.user = JSON.parse(localStorage.user);
        this.logged = JSON.parse(localStorage.logged);
        this.travels = JSON.parse(localStorage.travels);

        console.log(localStorage);
    },
    clear: function() {
        localStorage.users = JSON.stringify([]);
        localStorage.user = JSON.stringify({});
        localStorage.logged = false;
        localStorage.travels = JSON.stringify([]);

        this.users = [];
        this.user = {};
        this.logged = false;
        this.travels = [];
    },
    store: function(name, value) {
        localStorage[name] = JSON.stringify(value);
        this[name] = value;
    },
    setMessageHandler: function(handler) {
        this.messageHandler = handler;
    },
    message: function(title, text, type) {
        if (typeof this.messageHandler === 'undefined') {
            console.log('[' + type + ']' + title + ': ' + text);
        } else {
            if (typeof this.messageHandler === 'function') {
                this.messageHandler(title, text, type);
            }
        }
    },
    getUser: function(email) {
        for (var i in this.users) {
            var user = this.users[i];

            if (user.email === email) {
                return user;
            }
        }

        return null
    },
    addUser: function(name, email, password) {
        if (this.getUser(email) === null) {
            this.users.push({
                name: name,
                email: email,
                password: password
            });

            this.store('users', this.users);

            return true;
        }

        return false;
    },
    isLogged: function() {
        return this.logged;
    },
    logout: function() {
        this.store('user', {});
        this.store('logged', false);
    },
    login: function(email, password) {
        var user = this.getUser(email);

        if (user !== null && user.password === password) {
            this.store('user', user);
            this.store('logged', true);
            return true;
        }

        return false;
    },
    myTravels: function() {
        var myTravels = [];

        for (var i in this.travels) {
            var travel = this.travels[i];

            if (travel.user.email === this.user.email) {
                myTravels.push(travel);
            }
        }

        return myTravels;
    },
    getTravels: function(from, to) {
        var foundTravels = [];

        for (var i in this.travels) {
            var travel = this.travels[i];

            if (travel.from === from && travel.to === to) {
                foundTravels.push(travel);
            }
        }

        return foundTravels;
    },
    addTravel: function(user, from, to, vehicle) {
        this.travels.push({
            user: user,
            from: from,
            to: to,
            vehicle: vehicle
        });

        this.store('travels', this.travels);
    },
    calculate: function(travel) {
        for (var i in costs) {
            var cost = costs[i];

            if (cost.dest === travel.to) {
                return cost.prices[0];
            }
        }
    }
};

functions.init();
