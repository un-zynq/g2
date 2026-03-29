"use strict";

{
    C3.Plugins.GM_SDK.Instance = class SingleGlobalInstance extends globalThis.ISDKInstanceBase {
        constructor() {
            super();

            // Initialise object properties
            this._gameID = "";
            this._sdkReady = false;
            this._adPlaying = false;
            this._adViewed = false;
            this._preloadedAd = false;
            this._available_adtypes = ["interstitial"];

            const properties = this._getInitProperties();
            if (properties) {
                this._gameID = properties[0];
            }

            globalThis.SDK_OPTIONS = {
                gameId: this._gameID,
                onEvent: (event) => {
                    switch (event.name) {
                        case "SDK_GAME_START":
                            // Advertisement done, resume game logic and unmute audio
                            this._adPlaying = false;
                            break;
                        case "SDK_GAME_PAUSE":
                            // Pause game logic / mute audio
                            this._adPlaying = true;
                            break;
                        case "COMPLETE":
                            // This event is triggered when the user watched an entire ad
                            this._adViewed = true;
                            setTimeout(() => {
                                this._adViewed = false;
                            }, 5000);
                            break;
                        case "SDK_READY":
                            this._sdkReady = true;
                            break;
                    }
                }
            };

         

         //Load the SDK from the CDN v3
      (function(d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//api.gamemonetize.com/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "gamemonetize-sdk");
    }

        Release() {
            super.Release();
        }

        SaveToJson() {
            return {
                // Data to be saved for savegames
            };
        }

        LoadFromJson(o) {
            // Load state for savegames
        }

        ShowAd() {
            var sdk = window["sdk"];
            if (sdk !== undefined && sdk.showBanner !== undefined) {
                sdk.showBanner();
            }
        }
    };
}
