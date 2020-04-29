<template>
  <div
    id="consumer-loan"
    class="consumer-loan py-lg-5"
    :class="{'h-100': !showSettingsView}">
    <div class="consumer-loan__container container-lg">
      <div class="consumer-loan__row row">
        <div
          v-if="showSettingsView"
          class="col-lg-6 p-4 p-sm-5 d-flex flex-column d-lg-block">
          <h2 class="h5 mb-4 text-primary">
            {{ $t('main.title') }}
          </h2>
          <div class="form-group">
            <label for="">{{ $t('main.credit-amount') }}</label>
            <money
              v-model="amount"
              v-bind="moneyOptions"
              class="d-block form-control"
              @input="calculateLoan" />
            <small class="d-block mt-2">
              {{ $t('main.minimum-credit-msg', {amount: currency(minAmount, currencyFormat)}) }}
            </small>
            <div
              v-if="showMaxMessage"
              class="mt-3 bg-light px-4 py-3 d-lg-none">
              <i18n
                path="main.credit-amount-exceeds-msg"
                tag="p"
                class="text-danger mb-0">
                <span />
                <strong class="text-primary">{{ currency(available, currencyFormat) }}</strong>
              </i18n>
              <i18n
                path="main.credit-quote-increase-request"
                tag="p"
                class="mt-1 mb-0">
                <a href="#">{{ $t('main.credit-quote-increase-request-link') }}
                  <strong class="consumer-loan__request-quota-increase-link-strong">
                    {{ $t('main.credit-quote-increase-request-link-strong') }}
                  </strong>
                </a>
              </i18n>
            </div>
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
              :allow-empty="false"
              track-by="id"
              label="accountType"
              :placeholder="$t('main.select-to-account')">
              <template
                slot="option"
                slot-scope="props">
                <span class="text-capitalize">{{ props.option.accountType }} -
                  <small>{{ props.option.accountNumber }}</small>
                </span>
              </template>
            </multiselect>
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

          <div class="mb-4">
            <label>{{ $t('main.insurances') }}</label>
            <div
              class="d-flex flex-column flex-sm-row flex-lg-column flex-xl-row
              flex-fill mt-2 justify-content-start">
              <div class="checkbox-pill mb-2 mx-1">
                <input
                  v-model="disgrace"
                  :disabled="isRangeDisabled"
                  type="checkbox"
                  @input="calculateLoan">
                <span class="checkbox-icon" />
                <label class="d-flex align-items-center flex-fill  justify-content-between">
                  {{ $t('main.disencumbrance') }}
                  <font-awesome-icon
                    icon="check" />
                </label>
              </div>

              <div class="checkbox-pill mb-2 mx-1">
                <input
                  v-model="unemployment"
                  :disabled="isRangeDisabled"
                  type="checkbox"
                  @input="calculateLoan">
                <span class="checkbox-icon" />
                <label class="d-flex align-items-center flex-fill  justify-content-between">
                  {{ $t('main.unemployment') }}
                  <font-awesome-icon
                    icon="check" />
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
          v-if="activeDetailInfo || (!showMinMessage && !showMaxMessage && account)"
          class="consumer-loan__summary col-lg-6 p-4 p-sm-5 d-lg-block"
          :class="{'d-none': showSettingsView}">
          <div v-if="!activeInfo">
            <p class="h5 consumer-loan__simulation__title mb-4 d-flex align-items-center text-primary">
              <button
                class="d-inline-block d-lg-none btn btn-link pl-0"
                @click="activeDetailInfo=false; showSettingsView=true;">
                <font-awesome-icon icon="arrow-left" />
              </button>
              {{ $t('main.simulation-summary.title') }}
            </p>

            <div class="d-flex justify-content-between">
              <p class="mb-0">
                {{ $t('main.simulation-summary.credit-total-cost') }}:
              </p>
              <p class="ml-3 mb-0">
                <strong>{{ totalLoanAmount | currency(currencyFormat) }}</strong>
              </p>
            </div>

            <div
              class="consumer-loan__sumary-fees-container p-4 my-5 my-lg-4 d-flex justify-content-between rounded">
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
                  {{ monthlyAmount | currency(currencyFormat) }}
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

            <div class="mb-5 mt-lg-0 mb-lg-4">
              <div class="bg-white px-3 pt-3 pb-2 rounded">
                <div class="d-flex justify-content-between mb-2">
                  <strong>{{ $t('main.summary.credit-total-amount') }}</strong>
                  <strong>{{ amount | currency(currencyFormat) }}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <strong>{{ $t('main.simulation-summary.fees') }}</strong>
                  <span>{{ payments }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <strong>{{ $t('main.simulation-summary.fee-value') }}</strong>
                  <span>{{ monthlyAmount | currency(currencyFormat) }}</span>
                </div>
              </div>
              <div class="bg-white px-3 pt-3 pb-2 rounded mt-3">
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
                <div class="d-flex justify-content-between mb-2">
                  <span>{{ $t('main.simulation-summary.to-account') }}</span>
                  <span class="text-capitalize text-right ">{{ account.accountType }}<br>
                    <strong>{{ account.accountNumber }}</strong>
                  </span>
                </div>
              </div>
              <div class="bg-white px-3 pt-3 pb-2 rounded mt-3">
                <div
                  v-if="disgrace"
                  class="d-flex justify-content-between mb-2">
                  <span>{{ $t('main.summary.disgrace-insurance') }}</span>
                  <span>{{ disgraceInsurance | currency(currencyFormat) }}</span>
                </div>
                <div
                  v-if="unemployment"
                  class="d-flex justify-content-between mb-2">
                  <span>{{ $t('main.summary.unemployment-insurance') }}</span>
                  <span>{{ unemploymentInsurance | currency(currencyFormat) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>{{ $t('main.summary.stamps-tax') }}</span>
                  <span>{{ stampTax | currency(currencyFormat) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>{{ $t('main.summary.notarial-fees') }}</span>
                  <span>{{ notaryFee | currency(currencyFormat) }}</span>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-12 col-lg-6 text-center text-lg-left">
                  <p class="consumer-loan__simulator-details-total-credit-cost h5 text-primary">
                    {{ $t('main.summary.credit-total-cost') }}
                  </p>
                </div>
                <div class="col-12 col-lg-6 text-center text-lg-right font-weight-normal">
                  <p class="h5 text-primary">
                    {{ totalLoanAmount | currency(currencyFormat) }}
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
              tag="h4"
              class="font-weight-light">
              <strong class="text-primary font-weight-bold">
                {{ $t('main.credit-minimum-amount-insert-msg-strong') }}
              </strong>
            </i18n>
          </div>
        </div>
        <div
          v-else-if="showMaxMessage"
          class="col-lg-6 bg-tertiary-20 p-4 p-sm-5 d-none d-lg-flex flex-column
          justify-content-center align-items-center">
          <h3 class="text-center">
            <font-awesome-icon
              icon="ban"
              class="consumer-loan__max-amount-exceeded-icon d-block mx-auto mb-4" />
            <i18n
              path="main.credit-amount-exceeds-msg"
              tag="span">
              <br>
              <strong class="text-primary">{{ currency(available, currencyFormat) }}</strong>
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
import { Money } from 'v-money-no-negative';

import { currency, debounce, getURLParams } from '@modyo/financial-commons';
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
      payments: 6,
      paymentSteps: [1, 6, 12, 18, 24, 30, 36],
      monthGrace: 0,
      monthGraceSteps: [0, 1, 2, 3, 4, 5, 6],
      monthsNoPayment: '',
      disgrace: true,
      unemployment: true,
      account: null,
      maxMonthsNoPayment: 2,
      currencyFormat: this.$t('currency.format'),
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
    isLangEn() {
      return this.$store.state.lang === 'en-US';
    },
    minAmount() {
      if (this.isLangEn) {
        return 10000;
      }
      return 100000;
    },
    available() {
      if (this.isLangEn) {
        return 100000;
      }
      return 10000000;
    },
    moneyOptions() {
      if (this.isLangEn) {
        return {
          prefix: '$',
          decimal: '.',
          thousands: ',',
          precision: 2,
          maxlength: this.available.toString().length + 3,
        };
      }
      return {
        prefix: '$',
        decimal: ',',
        thousands: '.',
        precision: 0,
        maxlength: this.available.toString().length + 3,
      };
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
      return `${account.accountType} - ${account.accountNumber}`;
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


<style lang="scss">
.multiselect .multiselect__placeholder,
.multiselect .multiselect__single,
.multiselect .multiselect__input {
  text-transform: capitalize;
}
@media (max-width: 575.98px){
  .multiselect .multiselect__placeholder,
  .multiselect .multiselect__single,
  .multiselect .multiselect__input {
    font-size: .8rem;
  }
}
</style>

<style lang="scss" scoped>
@import "./scss/variables.scss";

.consumer-loan__container {
  background-color: #fff;
}

.consumer-loan__summary {
  background-color: #fff;
}

.consumer-loan__sumary-fees-container {
  background-color: $tertiary-20;
}

.consumer-loan__sumary-fees-qtty {
  background-color: #fff;
}

.consumer-loan__simulator-details-total-credit-cost {
  font-weight: bolder;
}

.consumer-loan__initial-msg-icon {
  position: absolute;
  top: 50%;
  left: 0;

  display: flex;

  align-items: center;

  margin-top: -24px;
  margin-left: -24px;

  font-size: 48px;
  color: $primary-100;

  background-color: #fff;
  border-radius: 50%;
}

.consumer-loan__max-amount-exceeded-icon {
  font-size: 5rem;
}

.consumer-loan__request-quota-increase-link {
  color: inherit;
}

.consumer-loan__request-quota-increase-link:hover,
.consumer-loan__request-quota-increase-link:focus {
  color: inherit;
  text-decoration: none;

  .consumer-loan__request-quota-increase-link-strong {
    color: $primary-dark;
  }
}

.consumer-loan__request-quota-increase-link-strong {
  color: $primary;
  text-decoration: underline;
}

@media (max-width: 991.98px){
  .consumer-loan {
    background-color: #fff;
  }
}

@media (min-width: 992px){
  .consumer-loan__summary {
    background-color: $tertiary-20;
  }

  .consumer-loan__sumary-fees-container {
    background-color: #fff;
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
