import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { clinicSettingSchema } from '../data/module.schema';
import { getClinicDetails, removeClinicLogo, saveClinic, uploadClinicLogo } from '../data/clinicSetting.service';
import { getClinicIdentifier, getFilePathFromResponse, normalizeClinicData } from '../utils/clinicSetting.utils';

export const useClinicSettingForm = ({ loggedInClinicId }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingClinic, setFetchingClinic] = useState(false);
  const [formData, setFormData] = useState(clinicSettingSchema.form.initialValues);
  const [errors, setErrors] = useState({});
  const clinicId = loggedInClinicId || null;
  let active = true;
  const load = async () => {
    try {
      setFetchingClinic(true);
      const response = await getClinicDetails(clinicId);
      if (!response?.success)
        throw new Error(response?.message || 'Unable to load clinic settings');

      if (active) {
        setFormData(normalizeClinicData(response?.data?.data || response?.data || {}));
        setErrors({});
      }
    } catch (error) {
      if (active) toast.error(error.message);
    }
    finally {
      if (active) setFetchingClinic(false);
    }
  };

  useEffect(() => {
    load();
    return () => { active = false; };
  }, [clinicId]);


  const handleChange = event => setFormData(current => ({ ...current, [event.target.name]: event.target.value }));
  const handleSave = async () => {
    const clinicLogoFile = formData.clinic_logo instanceof File ? formData.clinic_logo : null;

    const parsed = clinicSettingSchema.validationSchema.safeParse(formData);
    if (!parsed.success) {
      const next = Object.fromEntries(parsed.error.issues.map(issue => [issue.path[0], issue.message]));
      setErrors(next); toast.error('Please fix the highlighted fields'); return;
    }
    try {
      setLoading(true); setErrors({});
      const response = await saveClinic({ mode: clinicId ? 'edit' : 'create', clinicId, payload: { ...formData, ...parsed.data } });
      if (!response?.success) throw new Error(response?.message || 'Unable to save clinic settings');

      if (clinicLogoFile) {
        const logoResponse = await uploadClinicLogo({ clinic_id: clinicId, file: clinicLogoFile });
        if (!logoResponse.success) {
          toast.error(logoResponse.message || "Clinic was saved, but logo upload failed.");
          return;
        }
        const logoPath = getFilePathFromResponse(response);
        setFormData((current) => ({ ...current, clinic_log_url: logoPath, clinic_logo: logoPath ? { name: logoPath.split("/").pop(), url: getLogoUrl(logoPath), existing: true } : null }));
      } else if (clinicId) {
        const removeResponse = await removeClinicLogo(clinicId);
        if (!removeResponse.success) {
          toast.error(removeResponse.message || "Clinic was saved, but logo removal failed.");
          return;
        }
      }

      toast.success(response.message || 'Clinic settings saved successfully');
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };
  return { loadClinic: load, loading, fetchingClinic, formData, errors, handleChange, handleSave };
};
