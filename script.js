const list = document.querySelector("#starred");
const status = document.querySelector("#status");

const showStatus = (message, isError = false) => {
    if (status) {
        status.textContent = message;
        status.setAttribute("aria-live", isError ? "assertive" : "polite");
    }
};

const loadEvents = async () => {
    if (!list) {
        console.error("The #starred list element was not found.");
        return;
    }

    try {
        if (window.location.protocol === "file:") {
            throw new Error("The page must be served over a local web server to load events.json.");
        }

        const response = await fetch("events.json", { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`Unable to load the event data (${response.status} ${response.statusText}).`);
        }

        const events = await response.json();

        if (!Array.isArray(events) || events.length === 0) {
            list.innerHTML = "";
            showStatus("No starred repositories were found.");
            return;
        }

        list.innerHTML = "";

        events.forEach(({ name, starred }) => {
            const item = document.createElement("li");
            item.textContent = `${name} - starred ${starred}`;
            list.appendChild(item);
        });

        showStatus(`${events.length} starred repositories loaded.`);
    } catch (error) {
        console.error("Failed to load starred repositories:", error);
        list.innerHTML = "";

        const message = window.location.protocol === "file:"
            ? "This page needs to be opened from a local web server to load the JSON data."
            : "Sorry, the starred repositories could not be loaded right now.";

        showStatus(message, true);
    }
};

loadEvents();