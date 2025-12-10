import * as Yup from "yup"

// Login validation schema
export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

// User validation schema
export const userValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Please enter a valid email address").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]*$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .nullable(),
  title: Yup.string().nullable(),
  initials: Yup.string().max(5, "Initials must be at most 5 characters").nullable(),
  role: Yup.string().required("Role is required"),
  responsibilities: Yup.array().min(1, "At least one responsibility is required"),
})
