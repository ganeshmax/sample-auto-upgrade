var util = {
    log: function(name, value) {
        if(value === undefined) {
            value = '';
        }
        $('#log').append(name + ': ' + value + '<br>');
        console.log('---------- ' + name + ': ' + value);
    }
};

