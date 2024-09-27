<template>
  <div
    class="modal fade show"
    id="exampleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    style="display: block"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Xác nhận muốn xóa !!!
          </h5>
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click="closeModal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">Bạn có chắc chắn xóa không?</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Đóng
          </button>
          <button type="button" class="btn btn-primary" @click="confirmDelete">
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["confirm", "close"]);

const confirmDelete = () => {
  emit("confirm");
};

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
.modal {
  display: block; /* Giữ modal luôn hiển thị */
}
</style>
