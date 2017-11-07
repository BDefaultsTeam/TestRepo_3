
// keeps track of pending operations to ensure expensive
// tasks are not concurrently run
function SingleOperation() {
    this.pending = {};
}

SingleOperation.prototype.run = function(key, valueFactory) {

    var operationPromise = this.pending[key];
    if (operationPromise) {
        return operationPromise;
    }

    var pending = this.pending;
    var promise = this.pending[key] = valueFactory()
        .finally(function() {
            delete pending[key];
        });

    return promise;
};

module.exports = SingleOperation;
