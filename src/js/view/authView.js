import View from './View';

class AuthView extends View {
    _parentElement = document.querySelector('.auth-cover');

    renderAuthView() {
        const spinner = this._parentElement.querySelector('.spinner');
        const auther = this._parentElement.querySelector('.auth-link')

        spinner.classList.toggle('hidden');
        auther.classList.toggle('hidden');
    }

    disableCover() {
        this._parentElement.classList.add('hidden');
    }

    // HANDLERS -------------------
    addHandlerAuth(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.auth-enter-button')
            if (!btn) return

            handler();
        })
    }

    addHandlerGuest(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.guest-enter-button')
            if (!btn) return

            handler();
        })
    }

}

export default new AuthView();