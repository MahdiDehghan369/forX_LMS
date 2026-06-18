const errorFactory = require("sillajError");

const validate =
  (schema, source = "body") =>
  async (req, res, next) => {
    try {
      const dataToValidate = req?.[source];
      await schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      next();
    } catch (error) {
      const errors = error.inner?.length
        ? error.inner.map((err) => ({
            field: err.path,
            message: err.message,
          }))
        : [{ field: error.path, message: error.message }];

      throw errorFactory.BadRequest("خطا در اعتبارسنجی اطلاعات ورودی", errors);
    }
  };

module.exports = validate;
