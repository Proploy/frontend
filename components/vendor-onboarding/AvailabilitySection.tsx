'use client'

import React from 'react';
import Select from '@/components/ui/Select';
import { useExpertVocabulary, vocabularyLabels } from '@/features/experts/use-expert-vocabulary';
import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts';
import { MultiSelectDropdown } from './MultiSelectDropdown';

interface AvailabilitySectionProps {
  formData: VendorOnboardingData;
  setFormData: (data: VendorOnboardingData) => void;
  readOnly?: boolean;
}

// Fallbacks only. The API serves these lists so the directory's filters and
// this form cannot disagree; they keep a required field usable if it is
// unreachable. `service-apis/modules/experts/vocabulary.py` is the original.
const timezoneOptions = [
  'UTC-12:00 (Baker Island)',
  'UTC-11:00 (Samoa)',
  'UTC-10:00 (Hawaii)',
  'UTC-09:00 (Alaska)',
  'UTC-08:00 (Pacific Time)',
  'UTC-07:00 (Mountain Time)',
  'UTC-06:00 (Central Time)',
  'UTC-05:00 (Eastern Time)',
  'UTC-04:00 (Atlantic Time)',
  'UTC-03:00 (Buenos Aires)',
  'UTC-02:00 (Mid-Atlantic)',
  'UTC-01:00 (Azores)',
  'UTC+00:00 (London, Lisbon)',
  'UTC+01:00 (Berlin, Paris)',
  'UTC+02:00 (Cairo, Helsinki)',
  'UTC+03:00 (Moscow, Nairobi)',
  'UTC+04:00 (Dubai)',
  'UTC+05:00 (Karachi)',
  'UTC+05:30 (Mumbai)',
  'UTC+06:00 (Dhaka)',
  'UTC+07:00 (Bangkok)',
  'UTC+08:00 (Singapore)',
  'UTC+09:00 (Tokyo)',
  'UTC+10:00 (Sydney)',
  'UTC+11:00 (Solomon Islands)',
  'UTC+12:00 (Auckland)',
];

const regionOptions = [
  'North America',
  'South America',
  'Europe',
  'Middle East',
  'Africa',
  'Central Asia',
  'South Asia',
  'Southeast Asia',
  'East Asia',
  'Oceania',
];

// Controlled list so the directory's country filter has stable, mergeable
// values. Kept here until the shared facet registry lands in service-apis.
const countryOptions = [
  'Australia',
  'Brazil',
  'Canada',
  'France',
  'Germany',
  'India',
  'Indonesia',
  'Ireland',
  'Israel',
  'Japan',
  'Malaysia',
  'Mexico',
  'Netherlands',
  'New Zealand',
  'Philippines',
  'Poland',
  'Portugal',
  'Singapore',
  'South Africa',
  'Spain',
  'Sweden',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Vietnam',
];

const projectTypeOptions = [
  'Implementation',
  'Migration',
  'Integration',
  'Customization',
  'Consulting',
  'Training',
  'Support & maintenance',
  'Audit & optimization',
];

const availabilityOptions = [
  'Less than 5 hours',
  '5 to 10 hours',
  '10 to 20 hours',
  '20+ hours',
];

