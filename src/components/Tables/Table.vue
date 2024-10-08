<template>
  <div class="container-fluid">
    <div class="container-fluid my-3 px-3">
      
     
      <table class="table table-hover table-striped w-100">
        <thead class="thead-lb">
          <tr>
            <th class="" v-for="(header, index) in props.header" :key="index"
              :class="{ 
                'd-none' : widthScreen<1000 && header ==='Giá tiền' ||  widthScreen<1000 && header ==='Đơn vị',
                'text-center': header === 'STT', 'table-price': header === 'Giá tiền'
                        
               }"
              
              >
              {{ header }}
            </th>
            
          </tr>
          <!-- <tr v-if="widthScreen>700" ></tr> -->
        </thead>
        <draggable tag="tbody" v-if="isDraggable" :list="props.data" :disabled="!enabled" ghost-class="ghost"
          :move="checkMove" @start="dragging = true" @end="(evt) => {
            dragging = false;
            emit('updateOrder', props.data);
          }
            ">
          <template #item="{ element, index }">
            <tr :key="element.id" class="w-100 drag-item">
              <th scope="row" class="text-center">
                {{ (currentPage - 1) * props.perPage + index + 1 }}
              </th>
              <td v-for="(key, keyIndex) in props.keys" :key="keyIndex">
                {{ element[key] || "N/A" }}
              </td>
              <td v-if="viewPublic">
                {{ element.isPublic ? "Công khai" : "Riêng tư" }}
              </td>
            </tr>
          </template>
        </draggable>
        <template v-else>
          <tbody>
            <tr v-for="(item, index) in props.data" :key="item.id">
              <th scope="row" class="text-center">
                {{ (currentPage - 1) * props.perPage + index + 1 }}
              </th>
              <td v-for="(key, keyIndex) in props.keys" :key="keyIndex" :class="{ 'd-none' : widthScreen<1000 && key ==='price' ||  widthScreen<1000 && key ==='currencyUnit',  'table-price': key === 'price' }">
                <template v-if="key === 'name'">
                  <router-link :to="props.actions.view(item)" class="course-name-link">
                    {{ item[key] || 'N/A' }}
                  </router-link>
                </template>
                <template v-else>
                  {{ item[key] || "N/A" }}
                </template>
              </td>
              <td class="action-button">
                <router-link v-if="viewDetail" :to="props.actions.view(item)" class="btn btn-primary btn-sm btn-action">
                  <i class="fas fa-eye"></i>
                </router-link>
                <router-link :to="props.actions.edit(item)" class="btn btn-warning btn-sm btn-action">
                  <i class="fas fa-edit"></i>
                </router-link>
                <router-link to="" @click="confirmDelete(item)" class="btn btn-danger btn-sm btn-action">
                  <i class="fas fa-trash"></i>
                </router-link>
              </td>
            </tr>
          </tbody>
        </template>
      </table>
      <b-pagination v-if="totalRows > 0" class="pagination" v-model="currentPage" :total-rows="totalRows" :per-page="1"
        aria-controls="my-table" first-number last-number @change="pageChanged" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";
import "@fortawesome/fontawesome-free/css/all.css";
import draggable from "vuedraggable";

const props = defineProps({
  header: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  keys: {
    type: Array,
    required: true,
  },
  actions: {
    type: Object,
    required: true,
  },
  isDraggable: {
    type: Boolean,
    default: false,
  },
  totalRows: {
    type: Number,
    required: false,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  viewPublic: {
    type: Boolean,
    default: true,
  },
  viewDetail: {
    type: Boolean,
    default: true,
  },
});

var widthScreen = ref(9999) ;

window.addEventListener('resize', function() {
     widthScreen.value = window.innerWidth || document.documentElement.clientWidth;
  
});


const currentPage = ref(1);

const emit = defineEmits(["updateOrder", "deleteItem", "pageChange"]);
const enabled = true;
const dragging = ref(false);

function checkMove(evt) {
  return true;
}

const confirmDelete = (item) => {
  emit("deleteItem", item);
};

watch(currentPage, (newPage) => {
  pageChanged();
});

const pageChanged = () => {
  emit("pageChange", currentPage.value);
};

</script>

<style scoped>
.action-button {
  display: flex;
  gap: 8px;
}

.table {
  width: 95%;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

th,
td {
  vertical-align: middle;
}

.container-fluid {
  padding-left: 10px;
  padding-right: 10px;
}

.ghost {
  background-color: #f8f9fa;
}

.drag-item {
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center !important;
}

.table-price {
  text-align: right;
  padding-right: 50px;
}

.course-name-link {
  color: #020202;
  text-decoration: none;
}
</style>
