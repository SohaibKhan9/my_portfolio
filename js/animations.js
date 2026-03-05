(() => {
    const blocks = document.querySelectorAll(
        "section .max-w-7xl > *, section .max-w-4xl > *, section .grid > div, section .space-y-12 > .relative, footer .max-w-7xl > *"
    );
    const variantGroups = [
        ["anim-lift", "anim-slide-left", "anim-soft-pop"],
        ["anim-slide-right", "anim-zoom", "anim-blur-rise"],
        ["anim-tilt-left", "anim-lift", "anim-slide-right"],
        ["anim-tilt-right", "anim-soft-pop", "anim-slide-left"]
    ];
    const uniqueBlocks = [...new Set(blocks)];
    const manualReplayTargets = new WeakSet();
    let observer = null;
    const getSectionItems = (sectionElement) =>
        uniqueBlocks.filter((block) => block.closest("section, footer") === sectionElement);

    const primeSectionForReplay = (sectionElement) => {
        if (!sectionElement) return [];

        const items = getSectionItems(sectionElement);
        if (!items.length) return [];

        items.forEach((item) => {
            manualReplayTargets.add(item);
            if (observer) observer.unobserve(item);
            item.style.transition = "none";
            item.classList.remove("is-visible");
        });

        items.forEach((item) => void item.offsetHeight);
        return items;
    };

    const replaySectionAnimations = (sectionElement) => {
        if (!sectionElement) return;

        const items = primeSectionForReplay(sectionElement);
        if (!items.length) return;

        items.forEach((item) => {
            item.style.removeProperty("transition");
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                items.forEach((item, index) => {
                    const delay = Math.min(index * 80, 560);
                    item.style.setProperty("--reveal-delay", `${delay}ms`);
                    item.classList.add("is-visible");
                });
            });
        });

        window.setTimeout(() => {
            items.forEach((item) => manualReplayTargets.delete(item));
        }, 1400);
    };

    uniqueBlocks.forEach((block, index) => {
        const section = block.closest("section, footer");
        const sectionIndex = [...document.querySelectorAll("section, footer")].indexOf(section);
        const group = variantGroups[(sectionIndex + 4) % variantGroups.length];
        const variant = group[index % group.length];

        block.classList.add("reveal-item", variant);
        block.style.setProperty("--reveal-delay", `${Math.min((index % 8) * 70, 490)}ms`);
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        uniqueBlocks.forEach((block) => block.classList.add("is-visible"));
        return;
    }

    observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                if (manualReplayTargets.has(entry.target)) return;
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -12% 0px"
        }
    );

    uniqueBlocks.forEach((block) => observer.observe(block));

    document.addEventListener("click", (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;

        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;

        const sectionElement = document.querySelector(hash);
        if (!sectionElement) return;

        primeSectionForReplay(sectionElement);

        if (window.location.hash !== hash) return;

        window.setTimeout(() => replaySectionAnimations(sectionElement), 60);
    });

    window.addEventListener("hashchange", () => {
        const hash = window.location.hash;
        if (!hash || hash === "#") return;

        const sectionElement = document.querySelector(hash);
        window.setTimeout(() => replaySectionAnimations(sectionElement), 60);
    });
})();
