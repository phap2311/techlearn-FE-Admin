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
    <h5 class="mt-5 title-sort" style="margin-left: 30px">Sắp xếp danh sách chương</h5>
    <Table :header="header" :data="data.chapter" :keys="keys" :actions="actions" :isDraggable="true"
        @updateOrder="handleDragUpdate" :totalRows="totalRows" :perPage="perPage" @pageChange="handlePageChange">
    </Table>
    <button class="d-flex mx-auto btn-save btn btn-warning" @click="saveOrder">Lưu thay đổi</button>
</template>
<script setup>
import Table from '@/components/Tables/Table.vue';
import axios from "axios";
import { reactive, onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import { useRoute } from 'vue-router';

const rootAPI = process.env.VUE_APP_ROOT_API;
const route = useRoute();
const idCourse = route.query.idCourse;

const data = reactive({
    chapter: [],
    updatedOrder: []
});

const dataCourse = reactive({
    course: {}
});

const header = ["STT", "Tên chương", "Mức độ truy cập"];
const keys = ["name"];

function handleDragUpdate(updatedData) {
    data.updatedOrder = updatedData.map((item, index) => ({
        id: item.id,
        order: (index + 1)
    }));
}


async function saveOrder() {
    if (!data.updatedOrder.length) {
        toast.info("Không có thay đổi thứ tự nào", {
            position: "top-right",
            autoClose: 3000,
        });
        return;
    }

    try {
        await axios.patch(`${rootAPI}/chapters/update-order`, data.updatedOrder);
        toast.success("Cập nhật thứ tự thành công", {
            position: "top-right",
            autoClose: 3000,
        });
        data.updatedOrder = [];  // Clear the local updated order after saving
    } catch (error) {
        toast.error("Lỗi cập nhật thứ tự chương", {
            position: "top-right",
            autoClose: 3000,
        });
        console.error("Lỗi cập nhật thứ tự chương:", error);
    }
}

const currentPage = ref(1);
const perPage = ref(50);
const totalRows = ref(0);

const fetchChapter = async () => {
    try {
        const response = await axios.get(
            `${rootAPI}/chapters`, {
            params: {
                idCourse: idCourse,
                page: currentPage.value,
                pageSize: perPage.value
            }
        }
        );
        data.chapter = response.data.data.items;
        perPage.value = response.data.data.pageSize
        totalRows.value = response.data.data.totalPage;
    } catch (error) {
        console.error(error);
    }
}

const fetchCourse = async () => {
    try {
        const response = await axios.get(`${rootAPI}/courses/${idCourse}`);
        dataCourse.course = response.data.data;
    } catch (error) {
        console.error(error);
    }
}

onMounted(async () => {
    await fetchChapter();
    await fetchCourse();
});

</script>

<style scoped>
.title-sort {
    margin-bottom: -35px;
}

.btn-save {
    margin-top: -25px;
}

.chapter-header {
    height: 37.6px;
}
</style>