const HOSTs= [
    "cmug.gitlab.io",
    "ubg67.gitlab.io",
    "ubg911.gitlab.io",
    "unblockedgamess3.gitlab.io",
];
let FETCHs= [];
const CLONER_URL= "https://gamecloner.wp235.workers.dev/";
const HOST= (self.location.href.split("://")?.[1]?? "").split("/")[0];
const GROUP= (self.location.href.split("?")?.[1]?? "").split("/")?.[1]?? "";
const GAME= (self.location.href.split("?")?.[1]?? "").split("/")?.[2]?? "";
const GAME_SLUG= GAME.split("=")[0];
const GAME_PATH= `${self.location.href.split("?")[0].split("&")[0].split("/cloner-sw-v")[0]}/`;


self.addEventListener("install", (event) => {
  console.log(`clonerSW Installed HOST--${HOST}-- GROUP--${GROUP}-- GAME--${GAME}-- GAME_SLUG--${GAME_SLUG}-- GAME_PATH--${GAME_PATH}--`);
  self.skipWaiting();
});


self.addEventListener("activate", (event) => {
  console.log(`clonerSW Activated HOST--${HOST}-- GROUP--${GROUP}-- GAME--${GAME}-- GAME_SLUG--${GAME_SLUG}-- GAME_PATH--${GAME_PATH}--`);
  event.waitUntil(self.clients.claim());
});


self.addEventListener("fetch", (event) => {
    const url= event.request.url;

    event.respondWith(
        fetch(event.request)
        .then((response) => {
            if (response.status === 404) {
                console.warn("clonerSW 404 Not Found:", url);

                // Change URL
                const ASSET_URL= url.replace(GAME_PATH, "");
                if (!ASSET_URL.startsWith("http") && HOSTs.includes(HOST)) {
                    const FULL_ASSET_URL= `${CLONER_URL}${GROUP}/${GAME}/${ASSET_URL}`;
                    if (url!= FULL_ASSET_URL && !FETCHs.includes(FULL_ASSET_URL)) {
                        FETCHs.push(FULL_ASSET_URL);
                        console.log("clonerSW Retrying with:", FULL_ASSET_URL);
                        return fetch(FULL_ASSET_URL, {
                            method: "GET",
                            headers: {
                                "Client": "Cloner Assets"
                            },
                        }).catch((err) => {
                            console.error("clonerSW Fallback also failed:", err);
                            return response;
                        });
                    }
                }
            }
            return response;
        })
        .catch((error) => {
            console.error("clonerSW Network error:", url, error);
            const fallbackUrl = "./patch/offline.html";
            return fetch(fallbackUrl);
        })
    );
});
