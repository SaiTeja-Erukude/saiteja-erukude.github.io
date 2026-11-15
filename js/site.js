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

    function getResearchCounts(records) {
        const count = (category) => records.filter((item) => item.category === category).length;
        const counts = {
            journals: count("journal"),
            conferences: count("conference"),
            theses: count("thesis"),
            books: count("book"),
            patents: count("patent"),
            posters: count("poster")
        };
        counts.papers = counts.journals + counts.conferences + counts.theses;
        counts.publications = counts.papers + counts.books;
        return counts;
    }

    window.portfolio = {
        escapeHtml,
        loadJson,
        renderError,
        getResearchCounts
    };
})();
