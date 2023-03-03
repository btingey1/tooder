import { parseDate, createDateString, getRelativeDate, shortDateStr, parseDateToObj } from "./helpers";
import { CAL_LENGTH } from "./config";

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
}

export const setState = function (dateObj = new Date()) {
    state.selectedDate = parseDate(dateObj);
    state.selectedOpt.selectedDateLong = createDateString(dateObj);
    state.selectedOpt.nextDate = parseDate(getRelativeDate(dateObj, true, false));
    state.selectedOpt.nextDateStr = shortDateStr(state.selectedOpt.nextDate)
    state.selectedOpt.prevDate = parseDate(getRelativeDate(dateObj, false, false));
    state.selectedOpt.prevDateStr = shortDateStr(state.selectedOpt.prevDate);
}

export const persistDateTasks = function () {
    localStorage.setItem('dateTasks', JSON.stringify(state.date));
    localStorage.setItem('taskTotals', JSON.stringify(state.taskTotals));
};

const createTaskObject = function (taskForm, timeOfCreation) {

    const taskTypes = Array.from(taskForm).map(input => {
        const { id } = input.dataset;
        return id
    });

    const text = taskTypes.indexOf('name');
    const location = taskTypes.indexOf('location');
    const time = taskTypes.indexOf('time');

    return {
        id: timeOfCreation.getTime(),
        parsedDate: parseDate(timeOfCreation),
        taskText: taskForm[text].value,
        taskLocation: taskForm[location].value ? taskForm[location].value : null,
        taskTime: taskForm[time].value ? taskForm[time].value : null,
        checked: false,
    }

};

export const loadNewTask = function (taskForm, selectedDate) {
    //Recieve and Parse Date
    const timeOfCreation = new Date();

    // Check if Date is existing property and set it, 
    if (!state.date[selectedDate]) state.date[selectedDate] = []
    if (!state.taskTotals[selectedDate]) state.taskTotals[selectedDate] = { assigned: 0, finished: 0 }
    const dateState = state.date[selectedDate];

    // Create our Task Object and Add It to State
    const taskObject = createTaskObject(taskForm, timeOfCreation)
    dateState.push(taskObject);
    updateTaskTotals(selectedDate)

    persistDateTasks();
};

// THIS MIGHT NOT WORK IF TASKS ARE DEEPLY NESTED
export const deleteTask = function (index, selectedDate) {
    const finished = state.date[selectedDate][index].checked;
    const newSelectedDateArr = state.date[selectedDate].slice(0);
    newSelectedDateArr.splice(index, 1);

    // Set date array and totals, and delete stuff if neccessary
    updateTaskTotals(selectedDate, false, finished, true);
    state.date[selectedDate] = newSelectedDateArr;
    if (state.date[selectedDate].length == 0) delete state.date[selectedDate];

    persistDateTasks();
}

export const editTaskText = function (taskForm, id) {
    const selectedDate = state.selectedDate;
    state.date[selectedDate][id].taskText = taskForm[0].value
    persistDateTasks();
};

export const updateChecked = function (selectedDate, index) {
    state.date[selectedDate][index].checked = !state.date[selectedDate][index].checked;
    updateTaskTotals(selectedDate, false, state.date[selectedDate][index].checked)
    persistDateTasks();
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

// Set new calendar dates
export const setCalDates = function (parsedDate = state.todayDate) {
    const newDate = parseDateToObj(parsedDate)
    const { prevContainer, curContainer, nextContainer } = generateCalDates(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    state.calendarDates.prevMonth = prevContainer;
    state.calendarDates.curMonth = curContainer;
    state.calendarDates.nextMonth = nextContainer;
    state.calendarDates.curMonthStr = `${newDate.toLocaleString("default", { month: "long" })} ${newDate.getFullYear()}`
}

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
}

export const init = function (dateObj = new Date()) {
    state.todayDate = parseDate();
    state.todayOpt.tomorrow = getRelativeDate(state.todayDate, true, true);
    state.todayOpt.yesterday = getRelativeDate(state.todayDate, false, true);
    const taskStorage = localStorage.getItem('dateTasks');
    const totalsStorage = localStorage.getItem('taskTotals')
    if (taskStorage) state.date = JSON.parse(taskStorage);
    if (totalsStorage) state.taskTotals = JSON.parse(totalsStorage);
};
