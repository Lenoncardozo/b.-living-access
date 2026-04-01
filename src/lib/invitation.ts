export const INVITATION_TITLE = "Inauguração B. Living Floripa";

export const EVENT_DETAILS = {
  dateLabel: "09 de abril de 2025",
  shortDateLabel: "09 de Abril",
  weekdayLabel: "Quarta-feira, 09 de abril",
  startTimeLabel: "18h",
  endTimeLabel: "23h",
  locationLabel: "B. Living Floripa",
  referenceLabel: "Anexo ao Pátio Milano",
  addressLine1: "Avenida Mauro Ramos, 1494",
  addressLine2: "Centro, Florianópolis - SC, 88020-302",
  mapQuery: "Avenida Mauro Ramos 1494 Centro Florianopolis SC 88020-302",
  details:
    "Inauguração da nova casa da B. Living em Florianópolis. Recepção a partir das 18h e encerramento às 23h.",
} as const;

export const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${EVENT_DETAILS.addressLine1}, ${EVENT_DETAILS.addressLine2}`,
)}`;

export function generateGoogleCalendarUrl() {
  const title = encodeURIComponent(INVITATION_TITLE);
  const location = encodeURIComponent(
    `${EVENT_DETAILS.addressLine1}, ${EVENT_DETAILS.addressLine2} - ${EVENT_DETAILS.referenceLabel}`,
  );
  const details = encodeURIComponent(EVENT_DETAILS.details);
  const dates = "20250409T210000Z/20250410T020000Z";

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&location=${location}&details=${details}`;
}
