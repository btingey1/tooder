import * as model from "./model.js";
import { parseDate } from "./helpers.js";
import { createDateString } from "./helpers.js";
import { parseDateToObj } from "./helpers.js";
import currentTaskView from "./view/currentTaskView";
import todayTaskView from "./view/todayTaskView.js";
import subTaskViews from "./view/subTaskViews.js";

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Controls When Users Select a Different Date
const controlSelectedDate = function () {

};

// Expands Task Options For Current Task
const controlExpandTask = function () {

};

const controlAddTask = function (taskForm) {
    const selectedDate = model.state.selectedDate;

    // Update State
    model.loadNewTask(taskForm, selectedDate);
    // Clear form and rerender today task view
    currentTaskView.clearSubmissionOptions(taskForm);
    todayTaskView.render(model.state.date[selectedDate]);
    // Render scrolling class if neccessary
    currentTaskView.toggleScrollingClass();
};

const controlCheckTask = function (index) {
    const selectedDate = model.state.selectedDate;

    model.state.date[selectedDate][index].checked = !model.state.date[selectedDate][index].checked;
    todayTaskView.render(model.state.date[selectedDate]);
    model.persistDateTasks();
};

// Fills out nearby tasks with a preview of tasks where neccessary
const controlNearbyTasks = function () {

};

// Handles clicks on nearby tasks
const controlMoveNearbyTask = function () {

};

// Handles clicks on the calendar icon
const controlCalendarView = function () {

};

// FOR TESTING ----------------------------------
const clearAllTasksStorage = function () {
    model.clearDateTasks();
    todayTaskView.render('', false)
    currentTaskView.toggleScrollingClass();
}

// Initalize certain values and handlers
const init = function () {
    // Initialize State
    model.setState();
    model.init();

    // Add Handlers
    currentTaskView.addHandlerSubmission(controlAddTask);
    todayTaskView.addCheckHandler(controlCheckTask);
    currentTaskView.addHandlerRemoveStorage(clearAllTasksStorage);

    // Render Current for Today
    currentTaskView.renderCurrentDate(createDateString(new Date()));
    if (model.state.date[model.state.selectedDate]) todayTaskView.render(model.state.date[model.state.selectedDate]);
    currentTaskView.toggleScrollingClass();
}

init();
