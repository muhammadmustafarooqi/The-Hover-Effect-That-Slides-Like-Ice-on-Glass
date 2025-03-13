import { awards } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
    const lenis = new Lenis({
        autoRaf: true,
    });

    const awardsList = document.querySelector(".awards-list");
    const awardPreview = document.querySelector(".award-preview");

    const Positions = {
        TOP: "-160",
        MIDDLE: "-80",
        BOTTOM: "0",
    };

    let lastMousePosition = { x: 0, y: 0 };
    let activeAward = null;
    let ticking = false;
    let mouseTimeout = null;
    let isMouseMoving = false;

    // Create award elements
    awards.forEach((award, index) => {
        const awardElement = document.createElement("div");
        awardElement.className = "award";

        awardElement.innerHTML = `
        <div class="award-wrapper">
            <div class="award-name">
                <h1>${award.name}</h1>
                <h1>${award.type}</h1>
            </div>
            <div class="award-project">
                <h1>${award.project}</h1>
                <h1>${award.label}</h1>
            </div>
            <div class="award-name">
                <h1>${award.name}</h1>
                <h1>${award.type}</h1>
            </div>
        </div>
        `;

        awardsList.appendChild(awardElement);

        // Add mouseover event to show preview image
        awardElement.addEventListener("mouseenter", (e) => {
            activeAward = awardElement;
            const wrapper = awardElement.querySelector(".award-wrapper");
            const rect = awardElement.getBoundingClientRect();
            const enterFromTop = e.clientY < rect.top + rect.height / 2;

            gsap.to(wrapper, {
                y: Positions.MIDDLE,
                duration: 0.4,
                ease: "power2.out",
            });

            // Create and animate the preview image
            const img = document.createElement("img");
            img.src = `assets/img.jpg`;
            img.style.position = "absolute";
            img.style.top = "0";
            img.style.left = "0";
            img.style.scale = "0";
            img.style.zIndex = Date.now();

            awardPreview.appendChild(img);

            gsap.to(img, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out",
            });
        });

        // Add mouseleave event to hide preview
        awardElement.addEventListener("mouseleave", (e) => {
            const wrapper = awardElement.querySelector(".award-wrapper");
            const rect = awardElement.getBoundingClientRect();
            const leavingFromTop = e.clientY < rect.top + rect.height / 2;

            gsap.to(wrapper, {
                y: leavingFromTop ? Positions.TOP : Positions.BOTTOM,
                duration: 0.4,
                ease: "power2.out",
            });

            activeAward = null;
        });
    });

    const animatePreview = () => {
        if (!awardsList) return;
        
        const awardListRect = awardsList.getBoundingClientRect();

        if (
            lastMousePosition.x < awardListRect.left ||
            lastMousePosition.x > awardListRect.right ||
            lastMousePosition.y < awardListRect.top ||
            lastMousePosition.y > awardListRect.bottom
        ) {
            const previewImages = awardPreview.querySelectorAll("img");
            previewImages.forEach((img) => {
                gsap.to(img, {
                    scale: 0,
                    ease: "power2.out",
                    duration: 0.4,
                    onComplete: () => img.remove(),
                });
            });
        }
    };

    const updateAwards = () => {
        animatePreview();

        if (activeAward) {
            const rect = activeAward.getBoundingClientRect();

            const isStillOver =
                lastMousePosition.x >= rect.left &&
                lastMousePosition.x <= rect.right &&
                lastMousePosition.y >= rect.top &&
                lastMousePosition.y <= rect.bottom;

            if (!isStillOver) {
                const wrapper = activeAward.querySelector(".award-wrapper");
                const leavingFromTop = lastMousePosition.y < rect.top + rect.height / 2;

                gsap.to(wrapper, {
                    y: leavingFromTop ? Positions.TOP : Positions.BOTTOM,
                    duration: 0.4,
                    ease: "power2.out",
                    delay: 0.2,
                });
                activeAward = null;
            }
        }

        document.querySelectorAll(".award").forEach((award) => {
            if (award === activeAward) return;

            const rect = award.getBoundingClientRect();
            const isMouseOver =
                lastMousePosition.x >= rect.left &&
                lastMousePosition.x <= rect.right &&
                lastMousePosition.y >= rect.top &&
                lastMousePosition.y <= rect.bottom;

            if (isMouseOver) {
                const wrapper = award.querySelector(".award-wrapper");
                
                gsap.to(wrapper, {
                    y: Positions.MIDDLE,
                    duration: 0.4,
                    ease: "power2.out",
                });
                activeAward = award;
            }
        });

        ticking = false;
    };

    document.addEventListener("mousemove", (e) => {
        lastMousePosition.x = e.clientX;
        lastMousePosition.y = e.clientY;
        isMouseMoving = true;

        if (mouseTimeout) {
            clearTimeout(mouseTimeout);
        }

        if (!awardsList || !awardPreview) return;

        const awardsListRect = awardsList.getBoundingClientRect();
        const isInsideAwardList =
            lastMousePosition.x >= awardsListRect.left &&
            lastMousePosition.x <= awardsListRect.right &&
            lastMousePosition.y >= awardsListRect.top &&
            lastMousePosition.y <= awardsListRect.bottom;

        if (isInsideAwardList) {
            mouseTimeout = setTimeout(() => {
                isMouseMoving = false;
                const images = awardPreview.querySelectorAll("img");

                if (images.length > 1) {
                    const lastImage = images[images.length - 1];

                    images.forEach((img) => {
                        if (img !== lastImage) {
                            gsap.to(img, {
                                scale: 0,
                                ease: "power2.out",
                                duration: 0.4,
                                onComplete: () => img.remove(),
                            });
                        }
                    });
                }
            }, 2000);
        }

        animatePreview();

        if (!ticking) {
            requestAnimationFrame(() => {
                updateAwards();
            });
            ticking = true;
        }
    });

    document.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateAwards();
            });
            ticking = true;
        }
    }, { passive: true });
});

