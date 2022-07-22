class Player {
    //on creation, a random password is assigned to the player
    static passwords = ['ant', 'bee','cat','dog','eagle','fish','goat','hen','iguana','jaguar','kangaroo','lion','monkey','newt','octopus','penguin','quail','rat','snake','tiger','urchin','viper','whale','yak','zebra'];
    
    //creates a player with a unique name, password, and court number.
    constructor(name) {
        this.name = name;
        this.password = Player.passwords[Math.floor(Math.random() * Player.passwords.length)];
        this.court = -1;
    }

    //changes the current court this player is on.
    changeCourt(court) {
        this.court = court
    }
}

export default Player


