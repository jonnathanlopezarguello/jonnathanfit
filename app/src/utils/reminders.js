let Notifications = null;
let Device = null;
try { Notifications = require('expo-notifications'); } catch (e) {}
try { Device = require('expo-device'); } catch (e) {}

const CHANNEL_ID = 'jfit-reminders';

export async function setupNotifications() {
  if (!Notifications || !Device) return false;

  if (Device.isDevice) {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return false;
  }

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Recordatorios Jonnathan Fit',
    importance: Notifications.AndroidImportance
      ? Notifications.AndroidImportance.HIGH
      : 4,
    vibrationPattern: [0, 250, 250, 250],
  });

  return true;
}

export async function scheduleReminders(profile) {
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const reminders = [
    { hour: 7, minute: 0, title: 'Buenos dias!', body: 'Registra tu desayuno y toma tu creatina.' },
    { hour: 12, minute: 0, title: 'Hora de almuerzo', body: 'No olvides registrar tu almuerzo.' },
    { hour: 15, minute: 0, title: 'Snack de la tarde', body: 'Revisa si vas bien con tus macros del dia.' },
    { hour: 19, minute: 0, title: 'Cena', body: 'Registra tu cena y revisa tus macros restantes.' },
    { hour: 21, minute: 0, title: 'Resumen del dia', body: 'Revisa tu progreso del dia en la app.' },
  ];

  for (const r of reminders) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: r.title,
        body: r.body,
        sound: true,
        channelId: CHANNEL_ID,
      },
      trigger: {
        type: 'daily',
        hour: r.hour,
        minute: r.minute,
      },
    });
  }
}

export async function scheduleWorkoutReminder(dayName, hour, minute) {
  if (!Notifications) return;

  const dayMap = {
    'Lunes': 2, 'Martes': 3, 'Miercoles': 4, 'Jueves': 5,
    'Viernes': 6, 'Sabado': 7, 'Domingo': 1,
  };
  const weekday = dayMap[dayName];
  if (!weekday) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora de entrenar!',
      body: 'Tu sesion de ' + dayName + ' te espera. Vamos!',
      sound: true,
      channelId: CHANNEL_ID,
    },
    trigger: {
      type: 'weekly',
      weekday,
      hour: hour || 17,
      minute: minute || 0,
    },
  });
}

export async function getScheduledReminders() {
  if (!Notifications) return [];
  return Notifications.getAllScheduledNotificationsAsync();
}

export async function cancelAllReminders() {
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
