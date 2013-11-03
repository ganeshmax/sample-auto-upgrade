function BootstrapError(type, code, message) {
    this.type = type;
    this.code = code;
    this.message = message;
}

BootstrapError.Type = {
    FATAL: 1,
    NON_FATAL: 2
};

BootstrapError.prototype = {
    isFatal: function() {
        return this.type === 1;
    }
};