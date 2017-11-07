function StorageError(code, message) {
    this.code = code;
    this.message = message || StorageError.Messages[code] || 'Storage Error';
    this.stack = (new Error()).stack;
}

StorageError.prototype = Object.create(Error.prototype);
StorageError.prototype.constructor = StorageError;

StorageError.Codes = {
    ObjectExists: 'ObjectExists'
};

StorageError.Messages = {
    ObjectExists: 'Object already exists'
};


module.exports = StorageError;