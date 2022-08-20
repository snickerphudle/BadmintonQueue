import Player from "./Player.js"
import Queue from "./Queue.js"
import System from "./System.js" 

var numCourts = 4;
var queues = {};
var players = {};
const PASSWORD = 'a';
const PLAYER_CAPACITY = 100;
const courtTime = 3600;

/**
 * Adds a new court queue to the system.
 */
function addQueue(e) {
    e.preventDefault();

    let courtName = document.querySelector("#adminSelect").value;
    let pass = document.querySelector("#adminPassword").value;

    if (pass === PASSWORD && !(courtName in queues) && courtName !== "") {
        let q = new Queue(courtName);
        queues[courtName] = q;

        //replaces spaces in the courtname with nothing for elementID purposes. g is a modifier that applies to all matches, not just 1st.
        let strippedName = courtName.replace(/\s/g, "");

        document.querySelector('.queue').innerHTML += `<table id='${strippedName}'>
        <tr>
            <td style="text-align:center" colspan="2" id='${strippedName}Timer'>Time</td>
        </tr>
        <tr>
            <td style="text-align:center" colspan="2">${courtName}</td>
        </tr>
        <tr>
            <td id='${strippedName}Current'>On Court: </td>
        </tr>
        <tr>
            <td id='${strippedName}1'>1.</td>
        </tr>
        <tr>
            <td id='${strippedName}2'>2.</td>
        </tr>
        <tr>
            <td id='${strippedName}3'>3.</td>
        </tr>
        </table>`;

        document.querySelector("#selectCourtAdd").innerHTML += `<option value="${courtName}" id="${strippedName}AddDrop">${courtName}</option>`;
        document.querySelector("#selectCourtRemove").innerHTML += `<option value="${courtName}" id="${strippedName}RemoveDrop">${courtName}</option>`;
    } else if (pass !== PASSWORD){
        alert('Invalid password. Please try again.');
    } else if (courtName === "") {
        alert('Court name cannot be empty. Please enter a different name.');
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
        let strippedName = courtName.replace(/\s/g, "");
        document.querySelector(`#${strippedName}`).remove();

        document.querySelector(`#${strippedName}AddDrop`).remove();
        document.querySelector(`#${strippedName}RemoveDrop`).remove();
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
    } else if (Object.keys(players).length >= PLAYER_CAPACITY) {
        alert('Cannot add player to system. The system is full. Please contact the admin for help.');
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

    let pass = document.querySelector("#adminPassword").value;

    if (pass === PASSWORD) {
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

        alert('Successfully reset the system.');
    } else {
        alert('Invalid password. Please try again.');
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

    //n = false if any credentials are false. otherwise, returns a list of players to add to the queue.
    let names = validNames(false, false);
    let courtName = document.querySelector('#selectCourtAdd').value;
    let q = queues[courtName];

    //if the credentials are correct, push the players to the court.
    if (names) {
        q.push(names);
        alert('Successfully added ' + names + ' to ' + courtName);
    } else {
        return;
    }

    //resets the form's fields to be empty
    document.querySelector('#addForm').reset();
}

/**
 * Merges players to the queue if the button "Merge to Court" is clicked and the credentials are correct.
 */
function mergePlayers(e) {
    e.preventDefault();

    //validates credentials before proceeding
    let names = validNames(true, false);
    let courtName = document.querySelector('#selectCourtAdd').value;
    let q = queues[courtName];

    //if the credentials are correct, merge the players to the court.
    if (names) {
        q.merge(names);
        alert('Successfully merged ' + names + ' to ' + courtName);
    } else {
        return;
    }

    //resets the form's fields to be empty
    document.querySelector('#addForm').reset();
}

/**
 * Removes the players specified if the button "Remove From Court" is clicked and the credentials are correct.
 */
function removePlayers(e) {
    e.preventDefault();

    //validates credentials before proceeding
    let names = validNames(false, true);
    let courtName = document.querySelector('#selectCourtRemove').value;
    let q = queues[courtName];
    
    //if the credentials are correct, merge the players to the court.
    if (names) {
        q.remove(names);
        alert('Successfully removed ' + names + ' from ' + courtName);
    } else {
        return;
    }

    //resets the form's fields to be empty
    document.querySelector('#addForm').reset();
}


/**
 * Returns the list of valid names if the following criteria are met:
 * 1. The name entered is in the system (players dictionary).
 * 2. The password for the specified name matches the password entered.
 * 3. Data for exactly 2 or 4 people is sent.
 */
function validNames(isMerging, isRemoving) {
    load();
    let credentials = null;

    //gets credentials from the page

    if (isRemoving) {
        credentials = [
            {
                name: document.querySelector('#removeName1').value,
                password: document.querySelector('#removePass1').value
            },
            {
                name: document.querySelector('#removeName2').value,
                password: document.querySelector('#removePass2').value
            },
            {
                name: document.querySelector('#removeName3').value,
                password: document.querySelector('#removePass3').value
            },
            {
                name: document.querySelector('#removeName4').value,
                password: document.querySelector('#removePass4').value
            }
        ];
    } else {
        credentials = [
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
    }

    let validNames = [];
    let playerCount = 0;

    for (let i = 0; i < credentials.length; i++) {
        let c = credentials[i];
        if (c.name !== '') {
            playerCount++;
        } else {
            break;
        }
    }

    if (playerCount == 1 || playerCount == 3) {
        alert('You must enter the username and password for 2 or 4 people to add to a queue. Please try again.');
        return false;
    }

    //loops through all the credentials
    for (let i = 0; i < playerCount; i++) {
        //if the name entered is not in the system, exit
        let c = credentials[i];
        if (!c.name in players) {
            alert('The name ' + c.name + ' is not in the system. Please try again.');
            return false;
        }


        //exit if password is incorrect
        if (c.password != players[c.name].password) {
            alert('The password for the player ' + c.name + ' is invalid. Please try again.');
            return false;
        }
        validNames.push(c.name);
    }

    //if merging to a court, data for exactly 2 people must be sent.
    if (isMerging && playerCount != 2) {
        alert('You can only merge to a court with exactly 2 people. Please try again.');
        return false;
    } 

    return validNames;
}

document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('joinButton').addEventListener('click', pushPlayers);
    document.getElementById('mergeButton').addEventListener('click', mergePlayers);
    document.getElementById('removeButton').addEventListener('click', removePlayers);
    document.getElementById('signUpButton').addEventListener('click', signUpPlayer);
    document.getElementById('addCourtButton').addEventListener('click', addQueue);
    document.getElementById('removeCourtButton').addEventListener('click', removeQueue);
    document.getElementById('resetButton').addEventListener('click', resetSystem);
    
});