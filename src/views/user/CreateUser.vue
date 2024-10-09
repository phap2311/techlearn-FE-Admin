<template>

  <div class="container-fluid p-5">
  <div class="card no-border">
  <div class="card-header mt-2">
      <h4 class="card-title">Thêm thông tin người dùng</h4>
  </div>
  <div class="card-body">
      <form @submit.prevent="submitForm">
          <div class="row">
          <div class="col-md-7 row">
                <div class="form-group">
                  <!-- <label for="fullName">Họ và tên</label>
                  <input type="text" id="fullName" v-model="fullName" class="form-control" placeholder="Nhập họ và tên" required> -->
                  <label for="fullName">Họ và tên:</label>
                  <input id="fullName" v-model="fullName" type="text" class="form-control" placeholder="Hãy Nhập Tên" />
                  <span class="error-message">{{ nameError }}</span>
              </div>
                <div class="form-group">
                  <label>Vai trò:</label>
                  <Multiselect
                    v-model="role.value"
                    :options="listRole.data"
                    label="name"
                    track-by="id"
                    @remove="removeTeacher"
                    placeholder="Chọn vai trò"
                  />
                      <!-- <select class="selectpicker form-control custom-select" data-style="py-0">
                          <option>Học viên</option>
                          <option>Giảng viên</option>
                          <option>Người hỗ trợ</option>
                      </select> -->
                </div>

              <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" v-model="email" class="form-control" placeholder="Nhập Email">
                  <span class="error-message">{{ emailError }}</span>
              </div>
          </div>
          <div class="col-md-5">
              <div class="image-preview-container">
                  <img :src="imagePreview" alt="Ảnh xem trước" class="image-preview" />
                  <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="d-none">
                  <button type="button" @click="triggerFileInput" class="btn btn-secondary mt-3">Chọn ảnh</button>
              </div>
          </div>
          </div>
                  <div class="d-flex justify-content-center"> 
                      <button type="submit" class="btn btn-primary me-2">Thêm mới</button> 
                      <button @click="goToUserPage" class="btn btn-danger">Hủy</button>
                  </div>
              </form>
          </div>
      </div>
  </div>
</template>

<script setup>
import router from '@/router';
import axios from 'axios';
import { useField, useForm } from 'vee-validate';
import { onMounted, reactive, ref } from 'vue';
import * as yup from 'yup';
import Multiselect from 'vue-multiselect';
import { toast } from "vue3-toastify";

const rootAPI = process.env.VUE_APP_ROOT_API;
const imagePreview = ref('');
const fileInput = ref(null);
const listRole = reactive ({
  data: []
})
const  avatarFile= ref();
const role = ref([]);
const triggerFileInput = () => {
fileInput.value.click();
};
const {handleSubmit, resetForm} = useForm ({
  validationSchema: yup.object({
    fullName: yup
    .string()
    .required('*Hãy nhập tên')
    .matches(/^[\p{L}\s]+$/u, "*Chỉ chứa kí tự chữ và khoảng trắng"),
    email: yup
    .string()
    .required("* Hãy nhập email")
    .matches(/^[a-zA-Z]+[0-9]*@gmail\.com$/, "* Email không đúng định dạng")
  })
})
const { value: fullName, errorMessage: nameError } = useField('fullName');
const { value: email, errorMessage: emailError } = useField('email');
const handleFileChange = (event) => {
const file = event.target.files[0];
if (file ) {
  avatarFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
    imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
}
};

const getAllRole = async () => {
  try {
    const res = await axios.get(`${rootAPI}/roles`);
    listRole.data = res.data;
  }catch(err) {
    console.log(err);
  }
}

const submitForm = handleSubmit(async(values) => {
  const selectedRoles = role.value.value.name;
  console.log(role.value.value.name);
  
  const formData = new FormData();
  formData.append('fullName', fullName._value);
  formData.append('email', email._value);
  formData.append('password', '123456');
  formData.append('roles', selectedRoles);
  formData.append('avatar',  avatarFile.value);
  console.log(formData);
  try {
    const res = await axios.post(`${rootAPI}/users`,formData,{
      headers: {
              "Content-Type": "multipart/form-data",
      },
    })
    console.log(res);
    if(res.status === 200) {
      toast.success("Thêm mới thành công");
      setTimeout(() => {
          goBack();
        }, 2000);
    }

  }catch(err){
    toast.error("Thêm mới thất bại");
  }
});
const goBack = () => {
      router.go(-1);
    };


const goToUserPage = () => {
  router.push("/user")
}

onMounted(async () => {
  await getAllRole();
})
</script>

<style scoped>
.error-message {
  color: #dc3545;
  font-size: 0.875rem;
}
.custom-select {
    height: auto !important;
}


.container-fluid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  overflow-x: hidden;
  overflow-y: hidden;
}

.card.no-border {
  box-shadow: none; 
  border: none;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem;
}

.card-title {
  margin-bottom: 0;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-control {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
}

.btn {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.image-preview-container {
    margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 60%;
  width: 60%;
  margin-left: 5rem;
}

.image-preview {
  width: 100%;
  height: 300px; 
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.small-image {
  max-width: 150px; 
  max-height: 150px;
}

.mt-4.d-flex.justify-content-between {
  display: flex;
  justify-content: space-between;
}

  </style>