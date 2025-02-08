import express from 'express';
import { DateTime } from 'luxon';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.get('/convert', (req, res) => {
  const { fromTimezone, toTimezone, time } = req.query;
  if (!fromTimezone || !toTimezone || !time) {
    return res.status(400).json({ error: 'Missing required query parameters: fromTimezone, toTimezone, and time' });
  }
  try {
    const inputTime = DateTime.fromISO(time, { zone: fromTimezone });
    if (!inputTime.isValid) {
      return res.status(400).json({ error: 'Invalid time format' });
    }
    const convertedTime = inputTime.setZone(toTimezone).toISO();
    return res.status(200).json({
      original_time: inputTime.toISO(),
      converted_time: convertedTime,
      from_timezone: fromTimezone,
      to_timezone: toTimezone
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(port, () => {
  console.log(`ChronoShift API running on port ${port}`);
});
