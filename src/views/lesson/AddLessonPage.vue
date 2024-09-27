<template>
    <div class="d-flex mt-3 justify-content-between align-items-center">
        <router-link :to="{ path: '/lessons', query: { idChapter: idChapter, idCourse:idCourse } }" class="text-decoration-none">
            <div class="d-flex align-items-center gap-2">
                <i class="fa-solid fa-arrow-left text-dark"></i>
                <p class="mb-0 text-dark">Danh sách bài học</p>
            </div>
        </router-link>
    </div>
    <div class="container">
        <h2 class="mb-4 mt-4">{{ isUpdate ? 'Cập nhật bài học' : 'Thêm bài học' }}</h2>
        <form @submit.prevent="submitLessons">
            <div class="row">
                <div class="row mb-3">
                    <div class="col-md-12">
                        <label for="title" class="form-label">Tiêu đề</label>
                        <input type="text" class="form-control" id="title" v-model="dataLesson.title" />
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="type" class="form-label">Loại</label>
                        <select class="form-select" id="type" v-model="dataLesson.type">
                            <option value="READINGS">Bài đọc</option>
                            <option value="LECTURES">Bài giảng</option>
                            <option value="EXERCISES">Bài tập</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-3" v-if="dataLesson.type === 'LECTURES'">
                    <div class="col-md-12">
                        <label for="video" class="form-label">Video URL</label>
                        <input type="text" class="form-control" id="video" v-model="dataLesson.videoUrl" />
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-12">
                        <label for="content" class="form-label">Nội dung</label>
                        <CKEditorComponent v-model="dataLesson.content" />
                    </div>
                </div>
                <div class="row mb-3" v-if="dataLesson.type === 'EXERCISES'">
                    <div class="col-md-12">
                        <label for="contentRefer" class="form-label">Ghi chú</label>
                        <CKEditorComponent v-model="dataLesson.contentRefer" />
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center mb-4">
                <button type="submit" class="btn btn-primary mx-4">{{ isUpdate ? 'Cập nhật' : 'Tạo mới' }}</button>
                <button type="button" class="btn btn-secondary mx-4" @click="goBack">Trở về</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import CKEditorComponent from '@components/CKEditor/CKEditorComponent.vue';
import axios from 'axios';

const rootAPI = process.env.VUE_APP_ROOT_API;
const route = useRoute();
const router = useRouter();
const isUpdate = ref(false);
const idChapter = route.query.idChapter
const idCourse = route.query.idCourse

const dataLesson = reactive({
    title: "",
    type: "READINGS",
    content: "",
    videoUrl: "",
    contentRefer: "",
    chapterId: idChapter
})

const submitLessons = async () => {
    if (isUpdate.value) {
        try {
            await axios.put(`${rootAPI}/lessons/${dataLesson.id}`, dataLesson);
            toast.success("Cập nhật bài tập thành công", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            toast.error("Cập nhật bài tập thất bại", {
                position: "top-right",
                autoClose: 3000,
            });
            console.error('Cập nhật bài tập thất bại:', error);
        }
        return;
    }
    try {
        await axios.post(`${rootAPI}/lessons`, dataLesson);
        toast.success("Thêm bài tập thành công", {
            position: "top-right",
            autoClose: 3000,
        });
    } catch (error) {
        toast.error("Thêm bài tập thất bại", {
            position: "top-right",
            autoClose: 3000,
        });
        console.error('Thêm bài tập thất bại:', error);
    }
}

const fetchLesson = async (id) => {
    try {
        const response = await axios.get(`${rootAPI}/lessons/${id}`);
        Object.assign(dataLesson, response.data.data);
    } catch (error) {
        console.error('Lấy thông tin bài tập thất bại:', error);
    }
}

const goBack = () => {
    router.go(-1);
};

onMounted(async () => {
    const { id } = route.params;
    if (id) {
        isUpdate.value = true;
        await fetchLesson(id);
    }
});
</script>