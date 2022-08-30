console.log('Loading...');

const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("/sw.js", {
                scope: "/",
            });
            if (registration.installing) {
                console.log("Service worker installing");
            } else if (registration.waiting) {
                console.log("Service worker installed");
            } else if (registration.active) {
                console.log("Service worker active");
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
    return 'Ready!'
};

registerServiceWorker().then((result) => {
    console.log(result);
});

function screen(selector){
    document.querySelector('.screen.active').classList.remove('active')
    document.querySelector(`.screen${selector}`).classList.add('active')
}

function widget(selector){
    return !document.querySelector(`.widget${selector}`).classList.contains('active')
        ? document.querySelector(`.widget${selector}`).classList.add('active')
        : document.querySelector(`.widget${selector}`).classList.remove('active');
}

function shutter(){
    return !document.querySelector('.screen.active').classList.contains('open')
        ? document.querySelector('.screen.active').classList.add('open')
        : document.querySelector('.screen.active').classList.remove('open');
}

