(async function () {
    const root = document.getElementById("disclosures-grid");
    const overview = document.getElementById("disclosures-overview");
    const metricsRoot = document.getElementById("disclosure-metrics");
    const { escapeHtml, loadJson, renderError } = window.portfolio;

    function externalAttrs(href) {
        return href && /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
    }

    function renderReferences(item) {
        const references = item.references && item.references.length ? item.references : [
            { label: "NVD", url: `https://nvd.nist.gov/vuln/detail/${item.cve}` },
            { label: "CVE.org record", url: item.cveUrl },
            { label: "PoC repository", url: item.pocUrl }
        ];

        return `
            <section class="disclosure-references" aria-label="${escapeHtml(item.cve)} references">
                <h3>References</h3>
                <div class="reference-list">
                    ${references.map((reference) => `
                        <a href="${escapeHtml(reference.url)}"${externalAttrs(reference.url)}>
                            <span>${escapeHtml(reference.label)}</span>
                            <i class="fas fa-arrow-up-right-from-square"></i>
                        </a>`).join("")}
                </div>
            </section>`;
    }

    function renderFacts(item) {
        const facts = item.facts && item.facts.length ? item.facts : [
            { label: "CWE", value: item.cwe },
            { label: "Affected", value: `${item.affected}. Fixed in ${item.fixed}.` },
            { label: "CNA / Score", value: item.cvss },
            { label: "PyPI downloads", value: item.downloads ? `${item.downloads.value} all-time` : "Not available" }
        ];

        return `
            <div class="disclosure-facts">
                ${facts.map((fact) => `
                    <div class="disclosure-fact">
                        <span>${escapeHtml(fact.label)}</span>
                        <strong>${escapeHtml(fact.value)}</strong>
                    </div>`).join("")}
            </div>`;
    }

    function getPublishedTime(item) {
        const time = Date.parse(item.published || "");
        return Number.isNaN(time) ? 0 : time;
    }

    function renderMetrics(disclosures) {
        const cves = [...new Map(disclosures.map((item) => [item.cve, item])).values()];
        const metrics = [
            { label: "Published CVEs", value: cves.length, kind: "total" },
            { label: "Critical", value: cves.filter((item) => item.severity.toLowerCase() === "critical").length, kind: "critical" },
            { label: "High", value: cves.filter((item) => item.severity.toLowerCase() === "high").length, kind: "high" },
            { label: "Patched", value: `${cves.filter((item) => typeof item.fixed === "string" && item.fixed.trim()).length}/${cves.length}`, kind: "patched" }
        ];

        metricsRoot.innerHTML = metrics.map((metric) => `
            <div class="disclosure-metric disclosure-metric-${metric.kind}">
                <dt>${metric.label}</dt>
                <dd>${metric.value}</dd>
            </div>`).join("");
        overview.hidden = false;
    }

    function renderDates(item) {
        if (!item.published) return "";

        return `<p class="disclosure-dates">Published ${escapeHtml(item.published)}${item.updated ? ` <span aria-hidden="true">&middot;</span> Updated ${escapeHtml(item.updated)}` : ""}</p>`;
    }

    function renderDetails(item) {
        if (!item.details || !item.details.length) return "";

        return `<details class="disclosure-technical">
            <summary>Technical details</summary>
            <div class="disclosure-details">${item.details.map((detail) => `
            <section>
                <h3>${escapeHtml(detail.label)}</h3>
                <p${detail.code ? ' class="disclosure-vector"' : ""}>${escapeHtml(detail.value)}</p>
            </section>`).join("")}</div>
        </details>`;
    }

    try {
        const disclosures = await loadJson("data/disclosures.json");

        renderMetrics(disclosures);

        if (!disclosures.length) {
            root.innerHTML = '<p class="disclosures-empty">Security disclosures will be added here.</p>';
            return;
        }

        const sortedDisclosures = disclosures
            .map((item, index) => ({ item, index }))
            .sort((a, b) => getPublishedTime(b.item) - getPublishedTime(a.item) || a.index - b.index)
            .map(({ item }) => item);

        root.innerHTML = `<div class="disclosures-list">${sortedDisclosures.map((item) => `
            <article class="disclosure-card">
                <div class="disclosure-header">
                    <div><p class="disclosure-id">${escapeHtml(item.cve)}</p><h2>${escapeHtml(item.title)}</h2></div>
                    <span class="severity severity-${escapeHtml(item.severity.toLowerCase())}">${escapeHtml(item.severity)}</span>
                </div>
                ${renderDates(item)}
                <p class="disclosure-description">${escapeHtml(item.description)}</p>
                ${renderFacts(item)}
                ${renderDetails(item)}
                ${renderReferences(item)}
            </article>`).join("")}</div>`;
    } catch (error) {
        overview.hidden = true;
        renderError(root, "Security disclosures could not be loaded.");
        console.error(error);
    }
})();
