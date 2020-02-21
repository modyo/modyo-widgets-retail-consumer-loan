<template>
  <div class="consumer-loan-months-selector">
    <div class="card text-center">
      <div class="card-header px-1">
        <slot name="header">
          Titulo
        </slot>
      </div>
      <div class="card-body py-2">
        <div class="row">
          <div
            v-for="option in options"
            :key="option.label"
            class="col-4 col-md-3 mb-1 p-1">
            <button
              :class="{ active: option.selected }"
              :disabled="isDisabled && !option.selected"
              type="button"
              class="btn btn-light btn-selector btn-block"
              @click="toogleSelection(option)">
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthsSelector',
  props: {
    value: { type: String, required: true },
    maxSelectables: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      options: [
        { label: 'Enero', selected: false },
        { label: 'Febrero', selected: false },
        { label: 'Marzo', selected: false },
        { label: 'Abril', selected: false },
        { label: 'Mayo', selected: false },
        { label: 'Junio', selected: false },
        { label: 'Julio', selected: false },
        { label: 'Agosto', selected: false },
        { label: 'Septiembre', selected: false },
        { label: 'Octubre', selected: false },
        { label: 'Noviembre', selected: false },
        { label: 'Diciembre', selected: false },
      ],
    };
  },
  computed: {
    selectedOptions() {
      return this.options.filter((option) => option.selected === true).map((option) => option.label);
    },
    isDisabled() {
      return this.selectedOptions.length >= this.maxSelectables;
    },
  },
  methods: {
    toogleSelection(selectedOption) {
      const option = selectedOption;
      if (this.selectedOptions.length < this.maxSelectables) {
        option.selected = !option.selected;
      } else {
        option.selected = false;
      }
      this.$emit('input', this.selectedOptions.join());
    },
  },
};
</script>

<style lang="scss">
.consumer-loan-months-selector{
  .card {
    border: 1px solid rgba(0,0,0,.125);
  }
  .card-header {
    padding: .75rem 1.25rem;
  }
  button.btn.btn-selector.btn-block{
    font-size:14px
  }
  button.btn.btn-selector.btn-block.active {
    background: #5cc4ef;
    color: white;
  }
}
</style>
