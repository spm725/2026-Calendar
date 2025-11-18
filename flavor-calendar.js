const targetYear = 2026;

const flavorRotation2025 = [
    "Heath Bar®",
    "Blueberry Pie",
    "Nutter Butter®",
    "Coffee Toffee",
    "Mint Oreo®",
    "Strawberry Cheesecake"
];

const flavorRotation2026 = [
    "Reese's® Cheesecake",
    "Coffee Toffee",
    "Butterfinger®",
    "Toasted Coconut",
    "Peaches n' Cream",
    "Nutter Butter®",
    "Strawberry Swirl",
    "Cookies n' Cream",
    "Blueberry Pie",
    "Reese's Peanut Butter Cup®",
    "Black Raspberry",
    "Mint Oreo®",
    "Toasted Coconut",
    "Orange Dreamsicle",
    "Strawberry Cheesecake",
    "Butterfinger®",
    "Peaches n' Cream",
    "Reese's Peanut Butter Cup®",
    "Oreo® Cheesecake",
    "Blueberry Pie",
    "Nutter Butter®",
    "Mint Oreo®",
    "Key Lime Pie",
    "Toasted Coconut",
    "Black Raspberry",
    "Coffee Toffee",
    "Strawberry Cheesecake",
    "Reese's Peanut Butter Cup®",
    "Orange Dreamsicle",
    "Key Lime Pie",
    "Reese's® Cheesecake",
    "Cookies n' Cream",
    "Toasted Coconut",
    "Blueberry Pie",
    "Strawberry Cheesecake",
    "Mint Oreo®",
    "Black Raspberry",
    "Nutter Butter®",
    "Strawberry Swirl",
    "Heath Bar®",
    "Reese's Peanut Butter Cup®",
    "Mint Oreo®",
    "Butterfinger®",
    "Oreo® Cheesecake",
    "Toasted Coconut",
    "Strawberry Swirl",
    "Heath Bar®",
    "Blueberry Pie",
    "Reese's® Cheesecake",
    "Coffee Toffee",
    "Mint Oreo®",
    "Strawberry Cheesecake",
    "Nutter Butter®"
];

const fullRotation = [...flavorRotation2025, ...flavorRotation2026];

const imageBaseURL = "https://spm725.github.io/2026-Calendar/Images/";

function getImageURL(name) {
    return (
        imageBaseURL +
        name
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/®/g, "")
            .replace(/'/g, "") +
        ".jpg"
    );
}

function getStartDate() {
    // Calendar schedule starts Monday, Nov 17, 2025
    return new Date(2025, 10, 17);
}

function formatDate(d) {
    return d.toISOString().slice(0, 10);
}

function buildFlavorData(rotation) {
    const start = getStartDate();
    return rotation.map((text, i) => {
        const s = new Date(start);
        s.setDate(s.getDate() + i * 7);
        const e = new Date(s);
        e.setDate(e.getDate() + 6);
        return {
            text,
            start: formatDate(s),
            end: formatDate(e),
            image: getImageURL(text),
        };
    });
}

const flavorData = buildFlavorData(fullRotation);

window.addEventListener("DOMContentLoaded", function () {
    const calendarContainer = document.getElementById("calendar-container");
    const monthDisplay = document.getElementById("month-display");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const currentFlavorBox = document.getElementById("featured-flavor");

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function normalizeDate(str) {
        const [y, m, d] = str.split("-").map(Number);
        return new Date(y, m - 1, d);
    }

    function updateCurrentFlavor() {
        const today = new Date();
        const t = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );
        const f = flavorData.find((fl) => {
            const s = normalizeDate(fl.start);
            const e = normalizeDate(fl.end);
            return t >= s && t <= e;
        });
        if (f) {
            currentFlavorBox.innerHTML = `
                <div class="title">Current Flavor</div>
                <img src="${f.image}" class="flavor-image" />
            `;
        } else {
            currentFlavorBox.innerHTML = `
                <div class="title">Current Flavor</div>
                <div class="flavor-image">No Current Flavor</div>
            `;
        }
    }

    function checkPrevButton() {
        const today = new Date();
        const currentStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );
        const displayed = new Date(currentYear, currentMonth, 1);
        prevButton.disabled = displayed <= currentStart;
    }

    function checkNextButton() {
        const lastEnd = normalizeDate(
            flavorData[flavorData.length - 1].end
        );
        const displayed = new Date(currentYear, currentMonth + 1, 0);
        nextButton.disabled = displayed >= lastEnd;
    }

    function adjustFontSizeForFlavorText() {
        document.querySelectorAll(".flavor-text").forEach((t) => {
            let size = 10;
            t.style.fontSize = size + "px";
            while (
                (t.scrollWidth > t.parentElement.clientWidth ||
                    t.scrollHeight > t.parentElement.clientHeight) &&
                size > 6
            ) {
                size -= 0.5;
                t.style.fontSize = size + "px";
            }
        });
    }

    function adjustCalendarColumns() {
        if (window.innerWidth > 1200) {
            calendarContainer.style.gridTemplateColumns = "repeat(7, 1fr)";
        } else if (window.innerWidth > 768) {
            calendarContainer.style.gridTemplateColumns = "repeat(5, 1fr)";
        } else {
            calendarContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
        }
    }

    function renderCalendar(year, month) {
        calendarContainer.innerHTML = "";
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let first = new Date(year, month, 1);
        while (first.getDay() !== 1) first.setDate(first.getDate() - 1);

        let last = new Date(year, month + 1, 0);
        while (last.getDay() !== 0) last.setDate(last.getDate() + 1);

        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        monthDisplay.textContent = `${months[month]} ${year}`;

        for (
            let d = new Date(first);
            d <= last;
            d.setDate(d.getDate() + 1)
        ) {
            const cell = document.createElement("div");
            cell.className = "calendar-cell";

            if (d.getMonth() !== month) {
                cell.classList.add("other-month");
            }

            const num = document.createElement("div");
            num.className = "day-number";
            num.textContent = d.getDate();
            cell.appendChild(num);

            const lbl = document.createElement("div");
            lbl.className = "day-of-week";
            lbl.textContent = d.toLocaleString("en-US", { weekday: "short" });
            cell.appendChild(lbl);

            const todayStamp = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            ).getTime();
            if (d.getTime() === todayStamp) cell.classList.add("current-date");

            const fl = flavorData.find((fl) => {
                const s = normalizeDate(fl.start);
                const e = normalizeDate(fl.end);
                return d >= s && d <= e;
            });

            if (fl) {
                const ft = document.createElement("div");
                ft.className = "flavor-text";
                ft.textContent = fl.text;
                cell.appendChild(ft);

                if (d < today) {
                    ft.classList.add("strikethrough");
                }
            }

            // NEW: mark ALL past days, even without a flavor
            if (d < today) {
                cell.classList.add("past-day");
            }

            calendarContainer.appendChild(cell);
        }

        checkPrevButton();
        checkNextButton();
        adjustFontSizeForFlavorText();
        adjustCalendarColumns();
    }

    prevButton.addEventListener("click", (e) => {
        e.preventDefault();
        const today = new Date();
        const currentStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );
        const displayed = new Date(currentYear, currentMonth, 1);
        if (displayed <= currentStart) return;

        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
    });

    nextButton.addEventListener("click", (e) => {
        e.preventDefault();
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
    });

    updateCurrentFlavor();
    renderCalendar(currentYear, currentMonth);

    window.addEventListener("load", adjustFontSizeForFlavorText);
    window.addEventListener("resize", () => {
        adjustFontSizeForFlavorText();
        adjustCalendarColumns();
    });
});
