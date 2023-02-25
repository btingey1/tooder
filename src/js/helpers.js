export const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const parseDate = function (dateObject = new Date()) {

    const year = String(dateObject.getFullYear());
    const month = String(dateObject.getMonth()).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return Number(`${year}${month}${day}`)

}

export const parseDateToObj = function (parsedDate) {
    const year = String(parsedDate).slice(0, 4);
    const month = String(parsedDate).slice(4, 6);
    const day = String(parsedDate).slice(6);

    return new Date(year, month, day);
}

export const createDateString = function (dateObject) {
    const year = dateObject.getFullYear();
    const month = dateObject.toLocaleString("default", { month: "long" });
    const day = dateObject.getDate();

    return `${month} ${day}${nthNumber(day)}, ${year}`;
}

const nthNumber = (number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

export function scrollbarVisible(element) {
    return element.scrollHeight > element.clientHeight;
}