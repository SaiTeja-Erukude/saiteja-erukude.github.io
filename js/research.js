(async function () {
    const booksGrid = document.getElementById("books-grid");
    const patentsGrid = document.getElementById("patents-grid");
    const papersGrid = document.getElementById("papers-grid");
    const postersGrid = document.getElementById("posters-grid");
    const { escapeHtml, loadJson, renderError } = window.portfolio;

    function externalAttrs(href) {
        return href && /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
    }

    function renderTags(tags) {
        return tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    }

    function renderAuthors(authors) {
        const highlightedAuthor = "Sai Teja Erukude";

        return authors
            .split(highlightedAuthor)
            .map(escapeHtml)
            .join(`<strong class="author-self">${highlightedAuthor}</strong>`);
    }

    function renderPatentNumber(value) {
        const number = String(value || "Patent application");
        const match = number.match(/^(.*?)(\d[\d-]*)$/);

        if (!match) return escapeHtml(number);

        return `${escapeHtml(match[1])}<b>${escapeHtml(match[2])}</b>`;
    }

    function renderBook(book) {
        const titleWords = book.title.split(" ").slice(0, 5).join(" ");
        const links = book.links?.length ? book.links : [{ label: book.linkLabel || "View book", href: book.link }];

        return `<article class="book-card">
            <div class="book-copy">
                <h3>${escapeHtml(book.title)}</h3>
                <p class="research-meta">${escapeHtml(book.venue)} - ${escapeHtml(book.year)}</p>
                <p>${escapeHtml(book.description)}</p>
                <div class="publication-tags">${renderTags(book.tags || [])}</div>
                <div class="book-links">${links.map((link) => `<a href="${escapeHtml(link.href)}"${externalAttrs(link.href)}>${escapeHtml(link.label)} <i class="fas fa-arrow-up-right-from-square"></i></a>`).join("")}</div>
            </div>
            <aside class="book-cover" aria-label="Book cover"><span></span><strong>${escapeHtml(titleWords)}</strong><small>${escapeHtml(book.venue)} - ${escapeHtml(book.year)}</small></aside>
        </article>`;
    }

    function renderPatent(patent) {
        return `<article class="patent-card">
            <div class="patent-body">
                <h3>${escapeHtml(patent.title)}</h3>
                ${patent.priorityDate ? `<p class="patent-reference">Priority date: ${escapeHtml(patent.priorityDate)}</p>` : ""}
                ${patent.description ? `<p>${escapeHtml(patent.description)}</p>` : ""}
                <div class="publication-tags">${renderTags(patent.tags || [])}</div>
                ${patent.link ? `<div class="patent-actions"><a class="publication-action" href="${escapeHtml(patent.link)}"${externalAttrs(patent.link)}>View record <i class="fas fa-arrow-up-right-from-square"></i></a></div>` : ""}
            </div>
            <aside class="patent-visual" aria-label="Patent details">
                <span>IPO</span>
                <strong>${escapeHtml(patent.year || "--")}</strong>
                <p class="patent-application">${renderPatentNumber(patent.number)}</p>
                <small>${escapeHtml(patent.status || patent.venue || "Patent record")}</small>
            </aside>
        </article>`;
    }

    const authorsByTitle = {
        "Amplifying the imaging power of digital sky surveys with space telescopes data and generative AI": "Sai Teja Erukude, Lior Shamir",
        "AI-Driven Cybersecurity Threats: A Survey of Emerging Risks and Defensive Strategies": "Sai Teja Erukude, Viswa Chaitanya Marella, Suhasnadh Reddy Veluru",
        "CornViT: A Multi-Stage Convolutional Vision Transformer Framework for Hierarchical Corn Kernel Analysis": "Sai Teja Erukude, Jane Mascarenhas, Lior Shamir",
        "Galaxy Image Simplification Using Generative AI": "Sai Teja Erukude, Lior Shamir",
        "Multimodal Detection of Fake Reviews using BERT and ResNet-50": "Suhasnadh Reddy Veluru, Sai Teja Erukude, Viswa Chaitanya Marella",
        "FedOnco-Bench: A Reproducible Benchmark for Privacy-Aware Federated Tumor Segmentation with Synthetic CT Data": "Viswa Chaitanya Marella, Suhasnadh Reddy Veluru, Sai Teja Erukude",
        "Explainable Deep Learning in Medical Imaging: Brain Tumor and Pneumonia Detection": "Sai Teja Erukude, Viswa Chaitanya Marella, Suhasnadh Reddy Veluru",
        "Wavelet-based GAN Fingerprint Detection using ResNet50": "Sai Teja Erukude, Suhasnadh Reddy Veluru, Viswa Chaitanya Marella",
        "Fourier-Based GAN Fingerprint Detection Using ResNet50": "Sai Teja Erukude, Viswa Chaitanya Marella, Suhasnadh Reddy Veluru",
        "The Evolution of Search Engines: From Keyword Matching to AI-Powered Understanding": "Suhasnadh Reddy Veluru, Viswa Chaitanya Marella, Sai Teja Erukude",
        "Multimodal Deep Learning: A Survey of Models, Fusion Strategies, Applications, and Research Challenges": "Sai Teja Erukude, Suhasnadh Reddy Veluru, Viswa Chaitanya Marella",
        "Towards a New Era of Sustainable Agriculture: AI Applications and Case Studies in Crop Management": "Viswa Chaitanya Marella, Sai Teja Erukude, Suhasnadh Reddy Veluru",
        "Transforming Medicine With Intelligence: How AI Is Reshaping the Role of Doctors and the Future of Clinical Practice": "Suhasnadh Reddy Veluru, Viswa Chaitanya Marella, Sai Teja Erukude",
        "Agentic AI-The Rise of Autonomous Intelligent Agents in the Era of LLMs": "Sai Teja Erukude, Suhasnadh Reddy Veluru, Viswa Chaitanya Marella",
        "The Impact of Artificial Intelligence on Traditional Art Forms: A Disruption or Enhancement?": "Viswa Chaitanya Marella, Sai Teja Erukude, Suhasnadh Reddy Veluru",
        "Data-Centric AI: A Systematic Review of Methods, Challenges, and Future Directions": "Suhasnadh Reddy Veluru, Sai Teja Erukude, Viswa Chaitanya Marella",
        "Explainable Identification of Similarities Between Entities for Discovery in Large Text": "Akhil Joshi, Sai Teja Erukude, Lior Shamir",
        "Identifying Bias in Deep Neural Networks Using Image Transforms": "Sai Teja Erukude, Akhil Joshi, Lior Shamir",
        "Identifying bias in CNN image classification using image scrambling and transforms": "Sai Teja Erukude"
    };

    const figuresByTitle = {
        "Amplifying the imaging power of digital sky surveys with space telescopes data and generative AI": "images/research/galxy-amplification.jpg",
        "AI-Driven Cybersecurity Threats: A Survey of Emerging Risks and Defensive Strategies": "images/research/ai-cybersecurity-deepfake-categories.png",
        "CornViT: A Multi-Stage Convolutional Vision Transformer Framework for Hierarchical Corn Kernel Analysis": "images/research/cornvit-pipeline.png",
        "Galaxy Image Simplification Using Generative AI": "images/research/galaxy-skeletonization.jpg",
        "Multimodal Detection of Fake Reviews using BERT and ResNet-50": "images/research/fake-reviews-flow.png",
        "FedOnco-Bench: A Reproducible Benchmark for Privacy-Aware Federated Tumor Segmentation with Synthetic CT Data": "images/research/fedonco-segmentation.jpg",
        "Explainable Deep Learning in Medical Imaging: Brain Tumor and Pneumonia Detection": "images/research/medical-imaging-brain-tumor.jpg",
        "Wavelet-based GAN Fingerprint Detection using ResNet50": "images/research/wavelet-gan-fingerprints.jpg",
        "Fourier-Based GAN Fingerprint Detection Using ResNet50": "images/research/fourier-gan-methodology.jpg",
        "The Evolution of Search Engines: From Keyword Matching to AI-Powered Understanding": "images/research/search-engines.png",
        "Multimodal Deep Learning: A Survey of Models, Fusion Strategies, Applications, and Research Challenges": "images/research/multimodal-architecture.jpg",
        "Towards a New Era of Sustainable Agriculture: AI Applications and Case Studies in Crop Management": "images/research/sustainable-agriculture.jpg",
        "Transforming Medicine With Intelligence: How AI Is Reshaping the Role of Doctors and the Future of Clinical Practice": "images/research/ai-medicine.png",
        "The Impact of Artificial Intelligence on Traditional Art Forms: A Disruption or Enhancement?": "images/research/ai-art.png",
        "Data-Centric AI: A Systematic Review of Methods, Challenges, and Future Directions": "images/research/datacentric-ai.png",
        "Explainable Identification of Similarities Between Entities for Discovery in Large Text": "images/research/text-similarity.png",
        "Identifying Bias in Deep Neural Networks Using Image Transforms": "images/research/bias-image-transforms-wavelet.png",
        "Identifying bias in CNN image classification using image scrambling and transforms": "images/research/thesis.png"
    };

    function publicationType(category) {
        return ({ journal: "Journal article", conference: "Conference paper", thesis: "Master's thesis" })[category] || "Research work";
    }

    function renderPaper(paper, index) {
        const authors = authorsByTitle[paper.title] || "Sai Teja Erukude";
        const figure = figuresByTitle[paper.title];
        const paperAction = paper.disabled || !paper.link
            ? `<span class="publication-action disabled">${paper.venue === "Review in progress" ? "In review" : "Record pending"}</span>`
            : `<a class="publication-action" href="${escapeHtml(paper.link)}"${externalAttrs(paper.link)}>Paper <i class="fas fa-arrow-up-right-from-square"></i></a>`;
        const scholarAction = paper.scholarLink ? `<a class="publication-action secondary" href="${escapeHtml(paper.scholarLink)}"${externalAttrs(paper.scholarLink)}>Scholar <i class="fas fa-arrow-up-right-from-square"></i></a>` : "";

        return `<article class="publication-card${paper.disabled ? " is-pending" : ""}">
            <div class="publication-copy">
                <p class="publication-type">${escapeHtml(publicationType(paper.category))}</p>
                <h3>${escapeHtml(paper.title)}</h3>
                <p class="publication-authors">${renderAuthors(authors)}</p>
                <p class="publication-citation">${escapeHtml(paper.venue)} - ${escapeHtml(paper.year)}</p>
                <p class="publication-summary">${escapeHtml(paper.description)}</p>
                <div class="publication-actions">${paperAction}${scholarAction}</div>
            </div>
            <aside class="publication-visual${figure ? " has-figure" : ""}">
                ${figure ? `<img class="publication-figure" src="${escapeHtml(figure)}" alt="Figure from ${escapeHtml(paper.title)}" loading="lazy">` : `
                    <span class="visual-index">${String(index + 1).padStart(2, "0")}</span>
                    <span class="visual-label">${escapeHtml((paper.tags || ["Research"])[0])}</span>
                    <span class="visual-orbit"></span>
                    <span class="visual-orbit visual-orbit-secondary"></span>`}
            </aside>
        </article>`;
    }

    function renderPoster(poster) {
        return `<article class="publication-card poster-card">
            <div class="publication-copy">
                <h3>${escapeHtml(poster.title)}</h3>
                <p class="publication-authors">${renderAuthors(poster.authors || "Sai Teja Erukude")}</p>
                <p class="publication-citation">${escapeHtml(poster.venue)} - ${escapeHtml(poster.year)}</p>
                <p class="publication-summary">${escapeHtml(poster.description)}</p>
                <div class="publication-actions"><a class="publication-action" href="${escapeHtml(poster.link)}"${externalAttrs(poster.link)}>${escapeHtml(poster.linkLabel || "View poster")} <i class="fas fa-arrow-up-right-from-square"></i></a></div>
            </div>
            <aside class="publication-visual has-figure" aria-label="Poster presentation photograph">
                <img class="publication-figure" src="${escapeHtml(poster.image)}" alt="${escapeHtml(poster.imageAlt || `Poster for ${poster.title}`)}" loading="lazy" decoding="async">
            </aside>
        </article>`;
    }

    try {
        const records = await loadJson("data/research.json");
        const books = records.filter((item) => item.category === "book");
        const patents = records.filter((item) => item.category === "patent");
        const papers = records.filter((item) => ["journal", "conference", "thesis"].includes(item.category));
        const posters = records.filter((item) => item.category === "poster");

        document.getElementById("books-count").textContent = `${books.length} published`;
        document.getElementById("patents-count").textContent = patents.length ? `${patents.length} on record` : "Patent record";
        document.getElementById("papers-count").textContent = `${papers.length} papers - journal, conference & thesis`;
        document.getElementById("posters-count").textContent = `${posters.length} presented`;
        booksGrid.innerHTML = books.length ? books.map(renderBook).join("") : '<p class="disclosures-empty">Published books will appear here.</p>';
        patentsGrid.innerHTML = patents.length ? patents.map(renderPatent).join("") : '<article class="patent-card patent-placeholder"><div class="patent-body"><p class="publication-type">Patent</p><h3>Patent details coming soon.</h3><p>This space is reserved for the title, filing number, status, and official record.</p></div><aside class="patent-visual"><span>IPO</span><strong>--</strong><small>Patent record</small></aside></article>';
        papersGrid.innerHTML = papers.map(renderPaper).join("");
        postersGrid.innerHTML = posters.length ? posters.map(renderPoster).join("") : '<p class="disclosures-empty">Poster presentations will appear here.</p>';
    } catch (error) {
        renderError(booksGrid, "Research records could not be loaded.");
        renderError(postersGrid, "Poster records could not be loaded.");
        console.error(error);
    }
})();
