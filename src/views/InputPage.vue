<template>
    <div class="main">
        <h1>并没有什么卵用的壁纸制作器</h1>
        <h2>闲话</h2>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="简介" name="intro">
                <p>
                    这个项目能在你喜欢的图片的右上角加一个TODO与Deadline的日历，然后设置为桌面用来当成一个方便的日历（实在是并没有什么卵用（甚至还要手动截图
                </p>
                <p>
                    如果发现了什么问题欢迎反馈（不会除了我和sanka之外还有其他人在用吧？），联系方式：nicklin9907@gmail.com
                </p>
            </el-collapse-item>
            <el-collapse-item title="TODOs" name="todos">
                <p>
                    <ol>
                        <li>加入自动生成图片的功能（好难啊不知道有没有什么库可以做到）</li>
                        <li>可能添加其他种类的日历</li>
                        <li>更多的日历自定义（字体，字号，间距，位置之类的）</li>
                    </ol>
                </p>
            </el-collapse-item>
        </el-collapse>
        <h2>帮助</h2>
        <p>
            <ol>
                <li>填写事项并上传图片 / 导入之前已经保存的数据</li>
                <li>点击完成进入结果页面</li>
                <li>按下键盘上的F11进入全屏</li>
                <li>截图整个屏幕并保存为图片</li>
            </ol>
            另外也可以将已填写完的内容保存起来方便下次编辑
        </p>
        <h2>已保存的数据</h2>
        <div class="data-import-container">
            <el-select placeholder="请选择已保存的数据" v-model="selectedData">
                <el-option
                    v-for="name in savedDataNames"
                    :key="name"
                    :label="name"
                    :value="name"
                ></el-option>
            </el-select>
            <el-button type="primary" @click="importData">导入</el-button>
            <el-button type="danger" @click="deleteData">删除</el-button>
        </div>
        <h2>事项输入</h2>
        <div class="color-picker">
            <span>选择待办事项颜色</span>
            <el-color-picker
                size="small"
                v-model="color"
                show-alpha
            ></el-color-picker>
        </div>
        <div class="item" v-for="(item, index) in items" :key="index">
            <el-date-picker
                slot="prepend"
                placeholder="截止日期"
                v-model="items[index].deadline"
                value-format="yyyy/MM/dd"
                format="yyyy年MM月dd日"
                :picker-options="deadlineOptions"
                class="deadline-picker"
            ></el-date-picker>
            <el-input placeholder="事项内容" v-model="items[index].title">
                <el-button
                    slot="append"
                    @click="items.splice(index, 1)"
                    icon="el-icon-delete"
                >
                </el-button>
            </el-input>
            <el-button
                icon="el-icon-bottom"
                :disabled="index === items.length - 1"
                @click="moveDown(index)"
            ></el-button>
            <el-button
                icon="el-icon-top"
                :disabled="index === 0"
                @click="moveUp(index)"
            ></el-button>
        </div>
        <el-button round size="mini" class="add-btn" @click="addNewItem">
            <i class="el-icon-plus"></i>
        </el-button>
        <h2>图片选择</h2>
        <el-upload
            action="#"
            list-type="picture-card"
            :on-change="onChange"
            :show-file-list="false"
            :auto-upload="false"
            v-show="!image"
        >
            <i slot="default" class="el-icon-plus"></i>
        </el-upload>
        <div class="preview">
            <img v-if="image" :src="image" alt="" />
            <div class="mask" @click="image = ''">
                <i class="el-icon-delete"></i>
            </div>
        </div>
        <div class="btn-group">
            <el-button class="save" @click="save"> 保存 </el-button>
            <el-button type="primary" class="finish" @click="validate">
                完成
            </el-button>
        </div>
    </div>
</template>

