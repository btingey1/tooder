import { parseDate, createDateString } from "./helpers";

export const state = {
    date: {},
    todayDate: '',
    selectedDate: '',
    selectedDateLong: '',
}

export const setState = function (dateObj = new Date()) {
    state.selectedDateLong = createDateString(dateObj);
    state.selectedDate = parseDate(dateObj);
    state.todayDate = parseDate();
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

export const init = function () {
    const storage = localStorage.getItem('dateTasks');
    if (storage) state.date = JSON.parse(storage);
};