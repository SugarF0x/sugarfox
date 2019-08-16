class PentaLink {
    // constructor(img = '#',url = '#',desc = '#', dest='#') {
    //     this.img = img;     // the image displayed
    //     this.url = url;     // the link of the button
    //     this.desc = desc;   // tooptip
    //     this.dest = dest;   // destination of where to append class
    //
    //     if (this.dest === '#') {
    //         console.log('ERROR: Please specify where to append element!');
    //         return null;
    //     }
    // }

    constructor(list = [{img: '#', url:'#', desc:'#', id:'#'}]) {
        this.array = [];

        list.forEach((each) => {
            this.array.push(each);
        })
    }

    _getTiltDeg(min, max) {
        let number = Math.floor(Math.random() * (max - min)) + min;
        if (Math.random() < 0.5) {
            number*=-1;
        }
        return number;
    }

    _generate(element) {
        let tilt = this._getTiltDeg(30,60);

        let a = document.createElement('a');
            a.classList.add('pentaLink');
            a.setAttribute('href',element.url);    // link
            a.setAttribute('title',element.desc);  // hover hint
                // TODO: change default hover hints to Popper.js ones with time delay ^^^

                // i didnt figure out how to properly create SVG element, so here is my little work-around
            let pentagon = `<svg viewBox="0 0 58 64" class="pL__bg" style="transform: rotate(${tilt}deg);">
                                <polygon points="46.954,57.792 11,57.792 -1,24.544 29.039,0.208 59,24.792"/>
                            </svg>`;
            a.insertAdjacentHTML('afterbegin',pentagon);

            let img = document.createElement('img');
                img.classList.add('pL__fg');
                img.setAttribute('src',element.img);
                img.setAttribute('style', 'transform: rotate(' + (Math.floor(tilt/2)*(-1)) + 'deg)');  // setting random tilt for css transform()
                img.setAttribute('alt',element.desc + '.png');
            a.appendChild(img);

        return a;
    }

    render() {
        this.array.forEach(each => {
            if (each.id !== '#') {
                let doc = document.getElementById(each.id);
                doc.appendChild(this._generate(each));
            }
        })
    }
}