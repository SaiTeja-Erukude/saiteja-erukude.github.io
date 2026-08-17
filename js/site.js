(function () {
    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    async function loadJson(path) {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Unable to load ${path}: ${response.status}`);
        }

        return response.json();
    }

    function renderError(container, message) {
        container.innerHTML = `<p class="data-error">${escapeHtml(message)}</p>`;
    }

    window.portfolio = {
        escapeHtml,
        loadJson,
        renderError
    };
})();
