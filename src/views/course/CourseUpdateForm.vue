<template>
  <div class="container">
    <h2 class="mb-4">{{ isUpdate ? 'Cập nhật khóa học' : 'Tạo khóa học mới' }}</h2>
    <form @submit.prevent="submitCourse">
      <div class="mb-3">
        <label for="courseName" class="form-label">Tên khóa học</label>
        <input type="text" class="form-control" id="courseName" v-model="course.name" />
      </div>
      <div class="mb-3">
        <label for="courseDescription" class="form-label">Mô tả khóa học</label>
        <input type="text" class="form-control" id="courseDescription" v-model="course.description" />
      </div>
      <div class="mb-3">
        <label for="coursePrice" class="form-label">Giá</label>
        <input type="number" class="form-control" id="coursePrice" v-model="course.price" />
      </div>
      <div class="mb-3">
        <label for="courseUnit" class="form-label">Đơn vị</label>
        <select class="form-select" id="courseUnit" v-model="course.currencyUnit">
          <option value="VND">VND</option>
          <option value="USD">USD</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="courseImageUrl" class="form-label">Đường dẫn ảnh khóa học</label>
        <input type="url" class="form-control" id="courseImageUrl" v-model="course.thumbnailUrl" />
      </div>
      <div class="mb-3">
        <label for="courseTechStacks" class="form-label">Công nghệ</label>
        <Multiselect
        v-model="course.techStack"
        :options="techStack.data"
        label="name"
        :multiple="true"
        :taggable="true"
        @tag="addTag"
        @remove="removeTag"
        placeholder="Chọn công nghệ"
        />
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
      </div>
      <div class="d-flex justify-content-between mb-3">
        <div class="me-2 flex-grow-1">
          <label for="courseActivation" class="form-label">Kích hoạt</label>
          <select class="form-select" id="courseActivation" v-model="course.isActive">
            <option value=true>Kích hoạt</option>
            <option value=false>Không kích hoạt</option>
          </select>
        </div>
        <div class="ms-2 flex-grow-1">
          <label for="coursePublicity" class="form-label">Trạng thái</label>
          <select class="form-select" id="coursePublicity" v-model="course.isPublic">
            <option value=false>Riêng tư</option>
            <option value=true>Công khai</option>
          </select>
        </div>
        <div class="ms-2 flex-grow-1">
          <label for="coursePublicity" class="form-label">Lượt hỗ trợ</label>
          <input type="number" class="form-control" v-model="course.point"/>
        </div>
      </div>
      <div class="d-flex justify-content-center mb-4">
        <button type="submit" class="btn btn-primary mx-4">{{ isUpdate ? 'Cập nhật' : 'Tạo mới' }}</button>
        <button type="button" class="btn btn-secondary mx-4" @click="goBack">Trở về</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Multiselect from "vue-multiselect";
import { onMounted, reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
    const course = reactive({
      id: null,
      name: '',
      description: '',
      price: 0,
      currencyUnit: 'VND',
      thumbnailUrl: '',
      techStack: [],
      teacher: [],
      isActive: true,
      isPublic: true,
      point: 30,
    });

    const techStack = reactive({
      data: []
    });
    const teachers = reactive({
      data: []  
    });
    const submitCourse = async () => {
      try {
        const courseData = { ...course, techStack: course.techStack.map(tech => tech.id)};
        if (isUpdate.value) {
          await axios.put(`${rootAPI}/courses/${course.id}`, courseData);
          toast.success("Cập nhật khóa học thành công!", {
            autoClose: 1000,
          });
        } else {
          await axios.post(`${rootAPI}/courses`, courseData);
          toast.success("Tạo khóa học mới thành công!", {
            autoClose: 1000,
          });
        }
      } catch (error) {
        toast.error(isUpdate.value ? "Cập nhật khóa học thất bại!" : "Tạo khóa học mới thất bại!", {
          autoClose: 1000,
        });
        console.error('Error submitting course:', error);
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
    const techStackSet = new Set(course.techStack.map(tag => tag.name));
    techStackSet.delete(tagToRemove.name);
    course.techStack = Array.from(techStackSet).map(name => ({ name }));
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
        console.log(response.data.data);
        
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    const fetchTechStack = async () => {
        const response = await axios.get(`${rootAPI}/tech-stacks`);
        techStack.data = response.data.data.items; 
      };

      const fetchTeachers = async () => {
        const response = await axios.get(`${rootAPI}/teachers`);
        teachers.data = response.data.data.items.map(teacher => ({
          id: teacher.id,
          name: teacher.name,       
          avatar: teacher.avatar,
          color:  teacher.color
        }));
        
      }

    onMounted(async () => {
      const { id } = route.params;
      if (id) {
        isUpdate.value = true;
        course.id = id;
        await fetchCourse(id);
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
      removeTeacher    
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin-top: 20px;
}

.btn {
  width: 100px;
  background-color: #0D6EFD;
  border: #ffff;
}

.btn.btn-secondary {
  background-color: #dd8792;
  border: #ffff;
}
</style>