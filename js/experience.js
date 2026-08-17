(async function () {
    const root = document.getElementById("experience-content");
    const { escapeHtml, loadJson, renderError } = window.portfolio;

    function renderTags(items) {
        return items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("");
    }

    function renderOutcomes(outcomes) {
        if (!outcomes?.length) return "";

        function renderOutcome(outcome) {
            const parts = outcome.split(" · ");
            const hasDivider = parts.length > 1;
            const fallback = hasDivider ? null : outcome.match(/^(\S+)\s+(.+)$/);
            const value = hasDivider ? parts[0] : fallback?.[1] || outcome;
            const label = hasDivider ? parts.slice(1).join(" · ") : fallback?.[2] || "";

            return `<span class="experience-outcome">
                <strong>${escapeHtml(value)}</strong>
                ${label ? `<span>${escapeHtml(label)}</span>` : ""}
            </span>`;
        }

        return `<div class="experience-outcomes" aria-label="Selected outcomes">
            ${outcomes.map(renderOutcome).join("")}
        </div>`;
    }

    function renderHighlights(highlights) {
        if (!highlights?.length) return "";

        return `
            <section class="work-highlights" aria-label="Selected impact">
                <p class="work-highlights-eyebrow">Selected areas of impact</p>
                <div class="work-highlights-grid">
                    ${highlights.map((highlight) => `
                        <article class="work-highlight">
                            <h3>${escapeHtml(highlight.title)}</h3>
                            <p class="work-highlight-impact">${escapeHtml(highlight.impact)}</p>
                        </article>
                    `).join("")}
                </div>
            </section>`;
    }

    try {
        const experience = await loadJson("data/experience.json");
        root.innerHTML = `<div class="experience-list">${experience.items.map((item) => `
            <article class="experience-item">
                <div class="experience-rail">
                    <span class="period">${escapeHtml(item.period)}</span>
                    <p class="experience-location"><i class="fas fa-location-dot" aria-hidden="true"></i>${escapeHtml(item.location)}</p>
                </div>
                <div class="experience-details">
                    <h2>${escapeHtml(item.role)}</h2>
                    <p class="organization">${escapeHtml(item.organization)}</p>
                    ${item.progression ? `<p class="career-progression">${escapeHtml(item.progression)}</p>` : ""}
                    <p class="experience-summary">${escapeHtml(item.summary)}</p>
                    ${renderOutcomes(item.outcomes)}
                    ${item.tags?.length ? `<div class="tag-list">${renderTags(item.tags)}</div>` : ""}
                    ${item.period.toLowerCase().includes("present") ? renderHighlights(item.highlights) : ""}
                </div>
            </article>
        `).join("")}</div>`;
    } catch (error) {
        renderError(root, "Experience details could not be loaded.");
        console.error(error);
    }
})();
