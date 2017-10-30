(function($){
    $('.nav-toggle').click(function() {
        $('.nav-toggle').toggleClass('is-active');
        $('.nav-menu').toggleClass('is-active');
    });

    var viewHistory = [];
    var currentView = -1;

    $.viewHistory = function() {
        return viewHistory;
    }

    var showMap = function(view) {
        if ($('.map', view).length > 0) {
            $('.map', view).locationpicker({
                location: {
                    latitude: 28.7032804,
                    longitude: -106.1352603
                },
            });
        }
    }

    var show = function(id, back) {
        var templates = $('.view');

        templates.each(function(index, template) {
            var templateId = '#' + $(template).attr('id');

            if (templateId !== id) {
                $(templateId).hide();
            }
        });

        $(id).show(0, function() {
            showMap(id);
        });

        if (typeof back === 'undefined' 
            && id !== '#signin' && id !== '#signup' 
            && id !== viewHistory[currentView]) {
            viewHistory.push(id);
        }

        if (id === '#signin' || id === '#signup') {
            viewHistory = [];
        }
        
        currentView = viewHistory.length - 1;

        if (currentView > 0) {
            $('#back-action').show();
        } else {
            $('#back-action').hide();
        }

        if (id == '#signin' || id == '#signup') {
            $('#signin-action').show();
            $('#signup-action').show();
            $('#account-action').hide();
            $('#logout-action').hide();
        } else {
            $('#signin-action').hide();
            $('#signup-action').hide();
            $('#account-action').show();
            $('#logout-action').show();
        }

        $('.nav-toggle').removeClass('is-active');
        $('.nav-menu').removeClass('is-active');

        $('html, body').animate({ scrollTop: 0 }, 'slow');
    }

    if (!functions.isLogged()) {
        show('#signin');
    } else {
        show('#index');
    }

    functions.setMessageHandler(function(title, text, type){
        var notification
            = $('<div>').addClass('notification').addClass('is-' + type);
        var notificationTitle = $('<b>').text(title + ': ');
        var closeButton = $('<button>').addClass('delete');
        notification.append(notificationTitle);
        notification.append(closeButton);
        notification.append(text);

        notification.hide();
        $('body').prepend(notification);
        notification.show('slow');

        closeButton.on('click', function() {
            notification.hide('slow', function() {
                notification.remove();
            });
        });

        setTimeout(function() {
            closeButton.trigger('click');
        }, 3000);
    });

    $('#back-action').on('click', function(e) {
        e.preventDefault();

        viewHistory.pop();
        view = viewHistory[currentView - 1];
        if (typeof view !== 'undefined') {
            show(view, true);
        }
    });

    $('[data-view], #back-action').on('click', function(e) {
        e.preventDefault();

        var view = $(this).data('view');
        if (typeof view !== 'undefined') {
            show(view);
        }
    });

    $('#viaje-redondo').on('click', function(e) {
        if ($(this).is(':checked')) {
            $('#fecha-vuelta').show();
        } else {
            $('#fecha-vuelta').hide();
        }
    });

    $('#logout-action').on('click', function(e) {
        e.preventDefault();
        functions.logout();
        show('#signin');
    });

    $('form[data-message]').on('submit', function(e) {
        e.preventDefault();

        var title = $(this).data('title');
        var message = $(this).data('message');

        functions.message(title, message, 'success');

        var view = viewHistory[0];
        viewHistory = [];
        show(view);
    });

    $('#signin-form').on('submit', function(e){
        e.preventDefault();

        var email = $('input[name="email"]', this).val();
        var password = $('input[name="password"]', this).val();

        if (functions.login(email, password)) {
            functions.message('Login', '¡Bienvenido!', 'success');
            show('#index');
        } else {
            functions.message('Login', 'Usuario y/o contraseña invalidos', 'warning');
        }
    });

    $('#signup-form').on('submit', function(e){
        e.preventDefault();

        var name = $('input[name="name"]', this).val();
        var email = $('input[name="email"]', this).val();
        var password = $('input[name="password"]', this).val();
        var confirmation = $('input[name="password_confirmation"]', this).val();

        var errors = false;

        if (functions.getUser(email) !== null) {
            errors = true;
            functions.message('Registro', 'El correo ya esta en uso', 'warning');
        }

        if (password !== confirmation) {
            errors = true;
            functions.message('Registro', 'Las contraseñas no coinciden', 'warning');
        }

        if (errors) return;

        if (functions.addUser(name, email, password)) {
            functions.message('Registro', 'Registrado correctamente', 'success');
            functions.login(email, password);
            show('#index');
        } else {
            functions.message('Registro', 'No se pudo completar el registro', 'warning');
        }
    });
})(jQuery);
