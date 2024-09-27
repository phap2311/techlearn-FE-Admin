<template>
  <div
    class="d-flex mt-3 justify-content-between align-items-center chapter-header"
  >
    <router-link
      :to="{ path: '/chapters', query: { idCourse: idCourse } }"
      class="text-decoration-none"
    >
      <div class="d-flex align-items-center gap-2">
        <i class="fa-solid fa-arrow-left text-dark"></i>
        <p class="mb-0 text-dark">Danh sách chương</p>
      </div>
    </router-link>
  </div>
  <hr class="border border-grey border-1 opacity-50" />
  <div class="row mt-5">
    <div class="col-5">
      <div class="col-md-12">
        <img class="img-fluid" :src="dataCourse.course.thumbnailUrl" alt="" />
      </div>
      <div class="col-md-12 text-start mt-3">
        <p>
          <span class="fw-bold">Tên khoá học:</span>
          {{ dataCourse.course.name }}
        </p>
        <p>
          <span class="fw-bold">Mô tả khoá học:</span>
          {{ dataCourse.course.description }}
        </p>
        <p>
          <span class="fw-bold">Giá khoá học:</span>
          {{ dataCourse.course.price }}
        </p>
        <p>
          <span class="fw-bold">Đơn vị:</span>
          {{ dataCourse.course.currencyUnit }}
        </p>
        <p>
          <span class="fw-bold">Công nghệ:</span>
          {{
            dataCourse.course.techStack
              ?.map((stack) => stack.name)
              .join(", ") || "N/A"
          }}
        </p>
      </div>
    </div>


        <div class="col-7">
            <h2>Thêm Chương Mới</h2>
            <form @submit.prevent="addChapter">
                <div class="mb-3">
                    <label for="chapterName" class="form-label">Tên chương</label>
                    <input type="text" class="form-control" id="chapterName" v-model="chapterName" required />
                </div>

                <div class="mb-3">
                    <label for="isPublic" class="form-label">Trạng thái</label>
                    <select v-model="isPublic" class="form-select" aria-label="Công khai">
                        <option v-for="option in publicOptions" :key="option.value" :value="option.value">
                            {{ option.text }}
                        </option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="supporter" class="form-label">Người hỗ trợ</label>
                    <Multiselect
                    v-model="mentors.data"
                    :options="options.data || []"
                    label="name"
                    :multiple="true"
                    :taggable="true"
                    @tag="addTeacher"
                    @remove="removeTeacher"
                    :close-on-select="false"
                    placeholder="Chọn người hỗ trợ"
                    />
                </div>
        <button type="submit" class="btn btn-primary">Thêm Chương</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { toast } from "vue3-toastify";
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import Multiselect from "vue-multiselect";

const rootAPI = process.env.VUE_APP_ROOT_API;

const chapterName = ref("");
const isPublic = ref(true);

const mentors = reactive({
    data:[]
})
const options = reactive({
    data:[]
})

const publicOptions = [
  { value: true, text: "Công khai" },
  { value: false, text: "Riêng tư" },
];

const route = useRoute();
const idCourse = route.query.idCourse;
const existingChapters = ref([]);

const addChapter = async () => {
    try {
        const newChapter = {
            name: chapterName.value,
            isPublic: isPublic.value,
            courseId: idCourse,
            mentor: mentors.data
        };
        const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/chapters`, newChapter);

        toast.success("Thêm chương thành công", {
            position: "top-right",
            autoClose: 3000,
        });

    } catch (error) {
        toast.error("Thêm chương thất bại", {
            position: "top-right",
            autoClose: 3000,
        });
        console.error('Thêm chương thất bại:', error);
    }

};

const dataCourse = reactive({
  course: {},
});

const fetchChapters = async () => {
  try {
    const response = await axios.get(
      `${rootAPI}/chapters?idCourse=${idCourse}`
    );
    existingChapters.value = response.data.data.items; // Store existing chapters
  } catch (error) {
    console.error(error);
  }
};

const fetchCourse = async () => {

    try {
        const response = await axios.get(`${rootAPI}/courses/${idCourse}`);
        dataCourse.course = response.data.data;
        // dataCourse.course = {...dataCourse.course, mentor:[]}
        console.log("dataCourse", dataCourse.course);

    } catch (error) {
        console.error(error);
    }
}


const fetchMentors = async () => {
    try {
        const response = await axios.get(`${rootAPI}/mentors`);
        options.data = response.data.data.items;
    }catch(err){
        console.log(err);
    }
}

const removeTeacher = (tagToRemove) => {
    const teacherSet = new Set(mentors.data);
    teacherSet.delete(tagToRemove);
    mentors.data = Array.from(teacherSet);

};

onMounted(async () => {

    await fetchMentors();
    await fetchChapters();
    await fetchCourse();

});
</script>

<style scoped>
.container {
  max-width: 600px;
}

h2 {
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
}

.text-decoration-none {
  text-decoration: none;
}

i {
  font-size: 1rem;
}

img {
  border-radius: 10px;
  max-width: 80%;
  height: auto;
}

.chapter-header {
  height: 37.6px;
}
</style>
