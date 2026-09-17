import ModuleControls from "../shared/ModuleControls";
import ModulePageLayout from "../shared/ModulePageLayout";
import ClinicSetting from "./components/ClinicSetting";
import { clinicSettingSchema } from "./data/module.schema";
import { useAuth } from "@auth/components/AuthProvider";
import { useClinicSettingForm } from "../clinic-settings/hooks/useClinicSettingForm";


function ClinicSettingModulePage({ menu_id }) {
  const { authSession } = useAuth();
  const clinicId = authSession?.clinic_id ?? authSession?.user?.clinic_id ?? null;
  const { loadClinic } = useClinicSettingForm({ loggedInClinicId: clinicId });

  return (
    <>
      <ModulePageLayout
        title={clinicSettingSchema.title}
        description={clinicSettingSchema.description}
        controls={
          <ModuleControls
            canCreate={false}
            onRefresh={() => { loadClinic() }}
          />
        }
        table={(
          <ClinicSetting
            menu_id={menu_id}
            loggedInClinicId={clinicId}
          />
        )}
      >
      </ModulePageLayout>
    </>
  );
}

export default ClinicSettingModulePage;
