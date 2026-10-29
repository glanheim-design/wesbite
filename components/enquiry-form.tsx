"use client";
import Link from "next/link";
import { useProductSelection } from "./product-selection";
import { itemSummary, briefEmail, enquiryBrief } from "@/lib/enquiry-brief";
import type { EnquiryTransport } from "@/lib/enquiry-config";
import {
  selectionFromQuery,
  selectionSummary,
  productCollections,
} from "@/lib/products";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
    measurementMethod: "Review supplied drawings",
    measurements: "",
    items: [],
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
  transport = enabled ? "api" : "email",
  submissionId,
  startedAt,
}: {
  uploadUrl: string | null;
  enabled: boolean;
  transport?: EnquiryTransport;
  submissionId: string;
  startedAt: number;
}) {
  const basket = useProductSelection();
  const params = useSearchParams();
  const router = useRouter();
  const selectedProducts = selectionFromQuery(params.get("selection"));
  const selectedCollections = productCollections.filter((c) =>
    selectedProducts.some((p) => p.collection === c.id),
  );
  const [formValues, setValues] = useState<FormValues>(() => ({
    ...defaults(),
    submissionId,
    startedAt,
    selectedProduct: (selectedProducts.length
      ? selectionSummary(selectedProducts)
      : params.get("product") || ""
    ).slice(0, 12000),
    position: (params.get("role") || "").slice(0, 120),
    packages: [
      ...new Set([
        ...params.getAll("material"),
        ...selectedCollections.map((c) => c.materialPackage),
      ]),
    ].filter((v): v is (typeof packageOptions)[number] =>
      packageOptions.includes(v as (typeof packageOptions)[number]),
    ),
    selectedCategory: (selectedCollections.length
      ? selectedCollections.map((c) => c.name).join(", ")
      : params.get("package") || ""
    ).slice(0, 1000),
  }));
  const queryIds = params.get("selection");
  const basketSource = queryIds === null || params.get("from") === "basket";
  const chosenIds = basketSource
    ? basket.ids
    : selectedProducts.map((p) => p.id);
  const chosenProducts = selectionFromQuery(chosenIds.join(","));
  const lineItems = chosenProducts.map(
    (p) =>
      basket.items.find((item) => item.id === p.id) || {
        id: p.id,
        quantity: "",
        measurements: "",
        notes: "",
      },
  );
  const chosenCollections = productCollections.filter((c) =>
    chosenProducts.some((p) => p.collection === c.id),
  );
  const values: FormValues = {
    ...formValues,
    items: lineItems,
    selectedProduct: chosenProducts.length
      ? selectionSummary(chosenProducts).slice(0, 12000)
      : basketSource
        ? ""
        : formValues.selectedProduct,
    selectedCategory: chosenCollections.length
      ? chosenCollections.map((c) => c.name).join(", ")
      : basketSource
        ? ""
        : formValues.selectedCategory,
  };
  const [draftLoaded, setDraftLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("glanheim-enquiry-draft") || "null",
      );
      if (saved && typeof saved === "object")
        setValues(
          (current) =>
            Object.fromEntries(
              Object.entries(current).map(([key, value]) => [
                key,
                [
                  "submissionId",
                  "startedAt",
                  "website",
                  "items",
                  "selectedProduct",
                  "selectedCategory",
                ].includes(key)
                  ? value
                  : typeof saved[key] === typeof value
                    ? saved[key]
                    : value,
              ]),
            ) as FormValues,
        );
    } catch {
      /* A draft is optional. */
    }
    setDraftLoaded(true);
  }, []);
  useEffect(() => {
    if (!draftLoaded) return;
    try {
      sessionStorage.setItem(
        "glanheim-enquiry-draft",
        JSON.stringify(formValues),
      );
    } catch {
      /* The enquiry still works without browser storage. */
    }
  }, [formValues, draftLoaded]);
  const [emailPrepared, setEmailPrepared] = useState(false);
  const [nativeReceipt, setNativeReceipt] = useState<string | null>(null);
  function downloadBrief(data: Enquiry) {
    const url = URL.createObjectURL(
      new Blob([enquiryBrief(data)], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `GLANHEIM-enquiry-${data.submissionId.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }
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
    if (transport === "email") {
      const draft = briefEmail(all.data);
      downloadBrief(all.data);
      setEmailPrepared(true);
      window.location.href = draft.href;
      return;
    }
    setBusy(true);
    setFailure("");
    setHasAttempted(true);
    const payload = submittedSnapshot || values;
    if (!submittedSnapshot) setSubmittedSnapshot(values);
    try {
      if (transport === "netlify") {
        const parsed = enquirySchema.parse(payload);
        const encoded = new URLSearchParams({
          "form-name": "glanheim-project-enquiry",
          website: parsed.website,
          submissionId: parsed.submissionId,
          reference: `GL-${parsed.submissionId.slice(0, 8).toUpperCase()}`,
          fullName: parsed.fullName,
          company: parsed.company,
          email: parsed.email,
          phone: parsed.phone,
          projectName: parsed.projectName,
          enquiry: enquiryBrief(parsed),
        });
        const response = await fetch("/__forms.html", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encoded.toString(),
          signal: AbortSignal.timeout(30000),
        });
        const responseBody = await response.text();
        if (
          !response.ok ||
          responseBody.includes("GLANHEIM_FORM_DETECTION_ONLY")
        )
          throw new Error(
            "Online receipt could not be confirmed. Download your enquiry below and email it to info@glanheim.com, or retry.",
          );
        setNativeReceipt(`GL-${parsed.submissionId.slice(0, 8).toUpperCase()}`);
        try {
          sessionStorage.removeItem("glanheim-enquiry-draft");
        } catch {
          /* Optional tab draft. */
        }
        setBusy(false);
        return;
      }
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.fields) setErrors(json.fields);
        if ([400, 403, 413, 415, 429].includes(res.status)) {
          setSubmittedSnapshot(null);
        }
        throw new Error(json.error || "Your enquiry could not be confirmed.");
      }
      if (
        typeof json.reference !== "string" ||
        !/^GL-\d{4}-[A-F0-9]{8}$/.test(json.reference)
      ) {
        throw new Error(
          "Receipt could not be verified. Retry this enquiry or email info@glanheim.com.",
        );
      }
      try {
        sessionStorage.removeItem("glanheim-enquiry-draft");
      } catch {
        /* Optional tab draft. */
      }
      router.push("/enquiry-confirmation");
    } catch (e) {
      setFailure(
        e instanceof Error && ["TimeoutError", "AbortError"].includes(e.name)
          ? "Confirmation is taking too long. Retry the same enquiry or email info@glanheim.com. Your enquiry may already be saved."
          : e instanceof Error
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
            maxLength={["scope", "measurements"].includes(name) ? 6000 : 1500}
            placeholder={placeholder}
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
                <span>{i < step ? "Done" : String(i + 1)}</span>
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
      <form
        className="enquiry-form"
        method="post"
        action="/api/enquiries"
        noValidate
        onSubmit={submit}
      >
        <noscript>
          <p className="form-alert">
            JavaScript is required for this project form. Please email your
            enquiry to <a href="mailto:info@glanheim.com">info@glanheim.com</a>.
          </p>
        </noscript>
        {transport === "email" && (
          <div className="integration-note">
            <strong>Prepare your enquiry. Send it by email.</strong>
            <p>
              Your product schedule, measurements and project brief will be
              prepared together. At the final step, download a copy and open an
              email to{" "}
              <a className="underline" href="mailto:info@glanheim.com">
                info@glanheim.com
              </a>
              . Attach your drawings and the downloaded brief before sending.
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
            {field("company", {
              placeholder: "Optional for residential enquiries",
            })}
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
            <p className="note-box">
              <Link className="text-link" href="/enquiry">
                View and edit enquiry items ↗
              </Link>
              <br />
              Add quantities, measurements or drawing references for each
              product, or remove an item.
            </p>
            {values.selectedProduct && (
              <p className="note-box">
                Selected products:{" "}
                <span style={{ whiteSpace: "pre-line" }}>
                  {values.selectedProduct}
                </span>
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
            {field("measurementMethod", {
              options: [
                "Review supplied drawings",
                "Enter measurements",
                "Both",
              ],
            })}
            {field("measurements", {
              area: true,
              placeholder:
                "Include units. For example: opening D01, 1200 mm W × 2400 mm H; or refer to drawing A201, revision C. Leave dimensions for drawing review if not yet confirmed.",
            })}
            <p className="form-description full-width">
              Enter dimensions here or against each item in your enquiry. You
              can instead provide drawings in the next step and request a
              dimension review. Any quantities or dimensions taken from drawings
              will be confirmed with your project team before supply.
            </p>
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
            {values.items.length > 0 && (
              <section className="review-section">
                <h3>Item quantities & measurements</h3>
                <pre className="enquiry-schedule">
                  {itemSummary(values.items)}
                </pre>
                <Link className="text-link" href="/enquiry">
                  Edit enquiry items ↗
                </Link>
              </section>
            )}
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
            <p className="form-description">
              Submitting requests a project review. It does not place an order
              or make a supply contract. Enquiries, including inactive
              enquiries, remain on file; contact us to request access,
              correction or deletion.
            </p>
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
                I have read and agree to the{" "}
                <Link href="/privacy" target="_blank">
                  privacy policy
                </Link>{" "}
                ,{" "}
                <Link href="/terms" target="_blank">
                  website terms
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
        {nativeReceipt && (
          <div className="form-success" role="status">
            <h3>Enquiry submitted.</h3>
            <p>
              Reference: <strong>{nativeReceipt}</strong>. Your enquiry has been
              accepted for project review. Keep a copy of the brief for your
              records.
            </p>
            <button
              type="button"
              onClick={() => {
                const data = enquirySchema.safeParse(values);
                if (data.success) downloadBrief(data.data);
              }}
            >
              Download your enquiry
            </button>
          </div>
        )}
        {emailPrepared && (
          <div className="integration-note" role="status">
            <strong>Your enquiry is ready to send.</strong>
            <p>
              Send it from your email app to info@glanheim.com. Attach the
              downloaded brief and your authorised drawings. Opening a draft
              does not send the enquiry.
            </p>
          </div>
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
        {(step === 5 || failure) && (
          <button
            type="button"
            className="enquiry-download"
            onClick={() => {
              const parsed = enquirySchema.safeParse(values);
              if (parsed.success) downloadBrief(parsed.data);
              else
                setFailure(
                  "Complete the required details before downloading the full enquiry.",
                );
            }}
          >
            Download complete enquiry brief ↓
          </button>
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
          <button
            className="button"
            type="submit"
            disabled={busy || !!nativeReceipt || !basket.ready || !draftLoaded}
          >
            {busy
              ? "Sending…"
              : step === 5
                ? transport === "email"
                  ? "Download & open enquiry email"
                  : "Submit project for review"
                : "Continue"}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>
    </section>
  );
}
