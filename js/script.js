/**
 * ORIGIN Publications India
 * Centralized Site Configuration & Interaction Controller
 */
var SITE_CONFIG = {
    organizationName: "ORIGIN Publications India",
    tagline: "The Original Research & Innovation Group for Integrated Novelty Publications",
    email: "Originpublicationsindia@gmail.com",
    emailLink: "mailto:Originpublicationsindia@gmail.com",
    phone: "+91 78420 74428",
    phoneLink: "tel:+917842074428",
    whatsappLink: "https://wa.me/917842074428",
    location: "Keralam, India"
};

if (typeof window !== "undefined") {
    window.SITE_CONFIG = SITE_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = SITE_CONFIG;
}

(function () {
    "use strict";

    if (typeof document === "undefined") {
        return;
    }

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

    // Copy email to clipboard with accessible visual feedback
    document.querySelectorAll(".copy-email-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var email = btn.getAttribute("data-email") || (window.SITE_CONFIG && window.SITE_CONFIG.email) || "Originpublicationsindia@gmail.com";
            var textSpan = btn.querySelector(".copy-btn-text");
            var originalText = textSpan ? textSpan.textContent : "Copy Email";

            function notifySuccess() {
                if (textSpan) {
                    textSpan.textContent = "Copied!";
                }
                btn.classList.add("is-copied");
                setTimeout(function () {
                    if (textSpan) {
                        textSpan.textContent = originalText;
                    }
                    btn.classList.remove("is-copied");
                }, 2000);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(notifySuccess).catch(function () {
                    fallbackCopyText(email);
                    notifySuccess();
                });
            } else {
                fallbackCopyText(email);
                notifySuccess();
            }
        });
    });

    function fallbackCopyText(text) {
        var tempInput = document.createElement("textarea");
        tempInput.value = text;
        tempInput.setAttribute("readonly", "");
        tempInput.style.position = "absolute";
        tempInput.style.left = "-9999px";
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand("copy");
        } catch (err) {
            // silent fallback
        }
        document.body.removeChild(tempInput);
    }

    var form = document.getElementById("contact-form");
    var emailClientBtn = document.getElementById("email-client-btn");

    if (emailClientBtn && form) {
        emailClientBtn.addEventListener("click", function () {
            var fullNameInput = form.querySelector("#full-name");
            var emailInput = form.querySelector("#email");
            var serviceSelect = form.querySelector("#service-interest");
            var audienceSelect = form.querySelector("#audience-group");
            var subjectInput = form.querySelector("#subject");
            var messageInput = form.querySelector("#message");

            var name = fullNameInput ? fullNameInput.value.trim() : "";
            var senderEmail = emailInput ? emailInput.value.trim() : "";
            var service = serviceSelect ? serviceSelect.value : "";
            var audience = audienceSelect ? audienceSelect.value : "";
            var rawSubject = subjectInput ? subjectInput.value.trim() : "";
            var rawMessage = messageInput ? messageInput.value.trim() : "";

            var finalSubject = rawSubject
                ? "ORIGIN Publications – " + rawSubject
                : "ORIGIN Publications – General Inquiry";

            var bodyLines = [
                "Dear ORIGIN Publications Team,",
                "",
                rawMessage || "I would like to inquire about your research, writing, and publication services.",
                "",
                "----------------------------------------",
                "Sender Details:",
                "Full Name: " + (name || "[Not provided]"),
                "Contact Email: " + (senderEmail || "[Not provided]"),
                "Service of Interest: " + (service || "General Support"),
                "Professional Background: " + (audience || "[Not provided]"),
                "----------------------------------------",
                "",
                "Thank you."
            ];

            var mailtoUrl = "mailto:" + encodeURIComponent(SITE_CONFIG.email) +
                "?subject=" + encodeURIComponent(finalSubject) +
                "&body=" + encodeURIComponent(bodyLines.join("\n"));

            window.location.href = mailtoUrl;
        });
    }

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
                if (!field) {
                    return;
                }
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

            var submitBtn = form.querySelector('button[type="submit"]');
            var originalBtnText = submitBtn ? submitBtn.textContent : "Send Inquiry";
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Sending...";
            }

            function resetForm() {
                form.reset();
                Object.keys(fields).forEach(function (key) {
                    if (fields[key]) {
                        fields[key].setAttribute("aria-invalid", "false");
                        var error = document.getElementById(fields[key].id + "-error");
                        if (error) {
                            error.textContent = "";
                        }
                    }
                });
            }

            // Google Sheets Script Web App URL
            var GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-eGbAHXOW1wnWHsEkd6hjNcrVzVyJNL1yNOxAxaqp_f2a-s-M7Nx5MKyawoqyr-S9/exec";
            if (!GOOGLE_SCRIPT_URL) {
                if (status) {
                    status.innerHTML = "<strong>Inquiry recorded.</strong><br>Thank you for connecting with " + SITE_CONFIG.organizationName + ". Our team will respond from <strong>" + SITE_CONFIG.email + "</strong>.";
                    status.className = "form-status form-status-success is-visible";
                    status.focus();
                }
                resetForm();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
                return;
            }

            var formData = new URLSearchParams(new FormData(form));

            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                body: formData
            })
                .then(function () {
                    if (status) {
                        status.innerHTML = "<strong>Thank you for your inquiry.</strong><br>Your details have been successfully received by " + SITE_CONFIG.organizationName + ". We will review your submission and reply to your provided email address from <strong>" + SITE_CONFIG.email + "</strong> within 1–2 business days.";
                        status.className = "form-status form-status-success is-visible";
                        status.focus();
                    }
                    resetForm();
                })
                .catch(function () {
                    if (status) {
                        status.innerHTML = "<strong>Submission could not be completed.</strong><br>Please try again or email our editorial desk directly at <a href='mailto:" + SITE_CONFIG.email + "?subject=ORIGIN%20Inquiry%20Direct' class='status-email-link'>" + SITE_CONFIG.email + "</a>.";
                        status.className = "form-status form-status-error is-visible";
                        status.focus();
                    }
                })
                .finally(function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                    }
                });
        });
    }
})();
