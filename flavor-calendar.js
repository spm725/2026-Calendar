const targetYear = 2026;

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

const imageBaseURL = "https://spm725.github.io/2026-Calendar/Images/";

function getImageURL(name) {
    return imageBaseURL + name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/®/g, "")
        .replace(/'/g, "") +
        ".jpg";
}

function getFirstMondayEndingInYear(year) {
    let d = new Date(year - 1, 11, 25);
    while (true) {
        d.setDate(d.getDate() + 1);
        const monday = new Date(d);
        if (monday.getDay() === 1) {
            const sunday = new Date(monday);
            sunday.setDate(sunday.getDate() + 6);
            if (sunday.getFullYear() === year) return monday;
        }
    }
}

function formatDate(d) {
    return d.toISOString().slice(0, 10);
}

function buildFlavorData(year, rotation) {
    const firstMonday = getFirstMondayEndingInYear(year);
    return rotation.map((text, i) => {
        const start = new Date(firstMonday);
        start.setDate(start.getDate() + i * 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return {
            text,
            start: formatDate(start),
            end: formatDate(end),
            image: getImageURL(text)
        };
    });
}

const flavorData = buildFlavorData(targetYear, flavorRotation2026);

window.addEventListener('DOMContentLoaded', function () {
    const calendarContainer = document.getElementById('calendar-container');
    const monthDisplay = document.getElementById('month-display');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const currentFlavorBox = document.getElementById('featured-flavor');

    if (!(calendarContainer && monthDisplay && prevButton && nextButton && currentFlavorBox)) return;

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function normalizeDate(str) {
        const [y, m, d] = str.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    function updateCurrentFlavor() {
        const today = new Date();
        const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const f = flavorData.find(fl => {
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
        const firstStart = normalizeDate(flavorData[0].start);
        const displayed = new Date(currentYear, currentMonth, 1);
        prevButton.disabled = displayed <= firstStart;
    }

    function checkNextButton() {
        const lastEnd = normalizeDate(flavorData[flavorData.length - 1].end);
        const displayed = new Date(currentYear, currentMonth + 1, 0);
        nextButton.disabled = displayed >= lastEnd;
    }

    function adjustFontSizeForFlavorText() {
        document.querySelectorAll('.flavor-text').forEach(t => {
            let size = 10;
            t.style.fontSize = size + 'px';
            while ((t.scrollWidth > t.parentElement.clientWidth ||
                   t.scrollHeight > t.parentElement.clientHeight) &&
                   size > 6) {
                size -= 0.5;
                t.style.fontSize = size + 'px';
            }
        });
    }

    function adjustCalendarColumns() {
        if (window.innerWidth > 1200) {
            calendarContainer.style.gridTemplateColumns = 'repeat(7, 1fr)';
        } else if (window.innerWidth > 768) {
            calendarContainer.style.gridTemplateColumns = 'repeat(5, 1fr)';
        } else {
            calendarContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }

    function renderCalendar(year, month) {
        calendarContainer.innerHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const first = new Date(year, month, 1);
        const last = new Date(year, month + 1, 0);

        const months = [
            'January','February','March','April','May','June',
            'July','August','September','October','November','December'
        ];
        monthDisplay.textContent = `${months[month]} ${year}`;

        for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';

            const num = document.createElement('div');
            num.className = 'day-number';
            num.textContent = d.getDate();
            cell.appendChild(num);

            const lbl = document.createElement('div');
            lbl.className = 'day-of-week';
            lbl.textContent = d.toLocaleString('en-US', { weekday: 'short' });
            cell.appendChild(lbl);

            const todayStamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
            if (d.getTime() === todayStamp) cell.classList.add('current-date');

            const fl = flavorData.find(fl => {
                const s = normalizeDate(fl.start);
                const e = normalizeDate(fl.end);
                return d >= s && d <= e;
            });

            if (fl) {
                const ft = document.createElement('div');
                ft.className = 'flavor-text';
                ft.textContent = fl.text;
                cell.appendChild(ft);
                if (d < today) {
                    cell.classList.add('past-day');
                    ft.classList.add('strikethrough');
                }
            }

            calendarContainer.appendChild(cell);
        }

        checkPrevButton();
        checkNextButton();
        adjustFontSizeForFlavorText();
        adjustCalendarColumns();
    }

    prevButton.addEventListener('click', e => {
        e.preventDefault();
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
    });

    nextButton.addEventListener('click', e => {
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

    window.addEventListener('load', adjustFontSizeForFlavorText);
    window.addEventListener('resize', () => {
        adjustFontSizeForFlavorText();
        adjustCalendarColumns();
    });
});
