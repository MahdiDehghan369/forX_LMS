const yup = require('yup');

const departmentsSchema = yup.object({
  title: yup
    .string()
    .required('عنوان دپارتمان الزامی است')
    .trim('عنوان نباید شامل فاصله خالی در ابتدا و انتها باشد')
    .min(3, 'عنوان دپارتمان باید حداقل ۳ کاراکتر باشد')
    .max(50, 'عنوان دپارتمان نباید بیشتر از ۵۰ کاراکتر باشد'),

  href: yup
    .string()
    .required('آدرس لینک الزامی است')
    .trim('عنوان نباید شامل فاصله خالی در ابتدا و انتها باشد')
});
const updateDepartmentSchema = yup.object({
  title: yup
    .string()
    .optional()
    .min(3, 'عنوان دپارتمان باید حداقل ۳ کاراکتر باشد')
    .max(50, 'عنوان دپارتمان نباید بیشتر از ۵۰ کاراکتر باشد'),

  href: yup
    .string()
    .optional()
    .min(3, 'عنوان دپارتمان باید حداقل ۳ کاراکتر باشد')
    .max(50, 'عنوان دپارتمان نباید بیشتر از ۵۰ کاراکتر باشد'),
});

const getDepartmentSchema = yup.object({
  id: yup
    .string()
    .required('آیدی دپارتمان الزامی است.')
    .matches(/^[0-9a-fA-F]{24}$/, "id must be a valid ObjectId"),
})

module.exports = { departmentsSchema, getDepartmentSchema,updateDepartmentSchema }