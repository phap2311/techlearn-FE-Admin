<template>
  <div class="container">
    <p class="header-text">Dash Board</p>
    <div class="informations">
      <div class="infor-container">
        <p class="title">Số lượng học viên</p>
        <p class="quantity">26</p>
      </div>
      <div class="infor-container">
        <p class="title">Số lượng khóa học</p>
        <p class="quantity">12</p>
      </div>
      <div class="infor-container">
        <p class="title">Số lượng lớp học</p>
        <p class="quantity">4</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 150px;
  margin-top: 30px;
  background-color: white;
  color: black;
}
.header-text {
  font-weight: 600;
  font-size: 23px;
  margin-left: 20px;
}
.informations {
  margin-left: 100px;
  margin-right: 100px;
  display: flex;
  justify-content: space-between;
  gap: 30px;
}
.infor-container {
  background-color: white;
  border: 2px solid rgb(156, 148, 148);
  border-radius: 10px;
  width: 300px;
  padding: 10px;
}
.title {
  font-size: 21px;
  color: #b8acac;
}
</style>
