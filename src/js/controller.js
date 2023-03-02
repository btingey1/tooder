import * as model from "./model.js";
import { createDateString, getRelativeDate, parseDateToObj, getRelativeMonth } from "./helpers.js";
import currentTaskView from "./view/currentTaskView";
import todayTaskView from "./view/todayTaskView.js";
import subTaskViews from "./view/subTaskViews.js";
import calendarView from "./view/calendarView.js";
import headerView from "./view/headerView.js";

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import headerView from "./view/headerView.js";

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

    model.updateChecked(selectedDate, index)
    todayTaskView.render(model.state.date[selectedDate]);
};

const controlDeleteTask = function (index) {
    const selectedDate = model.state.selectedDate;

    model.deleteTask(index, model.state.selectedDate);
    model.state.date[selectedDate] ? todayTaskView.render(model.state.date[selectedDate]) : todayTaskView.render(model.state.date[selectedDate], false);
};

const controlEditText = function (index, textEl) {
    const selectedDate = model.state.selectedDate;
    const finished = model.state.date[selectedDate][index].checked;
    const text = model.state.date[selectedDate][index].taskText;

    todayTaskView.renderTextEditForm(textEl, text, finished);
}

const controlEditSubmission = function (editForm, id, ed) {
    const selectedDate = model.state.selectedDate;
    if (!editForm[0]) return
    if (!model.state.date[selectedDate]?.[id]?.id) return
    if (model.state.date[selectedDate][id].id !== ed) return

    if (editForm[0].value.length == 0) return controlDeleteTask(id);

    model.editTaskText(editForm, id);
    todayTaskView.render(model.state.date[selectedDate]);

}

const controlStopEditText = function () {
    const selectedDate = model.state.selectedDate;
    todayTaskView.render(model.state.date[selectedDate]);
}

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
    model.setCalDates(model.state.selectedDate);
    calendarView.renderCal(model.state);
};

const controlCloseCalendar = function () {
    calendarView.toggleHidden();
}

const controlNavCalendar = function (next) {
    model.setCalDates(getRelativeMonth(model.state.calendarDates.curMonth[0], next, true));
    calendarView.renderCal(model.state, false);
}

const controlCalSelectDate = function (dateID) {

    model.setState(parseDateToObj(dateID));

    const selectedDate = model.state.selectedDate;

    currentTaskView.renderCurrentDate(model.state.selectedOpt.selectedDateLong);
    model.state.date[selectedDate] ? todayTaskView.render(model.state.date[selectedDate]) : todayTaskView.render('', false);
    subTaskViews.render(model.state);
    currentTaskView.toggleScrollingClass();

    controlCloseCalendar();
}

// FOR TESTING ----------------------------------
const clearAllTasksStorage = function () {
    model.clearDateTasks();
    todayTaskView.render('', false);
    init(true);
}

// Initalize certain values and handlers
const init = function (clearStorage = false) {
    // Initialize State
    model.setState();
    model.setCalDates();
    model.init();

    // Add Handlers
    if (!clearStorage) {
        currentTaskView.addHandlerSubmission(controlAddTask);
        currentTaskView.addHandlerRemoveStorage(clearAllTasksStorage);
        todayTaskView.addCheckHandler(controlCheckTask);
        todayTaskView.addDeleteHandler(controlDeleteTask);
        todayTaskView.addEditTextHandler(controlEditText);
        todayTaskView.addHandlerSubmission(controlEditSubmission, true, true);
        todayTaskView.addStopEditHandler(controlStopEditText);
        subTaskViews.addSubTaskHandler(controlMoveNearbyTask);
        headerView.addHandlerCalendar(controlCalendarView);
        calendarView.addHandlerClose(controlCloseCalendar);
        calendarView.addHandlerNav(controlNavCalendar);
        calendarView.addHandlerSelectDate(controlCalSelectDate);
    }

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
