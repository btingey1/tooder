import * as model from "./model.js";
import { parseDateToObj, getRelativeMonth, timeout } from "./helpers.js";
import { ALT_COORDS, MAIN_URL } from "./config.js";
import currentTaskView from "./view/currentTaskView";
import todayTaskView from "./view/todayTaskView.js";
import subTaskViews from "./view/subTaskViews.js";
import calendarView from "./view/calendarView.js";
import headerView from "./view/headerView.js";
import headerView from "./view/headerView.js";
import authView from "./view/authView.js";
import * as pb from "./pocketbase.js";

import 'core-js/stable';
import 'regenerator-runtime/runtime';


const controlAddTask = async function (taskForm) {
    const selectedDate = model.state.selectedDate;

    if (!taskForm[0].value) return

    // Update State
    if (currentTaskView.checkExpanded()) {
        currentTaskView.toggleLoadingState();
        todayTaskView.noScrollTasks(false);
        currentTaskView.clearFocus();
        await model.loadNewTask(taskForm, selectedDate, true)
        currentTaskView.toggleLoadingState();
    };
    if (!currentTaskView.checkExpanded()) await model.loadNewTask(taskForm, selectedDate);
    // Clear form and rerender today task view
    if (currentTaskView.checkExpanded()) controlExpandCurDetail();
    currentTaskView.clearSubmissionOptions(taskForm);
    todayTaskView.render(model.state.date[selectedDate]);
    todayTaskView.fixLargeTextDivs();
    currentTaskView.toggleScrollingClass();
    model.updateTaskForms('', true);
    if (currentTaskView.checkAddDetailExpanded()) controlAddDetailExpander();
    currentTaskView.clearAllOptForms();
};

const controlCheckTask = async function (index) {
    const selectedDate = model.state.selectedDate;

    await model.updateChecked(selectedDate, index)
    todayTaskView.render(model.state.date[selectedDate]);
    todayTaskView.fixLargeTextDivs();
};

const controlDeleteTask = async function (index) {
    const selectedDate = model.state.selectedDate;

    await model.deleteTask(index, model.state.selectedDate);
    model.state.date[selectedDate] ? todayTaskView.render(model.state.date[selectedDate]) : todayTaskView.render(model.state.date[selectedDate], false);
};

const controlEditText = function (index, textEl) {
    const selectedDate = model.state.selectedDate;
    const finished = model.state.date[selectedDate][index].checked;
    const text = model.state.date[selectedDate][index].taskText;

    todayTaskView.renderTextEditForm(textEl, text, finished);
};

const controlEditSubmission = async function (editForm, id, ed) {
    const selectedDate = model.state.selectedDate;
    if (!editForm) return
    if (!editForm[0]) return
    if (!model.state.date[selectedDate]?.[id]?.id) return
    if (model.state.date[selectedDate][id].id !== ed) return

    if (editForm[0].value.length == 0) return controlDeleteTask(id);

    await model.editTaskText(editForm, id);
    todayTaskView.render(model.state.date[selectedDate]);
    todayTaskView.fixLargeTextDivs();

};

const controlStopEditText = function () {
    const selectedDate = model.state.selectedDate;
    todayTaskView.render(model.state.date[selectedDate]);
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
    if (model.state.date[selectedDate]) todayTaskView.fixLargeTextDivs();
    currentTaskView.toggleScrollingClass();
    if (currentTaskView.checkExpanded()) controlExpandCurDetail();
    if (currentTaskView.checkAddDetailExpanded()) controlAddDetailExpander();
    model.updateTaskForms('', true);
    currentTaskView.clearAllOptForms();
    currentTaskView.clearSubmissionOptions(currentTaskView.getTaskForm());
};

// Handles clicks on the calendar icon
const controlCalendarView = function () {
    model.setCalDates(model.state.selectedDate);
    calendarView.renderCal(model.state);
};

const controlCloseCalendar = function () {
    calendarView.toggleHidden();
};

const controlNavCalendar = function (next) {
    model.setCalDates(getRelativeMonth(model.state.calendarDates.curMonth[0], next, true));
    calendarView.renderCal(model.state, false);
};

const controlCalSelectDate = function (dateID) {

    model.setState(parseDateToObj(dateID));

    const selectedDate = model.state.selectedDate;

    currentTaskView.renderCurrentDate(model.state.selectedOpt.selectedDateLong);
    model.state.date[selectedDate] ? todayTaskView.render(model.state.date[selectedDate]) : todayTaskView.render('', false);
    subTaskViews.render(model.state);
    todayTaskView.fixLargeTextDivs();
    currentTaskView.toggleScrollingClass();
    if (currentTaskView.checkExpanded()) controlExpandCurDetail();
    controlCloseCalendar();
    model.updateTaskForms('', true);
    currentTaskView.clearAllOptForms();
    currentTaskView.clearSubmissionOptions(currentTaskView.getTaskForm());
};

