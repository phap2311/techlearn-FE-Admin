<template>
    <div class="d-flex mt-3 justify-content-between align-items-center chapter-header">
        <router-link :to="{ path: '/chapters', query: { idCourse: idCourse } }" class="text-decoration-none">
            <div class="d-flex align-items-center gap-2">
                <i class="fa-solid fa-arrow-left text-dark"></i>
                <p class="mb-0 text-dark">Danh sách chương</p>
            </div>
        </router-link>
    </div>
    <hr class="border border-grey border-1 opacity-50">
    <div class="row mt-4">
        <div class="col-5">
            <div class="col-md-12">
                <img class="img-fluid" :src="dataCourse.course.thumbnailUrl" alt="">
            </div>
            <div class="col-md-12 text-start mt-3">
                <p>
                    <span class="fw-bold">Tên khoá học:</span> {{ dataCourse.course.name }}
                </p>
                <p>
                    <span class="fw-bold">Mô tả khoá học:</span> {{ dataCourse.course.description }}
                </p>
                <p>
                    <span class="fw-bold">Giá khoá học:</span> {{
                        formatCurrency(dataCourse.course.price, dataCourse.course.currencyUnit) }}
                </p>
                <p>
                    <span class="fw-bold">Đơn vị:</span> {{ dataCourse.course.currencyUnit }}
                </p>
                <p>
                    <span class="fw-bold">Công nghệ: </span>
                    <span v-if="
                        dataCourse.course &&
                        dataCourse.course.techStack &&
                        dataCourse.course.techStack.length > 0
                    ">
                        {{
                            dataCourse.course.techStack.map((stack) => stack.name).join(", ")
                        }}
                    </span>
                    <span v-else>N/A</span>
                </p>
            </div>
        </div>
        <div class="col-7">
            <h2>Sửa thông tin chương</h2>
            <form @submit.prevent="updateChapter">
                <div class="mb-3">
                    <label for="chapterName" class="form-label">Tên chương</label>
                    <input type="text" id="chapterName" class="form-control" v-model="chapterName" required />
                </div>

                <div class="mb-3">
                    <label for="isPublic" class="form-label">Trạng thái</label>
                    <br>
                    <div v-for="option in publicOptions" :key="option.value" class="form-check form-check-inline">
                        <input class="form-check-input" v-model="isPublic" :checked="option.value == isPublic"
                            type="radio" name="isPublic" :value="option.value">
                        <label class="form-check-label" for="inlineRadio1"> {{ option.text }}</label>
                    </div>

                </div>


                <button type="submit" class="btn btn-primary">Cập nhật</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { toast } from "vue3-toastify";
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

const rootAPI = process.env.VUE_APP_ROOT_API;

const route = useRoute();

const chapterId = route.params.id;
const idCourse = route.query.idCourse;
const mentors = reactive({
    data: []
})
const options = reactive({
    data: []
})
const chapterName = ref('');
const isPublic = ref(true);
const chapterOrder = ref(0);

const publicOptions = [
    { value: true, text: 'Công khai' },
    { value: false, text: 'Riêng tư' },
];


function formatCurrency(value, unit) {
    if (typeof value !== "number") {
        return value;
    }
    var formatter
    switch (unit) {
        case "USD":
            formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            });
            break;
        case "VND":
            formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            });

            break;
    }

    return formatter.format(value);
};

const fetchChapter = async () => {
    try {
        const response = await axios.get(`${rootAPI}/chapters/${chapterId}`);
        mentors.data = response.data.data.mentor;
        chapterName.value = response.data.data.name;
        isPublic.value = response.data.data.isPublic;
        chapterOrder.value = response.data.data.chapterOrder;
    } catch (error) {
        console.error('Failed to fetch chapter:', error);
    }
};

const updateChapter = async () => {

    try {
        const updatedChapter = {
            name: chapterName.value,
            chapterOrder: chapterOrder.value,
            isPublic: isPublic.value,
            courseId: idCourse,
            // mentorId:mentors.data,
            id:chapterId
        };
        // updatedChapter.mentorId = mentors.data.map(i =>i.id);

        await axios.put(`${rootAPI}/chapters/${chapterId}`, updatedChapter);
        toast.success("Cập nhật chương thành công", {
            position: "top-right",
            autoClose: 2000,
        });
        setTimeout(() => {
      router.push("/chapters?idCourse=" + idCourse);
    }, 2100);

    } catch (error) {
        toast.error("Cập nhật chương thất bại", {
            position: "top-right",
            autoClose: 3000,
        });
        console.error('Cập nhật chương thất bại:', error);
    }
};

const dataCourse = reactive({
    course: {}
});

const fetchCourse = async () => {
    try {
        const response = await axios.get(`${rootAPI}/courses/${idCourse}`);
        dataCourse.course = response.data.data;
    } catch (error) {
        console.error(error);
    }
}
const fetchMentors = async () => {
    try {
        const response = await axios.get(`${rootAPI}/mentors`);
        options.data = response.data.data.items;
    } catch (err) {
        console.log(err);
    }
}

const removeTeacher = (tagToRemove) => {
    const teacherSet = new Set(mentors.data);
    teacherSet.delete(tagToRemove);
    mentors.data = Array.from(teacherSet)
};

onMounted(async () => {
    await fetchChapter();
    await fetchCourse();
    await fetchMentors();
});
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: auto;
}

h2 {
    margin-bottom: 20px;
}

.text-decoration-none {
    text-decoration: none;
}

i {
    font-size: 1.0rem;
}

img {
    border-radius: 10px;
    max-width: 80%;
    height: auto;
}
</style>