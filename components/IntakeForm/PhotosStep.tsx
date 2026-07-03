"use client";

import { PhotoUploader, UploadedFile } from "../PhotoUploader";

export interface PhotosValues {
  method: "upload" | "schedule";
  requestedDates: string;
  bestTimeOfDay: string;
  accessNotes: string;
}

export function PhotosStep({
  values,
  onChange,
  orderId,
  maxFiles,
  includesPhotography,
  onUploaded
}: {
  values: PhotosValues;
  onChange: (values: PhotosValues) => void;
  orderId: string;
  maxFiles: number;
  includesPhotography: boolean;
  onUploaded: (files: UploadedFile[]) => void;
}) {
  function set<K extends keyof PhotosValues>(key: K, value: PhotosValues[K]) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="space-y-6">
      {includesPhotography && (
        <div>
          <p className="font-semibold text-navy">How would you like to handle photos?</p>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={values.method === "schedule"}
                onChange={() => set("method", "schedule")}
              />
              Schedule a session with a professional photographer
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={values.method === "upload"}
                onChange={() => set("method", "upload")}
              />
              Upload my own photos
            </label>
          </div>
        </div>
      )}

      {values.method === "schedule" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-navy">Preferred dates (list 2–3)</span>
            <input
              className="input mt-1"
              placeholder="e.g. July 10, July 12, July 14"
              value={values.requestedDates}
              onChange={(e) => set("requestedDates", e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-navy">Best time of day</span>
            <select className="input mt-1" value={values.bestTimeOfDay} onChange={(e) => set("bestTimeOfDay", e.target.value)}>
              <option value="">Select...</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="twilight">Twilight</option>
            </select>
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-navy">Access notes</span>
            <input className="input mt-1" value={values.accessNotes} onChange={(e) => set("accessNotes", e.target.value)} />
          </label>
        </div>
      ) : (
        <PhotoUploader orderId={orderId} maxFiles={maxFiles} onUploaded={onUploaded} />
      )}
    </div>
  );
}
