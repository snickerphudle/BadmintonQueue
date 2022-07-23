import Player from "./Player.js"
import Queue from "./Queue.js"
import System from "./System.js"

var numCourts = 4;
var queues = {};
var players = {};
const PASSWORD = 'a';

/**
 * Adds a new court queue to the system.
 */
function addQueue(e) {
    e.preventDefault();

    let courtName = document.querySelector("#adminSelect").value;
    let pass = document.querySelector("#adminPassword").value;

    if (pass === PASSWORD && !(courtName in queues)) {
        let q = new Queue(courtName);
        queues[courtName] = q;

        document.querySelector('.queue').innerHTML += `<table id='${courtName}'>
        <tr>
            <td style="text-align:center" colspan="2">Time</td>
        </tr>
        <tr>
            <td style="text-align:center" colspan="2">${courtName}</td>
        </tr>
        <tr>
            <td id='${courtName}Current'>On Court: </td>
        </tr>
        <tr>
            <td id='${courtName}First'>1.</td>
        </tr>
        <tr>
            <td id='${courtName}Second'>2.</td>
        </tr>
        <tr>
            <td id='${courtName}Third'>3.</td>
        </tr>
        </table>`;

        document.querySelector("#selectCourtAdd").innerHTML += `<option value="${courtName}">${courtName}</option>`;
        document.querySelector("#selectCourtRemove").innerHTML += `<option value="${courtName}">${courtName}</option>`;
    } else if (pass != PASSWORD){
        alert('Invalid password. Please try again.');
    } else {
        alert('A court with the name ' + courtName + ' already exists. Please enter a different court name.');
    }

    document.querySelector('#adminForm').reset(); 
}

/**
 * Removes a court from the system.
 */
function removeQueue(e) {
    e.preventDefault();

    let courtName = document.querySelector("#adminSelect").value;
    let pass = document.querySelector("#adminPassword").value;

    if (pass === PASSWORD && courtName in queues) {
        delete queues[courtName];
        document.querySelector(`#${courtName}`).remove();
    } else if (pass != PASSWORD){
        alert('Invalid password. Please try again.');
    } else {
        alert('No court with the name ' + courtName + ' exists. Please enter a different court name.');
    }

    document.querySelector('#adminForm').reset(); 
}

/**
 * Removes an existing player from the system. FIXME
 */
function removePlayer() {
    delete players[0];
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
    if (name in players) {
        alert('Another player with that name already exists. Please select a different name.');
    } else if (name === "") {
        alert('You cannot enter an empty name. Please select a different name with letters.');
    } else {
        let p = new Player(name);
        players[name] = p;
        alert('Sign up successful. \n\nName: ' + name + '\nPassword: ' + p.password);
    }

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

    //if there is persistent data in local storage, load the data into the local variables.
    if (storedPlayers != null) {    
        players = JSON.parse(storedPlayers);
    }
}

/**
 * Saves the data in the current state into the local storage.
 */
function save() {
    //stores this new change in local storage for persistence
    localStorage.setItem('storedPlayers', JSON.stringify(players));
}

/**
 * Removes all players from the system.
 */
function clearPlayers() {
    localStorage.clear();
    players = {};
}

/**
 * Removes all courts from the system.
 */
function clearCourts() {
    localStorage.clear();
    queues = {};
}

/**
 * Resets the system to a fresh state with zero players and zero courts.
 */
 function resetSystem(e) {
    e.preventDefault();
    
    clearPlayers();
    clearCourts();

    let allQueues = document.querySelector('#queues');
    let addChoices = document.querySelector('#selectCourtAdd');
    let removeChoices = document.querySelector('#selectCourtRemove');

    while (allQueues.lastChild) {
        allQueues.removeChild(allQueues.lastChild);
    }

    while (addChoices.lastChild) {
        addChoices.removeChild(addChoices.lastChild);
    }

    while (removeChoices.lastChild) {
        removeChoices.removeChild(removeChoices.lastChild);
    }
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
    load();

    //gets credentials from the page
    let credentials = [
        {
            name: document.querySelector('#addName1').value,
            password: document.querySelector('#addPass1').value
        },
        {
            name: document.querySelector('#addName2').value,
            password: document.querySelector('#addPass2').value
        },
        {
            name: document.querySelector('#addName3').value,
            password: document.querySelector('#addPass3').value
        },
        {
            name: document.querySelector('#addName4').value,
            password: document.querySelector('#addPass4').value
        }
    ];

    //n = false if any credentials are false. otherwise, returns a list of players to add to the queue.
    let n = validNames(credentials, false);
    let courtName = document.querySelector('#selectCourtAdd').value;
    let q = queues[courtName];

    if (n) {
        q.push(n);
    } else {
        return;
    }
    
    //adds the current players to the front end
    document.querySelector(`#${courtName}Current`).innerHTML += q.currentGroupString();

    //resets the form's fields to be empty
    document.querySelector('#addForm').reset();
}


/**
 * Returns the list of valid names if the following criteria are met:
 * 1. The name entered is in the system (players dictionary).
 * 2. The password for the specified name matches the password entered.
 * 3. Data for exactly 2 or 4 people is sent.
 */
function validNames(credentials, isMerging) {
    load()
    let playerCount = 0;
    let validNames = [];

    //loops through all the credentials
    for (let i = 0; i < credentials.length; i++) {
        //if the name entered is not in the system, exit
        let c = credentials[i];
        if (!c.name in players || c.name === '') {
            alert('The name ' + c.name + ' is not in the system. Please try again.');
            return false;
        }

        //if the name is not empty, validate the password
        if (c.name != '') {
            playerCount++;
            if (c.password != players[c.name].password) {
                alert('The password for the player ' + c.name + ' is invalid. Please try again.');
                return false;
            }
            validNames.push(c.name);
        }
    }

    //if merging to a court, data for exactly 2 people must be sent.
    if (isMerging && playerCount != 2) {
        alert('You can only merge to a court with exactly 2 people. Please try again.');
        return false;
    } else if (playerCount == 1 || playerCount == 3) {
        alert('You can only join a queue with 2 or 4 people. Please try again with the correct number of people.');
        return false;
    }

    return validNames;
}

document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('joinButton').addEventListener('click', pushPlayers);
    //document.getElementById('mergeButton').addEventListener('click', //FIXME);
    //document.getElementById('removeButton').addEventListener('click', //FIXME);
    document.getElementById('signUpButton').addEventListener('click', signUpPlayer);
    document.getElementById('addCourtButton').addEventListener('click', addQueue);
    document.getElementById('removeCourtButton').addEventListener('click', removeQueue);
    document.getElementById('resetButton').addEventListener('click', resetSystem);
    
});