<template>
  <div class="card shadow-sm border-0 rounded-3 p-3 primary-color">
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <h6 class="mb-0 pb-2" style="height: 40px;">{{ title }}</h6>
        <h3
          class="fw-bold mb-0 pb-2"
        >
          {{ percentage }}
        </h3>
        <small> {{ value }} </small>
      </div>
      <div class="icon-container d-flex justify-content-center align-items-center">
        <i :class="icon" class="fs-5"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatsCard",
  props: {
    title: { type: String, default: "Users" },
    value: { type: String, default: "1,250" },
    percentage: { type: Number, default: 5 },
    icon: { type: String, default: "bi bi-people-fill" }
  }
};
</script>

<style scoped>
.icon-container {
  width: 50px;
  height: 50px;
  background-color: var(--secondary);
  border-radius: 100%;
}
</style>