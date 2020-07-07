class Policy {
  constructor(id_, amountInsured_, email_, inceptionDate_, installmentPayment_) {
    return {
      id: id_,
      amountInsured: amountInsured_,
      email: email_,
      inceptionDate: inceptionDate_,
      installmentPayment: installmentPayment_,
    };
  }

  static get getSlim() {
    return {
      id: this.id,
      amountInsured: this.amountInsured,
      inceptionDate: this.inceptionDate,
    };
  }
}
