import View from './View';

class HeaderView extends View {
    _parentElement = document.querySelector('.header');

    addUserEmailTitle(userEmail) {
        const userIcon = this._parentElement.querySelector('.signed-user');

        userIcon.setAttribute('title', userEmail);
    }

    // HANDLERS -------------------
    addHandlerCalendar(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.calendar-icon')
            if (!btn) return

            handler();
        })
    }

    addSignOutHandler(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.log-out-button');
            if (!btn) return

            handler()
        })
    }

}

export default new HeaderView();