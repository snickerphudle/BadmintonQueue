import Timer from "./easytimer.js";

class Queue {
    constructor(name) {
        this.name = name;
        this.groups = [];
        this.currentGroup = null;
        this.timer = new Timer();
        this.size = 4;
        this.id = name.replace(/\s/g, "");
    }

    push(group) {
        if (this.groups.length == this.size) {
            alert('This queue is full. Please add to a different queue.');
        } else if (this.currentGroup == null) {
            this.currentGroup = group;
        } else {
            this.groups.push(group);
            this.timer.start({countdown: true, startValues: {seconds: 30}});

            $(`#${this.id}Timer .values`).html(timer.getTimeValues().toString());

            this.timer.addEventListener('secondsUpdated', function (e) {
                $(`#${this.id}Timer .values`).html(timer.getTimeValues().toString());
            });
            
            this.timer.addEventListener('targetAchieved', function (e) {
                $(`#${this.id}Timer .values`).html('KABOOM!!');
            });
        }
    }

    pop() {
        if (this.currentGroup == null) {
            alert('Cannot remove the current group. There is no group in the queue.');
        } else if (this.groups.length > 0) {
            this.currentGroup = this.groups.shift();
        } else {
            this.currentGroup = null;
        }
    }

    merge(group) {
        if (this.currentGroup.length > 2) {
            alert('Can only merge to courts with 2 players currently playing.');
        } else if (group.length != 2) {
            alert('The group merging must have exactly 2 players.');
        } else {
            this.currentGroup.push(group[0], group[1]);
        }
    }

    remove(group) {
        
    }

    setSize(size) {
        this.size = size;
    }

    currentGroupString() {
        let result = '';

        for (let i = 0; i < this.currentGroup.length; i++) {
            result += this.currentGroup[i] + ' ';
        }

        return result;
    }
}

export default Queue