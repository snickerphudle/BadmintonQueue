import Player from "./Player.js"
import Queue from "./Queue.js"
import System from "./System.js"

var numCourts = 4;
const queues = [];
var playerNames = [];
var players = [];


/**
 * Removes a new player from the system.
 */
function removePlayer() {

}

/**
 * Adds a new player to the system.
 */
function signUpPlayer(e) {
    //prevents the form from refreshing the page
    e.preventDefault();

    //loads the data from local storage into the backend
    load();

    //retrieves the name entered in the form, creates a player object with the name, and adds it to the list of all players
    let name = document.querySelector('#signUpName').value.trim();
    if (playerNames.includes(name)) {
        alert('Another player with that name already exists. Please select a different name.');
    } else if (name === "") {
        alert('You cannot enter an empty name. Please select a different name with letters.');
    } else {
        let p = new Player(name);
        playerNames.push(name);
        players.push(p);
    }

    console.log(players);
    console.log(playerNames);

    //resets the form's fields to be empty
    document.querySelector('#signUpForm').reset(); 

    save();
}

/**
 * Loads the data from local storage into the current state.
 */
function load() {
    //retrieves the data stored in local storage
    let storedPlayers = localStorage.getItem("storedPlayers");
    let storedPlayerNames = localStorage.getItem("storedPlayerNames");

    //if there is persistent data in local storage, load the data into the local variables.
    if (storedPlayers != null) {    
        players = JSON.parse(storedPlayers);
        playerNames = JSON.parse(storedPlayerNames);
    }
}

/**
 * Saves the data in the current state into the local storage.
 */
function save() {
    //stores this new change in local storage for persistence
    localStorage.setItem('storedPlayers', JSON.stringify(players));
    localStorage.setItem('storedPlayerNames', JSON.stringify(playerNames));
}

/**
 * Removes all players from the system.
 */
function clearPlayers() {
    localStorage.clear();
}

/**
 * Resets the system to a fresh state with zero players, and the default number of courts, 4.
 */
 function resetSystem() {
    clearPlayers();
    setNumCourts(4);
}

/**
 * Sets the number of courts to the amount specified. FIXME
 */
 function setNumCourts(num) {
    numCourts = num;
}

/**
 * Adds players to the queue if the button "Join Queue" is clicked and the credentials are correct.
 */
function pushPlayers(e) {
    e.preventDefault();
    let credentials = {
        p1: {
            name: document.querySelector('#addName1').value,
            password: document.querySelector('#addPass1').value
        },
        p2: {
            name: document.querySelector('#addName2').value,
            password: document.querySelector('#addPass2').value
        },
        p3: {
            name: document.querySelector('#addName3').value,
            password: document.querySelector('#addPass3').value
        },
        p4: {
            name: document.querySelector('#addName4').value,
            password: document.querySelector('#addPass4').value
        }
    };

    let court = document.querySelector('#selectCourtAdd').value;

    

    //resets the form's fields to be empty
    document.querySelector('#addForm').reset();
}

function validateCredentials(players) {

}

document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('joinButton').addEventListener('click', pushPlayers);
    //document.getElementById('mergeButton').addEventListener('click', //FIXME);
    //document.getElementById('removeButton').addEventListener('click', //FIXME);
    document.getElementById('signUpButton').addEventListener('click', signUpPlayer);
});