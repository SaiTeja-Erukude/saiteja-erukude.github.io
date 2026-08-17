(async function () {
    const root = document.getElementById("profile-home");
    const { escapeHtml, loadJson, renderError } = window.portfolio;

    function externalAttrs(href) {
        return /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
    }

    function renderLinks(links, className = "terminal-link") {
        return links.map((link) => `
            <a href="${escapeHtml(link.href)}" class="${className}"${externalAttrs(link.href)}>
                <i class="${escapeHtml(link.icon)}"></i>
                ${escapeHtml(link.label)}
            </a>
        `).join("");
    }

    function renderHero(profile) {
        return `
            <section class="home-intro">
                <div class="home-photo"><img src="${escapeHtml(profile.photo.src)}" alt="${escapeHtml(profile.photo.alt)}"></div>
                <div class="home-intro-copy">
                    <p class="home-kicker">${escapeHtml(profile.role)}</p>
                    <h1>${escapeHtml(profile.name)}</h1>
                    <p class="home-headline">${escapeHtml(profile.hero.headline)}</p>
                    <p class="home-summary">${escapeHtml(profile.hero.summary)}</p>
                    <div class="home-actions">
                        ${renderLinks(profile.hero.actions)}
                    </div>
                </div>
            </section>
        `;
    }

    function renderAbout(about) {
        const facts = about.facts.map((fact) => `
            <div class="fact-row">
                <span>// ${escapeHtml(fact.label)}</span>
                <strong>${escapeHtml(fact.value)}</strong>
            </div>
        `).join("");

        const paragraphs = about.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");

        return `
            <section class="home-about" id="about">
                <div class="home-about-heading"><p>About</p><h2>Production AI, evaluated and secured.</h2></div>
                <div class="home-about-narrative">${paragraphs}</div>
                <div class="home-facts">${facts}</div>
            </section>`;
    }

    function renderAdventure(adventure) {
        const photos = adventure.items.map((item, index) => `
            <figure class="adventure-photo adventure-photo-${escapeHtml(item.layout)}">
                <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" decoding="async">
                <figcaption><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(item.label)}</strong></figcaption>
            </figure>
        `).join("");

        return `
            <section class="home-adventure" id="beyond-work">
                <div class="home-adventure-heading">
                    <div><p>${escapeHtml(adventure.eyebrow)}</p><h2>${escapeHtml(adventure.title)}</h2></div>
                    <p>${escapeHtml(adventure.description)}</p>
                </div>
                <div class="adventure-grid">${photos}</div>
            </section>`;
    }

    try {
        const profile = await loadJson("data/profile.json");

        root.innerHTML = `
            ${renderHero(profile)}
            ${renderAbout(profile.about)}
            ${renderAdventure(profile.adventure)}
        `;
    } catch (error) {
        renderError(root, "Profile data could not be loaded.");
        console.error(error);
    }
})();
