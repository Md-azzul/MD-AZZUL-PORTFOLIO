document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- Mobile menu ----------
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");

    function setMenu(open) {
        navLinks.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
    }
    menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
    navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

    // ---------- Scroll reveal ----------
    const revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add("in"));
    }

    // ---------- Hero storefront demo: products get "added" one by one ----------
    const cards = document.querySelectorAll(".mock-card");
    const count = document.getElementById("mock-count");
    let current = 0;
    let total = 0;

    if (cards.length && count && !reduceMotion) {
        setInterval(() => {
            cards.forEach((c) => c.classList.remove("pick"));
            cards[current].classList.add("pick");
            current = (current + 1) % cards.length;

            total = total >= 9 ? 1 : total + 1;
            count.textContent = total;
            count.classList.remove("bump");
            void count.offsetWidth; // restart the bump animation
            count.classList.add("bump");
        }, 1800);
    }

    // ---------- Footer year ----------
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
});