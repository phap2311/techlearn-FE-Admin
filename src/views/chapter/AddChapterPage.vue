<template>
  <div class="d-flex mt-3 justify-content-between align-items-center chapter-header">
    <router-link :to="{ path: '/chapters', query: { idCourse: idCourse } }" class="text-decoration-none">
      <div class="d-flex align-items-center gap-2">
        <i class="fa-solid fa-arrow-left text-dark"></i>
        <p class="mb-0 text-dark">Danh sách chương</p>
      </div>
    </router-link>
  </div>
  <hr class="border border-grey border-1 opacity-50" />
  <div class="row mt-4">
    <div class="col-lg-5 mb-3 col-md-12 ">
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
          {{ formatCurrency(dataCourse.course.price, dataCourse.course.currencyUnit) }}
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
          <br>
          <div v-for="option in publicOptions" :key="option.value" class="form-check form-check-inline">
            <input class="form-check-input" :checked="option.value" type="radio" name="publicOptions"
              value="{{ option.value }}">
            <label class="form-check-label" for="inlineRadio1"> {{ option.text }}</label>
          </div>
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
import router from "@/router";


const rootAPI = process.env.VUE_APP_ROOT_API;


const chapterName = ref("");
const isPublic = ref(true);
const isInputFocused = ref(false);

const errors = reactive({
  chapterName: "",
  teacher: ""
});

const mentors = reactive({
  data: [""]
})
const options = reactive({
  data: []
})

const publicOptions = [
  { value: true, text: "Công khai" },
  { value: false, text: "Riêng tư" },
];

const route = useRoute();
const idCourse = route.query.idCourse;
const existingChapters = ref([]);

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

const addChapter = async () => {
  try {
    const newChapter = {
      name: chapterName.value,
      isPublic: isPublic.value,
      courseId: idCourse,
      mentor: mentors.data,
    };

    await axios.post(`${process.env.VUE_APP_ROOT_API}/chapters`, newChapter);

    toast.success("Thêm chương thành công", {
      position: "top-right",
      autoClose: 2000,
    });
    setTimeout(() => {
      router.push("/chapters?idCourse=" + idCourse);
    }, 2100);
    


  } catch (error) {
    if (error.response && error.response.data) {
      const validationErrors = error.response.data;
      errors.chapterName = validationErrors.name || '';
      errors.teacher = validationErrors.teacher || '';
    }
    toast.error("Thêm chương thất bại", {
      position: "top-right",
      autoClose: 3000,
    });
    console.error('Thêm chương thất bại:', errors);
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
    existingChapters.value = response.data.data.items;
  } catch (error) {
    console.error(error);
  }
};

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

input:focus {
  border-color: initial !important;
}
</style>