<script>
import { data } from "../store";
export default {
    data() {
        return {
            items: [
                {
                    deadline: "",
                    title: "",
                },
            ],
            color: "#000000",
            image: "",
            deadlineOptions: {
                disabledDate(date) {
                    let current = new Date();
                    return date <= current;
                },
            },
            savedData: {},
            selectedData: "",
            activeNames: [],
        };
    },
    methods: {
        addNewItem() {
            this.items.push({
                deadline: "",
                title: "",
            });
        },
        importData() {
            this.$confirm("未保存的内容将会丢失", "确认导入？").then(() => {
                if (this.selectedData) {
                    this.items = this.savedData[this.selectedData].items;
                    this.color = this.savedData[this.selectedData].color;
                    this.image = this.savedData[this.selectedData].image;
                } else {
                    this.$message({
                        type: "error",
                        message: "请先选择一个有效的导入内容",
                    });
                }
            });
        },
        deleteData() {
            this.$confirm("删除后将无法恢复", "确认删除？").then(() => {
                if (this.selectedData) {
                    this.selectedData = "";
                    this.$delete(this.savedData, this.selectedData);
                    this.saveAndUpdate(this.savedData);
                    this.$message({
                        type: "success",
                        message: "删除成功",
                    });
                } else {
                    this.$message({
                        type: "error",
                        message: "请先选择一个有效的内容",
                    });
                }
            });
        },
        saveAndUpdate(savedData) {
            window.localStorage.setItem("savedData", JSON.stringify(savedData));
            this.savedData = savedData;
        },
        save() {
            let that = this;
            this.$prompt("请输入文件名", "将内容保存于浏览器", {
                confirmButtonText: "保存",
                cancelButtonText: "放弃",
                inputValue: "新文件",
            })
                .then((data) => {
                    let value = data.value;
                    let savedData = window.localStorage.getItem("savedData");
                    if (!savedData) savedData = {};
                    else savedData = JSON.parse(savedData);
                    function saveToLocalStorage() {
                        savedData[value] = {
                            image: that.image,
                            items: that.items,
                            color: that.color,
                        };
                        that.saveAndUpdate(savedData);
                        that.$message({ type: "success", message: "保存成功" });
                    }
                    if (savedData[value]) {
                        console.log("冲突");
                        that.$confirm(
                            "是否覆盖已存在文件？",
                            "已有同名文件存在"
                        )
                            .then(() => {
                                saveToLocalStorage();
                            })
                            .catch((_) => {});
                    } else saveToLocalStorage();
                })
                .catch((_) => {});
        },
        onChange(e) {
            let reader = new FileReader();
            reader.readAsDataURL(e.raw);
            let that = this;
            reader.onload = function () {
                that.image = reader.result;
            };
        },
        validate() {
            if (!this.image) {
                this.$message({
                    type: "error",
                    message: "请上传背景图片",
                });
                return false;
            }
            if (this.items.length === 0) {
                this.$message({
                    type: "error",
                    message: "请填写至少一项事项",
                });
                return false;
            }
            data.image = this.image;
            data.items = this.items;
            data.color = this.color;
            this.$router.push({ name: "Result" });
        },
        moveDown(index) {
            this.items[index + 1] = this.items.splice(
                index,
                1,
                this.items[index + 1]
            )[0];
        },
        moveUp(index) {
            this.items[index - 1] = this.items.splice(
                index,
                1,
                this.items[index - 1]
            )[0];
        },
    },
    computed: {
        savedDataNames() {
            let savedDataNames = [];
            for (let name in this.savedData) {
                savedDataNames.push(name);
            }
            return savedDataNames;
        },
    },
    created() {
        if (data.image) this.image = data.image;
        if (data.items.length != 0) this.items = data.items;
        if (data.color) this.color = data.color;
        let savedData = window.localStorage.getItem("savedData");
        if (savedData) savedData = JSON.parse(savedData);
        else savedData = {};
        this.savedData = savedData;
    },
};
</script>

<style lang="scss" scoped>
.main {
    box-sizing: border-box;
    padding: 16px 32px;
    max-width: 800px;
    min-height: 100vh;
    margin: 0 auto;
    box-shadow: 2px 2px 5px rgba($color: #000000, $alpha: 0.1);
    background-color: white;
}
p {
    border-left: 3px solid #ccc;
    padding: 8px 0 8px 8px;
    ol {
        margin: 0;
        margin-bottom: 8px;
    }
}
.title {
    display: flex;
    align-items: baseline;
    column-gap: 16px;
}
.data-import-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 8px;
    &::v-deep {
        .el-button + .el-button {
            margin-left: 0;
        }
    }
}
.color-picker {
    display: flex;
    align-items: center;
    column-gap: 8px;
    margin-bottom: 16px;
}
.item {
    display: flex;
    column-gap: 8px;
    margin-bottom: 16px;
    &::v-deep {
        .el-button + .el-button {
            margin-left: 0;
        }
    }
}
.add-btn {
    display: block;
    width: 80%;
    margin: 0 auto;
}
.preview {
    cursor: pointer;
    width: 100%;
    margin: 0 auto;
    position: relative;
    img {
        width: 100%;
    }
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba($color: #000000, $alpha: 0.6);
        color: white;
        font-size: 32px;
        opacity: 0;
        transition: opacity ease 0.1s;
    }
    &:hover > .mask {
        opacity: 1;
    }
}
.btn-group {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.deadline-picker {
    flex-shrink: 0;
    flex-basis: 170px;
}
</style>
