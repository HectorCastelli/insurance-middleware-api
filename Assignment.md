# Node.js code assessment

The goal of this assessment is to build an API REST following the swagger specs found at: [expected assessment swagger](https://dare-nodejs-assessment.herokuapp.com/assessment-swagger).**That means you need to deliver a API REST with the same API REST contract than the previous swagger details.**

This API REST is a MIDDLEWARE that connect with the following [INSURANCE API REST](https://dare-nodejs-assessment.herokuapp.com/swagger). **That means you need to consume this API REST to do the assessment.**

## Important information about how to consume this API REST

- This [INSURANCE API REST](https://dare-nodejs-assessment.herokuapp.com/swagger) is protected by authentication. You must consume first the POST /login API endpoint to retrieve a token which you can use to call the other API endpoints. It's very important you manage the renovation (if it's expired) of the token in a transparent way. The client credentials for get a token from POST `/login` are:
  - client_id: axa
  - client_secret: s3cr3t
- The GET endpoints of INSURANCE API REST returns etag and others cache mechanism headers. You can use them to avoid request to this API during the cache is still valid.

## Mandatory

Your API REST middleware codebase delivered for the assessment must to follow the next **mandatory points**:

- Authentication and authorization. The authentication model must be based on [RFC 6750(OAuth2)](https://tools.ietf.org/html/rfc6750).
- Include tests (at least 1 unit test, 1 integration test and one end to end tests).
- Using JavaScript ES6.
- Deliver the codebase on github or any source control tool. It would be great if we can see incremental steps at the commits history.
- Use [Latest Node.js LTS](https://nodejs.org/en/about/releases/) version.
- DON'T USE A DB. The API REST your must to deliver is a middleware, so is very important to propagate the request to the data source [INSURANCE API REST](https://dare-nodejs-assessment.herokuapp.com/swagger) and to manage the error handling and the asynchronism.
- Configuration of a linter and some specific rules to maintain code coherence style. For example [ESLint AirBNB Config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base).

## Recommendations

- Solution properly structured.
- Usage of patterns: If you use some design pattern, explain the reasons.
- Add everything you think it is needed to ensure the product's quality & proper maintenance in case of an error.
- We expect to have a minimum documentation on a README file. We need to know what have you done and how to run your app. Also, if you have taken any decision or could not meet any of requirements, please explain it to us. Any documentation to help others to use the API REST is very valuable.
- In a possible interview, you can be asked for any part of your code, therefore, if you get some snippet or code from internet, be sure you understand how it works.
- Use the framework you feel more comfortable using (express.js, fastify...).
