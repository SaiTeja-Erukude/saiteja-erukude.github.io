(async function () {
    const root = document.getElementById("disclosures-grid");
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

    try {
        const disclosures = await loadJson("data/disclosures.json");

        if (!disclosures.length) {
            root.innerHTML = '<p class="disclosures-empty">Security disclosures will be added here.</p>';
            return;
        }

        root.innerHTML = `<div class="disclosures-list">${disclosures.map((item) => `
            <article class="disclosure-card">
                <div class="disclosure-header">
                    <div><p class="disclosure-id">${escapeHtml(item.cve)}</p><h2>${escapeHtml(item.title)}</h2></div>
                    <span class="severity severity-${escapeHtml(item.severity.toLowerCase())}">${escapeHtml(item.severity)}</span>
                </div>
                <p class="disclosure-description">${escapeHtml(item.description)}</p>
                ${renderFacts(item)}
                ${renderReferences(item)}
            </article>`).join("")}</div>`;
    } catch (error) {
        renderError(root, "Security disclosures could not be loaded.");
        console.error(error);
    }
})();
