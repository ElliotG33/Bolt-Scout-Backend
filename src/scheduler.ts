import { Alert } from './models/Alert';
import { sendEmail } from './emailService';

export const processAlerts = async () => {
  const now = new Date();

  try {
    const alerts = await Alert.find({
      active: true,
      $or: [
        // Alerts that are due based on frequency
        {
          $expr: {
            $gte: [
              { $subtract: [now, { $ifNull: ['$lastRun', '$createdAt'] }] },
              { $multiply: ['$frequency', 60 * 60 * 1000] },
            ],
          },
        },
        // Alerts with no lastRun (new alerts)
        { lastRun: { $exists: false } },
      ],
    });

    console.log('==alerts', alerts);

    for (const alert of alerts) {
      await sendEmail(
        alert.email,
        'Alert Notification',
        `<p><a href="${process.env.APP_URL}/alerts/${
          alert._id
        }">Click here</a> to view your alert results with keywords: <strong>${alert.keywords.join(
          ', '
        )}</strong>.</p>`
      );

      alert.lastRun = new Date();
      await alert.save();
      console.log(`Processed alert for ${alert.email}`);
    }
  } catch (error) {
    console.error('Error processing alerts:', error);
  }
};
