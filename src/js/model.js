import { parseDate, createDateString, getRelativeDate, shortDateStr, parseDateToObj } from "./helpers";

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
};

export const clearDateTasks = function () {
    localStorage.clear('dateTasks');
    // FOR TESTING  ----------------------------------
    state.date = {};
};

const createTaskObject = function (taskForm, timeOfCreation) {

    const text = taskForm[0].value;

    return {
        id: timeOfCreation.getTime(),
        taskText: text,
        checked: false,
    }

};

export const loadNewTask = function (taskForm, selectedDate) {
    //Recieve and Parse Date
    const timeOfCreation = new Date();

    // Check if Date is existing property and set it, 
    if (!state.date[selectedDate]) state.date[selectedDate] = []
    const dateState = state.date[selectedDate];

    // Create our Task Object and Add It to State
    const taskObject = createTaskObject(taskForm, timeOfCreation)
    dateState.push(taskObject);

    persistDateTasks();
};

export const init = function (dateObj = new Date()) {
    state.todayDate = parseDate();
    state.todayOpt.tomorrow = getRelativeDate(state.todayDate, true, true);
    state.todayOpt.yesterday = getRelativeDate(state.todayDate, false, true);
    const storage = localStorage.getItem('dateTasks');
    if (storage) state.date = JSON.parse(storage);
};
