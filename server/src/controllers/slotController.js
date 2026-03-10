import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appoinmentSchema.js";
import { generateSlots } from "../services/slotService.js";

export const getSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        message: "doctorId and date required",
      });
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const [year, month, day] = date.split("-");

    const [startHour, startMinute] = doctor.workingHours.start.split(":");

    const [endHour, endMinute] = doctor.workingHours.end.split(":");

    const start = new Date(year, month - 1, day, startHour, startMinute);

    const end = new Date(year, month - 1, day, endHour, endMinute);

    let slots = generateSlots(start, end, doctor.slotDuration);

    if (doctor.breakTimes && doctor.breakTimes.length > 0) {
      doctor.breakTimes.forEach((breakTime) => {
        const [bStartHour, bStartMin] = breakTime.start.split(":");

        const [bEndHour, bEndMin] = breakTime.end.split(":");

        const breakStart = new Date(
          year,
          month - 1,
          day,
          bStartHour,
          bStartMin,
        );

        const breakEnd = new Date(year, month - 1, day, bEndHour, bEndMin);

        slots = slots.filter(
          (slot) => !(slot >= breakStart && slot < breakEnd),
        );
      });
    }

    const today = new Date();

    if (
      today.getFullYear() == year &&
      today.getMonth() == month - 1 &&
      today.getDate() == day
    ) {
      slots = slots.filter((slot) => slot > today);
    }

    // fetch booked appointments
    const appointments = await Appointment.find({
      doctorId,
      slotTime: { $gte: start, $lt: end },
    });

    const bookedSlots = appointments.map((a) => a.slotTime.getTime());

    const result = slots.map((slot) => ({
      time: slot.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),

      status: bookedSlots.includes(slot.getTime()) ? "booked" : "available",
    }));

    res.json({
      message: "Slots fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Slot generation error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
