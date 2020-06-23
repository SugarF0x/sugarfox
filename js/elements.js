class PentaLink {
    constructor(list = [{img: '#', url:'#', desc:'#', id:'#', misc:null}]) {
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
        let tilt = this._getTiltDeg(15,60);

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
            // TODO: make these available only when frup members are quthorised
            // if (element.misc !== null && element.misc["check-frup-access"]) {
            //         if (!vk.isAuthorised) {
            //             a.setAttribute('disabled', '');
            //             a.setAttribute('data-html', 'true');
            //             a.setAttribute('title', element.desc + '<br><b>авторизируйтесь для доступа</b>');
            //             a.setAttribute('href','#');
            //         }
            // }

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
    //TODO: censor quotes for unauthorised users
    // alternatively can make it so that onauthorised users can only see family friendly quotes
    // this however will need me to refactor the whole quotes file and turn it to json with data, determining it's state
    // or make two separate files - family friendly quotes and not, where the latter shall only be injected after authorisation

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

        let t = document.getElementById('quotes-text');
            t.setAttribute('style','opacity: 0;');
        let i = document.getElementById('quotes-number');

        setTimeout(() => {
            t.innerText = this.quotes[id].replace(/(\r\n|\n|\r)/gm, "");
            i.innerText = ` [${id+1}/${this.quotes.length}] `;
            setTimeout(() => {
                t.setAttribute('style','opacity: 1;');
            },50);
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