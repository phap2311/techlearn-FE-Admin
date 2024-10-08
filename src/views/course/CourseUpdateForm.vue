<template>
  <div class="container">
    <h2 class="mb-4">
      {{ isUpdate ? "Cập nhật khóa học" : "Tạo khóa học mới" }}
    </h2>
    <form @submit.prevent="submitCourse">
      <div class="mb-3">
        <label for="courseName" class="form-label">Tên khóa học</label>
        <input
          type="text"
          class="form-control"
          id="courseName"
          v-model="course.name"
        />
        <span v-if="course.errors.name" class="text-danger">{{
          course.errors.name
        }}</span>
      </div>
      <div class="mb-3">
        <label for="courseDescription" class="form-label">Mô tả khóa học</label>
        <input
          type="text"
          class="form-control"
          id="courseDescription"
          v-model="course.description"
        />
        <span v-if="course.errors.description" class="text-danger">{{
          course.errors.description
        }}</span>
      </div>
      <div class="price-container">
        <div class="mb-3" style="flex: 1">
          <label for="coursePrice" class="form-label">Giá</label>
          <input
            type="text"
            class="form-control"
            id="coursePrice"
            v-model="priceTemp"
            @input="handleChange"
          />
          <span v-if="course.errors.price" class="text-danger">{{
            course.errors.price
          }}</span>
        </div>
        <div class="mb-3" style="flex: 1">
          <label class="form-label">Đơn vị</label>
          <div class="d-flex gap-3 align-items-center mt-2">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="currencyUnit"
                id="vnd"
                value="VND"
                v-model="course.currencyUnit"
              />
              <label class="form-check-label" for="vnd">VND</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="currencyUnit"
                id="usd"
                value="USD"
                v-model="course.currencyUnit"
              />
              <label class="form-check-label" for="usd">USD</label>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3 image-container">
        <label for="courseImageUrl" class="form-label">Chọn ảnh khóa học</label>
        <div class="upload-area-container" v-if="showUploadArea">
          <input
            @change="handleUploadImage"
            type="file"
            id="fileInput"
            style="display: none"
          />
          <label
            for="fileInput"
            style="
              cursor: pointer;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            "
          >
            <img
              class="img-upload"
              src="../../../public/upload_area.png"
              alt=""
            />
            <p>Chọn ảnh của khóa học</p>
          </label>
        </div>
        <div class="uploaded-image-container" v-if="course.thumbnailUrl">
          <img
            :src="thumbnailImage"
            alt="Uploaded Course Image"
            class="uploaded-image"
          />
          <button class="remove-btn" @click="removeImage">X</button>
        </div>
        <span v-if="course.errors.thumbnailUrl" class="text-danger">{{
          course.errors.thumbnailUrl
        }}</span>
      </div>
      <div class="mb-3">
        <label for="courseTechStacks" class="form-label">Công nghệ</label>
        <Multiselect
          v-model="course.techStack"
          :options="techStack.data"
          label="name"
          track-by="id"
          :multiple="true"
          :taggable="true"
          @tag="addTag"
          @remove="removeTag"
          placeholder="Chọn công nghệ"
        />
        <span v-if="course.errors.techStack" class="text-danger">{{
          course.errors.techStack
        }}</span>
      </div>
      <div class="mb-3">
        <label for="supporter" class="form-label">Giảng viên</label>
        <Multiselect
          v-model="course.teacher"
          :options="teachers.data"
          label="name"
          track-by="id"
          :multiple="true"
          :taggable="true"
          @tag="addTeacher"
          @remove="removeTeacher"
          placeholder="Chọn người hỗ trợ"
        />
        <span v-if="course.errors.teacher" class="text-danger">{{
          course.errors.teacher
        }}</span>
      </div>
      <div class="d-flex justify-content-between mb-3">
        <div class="me-2 flex-grow-1 d-flex gap-2 align-items-center">
          <div class="d-flex flex-column">
            <label class="form-label">Trạng thái</label>
            <div class="d-flex flex-row gap-3">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="courseActivation"
                  id="activated"
                  value="true"
                  v-model="course.isActive"
                />
                <label class="form-check-label" for="activated">
                  Kích hoạt
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="courseActivation"
                  id="deactivated"
                  value="false"
                  v-model="course.isActive"
                />
                <label class="form-check-label" for="deactivated">
                  Không kích hoạt
                </label>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="ms-2 flex-grow-1">
          <label for="coursePublicity" class="form-label">Trạng thái</label>
          <select
            class="form-select"
            id="coursePublicity"
            v-model="course.isPublic"
          >
            <option value="false">Riêng tư</option>
            <option value="true">Công khai</option>
          </select>
        </div> -->
        <div class="ms-2 flex-grow-1">
          <label for="coursePublicity" class="form-label">Lượt hỗ trợ</label>
          <input
            type="number"
            class="form-control"
            v-model="course.point"
            required
          />
        </div>
        <div class="ms-2 flex-grow-1">
          <label for="coursePublicity" class="form-label"
            >Lượt hỗ trợ công khai</label
          >
          <input type="number" class="form-control" required />
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

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { watch } from "vue";

