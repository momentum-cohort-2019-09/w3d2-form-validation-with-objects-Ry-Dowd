function qSelect(query) {
    return document.querySelector(query)
}
function qSelectAll(query) {
    return document.querySelectorAll(query)
}
function populateForm(){
    let form = new Form()
    let inputs = qSelectAll("input")
    for (let input of inputs){
        let temp = new Field(input)
        form.addField(temp)
    }
    return form
}
let today = new Date()

qSelect("#parking-form").addEventListener('submit', function(event){
    event.preventDefault()
    let form = populateForm()
    form.validate()
})

let validDict = {
    "car-info" : function validateCar(){
        let regex = /^\d{4}$/
        let year = this.content.slice(0,4)
        if (!regex.test(year)){
            this.throwError("Please make sure that your first four characters are a year")
        } else {
            if(year < 1900 || year > today.getFullYear()){
                this.throwError("Enter a year between 1900 and now")
            } else {
                this.showValid()
            }
        }
    },
    "start-date": function validateDate(){
        
    },
    // "days": validateDays(),
    // "credit-card": validateCard(),
    // "cvv": validateCVV(),
    // "expiration": validateExpiration(),
}
class Validation{
    constructor(test){
        this.test = test
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
        let errors = qSelectAll(".error")
        for (let error of errors){
            error.parentNode.removeChild(error)
        }
    }
    validate() {
        this.clearErrors()
        for(let field of this.fields){
            field.validate()
        }
    }
    getCreditCard(){
        return new CreditCard(this.fields[6].content,this.fields[7].content,this.fields[8].content)
    }
}

class Field {
    constructor(field) {
        this.field = field
        this.content = field.value.trim()
        this.type = field.id
        this.label = field.labels[0].textContent
        this.validation = validDict[this.type] || this.showValid()
        console.log(this.validation)
    }
    validate() {
        if(!this.content){
            this.throwError(this.label + " is required")
        }else{
            this.validation()
        }    
    }
    throwError(message){
        let errDiv = document.createElement("div")
        errDiv.classList.add("error")
        errDiv.textContent = message
        console.log(this.field)
        this.field.parentNode.appendChild(errDiv)
        this.field.parentNode.classList.remove("input-valid")
        this.field.parentNode.classList.add("input-invalid")
    }
    showValid(){
        this.field.parentNode.classList.remove("input-invalid")
        this.field.parentNode.classList.add("input-valid")
    }
}
class CreditCard {
    constructor(number, cvv, expiration) {
        this.number = number
        this.cvv = cvv
        this.expiration = expiration
    }
    validateCardNumber(number) {
        var regex = new RegExp("^[0-9]{16}$");
        if (!regex.test(number))
            return false;

        return this.luhnCheck(number);
    }
    validateExpiration(){
        let regex = /^\d{2}\/\d{2}$/
        console.log("expiration format test " + CanvasRenderingContext2D.test(this.expiration))
        if (!regex.test(this.expiration)){
            return false
        }
    }
    validateCVV(){
        let regex = /^\d{3}$/
        console.log("cvv test result " + regex.test(this.cvv))
        return regex.text(this.cvv)
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