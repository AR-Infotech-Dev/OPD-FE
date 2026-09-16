import ActionButton from "../../../components/ui/ActionButton";
import DynamicModuleForm from "../../../components/ui/DynamicModuleForm";
import { clinicSettingSchema } from "../data/module.schema";
import { useClinicSettingForm } from "../hooks/useClinicSettingForm";
import SpinnerIllustration from "@/components/ui/SpinnerIllustration";

function ClinicSetting({ menu_id, loggedInClinicId, }) {
    const { loading, fetchingClinic, formData, errors, handleChange, handleSave } = useClinicSettingForm({ loggedInClinicId });
    return (
        <div className="w-full overflow-auto">
            {!fetchingClinic ? (
                <div className="bg-white px-2">
                    <div className="pb-5">
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <div className="col-span-8 border p-4 border-gray-200 rounded-sm">
                                <DynamicModuleForm
                                    key={formData.clinic_id}
                                    sections={clinicSettingSchema.form.sections.slice(0, 6)}
                                    values={formData}
                                    onChange={handleChange}
                                    errors={errors}
                                    menuId={menu_id}
                                />
                            </div>
                            <div className="col-span-4 border p-4 border-gray-200 rounded-sm">
                                <DynamicModuleForm
                                    key={formData.clinic_id}
                                    sections={[clinicSettingSchema.form.sections[6]].filter(Boolean)}
                                    values={formData}
                                    onChange={handleChange}
                                    errors={errors}
                                    menuId={menu_id}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <div className="col-span-4 border p-4 border-gray-200 rounded-sm">
                                <DynamicModuleForm
                                    key={formData.clinic_id}
                                    sections={[clinicSettingSchema.form.sections[7]].filter(Boolean)}
                                    values={formData}
                                    onChange={handleChange}
                                    errors={errors}
                                    menuId={menu_id}
                                />
                            </div>
                            <div className="col-span-8 border p-4 border-gray-200 rounded-sm">
                                <DynamicModuleForm
                                    key={formData.clinic_id}
                                    sections={[clinicSettingSchema.form.sections[8]].filter(Boolean)}
                                    values={formData}
                                    onChange={handleChange}
                                    errors={errors}
                                    menuId={menu_id}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Bottom Action Bar */}
                    <div className="sticky -bottom-0 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-5 py-2">
                        <ActionButton className={loading ? "cursor-not-allowed bg-purple-200" : ""} disabled={loading || fetchingClinic} variant="primary" onClick={handleSave} > {loading} Save Changes </ActionButton>
                    </div>
                </div>
            ) : (
                <div className="flex items-center h-full justify-center">
                    <SpinnerIllustration />
                </div>
            )}
        </div >
    );

}
export default ClinicSetting;