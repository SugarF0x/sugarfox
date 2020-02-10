"use strict";

//--------------------------------------------------------------------------------------------------------------------\\

let goods = {
    goodList: [
        {name: 'Sub 2 PdP',  price: 0},
        {name: 'G-Fuel',     price: 69},
        {name: 'Memes',      price: 250},
        {name: 'Chair',      price: 399},
        {name: 'News',       price: 780},
        {name: 'TikTok Ads', price: 999},
        {name: 'Legs',       price: 1280}
    ],

    generate() {
        let board = '';

        for (let y = 0; y <= this.goodList.length-1; y++) {
            board += '<tr>';
            board += '<td>' + this.goodList[y].name + '</td>';
            board += '<td>' + this.goodList[y].price + '</td>';
            board += '<td><button class="buy" onclick="cart.add(goods.goodList[' + y + ']); cart.update()">Купить</button></td>';
            board += '</tr>';
        }

        return  '<table>' +
                    '<tbody>' +
                        '<tr>' +
                            '<td>Товар</td>' +
                            '<td>Стоимость</td>' +
                            '<td></td>' +
                        '</tr>' +
                        board +
                    '</tbody>' +
                '</table>';
    },

    render() {
        let table = this.generate();
        document.body.insertAdjacentHTML('beforeend', table);
    }
};

let cart = {
    items: [],

    add(good) {
        let isFound = false;

        this.items.forEach(function (it) {
            if (it.name === good.name) {
                it.amount++;
                isFound = true;
            }
        });

        if (!isFound) {
            this.items.push({name: good.name, price: good.price, amount: 1});
        }
    },

    getPriceTotal() {
        let price = 0;
        this.items.forEach(function (it) {
            price += it.price*it.amount;
        });
        return price;
    },

    getAmountTotal() {
        let amount = 0;
        this.items.forEach(function (it) {
            amount += it.amount;
        });
        return amount;
    },

    generateTable() {
        if (this.items.length === 0) return "<div id='cart'>Корзина пуста</div>";

        let board = '';

        for (let y = 0; y <= this.items.length-1; y++) {
            board += '<tr>';
            board += '<td>' + this.items[y].name + '</td>';
            board += '<td>' + this.items[y].price + '</td>';
            board += '<td>' + this.items[y].amount + '</td>';
            board += '</tr>';
        }
        return  '<table id="cart">' +
                    '<tbody>' +
                        '<tr>' +
                            '<td>Товар</td>' +
                            '<td>Стоимость</td>' +
                            '<td>Всего</td>' +
                        '</tr>' +
                        board +
                        '<tr>' +
                            '<td>' + 'Всего:</td>' +
                            '<td>' +  this.getPriceTotal() + '</td>' +
                            '<td>' + this.getAmountTotal() + '</td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>';
    },

    render() {
        let table = this.generateTable();
        document.body.insertAdjacentHTML('beforeend', table);
    },

    update() {
        let table = document.getElementById('cart');
        table.remove();
        this.render();
    }
};

//--------------------------------------------------------------------------------------------------------------------\\

function addCss(fileName) {

    let head = document.head;
    let link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = fileName;

    head.appendChild(link);
}

//--------------------------------------------------------------------------------------------------------------------\\

addCss('styles/lessons/6.css');
goods.render();
cart.render();