const buyBTN = document.querySelector('#BuyBTN')
const amountBox = document.querySelector('#AmountBox')
const meterBox = document.querySelector('#MeterBox')
const codeSpan = document.querySelector('.CodeSpan')
const expirySpan = document.querySelector('.ExpirySpan')
const resultFieldSet = document.querySelector('.Results')


buyBTN.addEventListener('click', (e)=>{
    let meterNumber = meterBox.value.split(' ').join('')
    let amount = amountBox.valueAsNumber
    if(meterNumber.match(/[^0-9]/g)){
       return alert("The Meter number should only contain numbers!")
    }
    if(meterNumber.length != 6){
        return alert("Exactly 6 Digits for the meter number. You entered "+ meterNumber.length)
    }
    if(amount%100 != 0){
       return alert("Only multiples of 100 for the amount")
    }

    buyBTN.innerHTML = `<img src="./loading.svg" class="loading">` + buyBTN.innerHTML
    buyBTN.style.pointerEvents = "none"
    buyBTN.style.filter = "brightness(0.8)"
    fetch('/buy', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: meterNumber,
            amount: amount
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.code == "#Error") return alert("Something went wrong. Please try again!")
        codeSpan.innerHTML = "<b>Code</b>: " + data.toShow.code
        expirySpan.innerHTML = "<b>Expiry Date</b>: " + (new Date(data.toShow.expiryDate)).toString().slice(0, 15)
        resultFieldSet.classList.remove("hide")
        buyBTN.innerHTML = `BUY`
        buyBTN.style.pointerEvents = ""
        buyBTN.style.filter = "none"
    })
})