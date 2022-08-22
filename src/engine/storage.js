class Storage {
    constructor(gameId) {
        this.gameId = gameId;
    }

    getValue = (key) => {
        return JSON.parse(
            window.localStorage.getItem(`${game_id}_${key}`)
        );
    }
    
    setValue = (key, value) => {
        return window.localStorage.setItem(
            `${game_id}_${key}`,
            JSON.stringify(value)
        );
    }
}

export default Storage;
