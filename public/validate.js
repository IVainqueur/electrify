const checkBTN = document.querySelector('#CheckBTN')
const tokenBox = document.querySelector('#TokenBox')
const resultsSpan = document.querySelector('.ResultsSpan')
const resultFieldSet = document.querySelector('.Results')

checkBTN.addEventListener('click', (e)=>{
    let tokenNumber = tokenBox.value.split(' ').join('')
    if(tokenNumber.match(/[^0-9]/g)){
        return alert("The token number should only contain numbers!")
     }
     if(tokenNumber.length != 8){
         return alert("Exactly 8 Digits for the meter number. You entered "+ tokenNumber.length)
     }

    checkBTN.innerHTML = `<img src="./loading.svg" class="loading">` + checkBTN.innerHTML
    checkBTN.style.pointerEvents = "none"
    checkBTN.style.filter = "brightness(0.8)"
    fetch('/validate', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            number: tokenNumber
        })
    })
    .then(res => res.json())
    .then(data => {
        checkBTN.innerHTML = `CHECK`
        checkBTN.style.pointerEvents = ""
        checkBTN.style.filter = "none"
        if(data.code == "#Error") return alert("Something went wrong. Please try again!")
        if(data.code == "#NoSuchToken") return alert("No such TOKEN")
        console.log(data)
        let time = 0;
        let now = new Date(Date.now())
        now = Date.now() - (now.getMilliseconds() + now.getSeconds()*1000 + now.getMinutes()*60*1000 + now.getHours()*60*60*1000)
        console.log("This is now" + now)
        data.toShow = [data.toShow]
        for(let one of data.toShow){
            console.log(one.expiryDate)
            let toUse = new Date(one.expiryDate) 
            toUse = Date.parse(toUse) - (toUse.getMilliseconds() + toUse.getSeconds()*1000 + toUse.getMinutes()*60*1000 + toUse.getHours()*60*60*1000)

            console.log(toUse)
            time += (toUse - now)
        }
        time = time/(24*60*60*1000)
        resultFieldSet.classList.remove("hide")
        let message = ""
        if(time <= 0){
            message = "The token is already used"
        }else{
            message = "The Token is VALID"
        }
        resultsSpan.innerHTML = `${message}`
    })
})


