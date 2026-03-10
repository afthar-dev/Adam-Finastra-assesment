export const generateSlots = (start, end, duration) => {
  const slots = [];

  let current = new Date(start);
  const endTime = new Date(end);

  while (current < endTime) {
    slots.push(new Date(current));

    current = new Date(current.getTime() + duration * 60000);
  }

  return slots;
};
