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

    function renderCopyIcon(copied = false) {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            ${copied ? '<path d="m5 12 4 4L19 6" />' : '<rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />'}
        </svg>`;
    }

    function renderCommand(command) {
        return command ? `<div class="project-command">
            <code><span class="command-prompt" aria-hidden="true">$</span> <span class="command-text">${escapeHtml(command)}</span></code>
            <button class="copy-command" type="button" title="Copy command" aria-label="Copy command: ${escapeHtml(command)}">${renderCopyIcon()}</button>
        </div>` : "";
    }

    async function copyCommand(command) {
        try {
            await navigator.clipboard.writeText(command);
            return true;
        } catch {
            // Support browsers where the Clipboard API is unavailable or denied.
            const input = document.createElement("textarea");
            input.value = command;
            input.readOnly = true;
            input.style.cssText = "position:fixed;left:-9999px;top:0";
            const focused = document.activeElement;
            document.body.append(input);
            try {
                input.select();
                input.setSelectionRange(0, command.length);
                return document.execCommand("copy");
            } catch {
                return false;
            } finally {
                input.remove();
                focused?.focus({ preventScroll: true });
            }
        }
    }

    const feedbackTimers = new WeakMap();
    root.addEventListener("click", async (event) => {
        const button = event.target.closest(".copy-command");
        if (!button || button.getAttribute("aria-busy") === "true") return;
        const text = button.closest(".project-command").querySelector(".command-text");
        const status = root.querySelector(".command-copy-status");
        clearTimeout(feedbackTimers.get(button));
        button.setAttribute("aria-busy", "true");
        const copied = await copyCommand(text.textContent);
        button.removeAttribute("aria-busy");
        button.innerHTML = renderCopyIcon(copied);
        button.classList.toggle("is-copied", copied);
        button.title = copied ? "Copied" : "Retry copy";
        button.setAttribute("aria-label", `${copied ? "Copied command" : "Retry copying command"}: ${text.textContent}`);
        status.textContent = copied ? `Copied command: ${text.textContent}` : "Could not copy. Select the command and copy it manually.";
        if (!copied) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        feedbackTimers.set(button, setTimeout(() => {
            button.innerHTML = renderCopyIcon();
            button.classList.remove("is-copied");
            button.title = "Copy command";
            button.setAttribute("aria-label", `Copy command: ${text.textContent}`);
        }, 2000));
    });

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
                <div class="package-list" aria-label="${escapeHtml(ecosystem.name)} packages">
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
            <p class="command-copy-status" role="status" aria-live="polite" aria-atomic="true"></p>
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
