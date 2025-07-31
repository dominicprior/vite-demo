import GUI from 'lil-gui';
export default class Debug {
    // active: boolean;
    gui: GUI;
    constructor() {
        // this.active = window.location.hash === '#debug';
        // this.active = true;
        // if (this.active) {
            this.gui = new GUI({ width: 400, }).show(false);
        // }
        window.addEventListener('keydown', (event) => { 
            if (event.key === 'h')
                this.gui.show(this.gui._hidden);
        });
    }
}


// const pr: (...args: any[]) => void = console.log

// function fwd<T extends any[], R>(
//     fn: (...args: T) => R
// ): (...args: T) => R {
//     return (...args: T) => fn(...args);
// }

// const pr2 = fwd(pr);
// pr2('hi from pr2')

// function pr3(...args: any[]) {
//     pr(...args)
// }
// pr3('hi from pr3')
