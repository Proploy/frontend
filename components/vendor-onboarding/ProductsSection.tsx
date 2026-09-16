'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Loader2, Plus, Search, Trash2, Upload } from 'lucide-react';
import { CatalogImage } from '@/components/catalog/CatalogImage';
import { useProductList } from '@/features/catalog';
import { getProductLogoUrl } from '@/features/catalog/products/logo-url';
import { createLocalId } from '@/features/experts/onboarding-mappers';
import { useExpertVocabulary, vocabularyLabels } from '@/features/experts/use-expert-vocabulary';
import type { UploadApplicationDocumentResult } from '@/features/experts/use-expert-application';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { UploadedFileRow } from './UploadControls';
import type {
  CertificationEntry,
  ProductExpertiseEntry,
  UploadedApplicationFile,
  VendorOnboardingData,
} from '@/hooks/types/vendor-contracts';

interface ProductsSectionProps {
  formData: VendorOnboardingData;
  setFormData: (data: VendorOnboardingData) => void;
  uploadDocument: (documentType: 'certification', file: File) => Promise<UploadApplicationDocumentResult>;
  readOnly?: boolean;
}

// Fallback only; the API serves this list so the directory's Industry filter
// and this question cannot disagree. See `experts/vocabulary.py`.
export const INDUSTRY_OPTIONS = [
  'Technology',
  'Finance & Banking',
  'Healthcare',
  'Education',
  'Retail & E-commerce',
  'Manufacturing',
  'Consulting',
];

