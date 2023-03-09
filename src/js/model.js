import { parseDate, createDateString, getRelativeDate, shortDateStr, parseDateToObj, toTitleCase, getRelativeDateWeek } from "./helpers";
import { CAL_LENGTH, FILE_API_KEY, FILE_URL } from "./config";
import * as pb from "./pocketbase.js";


export const state = {
    date: {},
    todayDate: '',
    todayOpt: {
        yesterday: '',
        tomorrow: '',
    },
    selectedDate: '',
    selectedOpt: {
        selectedDateLong: '',
        nextDate: '',
        nextDateStr: '',
        prevDate: '',
        prevDateStr: '',
    },
    calendarDates: {
        prevMonth: [],
        curMonth: [],
        curMonthStr: '',
        nextMonth: [],
    },
    taskTotals: {},
    activeForms: {
        tag: false,
        time: false,
        location: false,
        file: false,
        city: false,
        coords: false,
    },
    userId: '',
    userEmail: '',
}

export const setState = function (dateObj = new Date()) {
    state.selectedDate = parseDate(dateObj);
    state.selectedOpt.selectedDateLong = createDateString(dateObj);
    state.selectedOpt.nextDate = parseDate(getRelativeDate(dateObj, true, false));
    state.selectedOpt.nextDateStr = shortDateStr(state.selectedOpt.nextDate)
    state.selectedOpt.prevDate = parseDate(getRelativeDate(dateObj, false, false));
    state.selectedOpt.prevDateStr = shortDateStr(state.selectedOpt.prevDate);
}

const createTaskObject = async function (taskForm, timeOfCreation, expanded) {
    // Map out all the indexes of all ids of the forms
    const taskTypes = Array.from(taskForm).map(input => {
        const { id } = input.dataset;
        return id
    });

    // Match ids to indexes
    const text = taskTypes.indexOf('name');
    // const location = taskTypes.indexOf('location');
    const time = taskTypes.indexOf('time');
    const tag = taskTypes.indexOf('tag');
    const file = taskTypes.indexOf('file');

    const fileURL = taskForm[file].value ? await processFile(taskForm[file].files[0]) : '';

    // Return if somehow there is no task name
    if (!taskForm[text]) return

    // If not expanded, return text only
    if (!expanded) return {
        owner: `${state.userId}`,
        parsedDate: state.selectedDate,
        taskText: taskForm[text].value,
        checked: false,
    }

    // If expanded return full object
    if (expanded) return {
        owner: `${state.userId}`,
        parsedDate: state.selectedDate,
        taskText: taskForm[text].value,
        taskLocation: state.activeForms.city ? state.activeForms.city : null,
        taskCoords: state.activeForms.coords ? state.activeForms.coords : null,
        taskTime: taskForm[time]?.value ? taskForm[time].value : null,
        taskTag: taskForm[tag]?.value ? taskForm[tag].value.split(',').map(tag => tag.trim()) : null,
        taskFile: taskForm[file].value ? fileURL : null,
        checked: false,
    }

};

export const loadNewTask = async function (taskForm, selectedDate, expanded = false) {
    //Recieve and Parse Date
    const timeOfCreation = new Date();

    // Check if Date is existing property and set it, 
    if (!state.date[selectedDate]) state.date[selectedDate] = [];
    if (!state.taskTotals[selectedDate]) state.taskTotals[selectedDate] = { assigned: 0, finished: 0 }
    const dateState = state.date[selectedDate];

    // Create our Task Object and Add It to State
    const taskObject = await createTaskObject(taskForm, timeOfCreation, expanded);
    if (!taskObject) return


    const id = await pb.attempUploadTask(taskObject);
    taskObject.id = id;
    dateState.push(taskObject);
};

export const deleteTask = async function (index, selectedDate) {
    const finished = state.date[selectedDate][index].checked;
    const newSelectedDateArr = state.date[selectedDate].slice(0);
    newSelectedDateArr.splice(index, 1);

    await pb.attemptDeleteTask(state.date[selectedDate][index].id);

    // Set date array and totals, and delete stuff if neccessary
    updateTaskTotals(selectedDate, false, finished, true);
    state.date[selectedDate] = newSelectedDateArr;
    if (state.date[selectedDate].length == 0) delete state.date[selectedDate];
}

export const editTaskText = async function (taskForm, id) {
    const selectedDate = state.selectedDate;
    state.date[selectedDate][id].taskText = taskForm[0].value;
    await pb.attemptUpdateTask(state.date[selectedDate][id].id, 'taskText', taskForm[0].value);
};

export const updateChecked = async function (selectedDate, index) {
    state.date[selectedDate][index].checked = !state.date[selectedDate][index].checked;
    updateTaskTotals(selectedDate, false, state.date[selectedDate][index].checked);
    await pb.attemptUpdateTask(state.date[selectedDate][index].id, 'checked', state.date[selectedDate][index].checked)
};

