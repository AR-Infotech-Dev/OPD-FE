import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userroleModuleSchema } from "../data/module.schema";
import { getUserRoleDetails, saveUserRole } from "../data/userrole.service";
import {
  getUserRoleIdentifier,
  normalizeUserRoleData,
  normalizeUserRoleSavePayload,
  slugifyUserRole,
} from "../utils/userrole.utils";

export function useUserRoleForm({ isOpen, onClose, selectedUserRole, onAfterSave }) {
  const [loading, setLoading] = useState(false);
  const [fetchingUserRole, setFetchingUserRole] = useState(false);
  const [formData, setFormData] = useState(userroleModuleSchema.form.initialValues);
  const [errors, setErrors] = useState({});

  const mode = selectedUserRole ? "edit" : "create";
  const userRoleId = getUserRoleIdentifier(selectedUserRole);

  useEffect(() => {
    const fetchUserRoleDetails = async () => {
      if (!isOpen || !userRoleId) return;

      try {
        setFetchingUserRole(true);
        const res = await getUserRoleDetails(userRoleId);
        setFormData(normalizeUserRoleData(res?.data || selectedUserRole));
      } catch (error) {
        toast.error("Unable to fetch user role details");
        setFormData(normalizeUserRoleData(selectedUserRole));
      } finally {
        setFetchingUserRole(false);
      }
    };

    if (selectedUserRole && isOpen) {
      fetchUserRoleDetails();
      return;
    }

    setFormData(userroleModuleSchema.form.initialValues);
    setErrors({});
  }, [selectedUserRole, isOpen, userRoleId]);

  const handleClose = () => {
    setFormData(userroleModuleSchema.form.initialValues);
    setErrors({});
    onClose();
  };

  const handleChange = (event) => {
      const { name, value } = event.target;
  
      setFormData((current) => {
        const nextState = {
          ...current,
          [name]: value,
        };
  
        if (name === "roleName") {
          const currentSlug = String(current.slug || "");
          const nextSlug = slugifyUserRole(value);
          const previousGeneratedSlug = slugifyUserRole(current.roleName || "");
  
          if (!currentSlug || currentSlug === previousGeneratedSlug) {
            nextState.slug = nextSlug;
          }
        }

        return nextState;
      });
    };

  const handleSave = async () => {
    const payload = normalizeUserRoleSavePayload(formData);
    const result = userroleModuleSchema.validationSchema.safeParse(payload);

    if (!result.success) {
      const nextErrors = {};
      result.error.issues.forEach((issue) => {
        nextErrors[issue.path[0]] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    try {
      setErrors({});
      setLoading(true);
      const res = await saveUserRole({ mode, userRoleId, payload });

      if (res.success) {
        toast.success(res?.message || `User Role ${mode === "create" ? "created" : "updated"} successfully`);
        setFormData(userroleModuleSchema.form.initialValues);
        onClose();
        onAfterSave?.();
        return;
      }

      toast.error(res?.msg || res?.message || "Something went wrong");
    } catch (error) {
      toast.error(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchingUserRole,
    formData,
    errors,
    handleClose,
    handleChange,
    handleSave,
  };
}
