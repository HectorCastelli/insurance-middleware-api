class Client {
  constructor(id_, name_, email_, role_) {
    return {
      id: id_,
      name: name_,
      email: email_,
      role: role_,
    };
  }
}

module.exports = Client;