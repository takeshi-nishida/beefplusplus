chrome.storage.sync.get(optionNames, (items) => {
    Object.keys(items).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.checked = items[key];
        }
    });
});

optionNames.forEach((name) => {
    const input = document.getElementById(name);
    if (input) {
        input.addEventListener("change", _ => {
            chrome.storage.sync.set({ [name]: input.checked });
        });
    }
});