import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appoinmentSchema.js";
import { generateSlots } from "../services/slotService.js";

export const getSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctorId and date required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const [year, month, day] = date.split("-");

    const [startHour, startMinute] = doctor.workingHours.start.split(":");
    const [endHour, endMinute] = doctor.workingHours.end.split(":");

    const start = new Date(year, month - 1, day, startHour, startMinute);
    const end = new Date(year, month - 1, day, endHour, endMinute);

    let slots = generateSlots(start, end, doctor.slotDuration);

    const appointments = await Appointment.find({
      doctorId,
      slotTime: { $gte: start, $lt: end },
    });

    const bookedSet = new Set(
      appointments.map((a) =>
        new Date(a.slotTime).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      ),
    );

    const result = slots.map((slot) => {
      const time = slot.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      return {
        time,
        status: bookedSet.has(time) ? "booked" : "available",
      };
    });

    res.json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
