<template>
    <header class="container-fluid">
        <div class="row d-flex justify-content-between">
            <a href='/' class="d-flex align-items-center" id="logo">
                <img src="img/sgfx_line_blue.webp" alt="sgfx-logo">
                <span>SGFX</span>
            </a>
            <div class="col-6 text-right" id="page-title">
                Main
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        name: "Header"
    }
</script>

<style scoped lang="less">
    header {
        #logo {
            height: 3rem;
            text-decoration: none;
            color: white;
            padding: 0.5rem;
            img {
                height: 2.5rem;
            }
            span {
                font-family: Kurbanistika, sans-serif;
                font-size: 2.5rem;
            }
        }
        #page-title {
            font-size: 2rem;
            text-transform: uppercase;
            font-weight: bold;
        }
    }
</style>