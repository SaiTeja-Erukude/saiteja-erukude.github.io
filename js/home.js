(async function () {
    const root = document.getElementById("profile-home");
    const { escapeHtml, loadJson, renderError } = window.portfolio;

    function renderHero(profile) {
        return `
            <section class="home-intro">
                <div class="home-photo"><img src="${escapeHtml(profile.photo.src)}" alt="${escapeHtml(profile.photo.alt)}"></div>
                <div class="home-intro-copy">
                    <p class="home-kicker">${escapeHtml(profile.role)}</p>
                    <h1>${escapeHtml(profile.name)}</h1>
                    <p class="home-headline">${escapeHtml(profile.hero.headline)}</p>
                    <p class="home-summary">${escapeHtml(profile.hero.summary)}</p>
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
                <div class="home-about-heading"><p>About</p><h2>${escapeHtml(about.title)}</h2></div>
                <div class="home-about-narrative">${paragraphs}</div>
                <div class="home-facts">${facts}</div>
            </section>`;
    }

    async function renderAchievements(metrics, container) {
        const [disclosures, projects] = await Promise.allSettled([
            loadJson("data/disclosures.json"),
            loadJson("data/projects.json")
        ]);
        const values = {};

        if (disclosures.status === "fulfilled") {
            values.disclosures = new Set(disclosures.value.map((item) => item.cve)).size;
        }
        if (projects.status === "fulfilled") {
            const data = projects.value;
            values.projects = data.ecosystem.packages.length + data.tools.length + data.models.length + data.researchModels.length;
        }

        const availableMetrics = metrics
            .map((metric) => ({ ...metric, value: metric.source ? values[metric.source] : metric.value }))
            .filter((metric) => metric.value !== undefined);

        container.innerHTML = availableMetrics.map((metric) => `
            <a class="home-achievement" href="${escapeHtml(metric.href)}">
                <strong>${escapeHtml(metric.value)}</strong>
                <span>${escapeHtml(metric.label)} <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
            </a>`).join("");
        container.hidden = !availableMetrics.length;
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
            <section class="home-achievements" id="home-achievements" aria-label="Portfolio achievements" hidden></section>
            ${renderAbout(profile.about)}
            ${renderAdventure(profile.adventure)}
        `;
        await renderAchievements(profile.metrics, document.getElementById("home-achievements"));
    } catch (error) {
        renderError(root, "Profile data could not be loaded.");
        console.error(error);
    }
})();
