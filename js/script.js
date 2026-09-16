(function () {
    "use strict";

    var nav = document.getElementById("site-nav");
    var toggle = document.querySelector(".nav-toggle");
    var overlay = document.querySelector(".nav-overlay");
    var navLinks = document.querySelectorAll("#site-nav a");

    function setNavOpen(isOpen) {
        if (!nav || !toggle) {
            return;
        }

        nav.classList.toggle("is-open", isOpen);
        if (overlay) {
            overlay.classList.toggle("is-open", isOpen);
        }
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        document.body.classList.toggle("nav-open", isOpen);
    }

    function closeNav() {
        setNavOpen(false);
    }

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var expanded = toggle.getAttribute("aria-expanded") === "true";
            setNavOpen(!expanded);
        });
    }

    if (overlay) {
        overlay.addEventListener("click", closeNav);
    }

    navLinks.forEach(function (link) {
        link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeNav();
        }
    });

    var currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!currentPage || currentPage === "/") {
        currentPage = "index.html";
    }

    document.querySelectorAll(".nav-list a").forEach(function (link) {
        var href = (link.getAttribute("href") || "").toLowerCase();
        if (href === currentPage) {
            link.setAttribute("aria-current", "page");
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (event) {
            var id = anchor.getAttribute("href");
            if (!id || id === "#") {
                return;
            }
            var target = document.querySelector(id);
            if (!target) {
                return;
            }
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
        });
    });

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion && "IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
        );

        document.querySelectorAll(".reveal, .process").forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        document.querySelectorAll(".reveal, .process").forEach(function (el) {
            el.classList.add("is-visible");
        });
    }

    var form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            var fields = {
                name: form.querySelector("#full-name"),
                email: form.querySelector("#email"),
                subject: form.querySelector("#subject"),
                message: form.querySelector("#message")
            };
            var valid = true;
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            Object.keys(fields).forEach(function (key) {
                var field = fields[key];
                var error = document.getElementById(field.id + "-error");
                var value = field.value.trim();
                var message = "";

                if (!value) {
                    message = "This field is required.";
                    valid = false;
                } else if (key === "email" && !emailPattern.test(value)) {
                    message = "Enter a valid email address.";
                    valid = false;
                }

                field.setAttribute("aria-invalid", message ? "true" : "false");
                if (error) {
                    error.textContent = message;
                }
            });

            var status = document.getElementById("form-status");
            if (!valid) {
                if (status) {
                    status.classList.remove("is-visible");
                }
                return;
            }

            form.reset();
            Object.keys(fields).forEach(function (key) {
                fields[key].setAttribute("aria-invalid", "false");
                var error = document.getElementById(fields[key].id + "-error");
                if (error) {
                    error.textContent = "";
                }
            });

            if (status) {
                status.classList.add("is-visible");
                status.focus();
            }
        });
    }
})();
