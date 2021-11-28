const ROUTES = require("./routes-config");

const handler =
  ({ isUnAuthenticated, component }, { services, exceptions, database }) =>
  (req, res, next) => {
    const { accountability, schema } = req;
    const { InvalidCredentialsException } = exceptions;

    if (!isUnAuthenticated && !accountability?.user) {
      return next(new InvalidCredentialsException());
    }

    component({ database, accountability, schema, services }, req)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error(error);
        return next(new ServiceUnavailableException(error.message));
      });
  };

module.exports = function registerEndpoint(
  router,
  { services, exceptions, database }
) {
  ROUTES.forEach((r) => {
    const callback = handler(r, { services, exceptions, database });
    switch (r.method.toUpperCase()) {
      case "GET":
        router.get(r.path, callback);
        break;
      case "POST":
        router.post(r.path, callback);
        break;
      case "PATCH":
        router.patch(r.path, callback);
        break;
      case "DELETE":
        router.delete(r.path, callback);
        break;
      default:
    }
  });
};
