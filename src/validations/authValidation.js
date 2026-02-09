const { z } = require('zod');

const formatName = (val) => {
  if (!val) return val;
  return val.trim().charAt(0).toUpperCase() + val.slice(1).toLowerCase();
};

const registerSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, "Имя обязательно")
    .min(2, "Имя слишком короткое")
    .max(50, "Имя слишком длинное")
    .transform(formatName),

  lastname: z
    .string()
    .trim()
    .min(1, "Фамилия обязательна")
    .min(2, "Фамилия слишком короткая")
    .max(50, "Фамилия слишком длинная")
    .transform(formatName),

  telephone: z
    .string()
    .trim()
    .min(1, "Телефон обязателен")
    .regex(/^\+?[0-9]{10,15}$/, "Неверный формат телефона (нужны только цифры, от 10 до 15)"),

  email: z
    .string()
    .trim()
    .min(1, "Email обязателен")
    .email("Некорректный email")
    .toLowerCase(), 

  password: z
    .string()
    .min(6, "Пароль должен быть не менее 6 символов")
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email обязателен" }) 
    .trim()                                       
    .min(1, "Email не может быть пустым")         
    .email("Некорректный формат email"),

  password: z
    .string({ required_error: "Пароль обязателен" })
    .trim()
    .min(1, "Пароль не может быть пустым")
});

module.exports = {
  registerSchema,
  loginSchema
};