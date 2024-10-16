// Initialize the quotes array from local storage.
let quotes = JSON.parse(localStorage.getItem('quotes')) || []

// Get references to the quote display and new quote elementss
const quoteDisplay = document.getElementById('quoteDisplay')
const quoteCategory = document.createElement('h2')
quoteCategory.id = 'quoteCategory'
const quoteText = document.createElement('p')
quoteText.id = 'quoteText'
const newQuote = document.getElementById('newQuote')

// Create a form to add new quotes
const createAddQuoteForm = document.createElement('div')
createAddQuoteForm.id = 'createAddQuoteForm'
const newQuoteText = document.createElement('input')
newQuoteText.id = 'newQuoteText'
newQuoteText.placeholder = 'Text'
const newQuoteCategory = document.createElement('input')
newQuoteCategory.id = 'newQuoteCategory'
newQuoteCategory.placeholder = 'Category'
const add = document.createElement('button')
add.textContent = "Add Quote"

// Add event listener to the add button
add.addEventListener(('click'), addQuote)

// Append the form elements to the form
createAddQuoteForm.appendChild(document.createElement('br'))
createAddQuoteForm.appendChild(newQuoteCategory)
createAddQuoteForm.appendChild(newQuoteText)
createAddQuoteForm.appendChild(add)

// Append the form to the body
const body = document.getElementsByTagName('body');
body[0].appendChild(createAddQuoteForm);

//Add a new quote to the quotes array and store it in local storage
function addQuote() {
    // Get the values of the new quote text and category inputs
    const newQuoteTextValue = newQuoteText.value.trim()
    const newQuoteCategoryValue = newQuoteCategory.value.trim()
    // Check if both values are not empty
    if (newQuoteTextValue && newQuoteCategoryValue) {
        // Add the new quote to the quotes array
        quotes.push({
            text: newQuoteTextValue,
            category:  newQuoteCategoryValue
        })
        // Store the updated quotes array in local storage
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }
    // Clear the input fields
    newQuoteText.value = ''
    newQuoteCategory.value = ''
}

//Show a random quote from the quotes array
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteText.innerHTML = randomQuote.text;
    quoteCategory.innerHTML = randomQuote.category
    quoteDisplay.appendChild(quoteCategory)
    quoteDisplay.appendChild(quoteText)
}

// Add event listener to the new quote button
newQuote.addEventListener(('click'), showRandomQuote)

// JSON Export
const exportButton = document.getElementById('exportQuotes');
exportButton.textContent = "Export Quotes";

exportButton.addEventListener('click', () => {
    const jsonQuotes = JSON.stringify(quotes);
    const blob = new Blob([jsonQuotes], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
});

// JSON Import
const importInput = document.createElement('input');
importInput.type = 'file';
importInput.accept = '.json';
body[0].appendChild(importInput);

importInput.addEventListener('change', (e) => {
    const file = importInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const jsonQuotes = JSON.parse(reader.result);
        quotes = jsonQuotes;
        localStorage.setItem('quotes', JSON.stringify(quotes));
        importInput.value = '';
    };
    reader.readAsText(file);
});
