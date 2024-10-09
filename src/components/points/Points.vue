<template>
  <div class="points container">
    <div
      class="header-points d-flex justify-content-between align-items-center my-3"
    >
      <p class="course-list-title h4">Danh sách gói hỗ trợ</p>
      <button class="btn btn-primary" @click="openCreateModal">Thêm Mới</button>
      <PointCreateModal
        :isOpen="isCreateModalOpen"
        @close="closeCreateModal"
        @created="handleCreated"
      />
    </div>

    <table class="table table-hover table-bordered">
      <thead class="thead-light">
        <tr>
          <th>STT</th>
          <th>Tên gói</th>
          <th>Số điểm</th>
          <th class="text-center price-cell">
            <div class="price-content">Giá tiền</div>
          </th>
          <th>Đơn vị</th>
          <th class="text-center actions-header">
            <div>Hành động</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="items.length === 0">
          <td colspan="6" class="text-center">Không có gói điểm nào.</td>
        </tr>
        <tr v-for="(point, index) in items" :key="point.id">
          <td>{{ (page - 1) * pageSize + index + 1 }}</td>
          <td>{{ point.name }}</td>
          <td>{{ point.points }}</td>
          <td class="text-center price-cell">
            <div class="price-content">
              {{
                formatPrice(
                  Number(point.price).toString(),
                  getCurrencyName(point.idCurrency)
                )
              }}
            </div>
          </td>

          <td>{{ getCurrencyName(point.idCurrency) }}</td>
          <td class="justify-content-start">
            <button
              class="btn btn-primary btn-sm btn-action"
              @click="handleDetail(point.id)"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              class="btn btn-warning btn-sm btn-action"
              @click.prevent="handleEdit(point.id)"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              class="btn btn-danger btn-sm btn-action"
              @click.prevent="handleDelete(point.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <PointEditModal
      :isOpen="isEditModalOpen"
      :pointId="selectedPointId"
      :currencies="currencies"
      @close="
        isEditModalOpen = false;
        selectedPointId = null;
      "
      @updated="fetchPoints"
    />

    <PointDetailModal
      :isOpen="isDetailModalOpen"
      :pointId="selectedPointIdForDetail"
      :currencies="currencies"
      @close="
        isDetailModalOpen = false;
        selectedPointIdForDetail = null;
      "
    />

    <ConfirmDeleteModal
      :isOpen="isDeleteModalOpen"
      :pointId="selectedPointIdForDelete"
      @close="
        isDeleteModalOpen = false;
        selectedPointIdForDelete = null;
      "
      @delete="deletePoint"
    />

    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click.prevent="prevPage"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          class="page-item"
          v-for="pageNumber in totalPage"
          :key="pageNumber"
          :class="{ active: page === pageNumber }"
        >
          <a class="page-link" href="#" @click.prevent="setPage(pageNumber)">{{
            pageNumber
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: page === totalPage }">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="nextPage"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>


<script>
import axios from "axios";
import PointEditModal from "./PointEditModal.vue";
import PointDetailModal from "./PointDetailModal.vue";
import ConfirmDeleteModal from "./ConfirmDeleteModal.vue";
import PointCreateModal from "./PointCreateModal.vue";

export default {
  components: {
    PointEditModal,
    PointDetailModal,
    ConfirmDeleteModal,
    PointCreateModal,
  },
  data() {
    return {
      page: 1,
      pageSize: 8,
      totalPage: 1,
      items: [],
      currencies: [],
      isEditModalOpen: false,
      selectedPointId: null,
      isDetailModalOpen: false,
      selectedPointIdForDetail: null,
      isDeleteModalOpen: false,
      selectedPointIdForDelete: null,
      isCreateModalOpen: false,
    };
  },
  created() {
    this.fetchPoints();
    this.fetchCurrencies();
  },
  methods: {
    async fetchPoints() {
      try {
        const response = await axios.get(
          `http://localhost:8282/api/v1/points?page=${this.page}&pageSize=${this.pageSize}`
        );
        this.items = response.data.items;
        this.totalPage = response.data.totalPage;
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    },
    setPage(pageNumber) {
      this.page = pageNumber;
      this.fetchPoints();
    },
    nextPage() {
      if (this.page < this.totalPage) {
        this.page++;
        this.fetchPoints();
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchPoints();
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
    getCurrencyName(idCurrency) {
      const currency = this.currencies.find((c) => c.id === idCurrency);
      return currency ? currency.units : "Không có";
    },
    openCreateModal() {
      this.isCreateModalOpen = true;
    },
    closeCreateModal() {
      this.isCreateModalOpen = false;
    },
    handleCreated() {
      this.closeCreateModal();
      this.fetchPoints();
    },
    handleEdit(id) {
      this.selectedPointId = id;
      this.isEditModalOpen = true;
    },
    handleDetail(id) {
      this.selectedPointIdForDetail = id;
      this.isDetailModalOpen = true;
    },
    handleDelete(id) {
      this.selectedPointIdForDelete = id;
      this.isDeleteModalOpen = true;
    },
    async deletePoint(id) {
      try {
        await axios.delete(`http://localhost:8282/api/v1/points/${id}`);
        this.fetchPoints();
      } catch (error) {
        console.error("Error deleting point:", error);
      }
    },
    formatPrice(price, currency) {
      if (currency === "VND") {
        return new Intl.NumberFormat("vi-VN").format(price);
      } else {
        return new Intl.NumberFormat("en-US").format(price);
      }
    },
  },
};
</script>

<style scoped>
.btn-action {
  margin-right: 8px;
}

.points {
  max-width: 1173px;
  margin: 0 auto;
  margin-top: 45px;
}

.table th,
.table td {
  vertical-align: middle;
  text-align: center;
  border: none;
}

.header-points {
  padding: 10px 0;
}

.pagination {
  display: flex;
  align-items: center;
}

.course-list-title {
  font-weight: bold;
}

thead {
  background-color: #f8f9fa;
}

thead th {
  font-weight: bold;
}
.course-list-title {
  font-weight: 600;
  font-size: 25px;
  margin: 0;
}
.create-course-btn {
  margin-right: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.align-middle {
  color: #f8f9fa;
  background-color: #007bff;
  align-items: center;
  justify-items: center;
}

.price-cell {
  display: flex;
  justify-content: center;
  padding-right: 20px;
}

.price-content {
  margin-left: auto;
}
</style>

