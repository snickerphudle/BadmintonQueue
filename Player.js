class Player {
    static passwords = ['ant', 'bee','cat','dog','eagle','fish','goat','hen','iguana','jaguar','kangaroo','lion','monkey','newt','octopus','penguin','quail','rat','snake','tiger','urchin','viper','whale','yak','zebra'];
    
    constructor(name) {
        this.name = name;
        this.password = Player.passwords[Math.floor(Math.random() * Player.passwords.length)];
    }

}

export default Player


