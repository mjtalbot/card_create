var app = angular.module('app');

app.filter('image_filter', function() {
    return function(input) {
        if (input == 'undefined')
            input = undefined;

        return (input && "background-image:url('"+input+"');" || '');
    };
});
