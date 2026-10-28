"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  enquirySchema,
  stepFields,
  labels,
  packageOptions,
  pricingOptions,
  type Enquiry,
} from "@/lib/enquiry-schema";
const steps = [
  "Your details",
  "Project details",
  "Material package",
  "Scope & pricing",
  "Drawings & documents",
  "Review & submit",
];
type FormValues = Omit<Enquiry, "pricingPurpose" | "authority" | "privacy"> & {
  pricingPurpose: string;
  authority: boolean;
  privacy: boolean;
};
function defaults(): FormValues {
  return {
    submissionId: "",
    startedAt: 0,
    website: "",
    fullName: "",
    company: "",
    position: "",
    email: "",
    phone: "",
    companyWebsite: "",
    projectName: "",
    projectLocation: "",
    projectType: "",
    projectStage: "",
    tenderDate: "",
    deliveryDate: "",
    packages: [],
    selectedProduct: "",
    selectedCategory: "",
    pricingPurpose: "",
    scope: "",
    quantity: "",
    unit: "",
    packageValue: "",
    targetRate: "",
    supplierQuote: "",
    alternatives: "Discuss",
    deliveryRequirements: "",
    documentLink: "",
    drawingRevision: "",
    documentDescription: "",
    authority: false,
    privacy: false,
  };
}
export default function EnquiryForm({
  uploadUrl,
  enabled,
  submissionId,
  startedAt,
}: {
  uploadUrl: string | null;
  enabled: boolean;
  submissionId: string;
  startedAt: number;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(() => ({
    ...defaults(),
    submissionId,
    startedAt,
    selectedProduct: (params.get("product") || "").slice(0, 300),
    selectedCategory: (params.get("package") || "").slice(0, 200),
  }));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState("");
  const [busy, setBusy] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<FormValues | null>(
    null,
  );
  const heading = useRef<HTMLHeadingElement>(null);
  const alert = useRef<HTMLDivElement>(null);
  function update(key: string, value: string | boolean | string[]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }
  function changeStep(n: number) {
    setStep(n);
    setErrors({});
    setTimeout(() => heading.current?.focus(), 0);
  }
  function validate() {
    const result = enquirySchema.safeParse(values);
    const e: Record<string, string> = {};
    if (!result.success)
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (stepFields[step].includes(key as keyof Enquiry))
          e[key] = issue.message;
      }
    setErrors(e);
    if (Object.keys(e).length) {
      setTimeout(() => document.getElementById(Object.keys(e)[0])?.focus(), 0);
      return false;
    }
    return true;
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    if (step < 5) {
      changeStep(step + 1);
      return;
    }
    const all = enquirySchema.safeParse(values);
    if (!all.success) {
      setFailure("Please check all form steps before submitting.");
      return;
    }
    setBusy(true);
    setFailure("");
    setHasAttempted(true);
    const payload = submittedSnapshot || values;
    if (!submittedSnapshot) setSubmittedSnapshot(values);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.fields) setErrors(json.fields);
        throw new Error(json.error || "Your enquiry could not be confirmed.");
      }
      router.push("/enquiry-confirmation");
    } catch (e) {
      setFailure(
        e instanceof Error
          ? e.message
          : "Connection failed. Please try again or email our team.",
      );
      setTimeout(() => alert.current?.focus(), 0);
      setBusy(false);
    }
  }
  function field(
    name: keyof FormValues,
    {
      type = "text",
      required = false,
      options,
      area = false,
      placeholder,
    }: {
      type?: string;
      required?: boolean;
      options?: readonly string[];
      area?: boolean;
      placeholder?: string;
    } = {},
  ) {
    const id = String(name);
    const props = {
      id,
      name: id,
      value: String(values[name]),
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => update(id, e.target.value),
      "aria-invalid": !!errors[id],
      "aria-describedby": errors[id] ? `${id}-error` : undefined,
      required,
      disabled: busy || !!submittedSnapshot,
    };
    return (
      <label className={`field ${area ? "full-width" : ""}`} key={id}>
        <span>
          {labels[id]}
          {required ? " *" : ""}
        </span>
        {options ? (
          <select {...props}>
            <option value="">Select an option</option>
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : area ? (
          <textarea
            {...props}
            rows={5}
            maxLength={name === "scope" ? 6000 : 1500}
          />
        ) : (
          <input
            {...props}
            type={type}
            min={type === "number" ? "0.001" : undefined}
            step={type === "number" ? "any" : undefined}
            placeholder={placeholder}
            maxLength={name === "documentLink" ? 2000 : 300}
            autoComplete={
              (
                {
                  fullName: "name",
                  company: "organization",
                  position: "organization-title",
                  email: "email",
                  phone: "tel",
                  companyWebsite: "url",
                } as Record<string, string>
              )[id] || "off"
            }
          />
        )}
        {errors[id] && (
          <span className="field-error" id={`${id}-error`}>
            {errors[id]}
          </span>
        )}
      </label>
    );
  }
  return (
    <section className="container form-layout">
      <aside className="form-sidebar">
        <ol className="form-steps" aria-label="Enquiry progress">
          {steps.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => changeStep(i)}
                disabled={i > step || busy}
                aria-current={i === step ? "step" : undefined}
              >
                <span>{i < step ? "✓" : `0${i + 1}`}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>
        <p>
          Have a tender deadline or a complex package? Email our team to discuss
          your requirements.
        </p>
        <a href="mailto:info@glanheim.com" className="text-link">
          info@glanheim.com ↗
        </a>
      </aside>
      <form className="enquiry-form" noValidate onSubmit={submit}>
        {!enabled && (
          <div className="integration-note">
            <strong>Online submission is awaiting activation.</strong>
            <p>
              You can prepare and review your scope below. To send your enquiry
              now, email{" "}
              <a
                className="underline"
                href="mailto:info@glanheim.com?subject=Project%20pricing%20enquiry"
              >
                info@glanheim.com
              </a>
              . This form will not claim receipt while the service is
              unconfigured.
            </p>
          </div>
        )}
        <p className="form-progress">STEP 0{step + 1} / 06</p>
        <h2 ref={heading} tabIndex={-1}>
          {steps[step]}
        </h2>
        <p className="form-description">
          {step === 0
            ? "Tell us who to contact. Fields marked * are required."
            : step === 4
              ? "Share links, not large attachments. We do not automatically open or download your documents."
              : step === 5
                ? "Check the complete brief before submitting for scope review."
                : "The more context you provide, the better we can understand your requirements."}
        </p>
        <div className="honeypot" aria-hidden="true">
          <label>
            Leave this blank
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </label>
        </div>
        {step === 0 && (
          <div className="form-grid">
            {field("fullName", { required: true })}
            {field("company", { required: true })}
            {field("position")}
            {field("email", { type: "email", required: true })}
            {field("phone", { type: "tel" })}
            {field("companyWebsite", { type: "url", placeholder: "https://" })}
          </div>
        )}
        {step === 1 && (
          <div className="form-grid">
            {field("projectName")}
            {field("projectLocation")}
            {field("projectType", {
              options: [
                "Commercial",
                "Multi-residential",
                "Hospitality",
                "Retail",
                "Office",
                "Residential",
                "Other",
              ],
            })}
            {field("projectStage", {
              options: [
                "Concept",
                "Design development",
                "Tender",
                "Construction",
                "Procurement",
              ],
            })}
            {field("tenderDate", { type: "date" })}
            {field("deliveryDate", { type: "date" })}
          </div>
        )}
        {step === 2 && (
          <>
            <fieldset className="border-0 p-0 m-0">
              <legend className="form-description">
                Select all relevant material packages *
              </legend>
              <div id="packages" tabIndex={-1} className="checkbox-grid">
                {packageOptions.map((p) => (
                  <label className="checkbox-label" key={p}>
                    <input
                      type="checkbox"
                      disabled={busy || !!submittedSnapshot}
                      checked={values.packages.includes(p)}
                      onChange={(e) =>
                        update(
                          "packages",
                          e.target.checked
                            ? [...values.packages, p]
                            : values.packages.filter((v) => v !== p),
                        )
                      }
                    />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
              {errors.packages && (
                <p className="field-error" role="alert">
                  {errors.packages}
                </p>
              )}
            </fieldset>
            {values.selectedProduct && (
              <p className="note-box">
                Selected profile: {values.selectedProduct}
              </p>
            )}
            {values.selectedCategory && (
              <p className="note-box">
                Selected category: {values.selectedCategory}
              </p>
            )}
          </>
        )}
        {step === 3 && (
          <div className="form-grid">
            {field("pricingPurpose", {
              options: pricingOptions,
              required: true,
            })}
            {field("alternatives", { options: ["Yes", "No", "Discuss"] })}
            {field("scope", { area: true, required: true })}
            {field("quantity", { type: "number" })}
            {field("unit", {
              options: [
                "m²",
                "m³",
                "Linear metres",
                "Units",
                "Tonnes",
                "Package",
                "Other",
              ],
            })}
            {field("packageValue", { placeholder: "AUD, optional" })}
            {field("targetRate", { placeholder: "AUD / unit, optional" })}
            {field("supplierQuote", { area: true })}
            {field("deliveryRequirements", { area: true })}
          </div>
        )}
        {step === 4 && (
          <>
            <div className="form-grid">
              {field("documentLink", {
                type: "url",
                placeholder: "https://www.dropbox.com/…",
              })}
              <p className="form-description">
                Paste a secure link to your drawing package, BOQ, specifications
                or material schedules. Please ensure GLANHEIM has appropriate
                access.
              </p>
              {field("drawingRevision")}
              {field("documentDescription", { area: true })}
            </div>
            <a
              className="button"
              href={
                uploadUrl ||
                "mailto:info@glanheim.com?subject=Request%20a%20secure%20upload%20link"
              }
              {...(uploadUrl
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {uploadUrl
                ? "Upload drawings securely"
                : "Request a secure upload link"}{" "}
              <span aria-hidden="true">↗</span>
            </a>
            <p className="form-description mt-4">
              Uploading files separately does not submit this enquiry. Include
              the project name with your upload. Only share documents you have
              authority to disclose.
            </p>
            <label className="checkbox-label consent">
              <input
                id="authority"
                type="checkbox"
                disabled={busy || !!submittedSnapshot}
                checked={values.authority}
                onChange={(e) => update("authority", e.target.checked)}
                aria-describedby={
                  errors.authority ? "authority-error" : undefined
                }
              />
              <span>
                I am authorised to share this project information and any linked
                documents with GLANHEIM. *
              </span>
            </label>
            {errors.authority && (
              <p id="authority-error" className="field-error">
                {errors.authority}
              </p>
            )}
          </>
        )}
        {step === 5 && (
          <>
            {steps.slice(0, 5).map((s, i) => (
              <section className="review-section" key={s}>
                <h3>{s}</h3>
                <dl>
                  {stepFields[i].map((k) => (
                    <div key={k}>
                      <dt>{labels[k]}</dt>
                      <dd>
                        {typeof values[k] === "boolean"
                          ? values[k]
                            ? "Confirmed"
                            : "Not confirmed"
                          : Array.isArray(values[k])
                            ? (values[k] as string[]).join(", ")
                            : String(values[k] || "Not provided")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
            <label className="checkbox-label consent">
              <input
                id="privacy"
                type="checkbox"
                checked={values.privacy}
                disabled={busy || !!submittedSnapshot}
                onChange={(e) => update("privacy", e.target.checked)}
                aria-describedby={errors.privacy ? "privacy-error" : undefined}
              />
              <span>
                I acknowledge the{" "}
                <Link href="/privacy" target="_blank">
                  privacy policy
                </Link>{" "}
                and{" "}
                <Link href="/enquiry-terms" target="_blank">
                  enquiry terms
                </Link>
                , including project-specific review and confidential document
                handling. *
              </span>
            </label>
            {errors.privacy && (
              <p className="field-error" id="privacy-error">
                {errors.privacy}
              </p>
            )}
          </>
        )}
        {failure && (
          <div ref={alert} tabIndex={-1} className="form-alert" role="alert">
            <p>{failure}</p>
            <a href="mailto:info@glanheim.com?subject=Project%20pricing%20enquiry">
              Email info@glanheim.com ↗
            </a>
            {hasAttempted && submittedSnapshot && (
              <p className="mt-3">
                A retry uses the same enquiry to avoid duplicates. To revise the
                brief, reload this page.
              </p>
            )}
          </div>
        )}
        <div className="form-actions">
          {step > 0 ? (
            <button
              className="back-button"
              type="button"
              disabled={busy}
              onClick={() => changeStep(step - 1)}
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          <button className="button" type="submit" disabled={busy}>
            {busy
              ? "Sending…"
              : step === 5
                ? "Submit project for review"
                : "Continue"}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>
    </section>
  );
}
