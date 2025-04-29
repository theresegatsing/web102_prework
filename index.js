/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for(const game of games){
        // create a new div element, which will become the game card
        const gameCard = document.createElement("div");

        // add the class game-card to the list
        gameCard.classList.add("game-card");


        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `
        <img src="${game.img}" class="game-img" />
        <h3>${game.name}</h3>
        <p>${game.description}</p>
        <p><strong>Pledged:</strong> $${game.pledged.toLocaleString()}</p>
        `;



        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }



}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((accumulator, game) => {
    return accumulator + game.backers;
}, 0);


// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;


// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce((accumulator, game ) => {
    return accumulator + game.pledged;
}, 0 );

// set inner HTML using template literal
raisedCard.innerHTML = `$ ${totalRaised.toLocaleString()}`;


// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalGames = GAMES_JSON.length;

gamesCard.innerHTML = `${totalGames}`;



/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal); 

    // Log the filtered games array to the console and print the length
    console.log(unfundedGames); // This will show the array of unfunded games
    console.log(unfundedGames.length); // This will show the number of unfunded games


    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);

}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged > game.goal); 

    // Log the filtered games array to the console and print the length
    console.log(fundedGames); // This will show the array of funded games
    console.log(fundedGames.length); // This will show the number of funded games


    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);

}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    // Loop through the games array and create a div for each game
    GAMES_JSON.forEach(game => {
        const gameDiv = document.createElement("div");
        gameDiv.classList.add("game-card"); // Add a class for styling

        // Set the inner HTML of the div to include the game details
        gameDiv.innerHTML = `
            <img src="${game.img}" alt="${game.name}" class="game-img" />
            <h2>${game.name}</h2>
            <p>${game.description}</p>
            <p>Pledged: $${game.pledged.toLocaleString()}</p>
        `;

        // Append the newly created div to the container
        gamesContainer.appendChild(gameDiv);
    });


}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
allBtn.addEventListener("click", showAllGames);
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games

const numUnfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal).length;


// create a string that explains the number of unfunded games using the ternary operator

const totalgames = GAMES_JSON.length;

const totalraised = GAMES_JSON.reduce((sum, game) => sum + game.pledged, 0);


const message = `
    A total of $${totalraised.toLocaleString()} has been raised across ${totalgames} ${totalgames === 1 ? 'game' : 'games'}.
    Currently, a total of ${numUnfundedGames} ${numUnfundedGames === 1 ? 'game' : 'games'} remain unfunded. We need your help to fund
    these amazing games!
`;
// create a new DOM element containing the template string and append it to the description container

// Create a new paragraph element
const messageParagraph = document.createElement("p");

// Set the innerHTML of the new paragraph to the message
messageParagraph.innerHTML = message;

// Append the new paragraph element to the description container
descriptionContainer.appendChild(messageParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games

const [firstGame, secondGame, ...rest] = sortedGames;

//firstGameContainer.innerText = firstGame.name;
//secondGameContainer.innerText = secondGame.name;

// create a new element to hold the name of the top pledge game, then append it to the correct element

const topGameElement = document.createElement("p");
topGameElement.textContent = firstGame.name;
firstGameContainer.appendChild(topGameElement);


// do the same for the runner up item


const secondTopGameElement = document.createElement("p");
secondTopGameElement.textContent = secondGame.name;
secondGameContainer.appendChild(secondTopGameElement);


/* My extra implementation: A Search Bar */

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    const gameCards = document.querySelectorAll(".game-card");

    gameCards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        if (title.includes(query)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});
