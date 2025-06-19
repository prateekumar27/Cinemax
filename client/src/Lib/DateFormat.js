export const dateFormat = (date) => {
  return new Date(date).toDateString(" en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};
