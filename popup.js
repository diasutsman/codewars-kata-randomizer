const randomKata = document.getElementById('randomKata')
const inputId = document.getElementById('inputId')
const formCheckDate = document.getElementById('formCheckDate')
const resultDate = document.getElementById('resultDate')
const scrollSwitch = document.querySelector('.switch input[type="checkbox"]')
const main = document.querySelector('.main')
const message = document.getElementById('not-right-page')

let tab;

(async () => {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => window.location.href.startsWith('https://www.codewars.com/kata/search/'),
    }, ([{ result: isValid }]) => {
        if (isValid) {
            message.style.display = 'none'
        } else {
            main.style.display = 'none'
        }
    })
})();


randomKata.addEventListener('click', async () => {
    message.style.display = 'none'
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: chooseKata,
    })
})

scrollSwitch.addEventListener('click', async () => {

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: loadAllKatas(),
        args: [scrollSwitch.checked]
    });
})

formCheckDate.addEventListener('submit', async (e) => {
    e.preventDefault()
    resultDate.innerText = 'loading...'
    const kata = await fetch(`https://www.codewars.com/api/v1/code-challenges/${inputId.value}`)
        .then(res => res.json())
        .then(data => data)
    const arr = new Date(kata.publishedAt).toDateString().split(' ').slice(1)
    resultDate.innerText = `${arr[1]} ${arr[0]} ${arr[2]}`
})

function chooseKata() {
    const katas = document.querySelectorAll('.list-item-kata')
    const { id } = katas[~~(Math.random() * katas.length)]
    window.open(`https://codewars.com/kata/${id}`, '_blank')
}

function loadAllKatas() {

    let id

    return checked => {
        const isEnd = document.querySelector('.has-centered-text') === null
        if (checked && !isEnd) {
            id = setInterval(() => {
                window.scrollTo(0, document.body.scrollHeight);
                if (!document.querySelector('.has-centered-text')) clearInterval(id);
            }, 10)
        } else {
            clearInterval(id)
        }
    }
}