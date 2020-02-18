export default {
  SET_PARAM_CLIENT_ID(state, data) {
    state.paramClientId = data;
  },

  SET_ACCOUNTS(state, data) {
    state.accounts = data;
  },

  SET_INTEREST_RATE(state, data) {
    state.interestRate = data;
  },

  SET_INSTALLMENT(state, data) {
    state.installment = data;
  },

  SET_ANNUAL_RATE(state, data) {
    state.annualRate = data;
  },

  SET_MONTHLY_AMOUNT(state, data) {
    state.monthlyAmount = data;
  },

  SET_TOTAL_LOAN_AMOUNT(state, data) {
    state.totalLoanAmount = data;
  },

  SET_LOAN_COSTS(state, data) {
    state.loanCosts = data;
  },

  SET_PERCENTAGE_LOAN_COSTS(state, data) {
    state.percentageLoanCosts = data;
  },

  SET_CAE(state, data) {
    state.cae = data;
  },

  SET_STAMP_TAX(state, data) {
    state.stampTax = data;
  },

  SET_NOTARY_FEE(state, data) {
    state.notaryFee = data;
  },

  SET_MONTHLY_RATE(state, data) {
    state.monthlyRate = data;
  },

  SET_DISGRACE_INSURANCE(state, data) {
    state.disgraceInsurance = data;
  },

  SET_UNEMPLOYMENT_INSURANCE(state, data) {
    state.unemploymentInsurance = data;
  },
};
