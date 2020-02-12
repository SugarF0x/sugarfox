<template>
    <div class="container pt-5 text-center">
        {{msg}}
        <br>
        <PentaLink
            img="img/main/geekbrains.webp"
            desc="Geekbrains"
        ></PentaLink>
        <br>
        <Quotes></Quotes>
    </div>
</template>

<script>
    import PentaLink from './components/PentaLink.vue'
    import Quotes from './components/Quotes.vue'

    export default {
        data() {
            return {
                msg: 'TEST MESSAGE OF GAY'
            }
        },
        components: {
            PentaLink,
            Quotes
        },
        methods: {
            getJson(url){
                return fetch(url)
                    .then(result => result.json())
                    .catch(error => console.log(error))
            },
            postJson(url, data){
                return fetch(url, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                    .then(result => result.json())
                    .catch(error => console.log(error))
            },
            putJson(url, data){
                return fetch(url, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                    .then(result => result.json())
                    .catch(error => console.log(error))
            },
            deleteJson(url){
                return fetch(url, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(result => result.json())
                    .catch(error => console.log(error))
            }
        }
    }
</script>

<style lang="less" src="./styles/main.less"></style>