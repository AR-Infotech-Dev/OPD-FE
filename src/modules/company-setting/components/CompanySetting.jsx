import { useRef } from "react";
import { ImagePlus, Upload } from "lucide-react";

import ActionButton from "../../../components/ui/ActionButton";
import Spinner from "../../../components/ui/Spinner";
import DynamicModuleForm from "../../../components/ui/DynamicModuleForm";
import { companySettingSchema } from "../data/module.schema";
import { useCompanySettingForm } from "../hooks/useCompanySettingForm";
import { getLogoUrl } from "@modules/company-master/utils/companyMaster.utils";

function CompanySetting({ selectedCompany, onAfterSave, menu_id, loggedInCompanyId, }) {
    const logoInputRef = useRef(null);
    const {
        loading,
        testingConnection,
        uploadingLogo,
        fetchingCompany,
        formData,
        errors,
        connectionEmailBadge,
        connectionDBBadge,
        handleChange,
        handleLogoUpload,
        handleRemoveLogo,
        handleSave,
        handleTestEmailConnection,
        handleTestDBConnection,
    } = useCompanySettingForm({ isOpen: true, selectedCompany, onAfterSave, loggedInCompanyId, });
    const EmailConnectionIcon = connectionEmailBadge.icon;
    const DBConnectionIcon = connectionDBBadge.icon;
    return (
        <div className="w-full">
            {/* Main Card */}
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                {fetchingCompany
                    ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <Spinner />
                        </div>
                    )
                    : (
                        <>
                            <div className="p-5 pt-10">
                                {/* Company Logo */}
                                {/* <section className="company-logo-uploader">
                                    <div className="company-logo-preview">
                                        {formData.email_logo ? (
                                            <img src={getLogoUrl(formData.email_logo)} alt={`${formData.company_name || "Company"} logo`} />
                                        ) : (
                                            <ImagePlus size={28} />
                                        )}
                                    </div>

                                    <div className="company-logo-copy">
                                        <h3>Company Logo</h3>
                                        <p> Upload a separate logo for this company. It will be used in reports and emails. </p>
                                        {formData.email_logo && (<span> {formData.email_logo} </span>)}
                                    </div>

                                    <div className="company-logo-actions">
                                        {!formData.email_logo && (
                                            <ActionButton disabled={uploadingLogo || loading || fetchingCompany} variant="ghostPrimary" onClick={() => logoInputRef.current?.click()} >
                                                {uploadingLogo ? (<Spinner />) : (<Upload size={15} />)}
                                                Upload Logo
                                            </ActionButton>
                                        )}

                                        {formData.email_logo && (
                                            <button
                                                type="button" className="company-logo-remove" disabled={uploadingLogo || loading
                                                }
                                                onClick={handleRemoveLogo}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        className="sr-only"
                                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                        onChange={handleLogoUpload}
                                    />
                                </section> */}
                                <section className="company-logo-uploader">
                                    <div className="company-logo-preview">
                                        {formData.email_logo ? (
                                            <img
                                                src={
                                                    formData.email_logo instanceof File
                                                        ? URL.createObjectURL(formData.email_logo)
                                                        : getLogoUrl(formData.email_logo)
                                                }
                                                alt={`${formData.company_name || "Company"} logo`}
                                            />
                                        ) : (
                                            <ImagePlus size={28} />
                                        )}
                                    </div>

                                    <div className="company-logo-copy">
                                        <h3>Company Logo</h3>

                                        <p>
                                            Upload a separate logo for this company. It will be used in reports and emails.
                                        </p>

                                        {formData.email_logo && (
                                            <span>
                                                {formData.email_logo instanceof File
                                                    ? formData.email_logo.name
                                                    : formData.email_logo}
                                            </span>
                                        )}
                                    </div>

                                    <div className="company-logo-actions">
                                        {!formData.email_logo && (
                                            <ActionButton
                                                disabled={uploadingLogo || loading || fetchingCompany}
                                                variant="ghostPrimary"
                                                onClick={() => logoInputRef.current?.click()}
                                            >
                                                {uploadingLogo ? <Spinner /> : <Upload size={15} />}
                                                Upload Logo
                                            </ActionButton>
                                        )}

                                        {formData.email_logo && (
                                            <button
                                                type="button"
                                                className="company-logo-remove"
                                                disabled={uploadingLogo || loading}
                                                onClick={handleRemoveLogo}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        className="sr-only"
                                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                        onChange={handleLogoUpload}
                                    />
                                </section>
                                {/* Dynamic Form */}
                                <div className="mt-6">
                                    {!fetchingCompany ? (
                                        <DynamicModuleForm
                                            key={formData.company_id}
                                            sections={companySettingSchema.form.sections}
                                            values={formData}
                                            onChange={handleChange}
                                            errors={errors}
                                            menuId={menu_id}
                                        />
                                    ) : (
                                        <div className="flex min-h-[200px] items-center justify-center">
                                            <Spinner />
                                        </div>
                                    )}
                                </div>


                            </div>

                            {/* Bottom Action Bar */}
                            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={` flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold ${connectionEmailBadge.className} `} title={connectionEmailBadge.title} >
                                            <EmailConnectionIcon size={14} className={connectionEmailBadge.spin ? "animate-spin" : ""} />
                                            Email
                                        </span>
                                        {formData.own_db_enabled === "yes" && (
                                            <span className={` flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold ${connectionDBBadge.className} `} title={connectionDBBadge.title} >
                                                <DBConnectionIcon size={14} className={connectionDBBadge.spin ? "animate-spin" : ""} />
                                                Database
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ActionButton disabled={loading || fetchingCompany || testingConnection} variant="flyoutSecondary" onClick={handleTestEmailConnection} > {testingConnection} Test Email Connection </ActionButton>
                                {formData.own_db_enabled === "yes" && (<ActionButton disabled={loading || fetchingCompany || testingConnection} variant="flyoutSecondary" onClick={handleTestDBConnection} > {testingConnection} Test DB Connection </ActionButton>)}
                                <ActionButton className={loading ? "cursor-not-allowed bg-purple-200" : ""} disabled={loading || fetchingCompany} variant="primary" onClick={handleSave} > {loading} Save Changes </ActionButton>
                            </div>
                        </>
                    )}
            </div>
        </div>
    );

}

export default CompanySetting;