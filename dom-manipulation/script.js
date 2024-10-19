// Initialize the quotes array from local storage.
let quotes = JSON.parse(localStorage.getItem('quotes')) || []

// Get references to the quote display and new quote elements
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
        // Update the category dropdown if the new category is not already present
        if (!categoryOption.includes(newQuoteCategoryValue)) {
            categoryOption.push(newQuoteCategoryValue);
            populateCategories(categoryOption); // Update the dropdown
        }
    }
    // Clear the input fields
    newQuoteText.value = ''
    newQuoteCategory.value = ''
}

//Show a random quote from the quotes array
function showRandomQuote() {
    quoteDisplay.innerHTML = '';
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
const importInput = document.getElementById('importFile');

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

// Initialize an empty array to hold category options
let categoryOption = []

// Create a unique set of categories from the quotes array
const categories = [...new Set(quotes.map(quote => quote.category))];

// Function to remove duplicate items from an array
function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}

// Populate categoryOption with unique categories by removing duplicates
categoryOption = removeDuplicates(categories)

// Get the category filter dropdown element from the DOM
const categoryFilter = document.getElementById('categoryFilter')

// Function to populate the category filter dropdown with options
function populateCategories(arr) {
    // Clear existing options
    categoryFilter.innerHTML = '';
    
    // Add default option if needed
    const defaultOption = document.createElement("option");
    defaultOption.innerHTML = 'Select a category';
    categoryFilter.appendChild(defaultOption);
    
    arr.forEach(category => {
        const option = document.createElement("option");
        option.innerHTML = category;
        categoryFilter.appendChild(option);
    });
}

// Call the populateCategories function to fill the dropdown with category options
populateCategories(categoryOption);


// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    // Clear the current displayed quotes
    quoteDisplay.innerHTML = '';
    
    // Filter quotes based on the selected category
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    
    // Display the filtered quotes
    filteredQuotes.forEach(quote => {
        const quoteCategory = document.createElement('h2');
        quoteCategory.innerHTML = quote.category;
        const quoteText = document.createElement('p');
        quoteText.innerHTML = quote.text;
        quoteDisplay.appendChild(quoteCategory);
        quoteDisplay.appendChild(quoteText);
    });
}

// Add event listener to the category filter dropdown
categoryFilter.addEventListener('change', () => {
    // Save the selected category to local storage
    localStorage.setItem('selectedCategory', categoryFilter.value);
    // Call filterQuotes to update displayed quotes
    filterQuotes();
});

// On page load, check for last selected category in local storage
window.onload = () => {
    const lastSelectedCategory = localStorage.getItem('selectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
        filterQuotes(); // Display quotes for the last selected category
    }
};

// Mock API URL
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; 

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const serverQuotes = await response.json();
        // Assuming server returns an array of quotes
        return serverQuotes.map(quote => ({
            text: quote.title, // Use title as quote text
            category: 'General' // Assign a default category
        }));
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

// Periodically fetch quotes every 5 minutes
setInterval(async () => {
    const serverQuotes = await fetchQuotesFromServer();
    syncQuotesWithServer(serverQuotes);
}, 300000);

function syncQuotesWithServer(serverQuotes) {
    // Check for discrepancies and resolve conflicts
    const localQuotesMap = new Map(quotes.map(quote => [quote.text, quote]));
    let updated = false;

    serverQuotes.forEach(serverQuote => {
        const localQuote = localQuotesMap.get(serverQuote.text);
        if (!localQuote) {
            // If the quote does not exist locally, add it
            quotes.push(serverQuote);
            updated = true;
        } else {
            // If the quote exists locally, we assume server data takes precedence
            Object.assign(localQuote, serverQuote);
            updated = true;
        }
    });

    // Store the updated quotes array in local storage
    if (updated) {
        localStorage.setItem('quotes', JSON.stringify(quotes));
        alert('Quotes updated from server.');
    }
}
