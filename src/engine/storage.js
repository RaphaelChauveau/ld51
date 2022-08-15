// TODO class ?
// TODO add unique hash in key (avoid collisions between games)

const getValue = (key) => {
    return JSON.parse(window.localStorage.getItem(key));
}

const setValue = (key, value) => {
    return window.localStorage.setItem(key, JSON.stringify(value));
}