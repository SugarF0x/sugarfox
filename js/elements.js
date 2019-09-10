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
            if (element.url === '#') {
                a.setAttribute('disabled','');
                a.setAttribute('data-html','true');
                a.setAttribute('title',element.desc + '<br><b>временно недоступно</b>');
            }

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
        $.get('data/quotes.txt', data => {
            this.quotes = data.split("\n");
            document.getElementById('quotes').addEventListener('click', () => {
                this.render();
                this.manualRender = true;
            });
            this.render();
        }, 'text');
        this.manualRender = false;
        setInterval(() => {
            if (!this.manualRender) this.render();
            this.manualRender = false;
        },3500);
    }

    // TODO: make ajax each and every quote

    render() {
        let id = randomInt(0,this.quotes.length);

        let q = document.getElementById('quotes');
        let t = document.getElementById('quotes-text');
            t.setAttribute('style','opacity: 0;');
        let i = document.getElementById('quotes-number');

        setTimeout(() => {
            t.innerText = this.quotes[id];
            i.innerText = ` [${id+1}/${this.quotes.length}] `;
            t.setAttribute('style','opacity: 1;');
            t.innerHTML = t.innerHTML.replace('<br>','');
        }, 250);
    }
}

class Bank {
    constructor() {

    }

    update(state) {
        let today = new Date();
        let date = '';
        let time = '';
        if (today.getDate() < 10) date += '0';
        date += today.getDate() + '/';
        if (today.getMonth() < 10) date += '0';
        date += today.getMonth() + '/';
        date += today.getFullYear();
        if (today.getHours() < 10) time += '0';
        time += today.getHours() + ':';
        if (today.getMinutes() < 10) time += '0';
        time += today.getMinutes() + ':';
        if (today.getSeconds() < 10) time += '0';
        time += today.getSeconds();

        $.ajax({
            type: "POST",
            url: "handlers/bank.php",
            data: {
                "date": date,
                "time": time,
                "change": document.getElementById('input').value,
                "state": state
            },
            success: (result) => {
                if (result === 'SUCCESS') {
                    location.reload()
                } else {
                    alert(result);
                }
            }
        });
    }
}