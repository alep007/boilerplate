import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";

const PRODUCT_TYPE_OPTIONS = [
  { id: "Talonario",         label: "Talonario"         },
  { id: "Tarjeta de visita", label: "Tarjeta de visita" },
  { id: "Volante",           label: "Volante"           },
  { id: "Afiche",            label: "Afiche"            },
  { id: "Membrete",          label: "Membrete"          },
  { id: "Otro",              label: "Otro"              },
];

export const getOrderSchema = (t: (key: string) => string, isNew: boolean) => ({
  fields: [
    ...(isNew
      ? [
          {
            component: componentTypes.TEXT_FIELD,
            name: "customer_name",
            label: t("fieldCustomerName"),
            validate: [
              { type: validatorTypes.REQUIRED, message: t("validationCustomerName") },
              { type: validatorTypes.MIN_LENGTH, threshold: 2, message: t("validationCustomerName") },
            ],
          },
        ]
      : []),
    {
      component: componentTypes.TEXT_FIELD,
      name: "customer_phone",
      label: t("fieldCustomerPhone"),
      type: "tel",
    },
    {
      component: componentTypes.DATE_PICKER,
      name: "delivery_date",
      label: t("fieldDeliveryDate"),
      minDate: new Date(),
      validate: [
        { type: validatorTypes.REQUIRED, message: t("validationDeliveryDate") },
      ],
    },
    {
      component: componentTypes.TEXTAREA,
      name: "description",
      label: t("fieldDescription"),
      validate: [
        { type: validatorTypes.REQUIRED, message: t("validationDescription") },
      ],
    },
    {
      component: componentTypes.SELECT,
      name: "product_type",
      label: t("fieldProductType"),
      options: PRODUCT_TYPE_OPTIONS,
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "quantity",
      label: t("fieldQuantity"),
      type: "number",
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "size",
      label: t("fieldSize"),
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "material",
      label: t("fieldMaterial"),
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: "colors",
      label: t("fieldColors"),
    },
    {
      component: componentTypes.TEXTAREA,
      name: "operator_notes",
      label: t("fieldOperatorNotes"),
    },
    {
      component: componentTypes.TEXTAREA,
      name: "internal_notes",
      label: t("fieldInternalNotes"),
    },
  ],
});
