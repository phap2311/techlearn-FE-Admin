<template>
  <div class="modal" v-if="isOpen">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h4>Chi tiết gói hỗ trợ</h4>
      <p v-if="!point.id">Đang tải dữ liệu...</p>
      <div v-if="point.id">
        <p><strong>Tên gói:</strong> {{ point.name }}</p>
        <p><strong>Số lượt hỗ trợ:</strong> {{ point.points }}</p>
        <p>
          <strong>Giá:</strong> {{ formattedPrice }}
          {{ getCurrencyName(point.idCurrency) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

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
    };
  },
  computed: {
    formattedPrice() {
      if (this.point.price == null) return "0";
      const isVND = this.getCurrencyName(this.point.idCurrency) === "VND";
      if (isVND) {
        return new Intl.NumberFormat("vi-VN", {
          style: "decimal",
          minimumFractionDigits: 0,
        }).format(this.point.price);
      } else {
        return new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 0,
        }).format(this.point.price);
      }
    },
  },

  watch: {
    pointId: "fetchPointDetails",
  },
  created() {
    this.fetchCurrencies();
  },
  methods: {
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
    getCurrencyName(currencyId) {
      const currency = this.currencies.find((curr) => curr.id === currencyId);
      return currency ? currency.units : "Không xác định";
    },
    closeModal() {
      this.$emit("close");
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
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  width: 90%;
  position: relative;
  animation: fadeIn 0.3s;
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

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 28px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s;
}

.close:hover {
  color: #d9534f;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

p {
  margin: 10px 0;
  line-height: 1.6;
  color: #555;
}

@media (max-width: 600px) {
  .modal-content {
    padding: 20px;
  }

  .close {
    top: 10px;
    right: 15px;
    font-size: 24px;
  }
}
</style>