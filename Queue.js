import Timer from "./easytimer.js";

class Queue {
    
    /** Default time in seconds that each court lasts for. */
    static COURT_TIME = 20;

    /**
     * Constructs a new queue.
     */
    constructor(name) {
        this.name = name;
        this.groups = [];
        this.currentGroup = null;
        this.timer = new Timer();
        this.size = 4;
        this.id = name.replace(/\s/g, "");
    }

    /**
     * Pushes a new group of players onto the queue. Starts the timer if there is no one on the court.
     */
    push(group) {
        if (this.groups.length == this.size) {
            alert('This queue is full. Please add to a different queue.');
        } else if (this.currentGroup == null) {
            //if court is empty make GROUP the current Group
            this.currentGroup = group;

            //resets the timer
            this.resetTimer();

            //updates the front end with the players on the court
            document.querySelector(`#${this.id}Current`).innerHTML = 'On Court: ' + this.currentGroupString();

        } else {
            this.groups.push(group);
            let currNum = this.groups.length;

            //updates the front end with the players in line
            document.querySelector(`#${this.id + currNum}`).innerHTML = currNum + '. ' + this.groupString(currNum);

        }
    }

    /**
     * Removes the currentGroup from the queue and replaces it with the next group in line. Resets the timer.
     */
    pop() {
        if (this.currentGroup == null) {
            return;
        } else if (this.groups.length > 0) {
            this.currentGroup = this.groups.shift();
            this.updateFrontend();
            this.resetTimer();
        } else {
            this.currentGroup = null;
            this.updateFrontend();
        }
    }

    /**
     * Merges a group of 2 players to a queue.
     */
    merge(group) {
        if (this.currentGroup.length > 2) {
            alert('Can only merge to courts with 2 players currently playing.');
        } else if (group.length != 2) {
            alert('The group merging must have exactly 2 players.');
        } else {
            if (this.currentGroup == null) {
                this.push(group)
            } else {
                this.currentGroup.push(group[0], group[1]);
                this.updateFrontend();
            }
        }
    }

    /**
     * Updates the front end with the current status of the queue.
     */
     updateFrontend(group) {
        if (this.currentGroup == null) {
            document.querySelector(`#${this.id}Current`).innerHTML = 'On Court: ';
        } else {
            document.querySelector(`#${this.id}Current`).innerHTML = 'On Court: ' + this.currentGroupString();

            console.log('current group: ', this.currentGroup);
            console.log('groups in queue: ', this.groups);

            for (let i = 1; i < 4; i++) {
                document.querySelector(`#${this.id + i}`).innerHTML = i + '. ' + this.groupString(i)
            }
        }
    }

    
    /**
     * Returns a string of the group currently on the court.
     */
    currentGroupString() {
        let result = '';

        for (let i = 0; i < this.currentGroup.length; i++) {
            result += this.currentGroup[i] + ' ';
        }

        return result;
    }

    /**
     * Resets the timer of this court.
     */
    resetTimer() {
        //reference the timer variable
        const t = this.timer;
        const q = this;

        //start the countdown timer
        t.start({countdown: true, startValues: {seconds: Queue.COURT_TIME}});

        //HTML for the timer this timer controls
        let timerHTML = document.querySelector(`#${this.id}Timer`)

        //Display the current time remaining
        timerHTML.innerHTML = t.getTimeValues().toString();

        //update the timerHTML on the page every second
        t.addEventListener('secondsUpdated', function (e) {
            timerHTML.innerHTML = t.getTimeValues().toString();
        });

        //execute this function once time runs out
        t.addEventListener('targetAchieved', function (e) {
            q.pop();
        });
    }

    /**
     * Returns a string of the group at the specified position in the queue. Not zero-indexed.
     */
    groupString(pos) {
        if (pos > this.groups.length) {
            return '';
        }
        
        let result = '';

        //get the group at index pos, which is pos - 1 in the groups array.
        let g = this.groups[pos - 1];

        for (let i = 0; i < g.length; i++) {
            result += g[i] + ' ';
        }

        return result;
    }
}

export default Queue