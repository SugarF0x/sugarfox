function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class PentaLink {
    constructor(list = [{img: '#', url:'#', desc:'#', id:'#'}]) {
        this.array = [];

        list.forEach((each) => {
            this.array.push(each);
        });

        this.render();
    }

    static _getTiltDeg(min, max) {
        let number = randomInt(min,max);
        if (Math.random() < 0.5) {
            number*=-1;
        }
        return number;
    }

    static _generate(element) {
        let tilt = this._getTiltDeg(30,60);

        let a = document.createElement('a');
            a.classList.add('pentaLink');
            a.setAttribute('href',element.url);
            a.setAttribute('data-toggle','tooltip');
            a.setAttribute('data-placement','top');
            a.setAttribute('data-delay','{ "show": 500, "hide": 100 }');
            a.setAttribute('title',element.desc);

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
                doc.appendChild(PentaLink._generate(each));
            }
        })
    }
}

class Quotes {
    constructor() {
        $.get('lists/quotes.txt', data => {
            this.quotes = data.split("\n");
            document.getElementById('quotes').addEventListener('click', () => {this.render()});
            this.render();
        }, 'text');
        setInterval(() => {this.render()},5000);
    }

    render() {
        let id = randomInt(0,this.quotes.length);

        let q = document.getElementById('quotes');
            q.setAttribute('style','color: steelblue;');
        setTimeout(() => {
            q.innerHTML = '';
            q.innerText = this.quotes[id];
            q.innerHTML = q.innerHTML.replace('<br>','');
            q.setAttribute('style','color: white;');

            let i = document.createElement('span');
                i.innerText = ` [${id+1}/${this.quotes.length}] `;
            q.appendChild(i);
        }, 250);
        // end q document
    }
}