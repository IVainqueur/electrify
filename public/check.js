const checkBTN = document.querySelector('#CheckBTN')
const meterBox = document.querySelector('#MeterBox')
const resultsSpan = document.querySelector('.ResultsSpan')
const resultFieldSet = document.querySelector('.Results')

checkBTN.addEventListener('click', (e)=>{
    let meterNumber = meterBox.value.split(' ').join('')
    if(meterNumber.match(/[^0-9]/g)){
        return alert("The Meter number should only contain numbers!")
     }
     if(meterNumber.length != 6){
         return alert("Exactly 6 Digits for the meter number. You entered "+ meterNumber.length)
     }

    checkBTN.innerHTML = `<img src="./loading.svg" class="loading">` + checkBTN.innerHTML
    checkBTN.style.pointerEvents = "none"
    checkBTN.style.filter = "brightness(0.8)"
    fetch('/check', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: meterNumber
        })
    })
    .then(res => res.json())
    .then(data => {
        checkBTN.innerHTML = `CHECK`
        checkBTN.style.pointerEvents = ""
        checkBTN.style.filter = "none"
        if(data.code == "#Error") return alert("Something went wrong. Please try again!")
        if(data.code == "#NoSuchAccount") return alert("Your meter is invalid")
        console.log(data)
        let time = 0;
        let now = new Date(Date.now())
        now = Date.now() - (now.getMilliseconds() + now.getSeconds()*1000 + now.getMinutes()*60*1000 + now.getHours()*60*60*1000)
        console.log("This is now" + now)
        for(let one of data.toShow){
            console.log(one.expiryDate)
            let toUse = new Date(one.expiryDate) 
            toUse = Date.parse(toUse) - (toUse.getMilliseconds() + toUse.getSeconds()*1000 + toUse.getMinutes()*60*1000 + toUse.getHours()*60*60*1000)

            console.log(toUse)
            time += (toUse - now)
        }
        time = time/(24*60*60*1000)
        resultFieldSet.classList.remove("hide")
        let message = `${time} day(s) remaining`
        if(time < 0) time = 0
        if(time == 0){
            message += `, BUY MORE!`
        }
        resultsSpan.innerHTML = message
    })
})


//Stupid comment