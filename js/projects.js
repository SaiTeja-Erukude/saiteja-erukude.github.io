(async function () {
    const root = document.getElementById("open-source-content");
    const { escapeHtml, loadJson, renderError } = window.portfolio;

    function externalAttrs(href) {
        return href && /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
    }

    function renderTags(tags = []) {
        return tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    }

    function renderLinks(links = []) {
        return links.map((link) => `
            <a class="project-link" href="${escapeHtml(link.href)}"${externalAttrs(link.href)}>
                ${escapeHtml(link.label)} <i class="fas fa-arrow-up-right-from-square"></i>
            </a>`).join("");
    }

    function renderCommand(command) {
        return command ? `<code class="project-command"><span>$</span> ${escapeHtml(command)}</code>` : "";
    }

    function renderEcosystem(ecosystem) {
        return `<section class="project-section" aria-labelledby="ecosystem-title">
            <div class="project-section-heading">
                <div><p>${escapeHtml(ecosystem.eyebrow)}</p><h2 id="ecosystem-title">${escapeHtml(ecosystem.name)}</h2></div>
                <span>Python packages</span>
            </div>
            <article class="ecosystem-card">
                <div class="ecosystem-intro">
                    <p>${escapeHtml(ecosystem.description)}</p>
                    ${renderCommand(ecosystem.install)}
                    <div class="tag-list">${renderTags(ecosystem.tags)}</div>
                    <div class="project-links">${renderLinks(ecosystem.links)}</div>
                </div>
                <div class="package-list" aria-label="RAI Audit Kit packages">
                    ${ecosystem.packages.map((pkg) => `<a href="${escapeHtml(pkg.href)}"${externalAttrs(pkg.href)}>
                        <span><strong>${escapeHtml(pkg.name)}</strong><small>${escapeHtml(pkg.purpose)}</small></span>
                        <i class="fas fa-arrow-up-right-from-square"></i>
                    </a>`).join("")}
                </div>
            </article>
        </section>`;
    }

    function renderToolCard(tool) {
        return `<article class="project-card">
            <div class="project-card-top"><p>${escapeHtml(tool.category)}</p></div>
            <h3>${escapeHtml(tool.name)}</h3>
            <p class="project-description">${escapeHtml(tool.description)}</p>
            ${renderCommand(tool.command)}
            <div class="tag-list">${renderTags(tool.tags)}</div>
            <div class="project-links">${renderLinks(tool.links)}</div>
        </article>`;
    }

    function renderModelCard(model, platform) {
        const command = renderCommand(model.command);
        return `<article class="model-card">
            <div class="model-card-top"><span>${escapeHtml(platform)}</span></div>
            <h3>${escapeHtml(model.name)}</h3>
            <p>${escapeHtml(model.description)}</p>
            ${command}
            <div class="tag-list">${renderTags(model.tags)}</div>
            <a class="model-link" href="${escapeHtml(model.href)}"${externalAttrs(model.href)}>View model <i class="fas fa-arrow-up-right-from-square"></i></a>
        </article>`;
    }

    function renderCardSection(id, eyebrow, title, note, cards) {
        return `<section class="project-section" aria-labelledby="${escapeHtml(id)}">
            <div class="project-section-heading">
                <div><p>${escapeHtml(eyebrow)}</p><h2 id="${escapeHtml(id)}">${escapeHtml(title)}</h2></div>
                <span>${escapeHtml(note)}</span>
            </div>
            <div class="project-card-grid">${cards}</div>
        </section>`;
    }

    try {
        const data = await loadJson("data/projects.json");
        root.innerHTML = `
            ${renderEcosystem(data.ecosystem)}
            ${renderCardSection("tools-title", "Standalone Python tools", "Security, evaluation & data quality", "Published on PyPI", data.tools.map(renderToolCard).join(""))}
            ${renderCardSection("ollama-title", "Fine-tuned Ollama models", "Specialized models for local workflows", "Available on Ollama", data.models.map((model) => renderModelCard(model, "Fine-tuned model")).join(""))}
            ${renderCardSection("research-models-title", "Released research models", "Models that accompany published work", "Available on Hugging Face", data.researchModels.map((model) => renderModelCard(model, "Research model")).join(""))}
        `;
    } catch (error) {
        renderError(root, "Open-source project data could not be loaded.");
        console.error(error);
    }
})();
