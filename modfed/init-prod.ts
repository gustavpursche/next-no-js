import { global } from "./global";

global();

const hotwire = true;

if (hotwire) {
    import("@hotwired/turbo").then(() => {
        console.log("hotwire loaded");
        document.addEventListener("turbo:load", function () {
            console.log("turbo:load");
            load();
        });
    });
} else {
    load();
}

function load() {
    const items = document.querySelectorAll(`[data-modfed-type="preact"]`);
    if (items.length) {
        console.log("trying to attach to %d elements", items.length);
        Promise.all([].map.call(items, (el) => maybeAttach(el)))
            .then((res) => {
                console.log("All done!");
            })
            .catch((e) => {
                console.log("could not dynamically attach", e);
            });
    }
}

async function maybeAttach(el: HTMLElement) {
    try {
        const m = await import("./init-preact");
        m.hydrate(el);
    } catch (e) {
        console.log("could not hydrate ", el);
    }
}
export {};