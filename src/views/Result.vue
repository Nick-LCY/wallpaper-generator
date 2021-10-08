<template>
    <div class="result" :style="{ backgroundImage: `url(${image})` }">
        <div class="table" :style="{ color }">
            <div class="title">Deadline</div>
            <div class="title">TODOs</div>
            <div class="content" v-for="(item, index) in items" :key="index">
                {{ item }}
            </div>
        </div>
    </div>
</template>
<script>
import { data } from "../store";
export default {
    data() {
        return {
            image: "",
            items: [],
            color: "#000000",
        };
    },
    created() {
        console.log(data);
        this.image = data.image;
        for (let item of data.items) {
            this.items.push(item.deadline);
            this.items.push(item.title);
        }
        this.color = data.color;
    },
};
</script>
<style lang="scss" scoped>
.result {
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-position: center center;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    .table {
        margin: 128px;
        margin-top: 64px;
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: auto;
        text-align: center;
        min-width: 30vw;
        div {
            border-bottom-style: solid;
            border-bottom-width: 2px;
            padding: 4px 8px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            font-size: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>