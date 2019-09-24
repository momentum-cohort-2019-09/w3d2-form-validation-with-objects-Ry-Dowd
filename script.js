function qSelect(query) {
    return document.querySelector(query)
}
function qSelectAll(query) {
    return document.querySelectorAll(query)
}

class Form {
    constructor() {
        this.fields = []
    }
    addField(field) {
        this.fields.push(field)
    }
    clearErrors() {
        
    }
}

class Field {
    constructor(field, type) {
        this.field = field
        this.content = field.value
        this.type = type
    }
    validate(Field) {

    }
}
class CreditCard {
    constructor(number) {
        this.number = number
    }
    validateCardNumber(number) {
        var regex = new RegExp("^[0-9]{16}$");
        if (!regex.test(number))
            return false;

        return this.luhnCheck(number);
    }

    luhnCheck(val) {
        var sum = 0;
        for (var i = 0; i < val.length; i++) {
            var intVal = parseInt(val.substr(i, 1));
            if (i % 2 == 0) {
                intVal *= 2;
                if (intVal > 9) {
                    intVal = 1 + (intVal % 10);
                }
            }
            sum += intVal;
        }
        return (sum % 10) == 0;
    }
    validate() {
        return this.validateCardNumber(this.number)
    }
}