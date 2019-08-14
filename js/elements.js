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

        let pentagon = document.createElement("img");
        pentagon.classList.add('pL__bg');
        pentagon.setAttribute('src',"svg/pentagon.svg");
        pentagon.setAttribute('style', 'transform: rotate(' + tilt + 'deg)');  // setting random tilt for css transform()
        a.appendChild(pentagon);

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