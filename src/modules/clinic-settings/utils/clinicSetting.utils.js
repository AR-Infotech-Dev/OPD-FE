import { clinicSettingSchema } from '../data/module.schema';
export const getClinicIdentifier = clinic => clinic?.clinic_id || clinic?.id || null;
export const normalizeClinicData = (clinic = {}) => {
  let workingDays = clinic.working_days;
  if (typeof workingDays === 'string') { try { workingDays = JSON.parse(workingDays); } catch { workingDays = []; } }
  return { ...clinicSettingSchema.form.initialValues, ...clinic, working_days: Array.isArray(workingDays) ? workingDays : clinicSettingSchema.form.initialValues.working_days };
};
