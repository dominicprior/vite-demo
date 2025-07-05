import GUI from 'lil-gui';
export default class Debug {
    active: boolean;
    // @ts-ignore: no initializer
    gui: GUI;
    constructor() {
        this.active = window.location.hash === '#debug';
        if (this.active) {
            this.gui = new GUI({
                width: 400,
            });
        }
    }
}