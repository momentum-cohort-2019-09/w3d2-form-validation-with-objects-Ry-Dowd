function qSelect(query) {
    return document.querySelector(query)
}
function qSelectAll(query) {
    return document.querySelectorAll(query)
}
function populateForm() {
    let form = new Form()
    let inputs = qSelectAll("input")
    for (let input of inputs) {
        let temp = new Field(input)
        form.addField(temp)
    }
    return form
}
let today = new Date()
let validForm = true
qSelect("#parking-form").addEventListener('submit', function (event) {
    event.preventDefault()
    let form = populateForm()
    form.validate()
})
let validDict = {
    "car-info": function validateCar() {
        let regex = /^\d{4}$/
        let year = this.content.slice(0, 4)
        if (!regex.test(year)) {
            this.throwError("Please make sure that your first four characters are a year")
        } else {
            if (year < 1900 || year > today.getFullYear()) {
                this.throwError("Enter a year between 1900 and now")
            } else {
                this.showValid()
            }
        }
    },
    "start-date": function validateDate() {
        let startDate = new Date(this.content)
        if (startDate >= today) {
            this.showValid()
        } else {
            this.throwError("Please select a future date")
        }
    },
    "days": function validateDays() {
        let regex = /^\d{1,2}$/
        if (!regex.test(this.content)){
            this.throwError("Please enter a number between 1 and 30")
        } else if (this.content < 1 || this.content > 30) {
            this.throwError("Please select a number of days between 1 and 30")
        } else {
            this.showValid()
        }
    },
    "credit-card": function validateCard() {
        let card = new CreditCard(this.content)
        if (!card.validateCardNumber()) {
            this.throwError("Please enter a valid credit card number")
        } else {
            this.showValid()
        }
    },
    "cvv": function validateCVV() {
        let regex = /^\d{3}$/
        if (!regex.test(this.content)) {
            this.throwError("please enter a valid CVV (3 digits)")
        } else {
            this.showValid()
        }
    },
    "expiration": function validateExpiration() {
        let regex = /^\d{2}\/\d{2}$/
        if (!regex.test(this.content)) {
            this.throwError("Please format your expiration properly (MM/YY)")
        } else {
            console.log("inside else")
            let month = this.content.slice(0, 2)
            let year = this.content.slice(3)
            console.log(month,year)
            if (month == 0 || month > 12) {
                this.throwError("Please enter a valid month")
            } else if (year < 19) {
                this.throwError("Your card is expired")
            } else if (year == 19) {
                console.log("inside final else")
                if ((+month - 1) < today.getMonth()) {
                    console.log("inside final if")
                    this.throwError("Your card is expired")
                } else{
                    this.showValid()
                }
            } else {
                this.showValid()
            }
        }
    }
}
class Form {
    constructor() {
        this.fields = []
    }
    addField(field) {
        this.fields.push(field)
    }
    clearErrors() {
        validForm = true
        let errors = qSelectAll(".error")
        for (let error of errors) {
            error.parentNode.removeChild(error)
        }
    }
    validate() {
        this.clearErrors()
        for (let field of this.fields) {
            field.validate()
        }
        if(validForm){
            qSelect("#total").textContent = "Your total parking cost is $" + this.getPrice()
        }
    }
    getPrice(){
        let  start =  new Date(this.fields[2].content)
        start = start.getDay()
        const days = this.fields[3].content
        let price = 0
        for(let day = 0; day<days; day++){
            if(start === 0){
                price += 7
                start++
            } else if(start < 6){
                price += 5
                start++
            } else {
                price += 7
                start = 0
            }
        }
        return price
    }
}
class Field {
    constructor(field) {
        this.field = field
        this.content = field.value.trim()
        this.type = field.id
        this.label = field.labels[0].textContent
        this.validation = validDict[this.type]
        console.log(this.validation)
    }
    validate() {
        if (!this.content) {
            this.throwError(this.label + " is required")
        } else if(this.validation){
            this.validation()
        }else{
            this.showValid()
        }
    }
    throwError(message) {
        let errDiv = document.createElement("div")
        errDiv.classList.add("error")
        errDiv.textContent = message
        console.log(this.field)
        this.field.parentNode.appendChild(errDiv)
        this.field.parentNode.classList.remove("input-valid")
        this.field.parentNode.classList.add("input-invalid")
        validForm = false
    }
    showValid() {
        this.field.parentNode.classList.remove("input-invalid")
        this.field.parentNode.classList.add("input-valid")
    }
}
class CreditCard {
    constructor(number) {
        this.number = number
    }
    validateCardNumber() {
        var regex = new RegExp("^[0-9]{16}$");
        if (!regex.test(this.number))
            return false;

        return this.luhnCheck(this.number);
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
}