export default function AvailabilitySection({ formData, setFormData, readOnly = false }: AvailabilitySectionProps) {
  const update = (patch: Partial<VendorOnboardingData>) => setFormData({ ...formData, ...patch });
  const vocabulary = useExpertVocabulary();
  const timezones = vocabularyLabels(vocabulary, 'timezones', timezoneOptions);
  const regions = vocabularyLabels(vocabulary, 'regions_served', regionOptions);
  const countries = vocabularyLabels(vocabulary, 'countries', countryOptions);
  const projectTypes = vocabularyLabels(vocabulary, 'project_types', projectTypeOptions);
  const whyPlatforms = formData.whyPlatforms ?? '';

  return (
    <div className="vo-step">
      <div className="vo-grid-2">
        {/* Where the expert is based — drives the country filter on the
            directory. Distinct from the regions they can serve, below. */}
        <Select
          label="Country"
          labelTip="Buyers filter the directory by country."
          required
          options={countries.map((country) => ({ value: country, label: country }))}
          value={formData.regionCountry}
          onChange={(value) => update({ regionCountry: value })}
          placeholder="Choose your country"
          disabled={readOnly}
        />

        <div className="pp-field">
          <label htmlFor="vo-region-city">City</label>
          <input
            id="vo-region-city"
            className="pp-input"
            type="text"
            value={formData.regionCity}
            onChange={(event) => update({ regionCity: event.target.value })}
            placeholder="Singapore"
            disabled={readOnly}
          />
        </div>
      </div>

      <Select
        label="Timezone"
        required
        options={timezones.map((tz) => ({ value: tz, label: tz }))}
        value={formData.timezone}
        onChange={(value) => update({ timezone: value })}
        placeholder="Choose your timezone"
        disabled={readOnly}
      />

      <MultiSelectDropdown
        label="Regions you serve"
        required
        helperText="Where you take clients, not where you live."
        options={regions}
        selectedValues={formData.regions}
        onChange={(regions) => update({ regions })}
        placeholder="Choose regions"
        disabled={readOnly}
      />

      <div className="pp-row pp-gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={formData.remoteOnly}
          onClick={() => update({ remoteOnly: !formData.remoteOnly })}
          className="vo-switch"
          aria-label="Remote only"
          disabled={readOnly}
        >
          <span />
        </button>
        <span className="pp-stack" style={{ gap: 2 }}>
          <span className="pp-body" style={{ color: 'var(--ink)' }}>
            <span
              className="vo-label-tip"
              data-tip="Switch on if you do not travel to client sites."
            >Remote only</span>
          </span>
        </span>
      </div>

      <fieldset className="pp-field" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ padding: 0, fontSize: 13, fontWeight: 'var(--weight-medium)', color: 'var(--ink)' }}>
          <span
            className="vo-label-tip"
            data-tip="How many hours per week you can take on new client work."
          >Weekly availability</span> <span className="vo-req">*</span>
        </legend>

        <div className="pp-stack pp-gap-3" style={{ marginTop: 6 }}>
          {availabilityOptions.map((option) => {
            const isSelected = formData.weeklyAvailability === option;
            return (
              <label key={option} className="vo-radio" data-on={isSelected}>
                <input
                  type="radio"
                  name="weeklyAvailability"
                  value={option}
                  checked={isSelected}
                  onChange={() => update({ weeklyAvailability: option })}
                  className="sr-only"
                  disabled={readOnly}
                />
                <span className="vo-radio-dot" aria-hidden />
                {option}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="pp-field">
        <label htmlFor="earliest-start-date">Earliest start date</label>
        <input
          id="earliest-start-date"
          type="date"
          value={formData.earliestStartDate}
          onChange={(event) => update({ earliestStartDate: event.target.value })}
          className="pp-input"
          style={{ cursor: 'pointer' }}
          disabled={readOnly}
        />
      </div>

      <MultiSelectDropdown
        label="Project types you prefer"
        required
        helperText="Pick the kinds of work you want to be matched with."
        options={projectTypes}
        selectedValues={formData.preferredProjectTypes}
        onChange={(preferredProjectTypes) => update({ preferredProjectTypes })}
        placeholder="Choose project types"
        disabled={readOnly}
      />

      <div className="pp-field">
        <label htmlFor="vo-why-platforms">Why Proploy</label>
        <textarea
          id="vo-why-platforms"
          value={whyPlatforms}
          onChange={(event) => {
            if (event.target.value.length <= 500) update({ whyPlatforms: event.target.value });
          }}
          placeholder="I want implementation work with clear scopes and clients who have already picked a product"
          className="pp-textarea"
          style={{ minHeight: 122 }}
          disabled={readOnly}
        />
        <p className="pp-small pp-mono-num" style={{ textAlign: 'right' }}>
          {whyPlatforms.length}/500
        </p>
      </div>
    </div>
  );
}
