export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function money(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(value || 0));
}

export function initials(name = "Player") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export function dateLabel(value, options = { day: "numeric", month: "short", year: "numeric" }) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", options).format(new Date(value));
}

export function serialize(value) {
  return JSON.parse(JSON.stringify(value));
}
