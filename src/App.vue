<template>
  <div
    id="consumer-loan"
    class="consumer-loan py-lg-5"
    :class="{'h-100': !showSettingsView}">
    <div class="consumer-loan__container container">
      <div class="consumer-loan__row row">
        <div
          v-if="showSettingsView"
          class="col-lg-6 p-5 d-flex flex-column d-lg-block">
          <h2 class="mb-4 text-primary">
            {{ $t('main.title') }}
          </h2>
          <div class="form-group">
            <label for="">{{ $t('main.credit-amount') }}</label>
            <money
              v-model="amount"
              class="d-block form-control"
              v-bind="{decimal: ',', thousands: '.', prefix: '$ ', precision: 0, masked: false}"
              @input="calculateLoan" />
            <small class="d-block mt-2">{{ $t('main.minimum-credit-msg', {amount: '$100.000'}) }}</small>
          </div>

          <div class="form-group">
            <label for="">{{ $t('main.fees') }}</label>
            <vue-slider
              v-model.number="payments"
              class="mb-5"
              :disabled="isRangeDisabled"
              :marks="paymentSteps"
              :min="1"
              :max="36"
              tooltip="always"
              tooltip-placement="bottom"
              @change="calculateLoan" />
          </div>

          <div class="form-group">
            <label for="">{{ $t('main.months-of-grace') }}</label>
            <vue-slider
              v-model.number="monthGrace"
              class="mb-5"
              :disabled="isRangeDisabled"
              :marks="monthGraceSteps"
              :min="0"
              :max="6"
              tooltip="always"
              tooltip-placement="bottom"
              @change="calculateLoan" />
          </div>
          <div class="form-group">
            <label for="">{{ $t('main.no-payment-dates') }}</label>
            <months-selector
              v-model="monthsNoPayment"
              :max-selectables="maxMonthsNoPayment">
              <div slot="header">
                {{ $t('main.select-month-of-no-payment',{max:maxMonthsNoPayment}) }}
              </div>
            </months-selector>
          </div>

          <div class="form-group">
            <label for="">{{ $t('main.deposit-to-account') }}:</label>
            <multiselect
              v-model="account"
              :show-no-results="false"
              :show-labels="false"
              :searchable="false"
              :options="accounts"
              :custom-label="accountLabel"
              track-by="id"
              label="accountType"
              :placeholder="$t('main.select-to-account')">
              <template
                slot="option"
                slot-scope="props">
                <span class="text-capitalize">{{ props.option.accountType }}
                  <small>{{ props.option.accountNumber }}</small>
                </span>
              </template>
            </multiselect>
          </div>

          <div class="form-group">
            <label for="">{{ $t('main.insurances') }}</label>
            <div class="d-flex">
              <div class="form-check form-check-inline">
                <input
                  v-model="disgrace"
                  :disabled="isRangeDisabled"
                  type="checkbox"
                  class="form-check-input"
                  @input="calculateLoan">
                <label class="form-check-label">{{ $t('main.disencumbrance') }}</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  v-model="unemployment"
                  :disabled="isRangeDisabled"
                  type="checkbox"
                  class="form-check-input"
                  @input="calculateLoan">
                <label class="form-check-label">
                  {{ $t('main.unemployment') }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-group d-lg-none">
            <button
              :disabled="showMinMessage || showMaxMessage"
              class="btn btn-primary btn-lg btn-block"
              @click="activeDetailInfo = true; showSettingsView=false">
              {{ $t('main.simulate') }}
            </button>
          </div>
        </div>
        <div
          v-if="activeDetailInfo || (!showMinMessage && !showMaxMessage)"
          class="consumer-loan__summary col-lg-6 p-5 d-lg-block"
          :class="{'d-none': showSettingsView}">
          <div v-if="!activeInfo">
            <h3 class="consumer-loan__simulation__title mt-1 mb-4 d-flex align-items-center text-primary">
              <button
                class="d-inline-block d-sm-none btn btn-link pl-0 ml-n3"
                @click="activeDetailInfo=false; showSettingsView=true;">
                <font-awesome-icon icon="arrow-left" />
              </button>
              {{ $t('main.simulation-summary.title') }}
            </h3>

            <div class="d-flex justify-content-between">
              <p class="mb-0">
                {{ $t('main.simulation-summary.credit-total-cost') }}:
              </p>
              <p class="ml-3 mb-0">
                <strong>{{ totalLoanAmount | currency }}</strong>
              </p>
            </div>

            <div
              class="consumer-loan__sumary-fees-container p-4 my-5 my-lg-4 d-flex justify-content-between">
              <div
                v-if="payments > 1"
                class="consumer-loan__sumary-fees-qtty p-2 p-lg-3 d-flex flex-column align-items-center">
                <p class="h1 text-primary mb-0">
                  {{ payments }}
                </p>
                <p class="mb-0 h6 font-weight-light">
                  {{ $t('main.simulation-summary.fees') }}
                </p>
              </div>
              <div
                v-else
                class="p-3 d-flex flex-column align-items-center">
                <p>
                  <i18n
                    path="main.simulation-summary.no-fees">
                    <br>
                  </i18n>
                </p>
              </div>
              <div class="d-flex flex-column justify-content-center text-right">
                <p class="text-primary d-none d-lg-block h3">
                  {{ monthlyAmount | currency }}
                </p>
                <p class="text-primary d-lg-none h5">
                  {{ monthlyAmount | currency }}
                </p>
                <p class="text-capitalize h6 font-weight-light">
                  {{ $t('main.simulation-summary.fee-value') }}
                </p>
              </div>
            </div>

            <div class="row text-center mb-4">
              <div class="col-6">
                <p class="mb-0 h5 font-weight-light">
                  <strong>
                    <span class="d-block">{{ interestRate }}%</span> {{ $t('main.simulation-summary.monthly') }}
                  </strong>
                </p>
                <p class="mb-0">
                  {{ $t('main.simulation-summary.interest-rate') }}
                </p>
              </div>
              <div class="col-6">
                <p class="mb-0 h5 font-weight-light">
                  <strong>
                    <span class="d-block">{{ annualRate }}%</span> {{ $t('main.simulation-summary.yearly') }}
                  </strong>
                </p>
                <p class="mb-0">
                  {{ $t('main.simulation-summary.total-tax') }}
                </p>
              </div>
            </div>

            <div class="text-right d-none d-lg-block">
              <button
                class="btn mx-auto btn-link border-0 pr-0"
                @click="activeInfo = true">
                {{ $t('main.simulation-summary.view-detail-btn') }}
                <font-awesome-icon
                  icon="chevron-right"
                  class="ml-2" />
              </button>
            </div>

            <div class="d-lg-none mt-5">
              <button
                class="btn mx-auto btn-secondary btn-lg btn-block border-0 pr-0"
                @click="activeInfo = true">
                {{ $t('main.simulation-summary.view-detail-btn') }}
                <font-awesome-icon
                  icon="chevron-right"
                  class="ml-2" />
              </button>
            </div>

            <div class="pt-lg-4 text-center mt-3 mt-lg-4">
              <button
                class="btn btn-primary btn-lg btn-block">
                {{ $t('main.simulation-summary.request-advance-btn') }}
              </button>
            </div>
          </div>
          <div
            v-if="activeInfo">
            <button
              class="btn btn-link mb-3 pl-0"
              @click="activeInfo = false">
              <font-awesome-icon
                icon="chevron-left"
                class="mr-2" /> {{ $t('main.summary.view-summary-btn') }}
            </button>
            <div class="mt-4 mb-5 my-lg-4">
              <div class="d-flex justify-content-between mb-2">
                <strong>{{ $t('main.summary.credit-total-amount') }}</strong>
                <strong>{{ amount | currency }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>{{ $t('main.summary.stamps-tax') }}</span>
                <span>{{ stampTax | currency }}</span>
              </div>
              <div
                v-if="disgrace"
                class="d-flex justify-content-between mb-2">
                <span>{{ $t('main.summary.disgrace-insurance') }}</span>
                <span>{{ disgraceInsurance | currency }}</span>
              </div>
              <div
                v-if="unemployment"
                class="d-flex justify-content-between mb-2">
                <span>{{ $t('main.summary.unemployment-insurance') }}</span>
                <span>{{ unemploymentInsurance | currency }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>{{ $t('main.summary.notarial-fees') }}</span>
                <span>{{ notaryFee | currency }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>{{ $t('main.summary.months-of-grace') }}</span>
                <span>{{ monthGrace }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>{{ $t('main.summary.interest-rate') }}</span>
                <span>{{ interestRate }}% {{ $t('main.summary.monthly') }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>{{ $t('main.summary.annual-interest') }}</span>
                <span>{{ annualRate }}% {{ $t('main.summary.annual') }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>{{ $t('main.summary.equivalent-anual-load-abbr') }}</span>
                <span>{{ cae }}%</span>
              </div>
              <div class="row mt-4">
                <div class="col-12 col-lg-6 text-center text-lg-left">
                  <p class="consumer-loan__simulator-details-total-credit-cost h5 text-primary">
                    {{ $t('main.summary.credit-total-cost') }}
                  </p>
                </div>
                <div class="col-12 col-lg-6 text-center text-lg-right font-weight-normal">
                  <p class="h5 text-primary">
                    {{ totalLoanAmount | currency }}
                  </p>
                </div>
              </div>
            </div>
            <button
              class="btn btn-primary btn-lg btn-block mt-5">
              {{ $t('main.summary.request-advance-btn') }}
            </button>
          </div>
        </div>
        <div
          v-else-if="!showMaxMessage && !activeDetailInfo"
          class="col-lg-6 bg-tertiary-20 p-5 d-none d-lg-flex align-items-center">
          <div>
            <span class="consumer-loan__initial-msg-icon"><font-awesome-icon icon="arrow-circle-left" /></span>
            <i18n
              path="main.credit-minimum-amount-insert-msg"
              tag="h3"
              class="font-weight-light">
              <strong class="text-primary font-weight-bold">
                {{ $t('main.credit-minimum-amount-insert-msg-strong') }}
              </strong>
            </i18n>
          </div>
        </div>
        <div
          v-else-if="showMaxMessage"
          class="col-lg-6 bg-tertiary-20 p-5 d-none d-lg-flex flex-column justify-content-center align-items-center">
          <h3 class="text-center">
            <font-awesome-icon
              icon="ban"
              class="consumer-loan__max-amount-exceeded-icon d-block mx-auto mb-4" />
            <i18n
              path="main.credit-amount-exceeds-msg"
              tag="span">
              <br>
              <strong class="text-primary">{{ currency(available) }}</strong>
            </i18n>
          </h3>
          <i18n
            path="main.credit-quote-increase-request"
            tag="p"
            class="mt-5">
            <a href="#">{{ $t('main.credit-quote-increase-request-link') }}
              <strong class="consumer-loan__request-quota-increase-link-strong">
                {{ $t('main.credit-quote-increase-request-link-strong') }}
              </strong>
            </a>
          </i18n>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import VueSlider from 'vue-slider-component';
import { Money } from 'v-money';

import { getURLParams } from '@modyo/financial-commons';
import { debounce } from './helpers';
import currency from './filters';

import MonthsSelector from './components/MonthsSelector.vue';

export default {
  name: 'App',
  filters: {
    currency,
  },
  components: {
    Money,
    VueSlider,
    MonthsSelector,
    Multiselect,
  },
  data() {
    return {
      activeInfo: false,
      showSettingsView: true,
      activeDetailInfo: false,
      amount: 0,
      minAmount: 100000,
      available: 10000000,
      payments: 6,
      paymentSteps: [1, 6, 12, 18, 24, 30, 36],
      monthGrace: 0,
      monthGraceSteps: [0, 1, 2, 3, 4, 5, 6],
      monthsNoPayment: '',
      disgrace: true,
      unemployment: true,
      account: null,
      maxMonthsNoPayment: 2,
    };
  },

  computed: {
    interestRate() {
      return this.$store.state.interestRate;
    },
    installment() {
      return this.$store.state.installment;
    },
    annualRate() {
      return this.$store.state.annualRate;
    },
    monthlyAmount() {
      return this.$store.state.monthlyAmount;
    },
    totalLoanAmount() {
      return this.$store.state.totalLoanAmount;
    },
    loanCosts() {
      return this.$store.state.loanCosts;
    },
    percentageLoanCosts() {
      return this.$store.state.percentageLoanCosts;
    },
    cae() {
      return this.$store.state.cae;
    },
    stampTax() {
      return this.$store.state.stampTax;
    },
    notaryFee() {
      return this.$store.state.notaryFee;
    },
    monthlyRate() {
      return this.$store.state.monthlyRate;
    },
    disgraceInsurance() {
      return this.$store.state.disgraceInsurance;
    },
    unemploymentInsurance() {
      return this.$store.state.unemploymentInsurance;
    },
    paramClientId() {
      return this.$store.state.paramClientId;
    },
    accounts() {
      return this.$store.state.accounts;
    },
    showMinMessage() {
      return (this.amount < this.minAmount);
    },
    showMaxMessage() {
      return (this.amount > this.available);
    },
    isRangeDisabled() {
      return (this.amount < this.minAmount);
    },
  },
  watch: {
    monthsNoPayment() {
      this.calculateLoan();
    },
  },
  created() {
    const client = parseInt(getURLParams('client'), 10) || 1;
    this.$store.commit('SET_PARAM_CLIENT_ID', client);
    this.$store.dispatch('DO_DATA_INITIALIZATION');
  },
  methods: {
    currency,
    accountLabel(account) {
      return `${account.accountType} ${account.accountNumber}`;
    },
    calculateLoan: debounce(function getLoans() {
      const payload = {
        amount: this.amount,
        payments: this.payments,
        monthGrace: this.monthGrace,
        monthsNoPayment: this.monthsNoPayment,
        disgrace: this.disgrace,
        unemployment: this.unemployment,
      };
      if (this.amount >= this.minAmount && this.payments > 0) {
        this.$store.dispatch('GET_LOANS', payload);
      }
    }, 200),
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue-slider-component/theme/default.css"></style>

<style lang="scss">
.multiselect .multiselect__placeholder, .multiselect .multiselect__single, .multiselect .multiselect__input {
  text-transform: capitalize;
}
@media (max-width: 575.98px){
  .multiselect .multiselect__placeholder, .multiselect .multiselect__single, .multiselect .multiselect__input {
    font-size: 0.8rem;
  }
}
</style>

<style lang="scss" scoped>
@import './scss/_variables.scss';

.consumer-loan__container {
  background-color: white;
}

.consumer-loan__summary {
  background-color: white;
}

.consumer-loan__sumary-fees-container {
  background-color: $tertiary-20;
}

.consumer-loan__sumary-fees-qtty {
  background-color: white;
}

.consumer-loan__simulator-details-total-credit-cost {
  font-weight: bolder;
}

.consumer-loan__initial-msg-icon {
  position: absolute;
  top: 50%;
  left: 0;
  font-size: 60px;
  margin-left: -30px;
  margin-top: -30px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
}

.consumer-loan__max-amount-exceeded-icon {
  font-size: 5rem;
}

.consumer-loan__request-quota-increase-link {
  color: inherit;
}

.consumer-loan__request-quota-increase-link:hover,
.consumer-loan__request-quota-increase-link:focus {
  text-decoration: none;
  color: inherit;
  .consumer-loan__request-quota-increase-link-strong {
    color: $primary-dark;
  }
}

.consumer-loan__request-quota-increase-link-strong {
  text-decoration: underline;
  color: $primary;
}

@media (max-width: 991.98px){
  .consumer-loan {
    background-color: white;
  }
  .consumer-loan__simulation__title {
    font-size: 1.5rem
  }
}

@media (min-width: 992px){

  .consumer-loan__summary {
    background-color: $tertiary-20;
  }

  .consumer-loan__sumary-fees-container {
    background-color: white;
  }

  .consumer-loan__sumary-fees-qtty {
    background-color: transparent;
    border: 1px solid $primary-10;
  }

  .consumer-loan__simulator-details-total-credit-cost {
    font-weight: 500;
  }
}
</style>