// Store and Update Task Totals
const updateTaskTotals = function (selectedDate, newTask = true, finished = false, deleteTotal = false) {
    if (newTask) {
        state.taskTotals[selectedDate].assigned += 1;
        return
    }
    if (deleteTotal) {
        const totalLength = state.taskTotals[selectedDate].finished + state.taskTotals[selectedDate].assigned;
        if (totalLength == 1) return delete state.taskTotals[selectedDate]
        finished ? state.taskTotals[selectedDate].finished += -1 : state.taskTotals[selectedDate].assigned += -1;
        return
    }
    if (!newTask && !deleteTotal) {
        state.taskTotals[selectedDate].finished += (finished ? 1 : -1);
        state.taskTotals[selectedDate].assigned += (finished ? -1 : 1);
    }
};

export const updateTaskForms = function (taskNames, reset = false) {
    if (taskNames) {
        taskNames.forEach(taskName => state.activeForms[taskName] = !state.activeForms[taskName]);
    }

    if (!reset) return
    for (const property in state.activeForms) {
        state.activeForms[property] = false;
    }
}

// Set new calendar dates
export const setCalDates = function (parsedDate = state.todayDate) {
    const newDate = parseDateToObj(parsedDate)
    const { prevContainer, curContainer, nextContainer } = generateCalDates(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    state.calendarDates.prevMonth = prevContainer;
    state.calendarDates.curMonth = curContainer;
    state.calendarDates.nextMonth = nextContainer;
    state.calendarDates.curMonthStr = `${newDate.toLocaleString("default", { month: "long" })} ${newDate.getFullYear()}`
}

// Don't actually need this
// const recieveFile = function (file) {
//     const reader = new FileReader();
//     reader.onloadend = function () {
//         console.log('Encoded Base 64 File String:', reader.result);
//         const data = (reader.result).split(',')[1];
//         const binaryBlob = atob(data);
//         console.log('Encoded Binary File String:', binaryBlob);
//         processFile(binaryBlob);
//     }
//     reader.readAsDataURL(file);
// }

const processFile = async function (file) {
    const fileData = new Blob([file], { type: file.type });

    const formData = new FormData();
    formData.append('file', fileData, file.name);
    formData.append('expires', `${getRelativeDateWeek(state.todayDate, true, true)}`);
    formData.append('maxDownloads', '1');
    formData.append('autoDelete', 'True');

    const res = await fetch(FILE_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': FILE_API_KEY,
        },
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    return data.link;

};

// Generate all parsed dates for a given month including appropriate ones from before and after. Recieves first day of month
const generateCalDates = function (dateObj) {
    const prevContainer = [];
    const curContainer = [];
    const nextContainer = [];
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();

    // Get the lengths of our three arrays
    const lengthOfPrev = dateObj.getDay();
    const daysInPrev = (new Date(year, month, 0).getDate());
    const lengthOfCur = new Date(year, month + 1, 0).getDate();
    const lengthOfNext = CAL_LENGTH - (lengthOfPrev + lengthOfCur);

    // Set State According to lengths and selected month
    for (let i = (daysInPrev - lengthOfPrev); i < daysInPrev; i++) {
        prevContainer.push(parseDate(new Date(year, month - 1, i + 1)));
    }

    for (let i = 0; i < lengthOfCur; i++) {
        curContainer.push(parseDate(new Date(year, month, i + 1)));
    }

    for (let i = 0; i < lengthOfNext; i++) {
        nextContainer.push(parseDate(new Date(year, month + 1, i + 1)));
    }

    return { prevContainer, curContainer, nextContainer }
};

export const returnCity = async function (lat, lng) {
    state.activeForms.coords = `${lat},${lng}`;

    const url = `https://geocode.xyz/${lat},${lng}?geoit=json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const city = toTitleCase(data.city);

        state.activeForms.city = city;

        return city;

    } catch {
        return 'Marker'
    }
}

export const setUserId = function (userId) {
    state.userId = userId;
};

export const setUserEmail = function (userEmail) {
    state.userEmail = userEmail;
};

const setTaskTotals = function () {
    for (let [parsedDate, tasks] of Object.entries(state.date)) {
        state.taskTotals[parsedDate] = { assigned: 0, finished: 0 };
        for (let task of tasks) {
            if (task.checked) state.taskTotals[parsedDate].finished += 1;
            if (!task.checked) state.taskTotals[parsedDate].assigned += 1
        }
    }
};

const parseTasksFromPB = function (recordArr) {
    recordArr.forEach(record => {
        if (!state.date[record.parsedDate]) state.date[record.parsedDate] = []
        state.date[record.parsedDate].push({
            owner: `${record.owner}`,
            parsedDate: record.parsedDate,
            taskText: record.taskText,
            taskLocation: record.taskLocation,
            taskCoords: record.taskCoords,
            taskTime: record.taskTime,
            taskTag: record.taskTag.split(',').map(tag => tag.trim()),
            taskFile: record.taskFile,
            checked: record.checked,
            id: record.id,
        })
    })
};

export const init = async function () {
    state.todayDate = parseDate();
    state.todayOpt.tomorrow = getRelativeDate(state.todayDate, true, true);
    state.todayOpt.yesterday = getRelativeDate(state.todayDate, false, true);
    parseTasksFromPB(await pb.attemptGetRecordList())
    // const taskStorage = localStorage.getItem('dateTasks');
    // if (taskStorage) state.date = JSON.parse(taskStorage);
    setTaskTotals();
};
