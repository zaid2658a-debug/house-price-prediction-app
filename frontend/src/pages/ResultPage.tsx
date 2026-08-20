import { Link, useLocation, Navigate } from "react-router-dom";
import type { PredictionRequest } from "../types/prediction";

function formatIndianPrice(price: number): string {
  if (price >= 1e7) {
    return `₹ ${(price / 1e7).toFixed(2)} Cr`;
  }
  if (price >= 1e5) {
    return `₹ ${(price / 1e5).toFixed(2)} Lac`;
  }
  return `₹ ${price.toLocaleString("en-IN")}`;
}

interface LocationState {
  predictedPrice?: number;
  inputs?: PredictionRequest;
}

export default function ResultPage() {
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  if (typeof state.predictedPrice !== "number") {
    return <Navigate to="/" replace />;
  }

  const { predictedPrice, inputs } = state;

  return (
    <div className="sheet">
      <span className="crop crop-tl" aria-hidden="true" />
      <span className="crop crop-tr" aria-hidden="true" />
      <span className="crop crop-bl" aria-hidden="true" />
      <span className="crop crop-br" aria-hidden="true" />

      <header className="title-block">
        <span className="title-block__eyebrow">Sheet 002 / Valuation Result</span>
        <span>India · Residential</span>
      </header>

      <main className="result">
        <span className="result__eyebrow">Estimated market value</span>
        <div className="result__price">{formatIndianPrice(predictedPrice)}</div>
        <p className="result__sub">
          {Math.round(predictedPrice).toLocaleString("en-IN")} rupees
        </p>

        {inputs && (
          <div className="result__specs">
            <dl>
              <div>
                <dt>Location</dt>
                <dd>{inputs.location}</dd>
              </div>
              <div>
                <dt>Carpet area</dt>
                <dd>{inputs.carpet_area_sqft} sqft</dd>
              </div>
              <div>
                <dt>Floor</dt>
                <dd>{inputs.floor_num}</dd>
              </div>
              <div>
                <dt>Bathrooms / balconies</dt>
                <dd>
                  {inputs.bathroom} / {inputs.balcony}
                </dd>
              </div>
              <div>
                <dt>Furnishing</dt>
                <dd>{inputs.furnishing}</dd>
              </div>
              <div>
                <dt>Transaction</dt>
                <dd>{inputs.transaction}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="result__actions">
          <Link to="/" className="btn-ghost">
            ↺ New estimate
          </Link>
        </div>
      </main>
    </div>
  );
}