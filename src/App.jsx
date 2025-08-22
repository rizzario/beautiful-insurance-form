import React, { useMemo, useState } from "react";

/**
 * Modern Multi‑Step Insurance Form (no icons, no external assets)
 * - Steps: Vehicle → Insurant → Product → Price → Review → Submit
 * - Accessible labels, simple validation, keyboard-friendly
 * - Clean Tailwind UI with cards and progress indicator
 * - Pure React; no external dependencies beyond React/Tailwind
 */

const MAKES = [
  "Audi",
  "BMW",
  "Ford",
  "Honda",
  "Mercedes",
  "Nissan",
  "Toyota",
  "Volkswagen",
];

const COUNTRIES = [
  "Thailand",
  "United States",
  "Germany",
  "United Kingdom",
  "India",
  "Australia",
  "Japan",
];

const OCCUPATIONS = [
  "Employee",
  "Self-Employed",
  "Unemployed",
  "Student",
  "Retired",
];

const INSURANCE_SUMS = [
  { label: "€ 3,000,000", value: 3000000 },
  { label: "€ 5,000,000", value: 5000000 },
  { label: "€ 10,000,000", value: 10000000 },
];

const DAMAGE_OPTIONS = [
  { label: "Partial Coverage", value: "partial" },
  { label: "Full Coverage", value: "full" },
  { label: "Third‑Party Only", value: "tpo" },
];

const OPTIONAL_PRODUCTS = [
  { label: "Legal Protection", value: "legal" },
  { label: "Breakdown Cover", value: "breakdown" },
  { label: "Glass Protection", value: "glass" },
];

const COURTESY_CAR = [
  { label: "No", value: "no" },
  { label: "Yes", value: "yes" },
];

const initialData = {
  // Vehicle
  make: "",
  enginePerformance: "",
  manufactureDate: "",
  seats: "",
  fuel: "",
  listPrice: "",
  licensePlate: "",
  annualMileage: "",
  // Insurant
  firstName: "",
  lastName: "",
  birthDate: "",
  gender: "",
  street: "",
  country: "",
  zip: "",
  city: "",
  occupation: "",
  hobbies: [],
  // Product
  startDate: "",
  insuranceSum: INSURANCE_SUMS[1].value,
  damage: DAMAGE_OPTIONS[0].value,
  optionalProducts: [],
  courtesyCar: COURTESY_CAR[0].value,
  // Price selection
  selectedPlan: "",
};

const STEPS = [
  { key: "vehicle", title: "Vehicle" },
  { key: "insurant", title: "Insurant" },
  { key: "product", title: "Product" },
  { key: "price", title: "Price" },
  { key: "review", title: "Review" },
];

function Stepper({ step }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => {
          const index = i + 1;
          const active = step === i;
          const done = i < step;
          return (
            <div key={s.key} className="flex-1 flex items-center">
              <div
                className={
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition " +
                  (done
                    ? "bg-emerald-600 text-white"
                    : active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-600")
                }
                aria-current={active ? "step" : undefined}
              >
                {index}
              </div>
              <div className="ml-3 text-sm font-medium text-slate-800 hidden md:block">
                {s.title}
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-[2px] mx-3 bg-slate-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, htmlFor, required, children, help }) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-800">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="mt-1">{children}</div>
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-slate-500 " +
        (props.className ?? "")
      }
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={
        "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 " +
        (props.className ?? "")
      }
    />
  );
}