const controlExpandCurDetail = function () {
    currentTaskView.renderExpandedTaskView();
    todayTaskView.noScrollTasks();
    currentTaskView.toggleScrollingClass();
}

const controlAddDetailExpander = function () {
    currentTaskView.renderDetailAdders(model.state.activeForms);
};

const controlAddDetail = async function (target) {
    controlAddDetailExpander();
    // Instead of just statically updating model with target, I need to first render my forms, and get an array of outstanding task form ids, and return that array to updateTaskForms
    currentTaskView.renderDetailForm(target);
    model.updateTaskForms([target]);
    todayTaskView.noScrollTasks(false);
    if (currentTaskView.checkMap()) return;
    if (target == 'location') {
        controlPosition();
        todayTaskView.noScrollTasks(false);
    }
};

const controlPosition = function () {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(controlMap, controlMapNoGeo);
};

const controlMapNoGeo = function () {
    controlMap({ coords: { latitude: ALT_COORDS[0], longitude: ALT_COORDS[1] } })
}

const controlMap = function (curPosition) {
    currentTaskView.initMap(curPosition.coords, controlAddMarkerPopup);
};

const controlAddMarkerPopup = async function () {
    const markerPos = currentTaskView.getCurMarker().getLatLng();
    const city = await model.returnCity(markerPos.lat, markerPos.lng);
    currentTaskView.createMarkerPopup(city);
};

const controlUpload = function () {
    currentTaskView.renderUploaded()
};

const controlAttemptLogout = async function () {
    await pb.attemptLogOut();
    window.location = MAIN_URL;
};

const controlAuthView = async function () {
    authView.renderAuthView();
};

const controlGuestEnter = async function () {
    model.setUserId('Guest');
    model.setUserEmail('Guest');
    model.setGuest(true);
    headerView.addUserEmailTitle('Guest');
    await model.init(true);
    authView.disableCover();
}

// Initalize certain values and handlers
const init = async function () {

    // Initialize State
    model.setState();
    model.setCalDates();

    pb.addAuthLink();

    if (!pb.pb.authStore.isValid) {
        try {
            await pb.attemptAuth();
            window.location = MAIN_URL;
        } catch {
            console.log('User Not Signed In');
        }
    }

    if (!pb.pb.authStore.isValid) authView.renderAuthView();

    if (pb.pb.authStore.isValid) {
        model.setUserId(pb.pb.authStore.model.id);
        model.setUserEmail(pb.pb.authStore.model.email);
        headerView.addUserEmailTitle(model.state.userEmail);
    }

    await model.init();

    if (pb.pb.authStore.isValid) authView.disableCover();

    // Add Handlers
    currentTaskView.addHandlerSubmission(controlAddTask);
    currentTaskView.addDetailExpandHandler(controlExpandCurDetail);
    currentTaskView.addAddDetailExpanderHandler(controlAddDetailExpander);
    currentTaskView.addUploadHandler(controlUpload);
    currentTaskView.addAddDetailHandler(controlAddDetail);
    todayTaskView.addCheckHandler(controlCheckTask);
    todayTaskView.addDeleteHandler(controlDeleteTask);
    todayTaskView.addEditTextHandler(controlEditText);
    todayTaskView.addHandlerSubmission(controlEditSubmission, true, true);
    todayTaskView.addStopEditHandler(controlStopEditText);
    subTaskViews.addSubTaskHandler(controlMoveNearbyTask);
    headerView.addHandlerCalendar(controlCalendarView);
    headerView.addSignOutHandler(controlAttemptLogout);
    calendarView.addHandlerClose(controlCloseCalendar);
    calendarView.addHandlerNav(controlNavCalendar);
    calendarView.addHandlerSelectDate(controlCalSelectDate);
    authView.addHandlerAuth(controlAuthView);
    authView.addHandlerGuest(controlGuestEnter);

    // Render Current for Today
    const selectedDate = model.state.selectedDate;
    currentTaskView.renderCurrentDate(model.state.selectedOpt.selectedDateLong);
    if (model.state.date[selectedDate]) todayTaskView.render(model.state.date[selectedDate]);
    if (model.state.date[selectedDate]) todayTaskView.fixLargeTextDivs();
    subTaskViews.render(model.state);
    currentTaskView.toggleScrollingClass();

    // Preload icons
    currentTaskView.preLoadImg(currentTaskView.getTaskViewImages());
    currentTaskView.preLoadImg(currentTaskView.getViewImages());
}

init();
