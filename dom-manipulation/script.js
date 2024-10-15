const quotes = [
    { text: "Believe you can and you're halfway there.", category: "Inspirational" },
    { text: "The only way to do great work is to love what you do.", category: "Motivational" },
]
const quoteDisplay = document.getElementById('quoteDisplay')
const quoteCategory = document.createElement('h2')
quoteCategory.id = 'quoteCategory'
const quoteText = document.createElement('p')
quoteText.id = 'quoteText'
const newQuote = document.getElementById('newQuote')
const addQuoteForm = document.createElement('div')
addQuoteForm.id = 'addQuoteForm'
const newQuoteText = document.createElement('input')
newQuoteText.id = 'newQuoteText'
newQuoteText.placeholder = 'Text'
const newQuoteCategory = document.createElement('input')
newQuoteCategory.id = 'newQuoteCategory'
newQuoteCategory.placeholder = 'Category'
const add = document.createElement('button')
add.textContent = "Add Quote"
add.addEventListener(('click'), addQuote)
const body = document.getElementsByTagName('body');

addQuoteForm.appendChild(document.createElement('br'))
addQuoteForm.appendChild(newQuoteCategory)
addQuoteForm.appendChild(newQuoteText)
addQuoteForm.appendChild(add)
body[0].appendChild(addQuoteForm);

function addQuote() {
    const newQuoteTextValue = newQuoteText.value.trim()
    const newQuoteCategoryValue = newQuoteCategory.value.trim()
    if (newQuoteTextValue && newQuoteCategoryValue) {
        quotes.push({
            text: newQuoteTextValue,
            category:  newQuoteCategoryValue
        })
    }
    addQuoteForm
    newQuoteText.value = ''
    newQuoteCategory.value = ''
}

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteText.innerHTML = randomQuote.text;
    quoteCategory.innerHTML = randomQuote.category
    quoteDisplay.appendChild(quoteCategory)
    quoteDisplay.appendChild(quoteText)
}

newQuote.addEventListener(('click'), showRandomQuote)
