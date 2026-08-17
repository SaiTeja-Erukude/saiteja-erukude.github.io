(async function () {
    const root = document.getElementById("connect-content");
    const { escapeHtml, loadJson, renderError } = window.portfolio;

    function externalAttrs(href) {
        return /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
    }

    try {
        const profile = await loadJson("data/profile.json");
        const email = profile.details.find((detail) => detail.href.startsWith("mailto:"));
        const profiles = profile.details.filter((detail) => !detail.href.startsWith("mailto:"));
        const emailAddress = email?.href.replace(/^mailto:/, "") || "erukude.saiteja@gmail.com";

        root.innerHTML = `
            <div class="contact-layout">
                <section class="contact-direct" aria-labelledby="contact-direct-title">
                    <p class="contact-kicker">Direct contact</p>
                    <h2 id="contact-direct-title">${escapeHtml(profile.connect.headline)}</h2>
                    <p class="contact-intro">${escapeHtml(profile.connect.description)}</p>
                    <a class="contact-email" href="${escapeHtml(email?.href || `mailto:${emailAddress}`)}">
                        <span class="contact-email-icon"><i class="fas fa-envelope" aria-hidden="true"></i></span>
                        <span class="contact-email-copy"><small>Email</small><strong>${escapeHtml(emailAddress)}</strong></span>
                        <i class="fas fa-arrow-right contact-email-arrow" aria-hidden="true"></i>
                    </a>
                    <p class="contact-location"><i class="fas fa-location-dot" aria-hidden="true"></i>Based in ${escapeHtml(profile.location)}</p>
                </section>

                <section class="contact-directory" aria-labelledby="contact-directory-title">
                    <div class="contact-directory-heading">
                        <p class="contact-kicker">Research &amp; professional profiles</p>
                        <h2 id="contact-directory-title">Elsewhere online</h2>
                    </div>
                    <ul class="contact-profile-grid">
                        ${profiles.map((detail) => `
                            <li>
                                <a href="${escapeHtml(detail.href)}"${externalAttrs(detail.href)}>
                                    <span class="contact-profile-icon"><i class="${escapeHtml(detail.icon)}" aria-hidden="true"></i></span>
                                    <span>${escapeHtml(detail.label)}</span>
                                    <i class="fas fa-arrow-up-right-from-square contact-profile-arrow" aria-hidden="true"></i>
                                </a>
                            </li>`).join("")}
                    </ul>
                </section>
            </div>`;
    } catch (error) {
        renderError(root, "Contact details could not be loaded.");
        console.error(error);
    }
})();
