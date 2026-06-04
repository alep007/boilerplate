"use client";

import { DeclarativeForm, componentTypes } from "@repo/forms";

const loginSchema = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: "email",
      label: "Correo Electronico",
      type: "email",
      placeholder: "ejemplo@correo.com",
      isRequired: true,
      validate: [{ type: "required", message: "El correo es obligatorio" }],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "password",
      label: "Contrasena",
      type: "password",
      placeholder: "........",
      isRequired: true,
      validate: [{ type: "required", message: "La contrasena es obligatoria" }],
    },
    {
      component: componentTypes.CHECKBOX,
      name: "rememberMe",
      label: "Recordar mi sesion",
    },
  ],
};

export const LoginForm = () => {
  const handleLoginSubmit = (values: Record<string, any>) => {
    console.log("Payload para Auth.js:", values);
  };

  return <DeclarativeForm schema={loginSchema} onSubmit={handleLoginSubmit} />;
};
