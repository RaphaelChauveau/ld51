class Storage {
    constructor(gameId) {
        this.gameId = gameId;
    }

    getValue = (key) => {
        return JSON.parse(
            window.localStorage.getItem(`${this.gameId}_${key}`)
        );
    }
    
    setValue = (key, value) => {
        return window.localStorage.setItem(
            `${this.gameId}_${key}`,
            JSON.stringify(value)
        );
    }
}

export default Storage;