const CURRENT_YEAR = new Date().getFullYear();

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function monogram(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

/** Logo off the catalog id; "Other tool" entries (no id) get a monogram. */
export function ProductLogoTile({ productId, productName }: { productId: string | null; productName: string }) {
  const fallback = <span aria-hidden>{monogram(productName)}</span>;
  const src = productId
    ? getProductLogoUrl(productId, `/api/v1/catalog/products/${encodeURIComponent(productId)}/logo`)
    : null;
  return (
    <span className="vo-logo">
      {src ? <CatalogImage src={src} alt="" fallback={fallback} /> : fallback}
    </span>
  );
}

function emptyCertification(): CertificationEntry {
  return { localId: createLocalId(), name: '', issuer: '', year: '', credentialUrl: '', linkId: null, file: null };
}

/**
 * Looks like the industries select: a trigger with a chevron that opens a
 * menu of catalog products with logos and a search box at the top. Picking
 * a product closes the menu; the row appears below.
 */
function ProductPicker({
  id,
  label,
  required,
  selected,
  onPick,
  disabled,
}: {
  id: string;
  label: string;
  required?: boolean;
  /** Every product already chosen in either group, to keep names unique. */
  selected: ProductExpertiseEntry[];
  onPick: (product: { productId: string | null; productName: string }) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounced(query.trim(), 250);
  const { products, loading, error } = useProductList({
    search: debouncedQuery || undefined,
    limit: debouncedQuery ? 20 : 100,
    sort: 'name',
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const selectedNames = useMemo(
    () => new Set(selected.map((entry) => entry.productName.trim().toLowerCase())),
    [selected],
  );

  const needle = query.trim().toLowerCase();
  const matches = products
    .filter((product) => !needle || product.product_name.toLowerCase().includes(needle))
    .filter((product) => !selectedNames.has(product.product_name.toLowerCase()))
    .slice(0, 30);
  const exactMatch = products.some((product) => product.product_name.toLowerCase() === needle);
  // Never offer "add as another tool" while the catalog cannot be reached:
  // a catalog product added that way loses its id and its logo for good.
  const catalogUnavailable = Boolean(error) && products.length === 0;
  const canAddOther = !catalogUnavailable && needle.length > 1 && !exactMatch && !selectedNames.has(needle);

  const pick = (productId: string | null, productName: string) => {
    onPick({ productId, productName });
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="pp-field" ref={containerRef}>
      <label htmlFor={`${id}-trigger`}>
        {label} {required && <span className="vo-req">*</span>}
      </label>

      <button
        id={`${id}-trigger`}
        type="button"
        className="vo-multi"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
      >
        <span className="vo-multi-values">
          <span className="vo-multi-ph">
            {selected.length === 0 ? 'Choose from the Proploy catalog' : 'Add another product'}
          </span>
        </span>
        <ChevronDown
          size={18}
          style={{
            flexShrink: 0,
            color: 'var(--ink-soft)',
            transition: 'transform var(--d-base) var(--ease)',
            transform: open ? 'rotate(180deg)' : undefined,
          }}
        />
      </button>

      {open && !disabled && (
        <div className="vo-menu-wrap">
          <div className="vo-menu" id={`${id}-menu`} role="listbox">
            <div style={{ position: 'relative', padding: 4, paddingBottom: 8 }}>
              <Search size={15} style={{ position: 'absolute', left: 16, top: 16, color: 'var(--ink-soft)' }} />
              <input
                ref={searchRef}
                className="pp-input"
                style={{ paddingLeft: 36, height: 38 }}
                type="text"
                value={query}
                placeholder="HubSpot, Salesforce, Zoho…"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setOpen(false);
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    if (matches[0]) pick(matches[0].product_id, matches[0].product_name);
                    else if (canAddOther) pick(null, query.trim());
                  }
                }}
                autoComplete="off"
                aria-label="Search the catalog"
              />
            </div>

            {loading && matches.length === 0 && (
              <p className="pp-small" style={{ padding: 10 }}>Loading the catalog…</p>
            )}
            {matches.map((product) => (
              <button
                key={product.product_id}
                type="button"
                role="option"
                aria-selected={false}
                className="vo-opt"
                onClick={() => pick(product.product_id, product.product_name)}
              >
                <span className="vo-opt-logo">
                  <ProductLogoTile productId={product.product_id} productName={product.product_name} />
                  <span className="pp-stack" style={{ gap: 0, minWidth: 0 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.product_name}</span>
                    {product.vendor_name && <span className="vo-prow-sub">{product.vendor_name}</span>}
                  </span>
                </span>
              </button>
            ))}
            {canAddOther && (
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="vo-opt"
                onClick={() => pick(null, query.trim())}
              >
                <span className="vo-opt-logo">
                  <span className="vo-logo" aria-hidden><Plus size={14} /></span>
                  <span>Add “{query.trim()}” as a tool we do not list yet</span>
                </span>
              </button>
            )}
            {catalogUnavailable && (
              <p className="pp-small" style={{ padding: 10 }}>
                The catalog is not reachable right now. Try again in a moment.
              </p>
            )}
            {!loading && !catalogUnavailable && matches.length === 0 && !canAddOther && (
              <p className="pp-small" style={{ padding: 10 }}>
                {needle ? 'Nothing in the catalog by that name. Keep typing to add it as another tool.' : 'No products to show.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CertificationCard({
  certification,
  productName,
  onChange,
  onRemove,
  uploadDocument,
  readOnly,
}: {
  certification: CertificationEntry;
  productName: string;
  onChange: (patch: Partial<CertificationEntry>) => void;
  onRemove: () => void;
  uploadDocument: ProductsSectionProps['uploadDocument'];
  readOnly?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | null) => {
    if (!file || uploading) return;
    setUploading(true);
    setUploadError(null);
    try {
      const result = await uploadDocument('certification', file);
      if (!result.ok) {
        setUploadError(result.error.message);
        return;
      }
      const uploaded: UploadedApplicationFile = {
        name: result.data.fileName,
        size: result.data.fileSizeBytes,
        fileContentType: result.data.fileContentType,
        storageKey: result.data.storageKey,
        visible: true,
      };
      onChange({ file: uploaded, linkId: null });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="vo-cert">
      <div className="vo-subcard-head">
        <p className="pp-small" style={{ fontWeight: 'var(--weight-medium)', color: 'var(--ink)' }}>
          Certification on {productName}
        </p>
        {!readOnly && (
          <button type="button" onClick={onRemove} className="vo-icon-btn vo-icon-btn--danger" aria-label="Remove certification">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="vo-grid-2">
        <div className="pp-field">
          <label>Certification <span className="vo-req">*</span></label>
          <input
            type="text"
            className="pp-input"
            value={certification.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="HubSpot Solutions Partner"
            disabled={readOnly}
          />
        </div>
        <div className="pp-field">
          <label>Issued by</label>
          <input
            type="text"
            className="pp-input"
            value={certification.issuer}
            onChange={(event) => onChange({ issuer: event.target.value })}
            placeholder="HubSpot Academy"
            disabled={readOnly}
          />
        </div>
        <div className="pp-field">
          <label>Year</label>
          <input
            type="number"
            inputMode="numeric"
            min={1980}
            max={CURRENT_YEAR + 1}
            className="pp-input"
            value={certification.year}
            onChange={(event) => onChange({ year: event.target.value })}
            placeholder={String(CURRENT_YEAR)}
            disabled={readOnly}
          />
        </div>
        <div className="pp-field">
          <label>Credential link</label>
          <input
            type="url"
            className="pp-input"
            value={certification.credentialUrl}
            onChange={(event) => onChange({ credentialUrl: event.target.value })}
            placeholder="https://app.hubspot.com/academy/…/certificate"
            disabled={readOnly}
          />
        </div>
      </div>

      {certification.file ? (
        <UploadedFileRow
          file={certification.file}
          onRemove={() => onChange({ file: null, linkId: null })}
        />
      ) : (
        !readOnly && (
          <label className="pp-link-arrow" style={{ alignSelf: 'flex-start', cursor: 'pointer' }}>
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Uploading…' : 'Attach certificate (PDF, PNG or JPG, max 25 MB)'}
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              disabled={uploading}
              onChange={(event) => {
                void handleFile(event.target.files?.[0] ?? null);
                event.currentTarget.value = '';
              }}
            />
          </label>
        )
      )}
      {uploadError && <p className="vo-error">{uploadError}</p>}
    </div>
  );
}

function ProductRow({
  product,
  industryOptions,
  onChange,
  onRemove,
  uploadDocument,
  readOnly,
}: {
  product: ProductExpertiseEntry;
  /** The product's own industries, from the catalog. Empty hides the picker. */
  industryOptions: string[];
  onChange: (patch: Partial<ProductExpertiseEntry>) => void;
  onRemove: () => void;
  uploadDocument: ProductsSectionProps['uploadDocument'];
  readOnly?: boolean;
}) {
  const [certsOpen, setCertsOpen] = useState(product.certifications.length > 0);
  const certCount = product.certifications.length;
  const yearsId = `vo-years-${product.localId}`;
  const projectsId = `vo-projects-${product.localId}`;

  const updateCertification = (localId: string, patch: Partial<CertificationEntry>) => {
    onChange({
      certifications: product.certifications.map((cert) => (cert.localId === localId ? { ...cert, ...patch } : cert)),
    });
  };

  const addCertification = () => {
    onChange({ certifications: [...product.certifications, emptyCertification()] });
    setCertsOpen(true);
  };

  return (
    <div className="vo-prow">
      <div className="vo-prow-head">
        <ProductLogoTile productId={product.productId} productName={product.productName} />
        <div className="pp-stack" style={{ gap: 0, minWidth: 0, flex: 1 }}>
          <span className="vo-prow-name">{product.productName}</span>
          <span className="vo-prow-sub">{product.productId ? 'Proploy catalog' : 'Not in the catalog yet'}</span>
        </div>
        {!readOnly && (
          <button type="button" onClick={onRemove} className="vo-icon-btn vo-icon-btn--danger" aria-label={`Remove ${product.productName}`}>
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="vo-prow-fields">
        <div className="pp-field">
          <label htmlFor={yearsId}>Years</label>
          <input
            id={yearsId}
            type="number"
            inputMode="numeric"
            min={0}
            max={60}
            className="pp-input"
            value={product.yearsExperience}
            onChange={(event) => onChange({ yearsExperience: event.target.value })}
            placeholder="5"
            disabled={readOnly}
          />
        </div>
        <div className="pp-field">
          <label htmlFor={projectsId}>Projects</label>
          <input
            id={projectsId}
            type="number"
            inputMode="numeric"
            min={0}
            max={10000}
            className="pp-input"
            value={product.projectsCompleted}
            onChange={(event) => onChange({ projectsCompleted: event.target.value })}
            placeholder="12"
            disabled={readOnly}
          />
        </div>
        <div className="pp-field vo-prow-certs-cta">
          <label aria-hidden>&nbsp;</label>
          {(certCount > 0 || !readOnly) && (
            <button type="button" className="vo-prow-toggle" onClick={() => (certCount > 0 ? setCertsOpen((v) => !v) : addCertification())}>
              {certCount > 0
                ? `${certsOpen ? 'Hide' : 'Show'} ${certCount} certification${certCount === 1 ? '' : 's'}`
                : 'Add a certification'}
            </button>
          )}
        </div>
      </div>

      {/* Offered only where the catalog knows the product's industries. Buyers
          filter on this per product, so a free-text answer would not match. */}
      {industryOptions.length > 0 && (
        <div style={{ marginTop: 'var(--sp-3)' }}>
          <MultiSelectDropdown
            label={`Industries you serve on ${product.productName}`}
            helperText="Buyers filter the directory by these."
            options={industryOptions}
            selectedValues={product.industryFit ?? []}
            onChange={(industryFit) => onChange({ industryFit })}
            placeholder="Choose industries"
            disabled={readOnly}
          />
        </div>
      )}

      {certsOpen && certCount > 0 && (
        <div className="vo-prow-certs">
          {product.certifications.map((cert) => (
            <CertificationCard
              key={cert.localId}
              certification={cert}
              productName={product.productName}
              onChange={(patch) => updateCertification(cert.localId, patch)}
              onRemove={() => onChange({ certifications: product.certifications.filter((c) => c.localId !== cert.localId) })}
              uploadDocument={uploadDocument}
              readOnly={readOnly}
            />
          ))}
          {!readOnly && (
            <button type="button" onClick={addCertification} className="vo-prow-toggle" style={{ alignSelf: 'flex-start' }}>
              <Plus size={14} />
              Add another certification
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ProductGroup({
  id,
  label,
  required,
  isPrimary,
  products,
  allProducts,
  industriesByProductId,
  onAdd,
  onChange,
  onRemove,
  uploadDocument,
  readOnly,
}: {
  id: string;
  label: string;
  required?: boolean;
  isPrimary: boolean;
  products: ProductExpertiseEntry[];
  allProducts: ProductExpertiseEntry[];
  industriesByProductId: Map<string, string[]>;
  onAdd: (product: { productId: string | null; productName: string }, isPrimary: boolean) => void;
  onChange: (localId: string, patch: Partial<ProductExpertiseEntry>) => void;
  onRemove: (localId: string) => void;
  uploadDocument: ProductsSectionProps['uploadDocument'];
  readOnly?: boolean;
}) {
  return (
    <div className="vo-group">
      <ProductPicker
        id={id}
        label={label}
        required={required}
        selected={allProducts}
        onPick={(product) => onAdd(product, isPrimary)}
        disabled={readOnly}
      />
      {products.map((product) => (
        <ProductRow
          key={product.localId}
          product={product}
          industryOptions={
            product.productId ? industriesByProductId.get(product.productId) ?? [] : []
          }
          onChange={(patch) => onChange(product.localId, patch)}
          onRemove={() => onRemove(product.localId)}
          uploadDocument={uploadDocument}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}
/** A single row in the "Other certifications" list: text input + upload + delete. */
function ManualCertificationRow({
  entry,
  onChange,
  onRemove,
  uploadDocument,
  readOnly,
}: {
  entry: { name: string; file: UploadedApplicationFile | null };
  onChange: (patch: Partial<{ name: string; file: UploadedApplicationFile | null }>) => void;
  onRemove: () => void;
  uploadDocument: ProductsSectionProps['uploadDocument'];
  readOnly?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | null) => {
    if (!file || uploading) return;
    setUploading(true);
    setUploadError(null);
    try {
      const result = await uploadDocument('certification', file);
      if (!result.ok) {
        setUploadError(result.error.message);
        return;
      }
      onChange({
        file: {
          name: result.data.fileName,
          size: result.data.fileSizeBytes,
          fileContentType: result.data.fileContentType,
          storageKey: result.data.storageKey,
          visible: true,
        },
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pp-stack" style={{ gap: 4 }}>
      <div className="pp-row pp-gap-2">
        <input
          type="text"
          value={entry.name}
          placeholder="Certified Scrum Master"
          onChange={(event) => onChange({ name: event.target.value })}
          className="pp-input"
          disabled={readOnly}
        />
        {!readOnly && !entry.file && (
          <label
            className="vo-icon-btn"
            aria-label="Attach certificate"
            title="Attach certificate (PDF, PNG or JPG, max 25 MB)"
            style={{ cursor: 'pointer', flexShrink: 0 }}
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              disabled={uploading}
              onChange={(event) => {
                void handleFile(event.target.files?.[0] ?? null);
                event.currentTarget.value = '';
              }}
            />
          </label>
        )}
        {!readOnly && (
          <button
            type="button"
            onClick={onRemove}
            className="vo-icon-btn vo-icon-btn--danger"
            aria-label="Remove certification"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      {entry.file && (
        <UploadedFileRow
          file={entry.file}
          onRemove={() => onChange({ file: null })}
        />
      )}
      {uploadError && <p className="vo-error">{uploadError}</p>}
    </div>
  );
}

export default function ProductsSection({ formData, setFormData, uploadDocument, readOnly = false }: ProductsSectionProps) {
  const industries = vocabularyLabels(useExpertVocabulary(), 'industries', INDUSTRY_OPTIONS);
  const products = formData.productExpertise;

  // Read live rather than copied onto the row when the product was picked: the
  // catalog is still being filled in, and an expert who applied before their
  // product had industries should see them the next time they open the form.
  const { products: catalog } = useProductList({ limit: 100, sort: 'name' });
  const industriesByProductId = useMemo(
    () => new Map(catalog.map((entry) => [entry.product_id, entry.industry_fit ?? []])),
    [catalog],
  );
  const primary = products.filter((entry) => entry.isPrimary);
  const secondary = products.filter((entry) => !entry.isPrimary);

  const updateProduct = (localId: string, patch: Partial<ProductExpertiseEntry>) => {
    setFormData({
      ...formData,
      productExpertise: products.map((entry) => (entry.localId === localId ? { ...entry, ...patch } : entry)),
    });
  };

  const removeProduct = (localId: string) => {
    setFormData({ ...formData, productExpertise: products.filter((entry) => entry.localId !== localId) });
  };

  const addProduct = ({ productId, productName }: { productId: string | null; productName: string }, isPrimary: boolean) => {
    const key = productName.trim().toLowerCase();
    if (!key || products.some((entry) => entry.productName.trim().toLowerCase() === key)) return;
    setFormData({
      ...formData,
      productExpertise: [
        ...products,
        {
          localId: createLocalId(),
          productId,
          productName: productName.trim(),
          isPrimary,
          yearsExperience: '',
          projectsCompleted: '',
          certifications: [],
          // The expert has not chosen yet; the options come from the catalog.
          industryFit: [],
        },
      ],
    });
  };

  const otherCertifications = formData.manualCertifications;
  const groupProps = { allProducts: products, industriesByProductId, onAdd: addProduct, onChange: updateProduct, onRemove: removeProduct, uploadDocument, readOnly };

  return (
    <div className="vo-step" style={{ gap: 'var(--sp-8)' }}>
      <ProductGroup id="vo-primary" label="Primary products" required isPrimary products={primary} {...groupProps} />
      <ProductGroup id="vo-secondary" label="Secondary products" isPrimary={false} products={secondary} {...groupProps} />

      <MultiSelectDropdown
        label="Industries you have delivered in"
        required
        helperText="Buyers filter the directory by these."
        options={industries}
        selectedValues={formData.industries}
        onChange={(industries) => setFormData({ ...formData, industries })}
        placeholder="Choose industries"
        disabled={readOnly}
      />

      {/* Credentials with no product behind them (kept as certification tags). */}
      <div className="vo-group">
        <div className="pp-stack" style={{ gap: 4 }}>
          <p className="pp-label">Optional</p>
          <p className="pp-h6">Other certifications</p>
        </div>

        {otherCertifications.map((entry, index) => (
          <ManualCertificationRow
            key={index}
            entry={entry}
            onChange={(patch) => {
              const next = otherCertifications.map((e, i) => (i === index ? { ...e, ...patch } : e));
              setFormData({ ...formData, manualCertifications: next });
            }}
            onRemove={() => setFormData({
              ...formData,
              manualCertifications: otherCertifications.filter((_, i) => i !== index),
            })}
            uploadDocument={uploadDocument}
            readOnly={readOnly}
          />
        ))}

        {/* Legacy standalone uploads (no text name attached). */}
        {formData.certificationFiles.map((file, index) => (
          <UploadedFileRow
            key={file.id ?? file.storageKey ?? `${file.name}-${index}`}
            file={file}
            onRemove={() => setFormData({
              ...formData,
              certificationFiles: formData.certificationFiles.filter((_, i) => i !== index),
            })}
            onToggleVisibility={() => setFormData({
              ...formData,
              certificationFiles: formData.certificationFiles.map((entry, i) =>
                i === index ? { ...entry, visible: !entry.visible } : entry),
            })}
          />
        ))}

        {!readOnly && (
          <button
            type="button"
            onClick={() => setFormData({ ...formData, manualCertifications: [...otherCertifications, { name: '', file: null }] })}
            className="pp-link-arrow"
            style={{ alignSelf: 'flex-start' }}
          >
            <Plus size={16} />
            Add another certification
          </button>
        )}
      </div>
    </div>
  );
}
