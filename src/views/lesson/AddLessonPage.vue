<template>
  <div class="d-flex mt-3 justify-content-between align-items-center">
    <router-link
      :to="{
        path: '/lessons',
        query: { idChapter: idChapter, idCourse: idCourse },
      }"
      class="text-decoration-none"
    >
      <div class="d-flex align-items-center gap-2">
        <i class="fa-solid fa-arrow-left text-dark"></i>
        <p class="mb-0 text-dark">Danh sách bài học</p>
      </div>
    </router-link>
  </div>
  <div class="container">
    <h3 class="mb-4 mt-4">
      {{ isUpdate ? "Cập nhật bài học" : "Thêm bài học" }}
    </h3>
    <form @submit.prevent="submitLessons">
      <div class="row">
        <div class="row mb-3">
          <div class="col-md-12">
            <label for="title" class="form-label h5">Tiêu đề</label>
            <input
              @input="validForm"
              type="text"
              class="form-control"
              id="title"
              v-model="dataLesson.title"
            />
            <div v-if="errors.title" class="text-danger">
              {{ errors.title }}
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="type" class="form-label h5">Loại</label>
            <select class="form-select" id="type" v-model="dataLesson.type">
              <option value="READINGS">Bài đọc</option>
              <option value="LECTURES">Bài giảng</option>
              <option value="EXERCISES">Bài tập</option>
            </select>
          </div>
        </div>
        <div class="row mb-3" v-if="dataLesson.type === 'LECTURES'">
          <div class="col-md-12">
            <label for="video" class="form-label h5">Video URL</label>
            <input
              v-on:input="validForm"
              type=""
              class="form-control"
              id="video"
              v-model="dataLesson.videoUrl"
            />

            <div v-if="errors.videoUrl" class="text-danger">
              {{ errors.videoUrl }}
            </div>
          </div>
          <div class="col-md-12 mt-3">
            <iframe
              class=""
              :class="{ 'd-none': dataLesson.videoUrl.trim().length < 1 }"
              width="100%"
              height="500"
              :src="renderVideo(dataLesson.videoUrl)"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-12">
            <label for="content" class="form-label h5">Nội dung</label>
            <CKEditorComponent v-model="dataLesson.content" />
            <div v-if="errors.content" class="text-danger">
              {{ errors.content }}
            </div>
          </div>
        </div>
        <div class="row mb-3" v-if="dataLesson.type === 'EXERCISES'">
          <div class="col-md-12">
            <label for="contentRefer" class="form-label h5">Ghi chú</label>
            <CKEditorComponent v-model="dataLesson.contentRefer" />
            <div v-if="errors.contentRefer" class="text-danger">
              {{ errors.contentRefer }}
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center mb-4">
        <button type="submit" class="btn btn-primary mx-4">
          {{ isUpdate ? "Cập nhật" : "Tạo mới" }}
        </button>
        <button type="button" class="btn btn-secondary mx-4" @click="goBack">
          Trở về
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import CKEditorComponent from "@components/CKEditor/CKEditorComponent.vue";
import axios from "axios";

const rootAPI = process.env.VUE_APP_ROOT_API;
const route = useRoute();
const router = useRouter();
const isUpdate = ref(false);
const idChapter = route.query.idChapter;
const idCourse = route.query.idCourse;
const linkYoutubeEmbed = "https://www.youtube.com/embed/";

function renderVideo(UrlYoutube) {
  let idVideoYoutube = UrlYoutube.substring(
    UrlYoutube.indexOf("=") + 1,
    UrlYoutube.length
  );
  return linkYoutubeEmbed + idVideoYoutube;
}

function validForm() {
  errors.title = dataLesson.title === "" ? "Tiêu đề yêu cầu nhập" : "";
  errors.content = dataLesson.content === "" ? "Nội Dung yêu cầu nhập" : "";
  if (dataLesson.type === "LECTURES") {
    if (!dataLesson.videoUrl.startsWith("https://www.youtube.com/watch?v=")) {
      errors.videoUrl = "Vui lòng copy link video từ youtube";
    } else {
      errors.videoUrl =
        dataLesson.videoUrl === "" ? "Video Url yêu cầu nhập" : "";
    }
  }

  return errors.title == "" && errors.videoUrl == "" && errors.content == "";
}

const dataLesson = reactive({
  title: "",
  type: "READINGS",
  content: "",
  videoUrl: "",
  contentRefer: "",
  chapterId: idChapter,
});

const errors = reactive({
  title: "",
  type: "",
  videoUrl: "",
  content: "",
  contentRefer: "",
});

const submitLessons = async () => {
  if (!validForm()) {
    return false;
  }
  if (isUpdate.value) {
    try {
      await axios.put(`${rootAPI}/lessons/${dataLesson.id}`, dataLesson);
      toast.success("Cập nhật bài tập thành công", {
        position: "top-right",
        autoClose: 2100,
      });
      setTimeout(() => {
        router.push(
          "/lessons?idChapter=" + idChapter + "&idCourse=" + idCourse
        );
      }, 2100);
    } catch (error) {
      toast.error("Cập nhật bài tập thất bại", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Cập nhật bài tập thất bại:", error);
    }
    return;
  }
  try {
    await axios.post(`${rootAPI}/lessons`, dataLesson);
    toast.success("Thêm bài tập thành công", {
      position: "top-right",
      autoClose: 2000,
    });
    setTimeout(() => {
      router.push("/lessons?idChapter=" + idChapter + "&idCourse=" + idCourse);
    }, 2100);
  } catch (error) {
    if (error.response && error.response.data) {
      const validationErrors = error.response.data; // Lấy lỗi từ phản hồi API
      errors.title = validationErrors.title || ""; // Gán thông báo lỗi vào đối tượng errors
      errors.videoUrl = validationErrors.videoUrl || "";
      errors.content = validationErrors.content || "";
      errors.contentRefer = validationErrors.contentRefer || "";
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Lỗi:", error);
    }
  }
};

const fetchLesson = async (id) => {
  try {
    const response = await axios.get(`${rootAPI}/lessons/${id}`);
    Object.assign(dataLesson, response.data.data);
  } catch (error) {
    console.error("Lấy thông tin bài tập thất bại:", error);
  }
};

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