export default {
  components: {
    Multiselect,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const rootAPI = process.env.VUE_APP_ROOT_API;
    const supporters = ref([]);
    const isUpdate = ref(false);
    const showUploadArea = ref(true);
    const priceTemp = ref(0);
    const thumbnailImage = ref();
    const course = reactive({
      id: null,
      name: "",
      description: "",
      price: 0,
      currencyUnit: "VND",
      thumbnailUrl: "",
      techStack: [],
      teacher: [],
      isActive: true,
      isPublic: true,
      point: 30,
      errors: {
        name: "",
        description: "",
        price: "",
        thumbnailUrl: "",
        techStack: "",
        teacher: "",
      },
    });

    const techStack = reactive({
      data: [],
    });
    const teachers = reactive({
      data: [],
    });

    const submitCourse = async () => {
      try {
        // course.price = priceTemp.value;
        if (course.currencyUnit === "VND") {
          course.price = priceTemp.value.replace(/\./g, "");
        } else {
          course.price = priceTemp.value.replace(/\,/g, "");
        }
        const formData = new FormData();
        formData.append("name", course.name);
        formData.append("price", course.price);
        formData.append("point", course.point);
        formData.append("description", course.description);
        formData.append("currencyUnit", course.currencyUnit);
        formData.append("isActive", course.isActive);

        course.techStack.forEach((tech) => {
          formData.append("techStack", tech.id);
        });
        course.teacher.forEach((tch) => {
          formData.append("teacher", tch.id);
        });
        console.log(course);
        if (typeof course.thumbnailUrl === "object") {
          formData.append("file", course.thumbnailUrl);
        }
        if (isUpdate.value) {
          await axios.put(`${rootAPI}/courses/${course.id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Cập nhật khóa học thành công!", {
            autoClose: 1000,
          });
        } else {
          await axios.post(`${rootAPI}/courses`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Tạo khóa học mới thành công!", {
            autoClose: 500,
          });
        }
        setTimeout(() => {
          goBack();
        }, 1000);
      } catch (error) {
        if (error.response && error.response.data) {
          const validationErrors = error.response.data;
          course.errors = {
            name: validationErrors.name || "",
            description: validationErrors.description || "",
            price: validationErrors.price || "",
            thumbnailUrl: validationErrors.thumbnailUrl || "",
            techStack: validationErrors.techStack || "",
            teacher: validationErrors.teacher || "",
          };
        }
        toast.error(
          isUpdate.value
            ? "Cập nhật khóa học thất bại!"
            : "Tạo khóa học mới thất bại!",
          {
            autoClose: 1000,
          }
        );
        console.error("Error submitting course:", error);
      }
    };

    const goBack = () => {
      router.go(-1);
    };

    const addTag = (newTag) => {
      course.techStack.push({ name: newTag });
    };
    const addTeacher = (newTeacher) => {
      course.teacher.push({ name: newTeacher });
    };

    const removeTag = (tagToRemove) => {
      const techStackMap = new Map(
        course.techStack.map((tag) => [tag.name, tag])
      );
      techStackMap.delete(tagToRemove.name);
      course.techStack = Array.from(techStackMap.values());
    };

    const removeTeacher = (tToRemove) => {
      const teacherSet = new Set(course.teacher);
      teacherSet.delete(tToRemove.name);
      course.teacher = Array.from(teacherSet);
    };

    const fetchCourse = async (id) => {
      try {
        const response = await axios.get(`${rootAPI}/courses/${id}`);
        Object.assign(course, response.data.data);
        priceTemp.value = formatCurrency(course.price, course.currencyUnit);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    const fetchTechStack = async () => {
      const response = await axios.get(`${rootAPI}/tech-stacks`);
      techStack.data = response.data.data.items;
    };

    const fetchTeachers = async () => {
      const response = await axios.get(`${rootAPI}/teachers`);
      teachers.data = response.data.data.items.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        avatar: teacher.avatar,
        color: teacher.color,
      }));
    };

    const handleUploadImage = (event) => {
      const file = event.target.files[0];
      course.thumbnailUrl = file;
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          thumbnailImage.value = e.target.result;
        };
        // console.log(course.thumbnailUrl);
        reader.readAsDataURL(file);
        showUploadArea.value = false;
      } else {
        alert("Vui lòng chọn một ảnh hợp lệ.");
      }
    };

    const removeImage = () => {
      // imageUrl.value = null;
      course.thumbnailUrl = null;
      showUploadArea.value = true;
    };

    watch(
      () => course.currencyUnit,
      (newValue) => {
        priceTemp.value = formatCurrency(course.price, newValue);
      }
    );

    const handleChange = () => {
      priceTemp.value = formatCurrency(priceTemp.value, course.currencyUnit);
    };

    const formatCurrency = (value, unit) => {
      value = value.toString();
      if (unit == "VND") {
        value = value.replace(/\./g, "");
      } else {
        value = value.replace(/\,/g, "");
      }
      if (typeof value !== "number" && value !== "") {
        value = parseFloat(value);
      } else {
        return 0;
      }
      var formatter;
      switch (unit) {
        case "USD":
          formatter = new Intl.NumberFormat("en-US", {
            style: "decimal",
            currency: "USD",
          });
          return formatter.format(value).replace("$", "");
        case "VND":
          formatter = new Intl.NumberFormat("vi-VN", {
            style: "decimal",
            currency: "VND",
          });
          return formatter.format(value);
      }
    };

    onMounted(async () => {
      const { id } = route.params;
      if (id) {
        isUpdate.value = true;
        course.id = id;
        await fetchCourse(id);
      }
      thumbnailImage.value = course.thumbnailUrl;
      priceTemp.value = formatCurrency(priceTemp.value, course.currencyUnit);
      if (course.thumbnailUrl) {
        showUploadArea.value = false;
      }
      await fetchTechStack();
      await fetchTeachers();
    });

    return {
      course,
      techStack,
      teachers,
      isUpdate,
      submitCourse,
      goBack,
      addTag,
      removeTag,
      addTeacher,
      removeTeacher,
      handleUploadImage,
      showUploadArea,
      removeImage,
      formatCurrency,
      priceTemp,
      thumbnailImage,
      handleChange,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin-top: 20px;
}

.btn {
  width: 100px;
  background-color: #0d6efd;
  border: #ffff;
}

.btn.btn-secondary {
  background-color: #d44a4a;
  border: #ffff;
}
.btn.btn-secondary:hover {
  background-color: #d42c43;
}

.price-container {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.image-container {
  display: flex;
  flex-direction: column;
}
.img-upload {
  width: 80px;
  height: auto;
}
.upload-area-container {
  border: 2px dashed rgb(157, 136, 136);
  flex: 1;
  height: auto;
  display: flex;
  justify-content: center;
}
.uploaded-image-container {
  position: relative;
  display: inline-block;
}
.uploaded-image {
  width: 100%;
  height: auto;
}
.remove-btn {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50px;
  padding: 4px 12px;
  cursor: pointer;
  background: transparent;
  color: white;
  border: 1px;
}
</style>
