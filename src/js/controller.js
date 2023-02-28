import * as model from "./model.js";
import { createDateString, getRelativeDate, parseDateToObj } from "./helpers.js";
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

// Handles clicks on nearby tasks
const controlMoveNearbyTask = function (element) {

    // Check if we are going to tomorrow or yesterday based on our classlist
    const next = element.classList.contains('sub-content-right');

    // Adjust model selected date
    next ? model.setState(parseDateToObj(model.state.selectedOpt.nextDate)) : model.setState(parseDateToObj(model.state.selectedOpt.prevDate));

    // Reneder All Tasks
    const selectedDate = model.state.selectedDate;

    currentTaskView.renderCurrentDate(model.state.selectedOpt.selectedDateLong);
    model.state.date[selectedDate] ? todayTaskView.render(model.state.date[selectedDate]) : todayTaskView.render('', false);
    subTaskViews.render(model.state);
    currentTaskView.toggleScrollingClass();
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
    subTaskViews.addSubTaskHandler(controlMoveNearbyTask);

    // Render Current for Today
    const selectedDate = model.state.selectedDate;
    currentTaskView.renderCurrentDate(model.state.selectedOpt.selectedDateLong);
    if (model.state.date[selectedDate]) todayTaskView.render(model.state.date[selectedDate]);
    subTaskViews.render(model.state);
    currentTaskView.toggleScrollingClass();

    // TESTING


    console.log(model.state);
}

init();
