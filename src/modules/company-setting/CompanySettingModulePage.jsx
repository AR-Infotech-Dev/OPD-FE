import ModuleControls from "../shared/ModuleControls";
import ModulePageLayout from "../shared/ModulePageLayout";
import CompanySetting from "./components/CompanySetting";
import { companySettingSchema } from "./data/module.schema";
import { useAuth } from "@auth/components/AuthProvider";

function CompanySettingModulePage({ menu_id }) {
  const { authSession } = useAuth();
  const companyId = authSession?.company_id ?? authSession?.user?.company_id ?? null;

  return (
    <>
      <ModulePageLayout
        title={companySettingSchema.title}
        controls={
          <ModuleControls
            canCreate={false}
          />
        }
      />
      <CompanySetting
        menu_id={menu_id}
        loggedInCompanyId={companyId}
      />
    </>
  );
}

export default CompanySettingModulePage;
