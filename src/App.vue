<template>
  <div
    id="consumer-loan"
    class="consumer-loan py-lg-5"
    :class="{'h-100': !showSettingsView}">
    <div class="consumer-loan__container container-lg">
      <div class="consumer-loan__row row">
        <loan-settings
          class="col-lg-6" />
        <simulation
          v-if="activeDetailInfo || (!showMinMessage && !showMaxMessage && account)"
          class="col-lg-6" />
        <initial-message
          v-else-if="!showMaxMessage && !activeDetailInfo"
          class="col-lg-6" />
        <max-quota-message
          v-else-if="showMaxMessage"
          class="col-lg-6" />
      </div>
    </div>
  </div>
</template>

<script>
import { getURLParams } from '@modyo/financial-commons';
import { mapState, mapGetters } from 'vuex';
import LoanSettings from './components/LoanSettings/LoanSettings.vue';
import InitialMessage from './components/LoanMessages/InitialMessage.vue';
import MaxQuotaMessage from './components/LoanMessages/MaxQuotaMessage.vue';
import Simulation from './components/LoanSimulation/Simulation.vue';

export default {
  name: 'App',
  components: {
    LoanSettings,
    InitialMessage,
    MaxQuotaMessage,
    Simulation,
  },
  computed: {
    ...mapState(['account']),
    ...mapGetters(['showMinMessage', 'showMaxMessage']),
    activeDetailInfo: {
      get() {
        return this.$store.state.activeDetailInfo;
      },
      set(value) {
        this.$store.commit('SET_ACTIVE_DETAIL_INFO', value);
      },
    },
    showSettingsView: {
      get() {
        return this.$store.state.showSettingsView;
      },
      set(value) {
        this.$store.commit('SET_SHOW_SETTINGS_VIEW', value);
      },
    },
  },
  created() {
    const client = parseInt(getURLParams('client'), 10) || 1;
    this.$store.commit('SET_PARAM_CLIENT_ID', client);
    this.$store.dispatch('DO_DATA_INITIALIZATION');
  },
};
</script>

<style lang="scss" scoped>
@import "./scss/variables.scss";

.consumer-loan__container {
  background-color: #fff;
}

@media (max-width: 991.98px) {
  .consumer-loan {
    background-color: #fff;
  }
}
</style>
