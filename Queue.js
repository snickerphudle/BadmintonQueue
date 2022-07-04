class Queue {
    constructor(name) {
        this.name = name;
        this.groups = [];
        this.size = size;
        this.currentGroup = null;
    }

    push(group) {
        if (this.groups.length == this.size) {
            alert('This queue is full. Please add to a different queue.');
        } else if (currentGroup == null) {
            this.currentGroup = groups;
        } else {
            this.groups.push(group);
        }
    }

    pop() {
        if (currentGroup == null) {
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
}

export default Queue