function Checkbox({ label, checked, onChange }) {
  const id = React.useId();
  return (
    <label htmlFor={id} className="flex items-center space-x-2 text-sm">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function Radio({ name, value, checked, onChange, label }) {
  const id = React.useId();
  return (
    <label htmlFor={id} className="flex items-center space-x-2 text-sm">
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        className="h-4 w-4"
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>{label}</span>
    </label>
  );
}

function SectionCard({ title, children, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function computeQuote(data) {
  // Base premium by make (arbitrary demo numbers)
  const baseByMake = {
    Audi: 500,
    BMW: 520,
    Ford: 430,
    Honda: 420,
    Mercedes: 560,
    Nissan: 410,
    Toyota: 415,
    Volkswagen: 440,
  };
  const base = baseByMake[data.make] || 450;

  // Adjustments
  let adj = 0;
  const perf = Number(data.enginePerformance || 0);
  if (perf > 180) adj += 120;
  else if (perf > 120) adj += 60;

  const price = Number(data.listPrice || 0);
  if (price > 50000) adj += 150;
  else if (price > 30000) adj += 80;

  const mileage = Number(data.annualMileage || 0);
  if (mileage > 20000) adj += 100;
  else if (mileage > 12000) adj += 50;

  // Product choices
  if (data.damage === "full") adj += 200;
  if (data.damage === "partial") adj += 80;
  if (data.optionalProducts?.includes("legal")) adj += 40;
  if (data.optionalProducts?.includes("breakdown")) adj += 35;
  if (data.optionalProducts?.includes("glass")) adj += 25;
  if (data.courtesyCar === "yes") adj += 30;

  // Simple age adjustment from birth year
  const birth = data.birthDate ? new Date(data.birthDate) : null;
  if (birth) {
    const age = Math.max(16, Math.min(90, Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 3600 * 1000))));
    if (age < 25) adj += 120;
    if (age > 70) adj += 90;
  }

  const monthly = Math.max(25, Math.round((base + adj) * 0.12));
  const yearly = monthly * 12;

  return {
    basic: { monthly, yearly },
    plus: { monthly: monthly + 20, yearly: (monthly + 20) * 12 },
    premium: { monthly: monthly + 45, yearly: (monthly + 45) * 12 },
  };
}

function currency(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(n);
}

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);
  const quotes = useMemo(() => computeQuote(data), [data]);

  function update(field, value) {
    setData((d) => ({ ...d, [field]: value }));
  }

  function toggleArray(field, value, checked) {
    setData((d) => {
      const set = new Set(d[field] || []);
      if (checked) set.add(value);
      else set.delete(value);
      return { ...d, [field]: Array.from(set) };
    });
  }

  function validate(currentStep) {
    const errors = [];
    const required = (field, label = field) => {
      if (!String(data[field] ?? "").trim()) errors.push(`${label} is required`);
    };

    if (currentStep === 0) {
      [
        ["make", "Make"],
        ["enginePerformance", "Engine performance"],
        ["manufactureDate", "Manufacture date"],
        ["seats", "Number of seats"],
        ["fuel", "Fuel"],
        ["listPrice", "List price"],
        ["annualMileage", "Annual mileage"],
      ].forEach(([f, l]) => required(f, l));
    }
    if (currentStep === 1) {
      [
        ["firstName", "First name"],
        ["lastName", "Last name"],
        ["birthDate", "Birth date"],
        ["gender", "Gender"],
        ["street", "Street address"],
        ["country", "Country"],
        ["zip", "ZIP"],
        ["city", "City"],
        ["occupation", "Occupation"],
      ].forEach(([f, l]) => required(f, l));
    }
    if (currentStep === 2) {
      [["startDate", "Start date"]].forEach(([f, l]) => required(f, l));
    }

    return errors;
  }

  function next() {
    const errs = validate(step);
    if (errs.length) {
      alert("Please correct the following:\n\n" + errs.join("\n"));
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit() {
    if (!data.selectedPlan) {
      alert("Please select a price plan before submitting.");
      return;
    }
    // Demo: pretend submit succeeded
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Practice Insurance Quote
          </h1>
          <p className="text-slate-600 mt-1">
            A clean, multi‑step form to practice automation or form handling. No icons or external assets.
          </p>
        </header>

        <div className="mb-8">
          <Stepper step={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {step === 0 && (
              <SectionCard title="Vehicle" description="Tell us about the vehicle to be insured.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Make" htmlFor="make" required>
                    <Select
                      id="make"
                      value={data.make}
                      onChange={(e) => update("make", e.target.value)}
                    >
                      <option value="">Select make…</option>
                      {MAKES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Engine performance (kW)" htmlFor="enginePerformance" required>
                    <Input
                      id="enginePerformance"
                      type="number"
                      min={1}
                      placeholder="e.g., 110"
                      value={data.enginePerformance}
                      onChange={(e) => update("enginePerformance", e.target.value)}
                    />
                  </Field>
                  <Field label="Date of manufacture" htmlFor="manufactureDate" required>
                    <Input
                      id="manufactureDate"
                      type="date"
                      value={data.manufactureDate}
                      onChange={(e) => update("manufactureDate", e.target.value)}
                    />
                  </Field>
                  <Field label="Number of seats" htmlFor="seats" required>
                    <Input
                      id="seats"
                      type="number"
                      min={1}
                      max={9}
                      value={data.seats}
                      onChange={(e) => update("seats", e.target.value)}
                    />
                  </Field>
                  <Field label="Fuel" htmlFor="fuel" required>
                    <Select id="fuel" value={data.fuel} onChange={(e) => update("fuel", e.target.value)}>
                      <option value="">Select fuel…</option>
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Hybrid</option>
                      <option>Electric</option>
                    </Select>
                  </Field>
                  <Field label="List price (EUR)" htmlFor="listPrice" required>
                    <Input
                      id="listPrice"
                      type="number"
                      min={500}
                      step={100}
                      placeholder="e.g., 24000"
                      value={data.listPrice}
                      onChange={(e) => update("listPrice", e.target.value)}
                    />
                  </Field>
                  <Field label="License plate number" htmlFor="licensePlate" help="Optional">
                    <Input
                      id="licensePlate"
                      placeholder="e.g., ABC‑1234"
                      value={data.licensePlate}
                      onChange={(e) => update("licensePlate", e.target.value)}
                    />
                  </Field>
                  <Field label="Annual mileage (km)" htmlFor="annualMileage" required>
                    <Input
                      id="annualMileage"
                      type="number"
                      min={0}
                      step={500}
                      placeholder="e.g., 15000"
                      value={data.annualMileage}
                      onChange={(e) => update("annualMileage", e.target.value)}
                    />
                  </Field>
                </div>
              </SectionCard>
            )}

            {step === 1 && (
              <SectionCard title="Insurant" description="Basic information about the policy holder.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="First name" htmlFor="firstName" required>
                    <Input
                      id="firstName"
                      value={data.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                    />
                  </Field>
                  <Field label="Last name" htmlFor="lastName" required>
                    <Input
                      id="lastName"
                      value={data.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                    />
                  </Field>
                  <Field label="Birth date" htmlFor="birthDate" required>
                    <Input
                      id="birthDate"
                      type="date"
                      value={data.birthDate}
                      onChange={(e) => update("birthDate", e.target.value)}
                    />
                  </Field>
                  <Field label="Gender" htmlFor="gender" required>
                    <div className="flex gap-6 py-2">
                      {[
                        { label: "Female", value: "female" },
                        { label: "Male", value: "male" },
                        { label: "Other", value: "other" },
                      ].map((g) => (
                        <Radio
                          key={g.value}
                          name="gender"
                          label={g.label}
                          value={g.value}
                          checked={data.gender === g.value}
                          onChange={(v) => update("gender", v)}
                        />
                      ))}
                    </div>
                  </Field>
                  <Field label="Street address" htmlFor="street" required>
                    <Input
                      id="street"
                      value={data.street}
                      onChange={(e) => update("street", e.target.value)}
                    />
                  </Field>
                  <Field label="Country" htmlFor="country" required>
                    <Select
                      id="country"
                      value={data.country}
                      onChange={(e) => update("country", e.target.value)}
                    >
                      <option value="">Select country…</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="ZIP" htmlFor="zip" required>
                    <Input id="zip" value={data.zip} onChange={(e) => update("zip", e.target.value)} />
                  </Field>
                  <Field label="City" htmlFor="city" required>
                    <Input id="city" value={data.city} onChange={(e) => update("city", e.target.value)} />
                  </Field>
                  <Field label="Occupation" htmlFor="occupation" required>
                    <Select
                      id="occupation"
                      value={data.occupation}
                      onChange={(e) => update("occupation", e.target.value)}
                    >
                      <option value="">Select occupation…</option>
                      {OCCUPATIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Hobbies" htmlFor="hobbies">
                    <div className="grid grid-cols-2 gap-2 py-2">
                      {[
                        "Cliff Diving",
                        "Skydiving",
                        "Bungee Jumping",
                        "Hiking",
                        "Reading",
                        "Cooking",
                      ].map((h) => (
                        <Checkbox
                          key={h}
                          label={h}
                          checked={data.hobbies.includes(h)}
                          onChange={(checked) => toggleArray("hobbies", h, checked)}
                        />
                      ))}
                    </div>
                  </Field>
                </div>
              </SectionCard>
            )}

            {step === 2 && (
              <SectionCard title="Product" description="Desired coverage and start date.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Start date" htmlFor="startDate" required>
                    <Input
                      id="startDate"
                      type="date"
                      value={data.startDate}
                      onChange={(e) => update("startDate", e.target.value)}
                    />
                  </Field>
                  <Field label="Insurance sum" htmlFor="insuranceSum">
                    <Select
                      id="insuranceSum"
                      value={data.insuranceSum}
                      onChange={(e) => update("insuranceSum", Number(e.target.value))}
                    >
                      {INSURANCE_SUMS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Damage insurance" htmlFor="damage">
                    <Select
                      id="damage"
                      value={data.damage}
                      onChange={(e) => update("damage", e.target.value)}
                    >
                      {DAMAGE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Optional products" htmlFor="optionalProducts">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2">
                      {OPTIONAL_PRODUCTS.map((p) => (
                        <Checkbox
                          key={p.value}
                          label={p.label}
                          checked={data.optionalProducts.includes(p.value)}
                          onChange={(checked) => toggleArray("optionalProducts", p.value, checked)}
                        />
                      ))}
                    </div>
                  </Field>
                  <Field label="Courtesy car" htmlFor="courtesyCar">
                    <div className="flex gap-6 py-2">
                      {COURTESY_CAR.map((c) => (
                        <Radio
                          key={c.value}
                          name="courtesy"
                          label={c.label}
                          value={c.value}
                          checked={data.courtesyCar === c.value}
                          onChange={(v) => update("courtesyCar", v)}
                        />
                      ))}
                    </div>
                  </Field>
                </div>
              </SectionCard>
            )}

            {step === 3 && (
              <SectionCard title="Price" description="Select a monthly plan.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: "basic", label: "Basic", desc: "Essential coverage" },
                    { key: "plus", label: "Plus", desc: "Added benefits" },
                    { key: "premium", label: "Premium", desc: "Maximum coverage" },
                  ].map((p) => (
                    <button
                      key={p.key}
                      onClick={() => update("selectedPlan", p.key)}
                      className={
                        "text-left rounded-2xl border p-5 transition focus:outline-none " +
                        (data.selectedPlan === p.key
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 hover:border-slate-400 bg-white")
                      }
                    >
                      <div className="text-sm font-semibold">{p.label}</div>
                      <div className="text-2xl font-bold mt-1">
                        {currency(quotes[p.key].monthly)}/mo
                      </div>
                      <div className={
                        "mt-1 text-sm " +
                        (data.selectedPlan === p.key ? "text-slate-200" : "text-slate-600")
                      }>
                        {p.desc}
                      </div>
                      <div className={
                        "mt-3 text-xs " +
                        (data.selectedPlan === p.key ? "text-slate-300" : "text-slate-500")
                      }>
                        {currency(quotes[p.key].yearly)} per year
                      </div>
                    </button>
                  ))}
                </div>
              </SectionCard>
            )}

            {step === 4 && (
              <SectionCard title="Review" description="Confirm details and submit.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900">Vehicle</h3>
                    <dl className="grid grid-cols-3 gap-x-2 gap-y-1">
                      <dt className="text-slate-500">Make</dt><dd className="col-span-2">{data.make || "—"}</dd>
                      <dt className="text-slate-500">Engine</dt><dd className="col-span-2">{data.enginePerformance || "—"} kW</dd>
                      <dt className="text-slate-500">Manufactured</dt><dd className="col-span-2">{data.manufactureDate || "—"}</dd>
                      <dt className="text-slate-500">Seats</dt><dd className="col-span-2">{data.seats || "—"}</dd>
                      <dt className="text-slate-500">Fuel</dt><dd className="col-span-2">{data.fuel || "—"}</dd>
                      <dt className="text-slate-500">List Price</dt><dd className="col-span-2">{data.listPrice ? currency(Number(data.listPrice)) : "—"}</dd>
                      <dt className="text-slate-500">Mileage</dt><dd className="col-span-2">{data.annualMileage || "—"} km</dd>
                    </dl>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900">Insurant</h3>
                    <dl className="grid grid-cols-3 gap-x-2 gap-y-1">
                      <dt className="text-slate-500">Name</dt><dd className="col-span-2">{data.firstName || "—"} {data.lastName || ""}</dd>
                      <dt className="text-slate-500">Birth Date</dt><dd className="col-span-2">{data.birthDate || "—"}</dd>
                      <dt className="text-slate-500">Gender</dt><dd className="col-span-2">{data.gender || "—"}</dd>
                      <dt className="text-slate-500">Address</dt><dd className="col-span-2">{data.street || "—"}, {data.city || "—"}, {data.zip || "—"}, {data.country || "—"}</dd>
                      <dt className="text-slate-500">Occupation</dt><dd className="col-span-2">{data.occupation || "—"}</dd>
                      <dt className="text-slate-500">Hobbies</dt><dd className="col-span-2">{data.hobbies.length ? data.hobbies.join(', ') : "—"}</dd>
                    </dl>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <h3 className="font-semibold text-slate-900">Product</h3>
                    <dl className="grid grid-cols-3 gap-x-2 gap-y-1">
                      <dt className="text-slate-500">Start</dt><dd className="col-span-2">{data.startDate || "—"}</dd>
                      <dt className="text-slate-500">Sum</dt><dd className="col-span-2">{currency(Number(data.insuranceSum))}</dd>
                      <dt className="text-slate-500">Damage</dt><dd className="col-span-2">{data.damage}</dd>
                      <dt className="text-slate-500">Options</dt><dd className="col-span-2">{data.optionalProducts.length ? data.optionalProducts.join(', ') : "—"}</dd>
                      <dt className="text-slate-500">Courtesy Car</dt><dd className="col-span-2">{data.courtesyCar}</dd>
                      <dt className="text-slate-500">Selected Plan</dt><dd className="col-span-2">{data.selectedPlan || "—"}</dd>
                    </dl>
                  </div>
                </div>
              </SectionCard>
            )}

            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-5">
                <div className="font-semibold">Submitted successfully</div>
                <div className="text-sm mt-1">This is a demo submission. Use this app to practice automation workflows or form handling.</div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={back}
                disabled={step === 0}
                className="px-4 py-2 rounded-xl border border-slate-300 disabled:opacity-50"
              >
                Back
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  onClick={next}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submit}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90"
                >
                  Submit
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <SectionCard
              title="Live Quote Overview"
              description="Numbers update as you change inputs."
            >
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="text-xs text-slate-600">Basic</div>
                  <div className="text-lg font-bold">{currency(quotes.basic.monthly)}</div>
                  <div className="text-xs text-slate-500">/mo</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="text-xs text-slate-600">Plus</div>
                  <div className="text-lg font-bold">{currency(quotes.plus.monthly)}</div>
                  <div className="text-xs text-slate-500">/mo</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="text-xs text-slate-600">Premium</div>
                  <div className="text-lg font-bold">{currency(quotes.premium.monthly)}</div>
                  <div className="text-xs text-slate-500">/mo</div>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Practice Notes" description="Tips for automation scripts.">
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
                <li>Each field has stable <em>id</em> attributes for reliable selectors.</li>
                <li>Validation triggers on <strong>Next</strong>; capture alert text for negative tests.</li>
                <li>Price cards are clickable; assert selection state via background color.</li>
                <li>Final submission shows a success message block.</li>
              </ul>
            </SectionCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
// End of App.jsx