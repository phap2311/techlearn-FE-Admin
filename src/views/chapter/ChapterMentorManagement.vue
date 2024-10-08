<template>
    <div class="mt-3">
        <div class="d-flex justify-content-between">
            <div class="mt-4" style="height: 37.6px;">
                <router-link :to="{ path: '/chapters', query: { idCourse: idCourse } }" class="text-decoration-none">
                    <div class="d-flex align-items-center gap-2">
                        <i class="fa-solid fa-arrow-left text-dark"></i>
                        <p class="mb-0 text-dark">Danh sách chương</p>
                    </div>
                </router-link>
            </div>
            <div v-if="addMentorStateButton" class="mt-3 d-flex justify-content-center align-items-center">
                <div>
                    <Multiselect v-model="selectedMentor" :options="mentors" label="name" :multiple="false"
                        placeholder="Chọn người hỗ trợ cho tất cả các chương"
                        @change="(mentor) => selectedMentor = mentor.id" />

                </div>
                <div class="ms-2">
                    <button class="btn btn-primary" @click="addMentorToAllChapters">Add</button>
                </div>
            </div>
        </div>
        <div class="mt-4">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" @change="selectAll" /></th>
                            <th scope="col">STT</th>
                            <th scope="col">Tên chương</th>
                            <th scope="col">Người hỗ trợ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in currentItems" :key="index">
                            <td><input type="checkbox" v-model="selectedItems" :value="item" /></td>
                            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                            <td>{{ item.name }}</td>
                            <td>
                                <Multiselect v-model="item.mentor" :options="availableMentorsForChapter(item) || []"
                                    label="name" :multiple="true" :taggable="true"
                                    @select="(mentor) => addMentorToChapter(mentor, item)"
                                    @remove="(mentor) => removeMentor(mentor, item)" :close-on-select="false"
                                    placeholder="Người hỗ trợ" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="pageSize" aria-controls="my-table"
                first-number last-number @change="pageChanged" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import axios from 'axios';
import Multiselect from 'vue-multiselect';

const rootAPI = process.env.VUE_APP_ROOT_API;

const route = useRoute();
const idCourse = route.query.idCourse;

const pageSize = 10;
const currentPage = ref(1);
const totalRows = ref(0);
const chapters = ref([]);
const selectedItems = ref([]);
const mentors = ref([]);
const selectedMentor = ref(null);

const fetchChapter = async () => {
    try {
        const response = await axios.get(`${rootAPI}/chapters`, {
            params: {
                idCourse: idCourse,
                page: currentPage.value,
                pageSize: pageSize,
            },
        });
        chapters.value = response.data.data.items;
        totalRows.value = response.data.data.totalPage * pageSize;
    } catch (error) {
        console.error(error);
    }
};

const fetchMentors = async () => {
    try {
        const response = await axios.get(`${rootAPI}/mentors/get-all`);
        mentors.value = response.data.data;
    } catch (error) {
        console.error(error);
    }
};

const currentItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return chapters.value.slice(start, start + pageSize);
});

const selectAll = (event) => {
    console.log(selectedItems.value);
    if (event.target.checked) {
        selectedItems.value = [...chapters.value];
    } else {
        selectedItems.value = [];
    }
};

const addMentorStateButton = computed(() => selectedItems.value.length > 1);

const pageChanged = () => {
    fetchChapter();
};

const availableMentorsForChapter = (item) => {
    return mentors.value.filter(mentor => {
        return !item.mentor.some(addedMentor => addedMentor.id === mentor.id);
    });
};

const addMentorToChapter = async (addMentor, item) => {
    let mentorId = addMentor.id;
    let chapterId = item.id
    if (!mentorId || !chapterId) {
        return toast.error("Lỗi thêm người hướng dẫn", {
            position: "top-right",
            autoClose: 3000,
        });
    }
    try {
        const res = await axios.post(`${rootAPI}/mentors/${mentorId}/create-mentor-chapter/${chapterId}`);
        if (res.status === 200) {
            toast.success("Thêm người hỗ trợ thành công", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    } catch (error) {
        console.error("Error add mentor to chapter: " + error);
    }
}

const addMentorToAllChapters = async () => {
    console.log(selectedMentor.value.id, selectedItems.value.id);
    if (!selectedMentor.value || selectedItems.value.length < 2) {
        return toast.error("Vui lòng chọn một người hỗ trợ và ít nhất hai chương.", {
            position: "top-right",
            autoClose: 3000,
        });
    }
    try {
        const chapterIds = selectedItems.value.map(chapter => chapter.id);
        const response = await axios.post(`${rootAPI}/mentors/${selectedMentor.value.id}/create-mentor-all-chapter`, chapterIds);
        if (response.status === 200) {
            await fetchChapter();
            selectedMentor.value = null;
            selectedItems.value = [];
            document.querySelector('input[type="checkbox"]:first-child').checked = false;
        }
    } catch (error) {
        if (error.status === 500) {
            toast.error("Đã có người hỗ trợ cho tất cả các chương", {
                position: "top-right",
                autoClose: 3000,
            });
        } else
            toast.error("Lỗi thêm người hỗ trợ vào tất cả chương", {
                position: "top-right",
                autoClose: 3000,
            });
        console.error('Failed to add mentor to chapters:', error);
    }
};

const removeMentor = async (removedMentor, item) => {
    if (!removedMentor.id || !item.id) {
        return toast.error("Lỗi xóa người hỗ trợ", {
            position: "top-right",
            autoClose: 3000,
        });
    }
    // remove mentor after deleted
    item.mentor = item.mentor.reduce((tempMentor, mentor) => {
        if (mentor.id !== removedMentor.id && !tempMentor.some(m => m.id === mentor.id)) {
            tempMentor.push(mentor);
        }
        return tempMentor;
    }, []);
    try {
        const response = await axios.delete(`${rootAPI}/mentors/${removedMentor.id}/delete-mentor-chapter/${item.id}`);
        if (response.status === 200) {
            toast.success("Xóa người hỗ trợ thành công", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    } catch (error) {
        console.error('Failed to remove mentor:', error);
    }
};

onMounted(async () => {
    await fetchChapter();
    await fetchMentors();
});
</script>

<style scoped>
.table-responsive {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table th,
table td {
    border-top: 1px solid #000;
    padding: 8px;
    text-align: left;
}

table th:first-child,
table td:first-child {
    width: 50px;
}

table th:nth-child(2),
table td:nth-child(2) {
    width: 80px;
}

table th:nth-child(3),
table td:nth-child(3) {
    width: 200px;
}

table th:last-child,
table td:last-child {
    width: auto;
}

table td {
    border-left: none;
    border-right: none;
}

table th {
    background-color: #f2f2f2;
}

@media (max-width: 768px) {

    table th,
    table td {
        padding: 4px;
    }

    table th:first-child,
    table td:first-child {
        width: 40px;
    }

    table th:nth-child(2),
    table td:nth-child(2) {
        width: 60px;
    }

    table th:nth-child(3),
    table td:nth-child(3) {
        width: 150px;
    }

    table th:last-child,
    table td:last-child {
        width: auto;
    }
}
</style>