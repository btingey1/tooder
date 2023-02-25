import { parseDate } from "./helpers";
import { createDateString } from "./helpers";

export const state = {
    date: {},
    todayDate: '',
    selectedDate: '',
    selectedDateLong: '',
}

export const setState = function () {
    state.selectedDateLong = createDateString(new Date());
    state.selectedDate = parseDate();
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

export const loadNewTask = function (taskForm) {
    //Recieve and Parse Date
    const timeOfCreation = new Date();
    const parsedDate = parseDate(timeOfCreation);

    // Check if Date is existing property and set it, 
    if (!state.date[parsedDate]) state.date[parsedDate] = []
    const dateState = state.date[parsedDate];

    // Create our Task Object and Add It to State
    const taskObject = createTaskObject(taskForm, timeOfCreation)
    dateState.push(taskObject);

    persistDateTasks();
};

export const init = function () {
    const storage = localStorage.getItem('dateTasks');
    if (storage) state.date = JSON.parse(storage);
};