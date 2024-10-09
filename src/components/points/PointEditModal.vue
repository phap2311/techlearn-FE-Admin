<template>
  <div class="modal" v-if="isOpen">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Sửa gói hỗ trợ</h2>
      <form @submit.prevent="submitEdit" novalidate>
        <div class="form-group">
          <label for="name">Tên gói:</label>
          <input
            type="text"
            v-model="point.name"
            id="name"
            required
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
          />
          <div v-if="errors.name" class="invalid-feedback">
            {{ errors.name }}
          </div>
        </div>
        <div class="form-group flex-group">
          <div class="flex-item points">
            <label for="points">Số lượt:</label>
            <input
              type="number"
              v-model="point.points"
              id="points"
              required
              class="form-control"
              :class="{ 'is-invalid': errors.points }"
            />
            <div v-if="errors.points" class="invalid-feedback">
              {{ errors.points }}
            </div>
          </div>
          <div class="flex-item price">
            <label for="price">Giá:</label>
            <input
              type="text"
              :value="formattedPrice"
              id="price"
              required
              class="form-control"
              @input="onPriceInput($event.target.value)"
              :class="{ 'is-invalid': errors.price }"
            />
            <div v-if="errors.price" class="invalid-feedback">
              {{ errors.price }}
            </div>
          </div>

          <div class="flex-item currency">
            <label for="idCurrency">Đơn vị:</label>
            <div class="select-wrapper">
              <select
                v-model="point.idCurrency"
                id="idCurrency"
                required
                class="form-control"
                :class="{ 'is-invalid': errors.idCurrency }"
                style="height: 48px"
              >
                <option value="" disabled hidden>Chọn loại tiền tệ</option>
                <option
                  v-for="currency in currencies"
                  :key="currency.id"
                  :value="currency.id"
                >
                  {{ currency.units }}
                </option>
              </select>
              <span class="select-arrow">&#9662;</span>
            </div>
            <div v-if="errors.idCurrency" class="invalid-feedback">
              {{ errors.idCurrency }}
            </div>
          </div>
        </div>
        <button type="submit" class="btn">Lưu</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
  data() {
    return {
      point: {},
      currencies: [],
      errors: {},
    };
  },
  watch: {
    pointId: "fetchPointDetails",
  },
  created() {
    this.fetchCurrencies();
  },
  methods: {
    async fetchCurrencies() {
      try {
        const response = await axios.get(
          `http://localhost:8282/api/v1/currencies`
        );
        this.currencies = response.data;
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    },
    async fetchPointDetails() {
      if (this.pointId) {
        try {
          const response = await axios.get(
            `http://localhost:8282/api/v1/points/${this.pointId}`
          );
          this.point = response.data;
        } catch (error) {
          console.error("Error fetching point details:", error);
        }
      }
    },
    validate() {
      this.errors = {};
      if (!this.point.name) {
        this.errors.name = "Tên gói là bắt buộc.";
      }
      if (!this.point.points) {
        this.errors.points = "Số điểm là bắt buộc.";
      } else if (this.point.points <= 0) {
        this.errors.points = "Số điểm phải lớn hơn 0.";
      }
      if (!this.point.price) {
        this.errors.price = "Giá là bắt buộc.";
      } else if (this.point.price <= 0) {
        this.errors.price = "Giá phải lớn hơn 0.";
      }
      if (!this.point.idCurrency) {
        this.errors.idCurrency = "Vui lòng chọn loại tiền tệ.";
      }
      return Object.keys(this.errors).length === 0;
    },
    async submitEdit() {
      if (this.validate()) {
        try {
          await axios.put(
            `http://localhost:8282/api/v1/points/${this.pointId}`,
            this.point
          );
          toast.success("Sửa gói hỗ trợ thành công");
          this.closeModal();
          this.$emit("updated");
        } catch (error) {
          console.error("Error updating point:", error);
        }
      }
    },
    closeModal() {
      this.$emit("close");
    },
    formatPrice(price, currency) {
      if (price === null || price === undefined) return "";

      if (currency === "VND") {
        return new Intl.NumberFormat("vi-VN").format(price);
      } else {
        return new Intl.NumberFormat("en-US").format(price);
      }
    },
    parsePrice(value) {
      return Number(value.replace(/[.,]/g, ""));
    },
    onPriceInput(value) {
      this.point.price = this.parsePrice(value);
    },
  },
  computed: {
    formattedPrice() {
      return this.formatPrice(this.point.price, this.point.idCurrency);
    },
  },
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  transition: opacity 0.3s ease;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  position: relative;
  width: 600px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.5s ease;
  height: auto;
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 28px;
  color: #333;
  cursor: pointer;
}

.flex-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-item {
  flex: 1;
  margin-right: 10px;
}

.flex-item:last-child {
  margin-right: 0;
}
.points {
  flex: 3;
}

.price {
  flex: 4;
}

.currency {
  flex: 4;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  height: 48px;
}

select.form-control {
  height: 48px;
}

.is-invalid {
  border-color: red;
}

.invalid-feedback {
  color: red;
  font-size: 12px;
}

.btn {
  padding: 10px 14px;
  border: none;
  border-radius: 4px;
  color: #fff;
  background-color: #007bff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}
.form-control,
.form-control:focus,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  height: 48px;
}

.flex-item {
  flex: 1;
  margin-right: 10px;
}

.flex-item:last-child {
  margin-right: 0;
}
.select-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.select-arrow {
  position: absolute;
  top: 5px;
  right: 10px;
  pointer-events: none;
  font-size: 25px;
  color: #000000;
}
.select-wrapper:hover .select-arrow {
  transform: rotate(180deg);
}
</style>
