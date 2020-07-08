function paginate(body, request) {
  if (!request.query) {
    request.query = {};
  }

  const limit = request.query.limit || 10;
  const page = request.query.page || 0;

  if (Array.isArray(body)) {
    const newBody = {};
    newBody.items = body.slice(page * limit, (page * limit) + limit);
    newBody.nextPage = page + 1;

    return newBody;
  }
  return body;
}

module.exports = paginate;
