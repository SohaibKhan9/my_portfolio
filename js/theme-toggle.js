(() => {
    const root = document.documentElement;
    const toggleButton = document.getElementById("theme-toggle");
    const toggleIcon = document.getElementById("theme-toggle-icon");
    const storageKey = "portfolio-theme";

    if (!toggleButton || !toggleIcon) return;

    const getSystemTheme = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const updateTheme = (theme) => {
        const isDark = theme === "dark";
        root.classList.toggle("dark", isDark);
        toggleIcon.textContent = isDark ? "light_mode" : "dark_mode";
        toggleButton.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
        toggleButton.setAttribute("title", isDark ? "Light mode" : "Dark mode");
    };

    const savedTheme = localStorage.getItem(storageKey);
    const initialTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : getSystemTheme();
    updateTheme(initialTheme);

    toggleButton.addEventListener("click", () => {
        const nextTheme = root.classList.contains("dark") ? "light" : "dark";
        updateTheme(nextTheme);
        localStorage.setItem(storageKey, nextTheme);
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", () => {
        const current = localStorage.getItem(storageKey);
        if (current !== "dark" && current !== "light") {
            updateTheme(getSystemTheme());
        }
    });
})();
