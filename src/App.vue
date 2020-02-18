<template>
  <div
    id="consumer-loan"
    class="py-5">
    <div class="container">
      <h2 class="mb-3">
        {{ $t('main.title') }}
      </h2>
      <div class="app-simulator">
        <div
          id="wrapper-layout"
          class="row no-gutters">
          <div
            id="sidebar-consumer-loan"
            class="col-md-6">
            <div class="sidebar-app-simulator p-4">
              <div class="form-group highlight-amount">
                <label for="">{{ $t('main.credit-amount') }}</label>
                <div class="input-money input-xl">
                  <money
                    v-model="amount"
                    v-bind="{decimal: ',', thousands: '.', prefix: '$ ', precision: 0, masked: false}"
                    @input="calculateLoan" />
                </div>
                <div class="info-account-cc">
                  <small>{{ $t('main.minimum-credit-msg', {amount: '$100.000'}) }}</small>
                </div>
              </div>

              <div class="form-group">
                <label for="">{{ $t('main.fees') }}</label>
                <vue-slider
                  v-model.number="payments"
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
                <div>
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
              <div class="form-group d-sm-none">
                <button
                  :disabled="showMinMessage || showMaxMessage"
                  class="btn btn-primary btn-lg btn-block"
                  @click="activeDetailInfo = true">
                  {{ $t('main.simulate') }}
                </button>
              </div>
            </div>
          </div>
          <div
            id="main-consumer-loan"
            class="col-md-6">
            <div
              :class="activeDetailInfo ? 'active' : ''"
              class="body-app-simulator">
              <div
                v-if="showMinMessage"
                class="empty-simulation p-4">
                <div class="header-empty-simulation" />
                <div class="body-empty-simulation p-5">
                  <h3 v-html="$t('main.credit-minimum-amount-insert-msg')" />
                </div>
              </div>

              <div
                v-else-if="showMaxMessage"
                class="amount-no-avalilable">
                <div>
                  <h3>
                    <span class="ico-light"><font-awesome-icon icon="ban" /></span>
                    <span v-html="$t('main.credit-amount-exceeds-msg',{available:currency(available)})" />
                  </h3>
                  <p v-html="$t('main.credit-quote-increase-request')" />
                </div>
              </div>

              <div
                v-else
                class="simulation-app">
                <div class="wrap-cards">
                  <div class="card-resume p-4">
                    <h3 class="mb-3 mb-sm-2 d-flex align-items-center">
                      {{ $t('main.simulation-summary.title') }}
                      <button
                        class="d-inline-block d-sm-none btn btn-link p-2 ml-auto"
                        @click="activeDetailInfo = false">
                        <font-awesome-icon icon="times" />
                      </button>
                    </h3>
                    <div class="form-group">
                      <div class="media">
                        <div class="media-body">
                          <p>{{ $t('main.simulation-summary.credit-total-cost') }}:</p><p />
                        </div>
                        <div class="pr-3">
                          <p><strong>{{ totalLoanAmount | currency }}</strong></p>
                        </div>
                      </div>
                    </div>
                    <div class="form-group highlight-info-amount p-3 my-4">
                      <div class="media">
                        <div class="media-body">
                          <div class="box-payment">
                            <div
                              v-if="payments > 1"
                              class="">
                              <h4>{{ payments }}</h4>
                              <p>{{ $t('main.simulation-summary.fees') }}</p>
                            </div>
                            <div
                              v-else
                              class="">
                              <p
                                class="zero-range"
                                v-html="$t('main.simulation-summary.no-fees')" />
                            </div>
                          </div>
                        </div>
                        <div class="pl-3 text-right">
                          <h4 class="text-right">
                            {{ monthlyAmount | currency }}
                          </h4>
                          <h5>{{ $t('main.simulation-summary.fee-value') }}</h5>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="row text-center">
                        <div class="col-md-6">
                          <p class="mb-0">
                            <strong>
                              <span>{{ interestRate }}%</span> {{ $t('main.simulation-summary.monthly') }}
                            </strong>
                          </p>
                          <p class="mb-0 text-muted">
                            {{$t('main.simulation-summary.interest-rate')}}
                          </p>
                        </div>
                        <div class="col-md-6">
                          <p class="mb-0">
                            <strong><span>{{ annualRate }}%</span> {{ $t('main.simulation-summary.yearly') }}</strong>
                          </p>
                          <p class="mb-0 text-muted">
                            {{ $t('main.simulation-summary.total-tax') }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="form-group text-center">
                      <button
                        class="btn btn-link"
                        @click="activeInfo = true">
                        <strong>
                          {{ $t('main.simulation-summary.view-detail-btn') }}
                        </strong> <font-awesome-icon icon="chevron-right" />
                      </button>
                    </div>
                    <div class="form-group simulation-actions pt-4 text-center">
                      <a
                        :class="account ? '' : 'disabled'"
                        href="#"
                        class="btn btn-primary btn-lg">{{ $t('main.simulation-summary.request-advance-btn') }}</a>
                      <button
                        class="d-inline-block d-sm-none btn btn-secondary btn-lg"
                        @click="activeDetailInfo = false">
                        {{ $t('commons.back') }}
                      </button>
                    </div>
                  </div>
                  <div
                    :class="activeInfo ? 'active' : ''"
                    class="card-resume info-resume p-4">
                    <div class="resume-request">
                      <button
                        class="btn btn-link mb-3"
                        @click="activeInfo = false">
                        <font-awesome-icon icon="chevron-left" /> {{ $t('main.summary.view-summary-btn') }}
                      </button>
                      <div class="form-group">
                        <div class="row-item">
                          <div class="row">
                            <div class="col-md-8">
                              <strong>{{ $t('main.summary.credit-total-amount') }}o</strong>
                            </div>
                            <div class="col-md-4 text-right">
                              {{ amount | currency }}
                            </div>
                          </div>
                        </div>
                        <div class="row-item">
                          <div class="row">
                            <div class="col-md-8">
                              <strong>{{ $t('main.summary.fees') }}</strong>
                            </div>
                            <div class="col-md-4 text-right">
                              {{ payments }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="row-item">
                          <div class="row">
                            <div class="col-md-8">
                              {{ $t('main.summary.stamps-tax') }} <i class="icon-info-sign" />
                            </div>
                            <div class="col-md-4 text-right">
                              {{ stampTax | currency }}
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="disgrace"
                          class="row-item">
                          <div class="row">
                            <div class="col-md-8">
                              {{ $t('main.summary.disgrace-insurance') }} <i class="icon-info-sign" />
                            </div>
                            <div class="col-md-4 text-right">
                              {{ disgraceInsurance | currency }}
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="unemployment"
                          class="row-item">
                          <div class="row">
                            <div class="col-md-8">
                              {{ $t('main.summary.unemployment-insurance') }} <i class="icon-info-sign" />
                            </div>
                            <div class="col-md-4 text-right">
                              {{ unemploymentInsurance | currency }}
                            </div>
                          </div>
                        </div>
                        <div class="row-item">
                          <div class="row">
                            <div class="col-md-8">
                              {{ $t('main.summary.notarial-fees') }} <i class="icon-info-sign" />
                            </div>
                            <div class="col-md-4 text-right text-capitalize">
                              {{ notaryFee | currency }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="row-item">
                          <div class="row">
                            <div class="col-md-6">
                              {{ $t('main.summary.months-of-grace') }}
                            </div>
                            <div class="col-md-6 text-right">
                              {{ monthGrace }}
                            </div>
                          </div>
                        </div>
                        <div class="row-item">
                          <div class="row">
                            <div class="col-md-8">
                              {{ $t('main.summary.interest-rate') }}
                            </div>
                            <div class="col-md-4 text-right">
                              {{ interestRate }}% {{ $t('main.summary.monthly') }}
                            </div>
                          </div>
                        </div>
                        <div class="row-item">
                          <div class="row">
                            <div class="col-md-8">
                              {{ $t('main.summary.annual-interest') }}
                            </div>
                            <div class="col-md-4 text-right">
                              {{ annualRate }}% {{ $t('main.summary.annual') }}
                            </div>
                          </div>
                        </div>
                        <div class="row-item">
                          <div class="row">
                            <div class="col-md-8">
                              {{ $t('main.summary.equivalent-anual-load-abbr') }}
                            </div>
                            <div class="col-md-4 text-right">
                              {{ cae }}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-group highlight-info mt-5 p-3">
                        <div class="row">
                          <div class="col-md-8">
                            <h5>{{ $t('main.summary.credit-total-cost') }}</h5>
                          </div>
                          <div class="col-md-4 text-right">
                            <h5>{{ totalLoanAmount | currency }}</h5>
                          </div>
                        </div>

                        <div class="actions text-center mt-3">
                          <a
                            :class="account ? '' : 'disabled'"
                            href="#"
                            class="btn btn-primary btn-lg">{{ $t('main.summary.request-advance-btn') }}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import VueSlider from 'vue-slider-component';
import { Money } from 'v-money';

import { getURLParams, debounce } from './helpers';
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
#consumer-loan {
  background: #ecf0f4;

.amount-no-avalilable {
  height: 100%;
  justify-content: center;
  text-align: center;
}

.ico-light {
  display: flex;
  width: 80px;
  height: 80px;
  margin: auto;
  border-radius: 50%;
  border: 2px solid #000;
  color: #000;
  font-size: 40px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  opacity: .3;
}

.sidebar-app-simulator,
.body-app-simulator {
  height: 100%;
}

.sidebar-app-simulator {
  background: #FFF;
}

.sidebar-app-simulator .form-group .vue-slider {
  margin-bottom: 50px;
}

.body-app-simulator {
  background: rgba(255, 255, 255, .5);
  margin-left: 3px;
}

.empty-simulation {
  display: flex;
  height: 100%;
}

.highlight-ammunt {
  background: aliceblue;
  padding: 20px;
}

.input-money {
  border: 1px solid #DDD;
  background: #FFF;
  padding: 4px;
  text-align: center;
}

.input-money.input-xl {
  font-size: 28px;
}

.input-money span {
  color: #999;
}

.input-money input {
  border: 0;
  color: #555;
  padding: 6px 12px;
  height: 34px;
  font-size: 14px;
}

.input-money input:focus {
  box-shadow: none;
  outline: none;
}

.input-money.input-xl input {
  font-size: 28px;
  height: 50px;
  width: 200px;
}

.highlight-amount .info-account-cc {
  display: block;
  text-align: center;
  margin-top: 10px;
}

.highlight-amount .info-account-cc p {
  margin: 0;
  color: #666;
  line-height: 1;
  font-size: 13px;
}

.body-empty-simulation {
  position: relative;
}

.body-empty-simulation:after {
  width: 100px;
  height: 45px;
  content: '';
  position: absolute;
  background: url("https://cloud.modyocdn.com/uploads/eb1438ba-fc6b-4a52-82b0-c6c4887b89df/original/arrow.png");
  background-size: 100%;
  left: -60px;
  top: 80px;
}

.highlight-info {
 border: 1px solid #EEE;
}

.highlight-info-amount {
  background: #FFF;
}

.body-empty-simulation h3 {
  color: #094279;
  position: relative;
  font-size: 32px;
}

.body-empty-simulation h3 strong {
  color: #20ade2;
}

.simulation-app {
 height: 100%;
}

.simulation-app p strong span {
  font-size: 21px;
}

.simulation-app h4 {
  font-size: 32px;
  font-weight: bold;
  color: #20ade2;
  line-height: 1;
  margin: 0;
}

.simulation-app h5 {
  font-size: 24px;
  font-weight: normal
}

.simulation-app .form-group small {
  color: #999;
}

.simulation-app .form-group i {
  opacity: 0.3;
}

.simulation-actions {
  border-top: 1px solid rgba(0, 0, 0, .1);
}

.box-payment {
  width: 70px;
  height: 70px;
  border: 2px solid #20ade2;
  text-align: center;
  padding: 8px;
  color: #20ade2;
}

.box-payment p {
  line-height: 1;
}

.box-payment p.zero-range {
  line-height: 1.3;
  margin-top: 6px !important;
}

.loan-datepicker .datepicker {
  width: 100%;
}

.info-resume {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: #FFF;
  transform: translateX(100%);
  transition: all .2s ease-in-out;

  &.active {
    transform: translateX(0);
  }
}

.wrap-cards {
  position: relative;
  overflow: hidden;
  height: 100%;
}

.resume-request .row-item {
  border-bottom: 1px solid rgba(0,0,0,.1);
}

.resume-request .form-group {
  background: #FFF;
}

.resume-request .row-item .row {
  padding: 8px 20px;
}

.input-money.input-xl.disabled {
  background: #f4f4f4;

  span {
    color: #DDD;
  }

  input:disabled {
    background: #f4f4f4;
    color: #DDD;
  }
}

}

@media (max-width: 768px) {
#consumer-loan {

  .app-simulator {
    position: relative;
    overflow: hidden;
  }

  #main-consumer-loan {
    position: static;
  }

  .body-app-simulator {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: auto;
    transform: translateX(100%);
    transition: all .2s ease-in-out;
    background: #f6f8fa;
    z-index: 2;

    &.active {
      transform: translateX(0);
    }
  }

  .simulation-app p strong span {
    font-size: 16px;
  }

  .simulation-app p {
    font-size: 14px;
  }

  .simulation-app h5 {
    font-size: 20px;
  }

  .simulation-app h4 {
    font-size: 28px;
  }

  .card-resume {
    h3 {

      button {
        background: #FFF;
        border-radius: 40px;
        font-size: 20px;
        color: #333;
        line-height: 1;
      }
    }
  }
  }
}
</style>
