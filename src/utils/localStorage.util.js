export function clear() {
    window.localStorage.clear();
};

export function deleteValue(key) {
    window.localStorage.removeItem(key);
};

export function exists(key) {
    return window.localStorage.getItem(key) !== undefined && window.localStorage.getItem(key) !== null;
};

export function get(key, fallbackValue = null) {
    var value = '';
    
    if (exists(key)) {
        value = JSON.parse(window.localStorage.getItem(key));
    } else {
        if (fallbackValue !== undefined && fallbackValue !== null) {
            value = fallbackValue;
        }
    }
    
    return value;
};

export function set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
};