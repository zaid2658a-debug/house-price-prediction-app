import { useEffect, useState } from "react";
import type { PredictionRequest } from "../types/prediction";
import { fetchLocations } from "../api/predictionClient";

const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"];
const TRANSACTION_OPTIONS = ["New Property", "Resale", "Rent/Lease", "Other"];
const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Co-operative Society", "Power Of Attorney"];
const FACING_OPTIONS = [
  "East",
  "West",
  "North",
  "South",
  "North - East",
  "North - West",
  "South - East",
  "South -West",
];

type FormErrors = Partial<Record<keyof PredictionRequest, string>>;

interface Props {
  onSubmit: (payload: PredictionRequest) => void;
  submitting: boolean;
}

export default function PredictionForm({ onSubmit, submitting }: Props) {
  const [locations, setLocations] = useState<string[]>([]);
  const [locationsError, setLocationsError] = useState<string | null>(null);

  const [form, setForm] = useState<PredictionRequest>({
    carpet_area_sqft: 0,
    floor_num: 0,
    bathroom: 1,
    balcony: 0,
    location: "",
    furnishing: FURNISHING_OPTIONS[0],
    transaction: TRANSACTION_OPTIONS[0],
    ownership: OWNERSHIP_OPTIONS[0],
    facing: FACING_OPTIONS[0],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchLocations()
      .then((locs) => {
        setLocations(locs);
        if (locs.length > 0) {
          setForm((f) => ({ ...f, location: locs[0] }));
        }
      })
      .catch(() => setLocationsError("Couldn't load the locations list."));
  }, []);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.location) next.location = "Choose a location.";
    if (!form.carpet_area_sqft || form.carpet_area_sqft <= 0) {
      next.carpet_area_sqft = "Must be greater than 0.";
    }
    if (form.bathroom < 0) next.bathroom = "Can't be negative.";
    if (form.balcony < 0) next.balcony = "Can't be negative.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  }

  function update<K extends keyof PredictionRequest>(key: K, value: PredictionRequest[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="spec-sheet">
      <div className="spec-group">
        <span className="spec-group__label">01 · Location &amp; area</span>
        <div className="field-row">
          <label className="field field--full" htmlFor="location">
            <span className="field__label">Location</span>
            <select
              id="location"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            >
              {locations.length === 0 && <option value="">Loading…</option>}
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            {locationsError && <span className="field__error">{locationsError}</span>}
            {errors.location && <span className="field__error">{errors.location}</span>}
          </label>

          <label className="field" htmlFor="carpet_area_sqft">
            <span className="field__label">
              Carpet area <span className="field__unit">(sqft)</span>
            </span>
            <input
              id="carpet_area_sqft"
              type="number"
              min={1}
              value={form.carpet_area_sqft || ""}
              onChange={(e) => update("carpet_area_sqft", Number(e.target.value))}
            />
            {errors.carpet_area_sqft && (
              <span className="field__error">{errors.carpet_area_sqft}</span>
            )}
          </label>

          <label className="field" htmlFor="floor_num">
            <span className="field__label">Floor</span>
            <input
              id="floor_num"
              type="number"
              value={form.floor_num}
              onChange={(e) => update("floor_num", Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="spec-group">
        <span className="spec-group__label">02 · Layout</span>
        <div className="field-row">
          <label className="field" htmlFor="bathroom">
            <span className="field__label">Bathrooms</span>
            <input
              id="bathroom"
              type="number"
              min={0}
              value={form.bathroom}
              onChange={(e) => update("bathroom", Number(e.target.value))}
            />
            {errors.bathroom && <span className="field__error">{errors.bathroom}</span>}
          </label>

          <label className="field" htmlFor="balcony">
            <span className="field__label">Balconies</span>
            <input
              id="balcony"
              type="number"
              min={0}
              value={form.balcony}
              onChange={(e) => update("balcony", Number(e.target.value))}
            />
            {errors.balcony && <span className="field__error">{errors.balcony}</span>}
          </label>

          <label className="field" htmlFor="furnishing">
            <span className="field__label">Furnishing</span>
            <select
              id="furnishing"
              value={form.furnishing}
              onChange={(e) => update("furnishing", e.target.value)}
            >
              {FURNISHING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="transaction">
            <span className="field__label">Transaction</span>
            <select
              id="transaction"
              value={form.transaction}
              onChange={(e) => update("transaction", e.target.value)}
            >
              {TRANSACTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="spec-group">
        <span className="spec-group__label">03 · Classification</span>
        <div className="field-row">
          <label className="field" htmlFor="ownership">
            <span className="field__label">Ownership</span>
            <select
              id="ownership"
              value={form.ownership}
              onChange={(e) => update("ownership", e.target.value)}
            >
              {OWNERSHIP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="facing">
            <span className="field__label">Facing</span>
            <select
              id="facing"
              value={form.facing}
              onChange={(e) => update("facing", e.target.value)}
            >
              {FACING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="spec-sheet__footer">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Calculating…" : "Estimate price"}
        </button>
      </div>
    </form>
  );
}