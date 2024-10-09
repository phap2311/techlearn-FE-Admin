<template>
  <div class="modal" v-if="isOpen">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h5>Xác Nhận Xóa</h5>
      <p>Bạn có chắc chắn muốn xóa gói điểm này không?</p>
      <div class="button-container">
        <button @click="confirmDelete">Xóa</button>
        <button @click="closeModal">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    pointId: {
      type: String,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    async confirmDelete() {
      try {
        await this.$emit("delete", this.pointId);
        this.closeModal();
        toast.success("Xóa gói hỗ trợ thành công");
      } catch (error) {
        console.error("Error deleting point:", error);
      }
    },
  },
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  transition: opacity 0.3s ease;
  opacity: 1;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  max-width: 450px;
  width: 90%;
  margin-top: 50px;
  animation: fadeIn 0.3s;
}

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 28px;
  color: #888;
  cursor: pointer;
  transition: color 0.3s;
}

.close:hover {
  color: #ff4d4d;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

button {
  background-color: #e13030;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin-left: 5px;
  transition: background-color 0.3s;
}

button:hover {
  opacity: 0.5;
}

button:last-child {
  background-color: #6c757d;
}

button:last-child:hover {
  background-color: #5a6268;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
