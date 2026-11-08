const SLOTS = [
  "Morning",
  "After breakfast",
  "After lunch",
  "After dinner"
];

function validateReading({ date, slot, value }) {
  if (value === undefined || value === null || value === "") {
    return "Please enter a glucose value.";
  }

  if (!Number.isInteger(Number(value)) || Number(value) < 40 || Number(value) > 600) {
    return "Value must be between 40 and 600 mg/dl.";
  }

  if (!SLOTS.includes(slot)) {
    return "Please select a valid time slot.";
  }

  if (!date) {
    return "Date is required.";
  }

  const selected = new Date(`${date}T00:00:00`);
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (Number.isNaN(selected.getTime())) {
    return "Please enter a valid date.";
  }

  if (selected > today) {
    return "Date cannot be in the future.";
  }

  return null;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { SLOTS, validateReading, isValidEmail };
