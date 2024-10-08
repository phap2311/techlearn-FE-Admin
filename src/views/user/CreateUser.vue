<template>
    <div class="container-fluid p-5">
    <div class="mb-4 d-flex justify-content-between align-items-center">
    <router-link to="/user" class="text-decoration-none">
        <div class="d-flex align-items-center gap-2">
        <i class="fa-solid fa-arrow-left text-dark"></i>
        <p class="mb-0 text-dark">Quản lý người dùng</p>
        </div>
    </router-link>
    </div>
    <div class="card no-border">
    <div class="card-header mt-2">
        <h4 class="card-title">Thêm thông tin người dùng</h4>
    </div>
    <div class="card-body">
        <form @submit.prevent="submitForm">
            <div class="row">
            <div class="col-md-7">
                <div class="form-group">
                        <label for="fullName">Họ và tên</label>
                        <input type="text" id="fullName" v-model="fullName" class="form-control" placeholder="Nhập họ và tên" required>
                </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" v-model="email" class="form-control" placeholder="Nhập Email" required>
                </div>
                    <div class="form-group">
                        <label for="password">Mật khẩu</label>
                        <input type="password" id="password" v-model="password" class="form-control" placeholder="Nhập mật khẩu" required>
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
                        <button type="reset" class="btn btn-outline-danger">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const fullName = ref('');
const email = ref('');
const password = ref('');
const imagePreview = ref('https://i.pinimg.com/564x/b6/9d/ed/b69dedbefb0f4516cc537b67519db790.jpg');
const fileInput = ref(null);

    const triggerFileInput = () => {
    fileInput.value.click();
    };

    const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
        imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    };

    const submitForm = () => {
    console.log( { fullName: fullName.value, email: email.value, password: password.value });
    };
</script>

<style scoped>
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

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
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